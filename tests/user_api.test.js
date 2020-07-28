const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const blogHelper = require("./blog_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const blog = require("../models/blog");

let token = "";

// beforeAll(async()=>{

// })

beforeEach(async () => {
  // setup users
  await User.deleteMany({});
  await Blog.deleteMany({});
  await blogHelper.prepareBlogs();
  await blogHelper.prepareUsers();
  await blogHelper.setupBlogAndUser();

  let response = await api
    .post("/api/login")
    .send({ username: "mike", password: "secret" });
  token = response.body.token;
  // console.log(response.body,token)
});

describe("users", () => {
  test("users", async () => {
    const users = await api.get("/api/users");
    // console.log(users.body)
  });
});

describe("group test", () => {
  test("blog list are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("number of blogs return should be correct", async () => {
    let blogs = await api.get("/api/blogs");
    expect(blogs.body).toHaveLength(blogHelper.initialBlogs.length);
  });

  test("id property is defined", async () => {
    let response = await api.get("/api/blogs");
    let blogs = response.body;
    blogs.map((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe("single blog entry test", () => {
  test("make a post", async () => {
    const newBlog = new Blog({
      title: "new blog",
      url: "www.blog.new",
    });
    await api
      .post("/api/blogs")
      //   .auth(token,{type:'bearer'})
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsInDb = await blogHelper.blogsInDb();
    expect(blogsInDb).toHaveLength(blogHelper.initialBlogs.length + 1);

    const titles = blogsInDb.map((n) => n.title);
    expect(titles).toContain("new blog");
  });

  test("missing likes", async () => {
    let newBlog = new Blog({
      title: "new blog without like",
      url: "www.blog.new",
    });

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog);

    expect(response.body.likes).toBe(0);
  });

  test("missing author", async () => {
    let newBlog = new Blog({
      title: "title",
      url: "url",
    });

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(200);
  });

  test("missing url", async () => {
    let newBlog = new Blog({
      title: "title",
      author: "author",
    });

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
  test("test delete", async () => {
    // create to be deleted
    let blogs = await (await api.get("/api/blogs")).body;
    let idToDelete = "5a422a851b54a676234d17f7";
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204);
  });

  test("test update", async () => {
    let blogs = await (await api.get("/api/blogs")).body;
    let toBeUpdated = blogs[0];
    // console.log(toBeUpdated)
    toBeUpdated.likes = 10;
    // console.log(toBeUpdated)
    let id = "5a422a851b54a676234d17f7";
    let updatedBlog = await (
      await api
        .put(`/api/blogs/${id}`)
        .set("Authorization", `bearer ${token}`)
        .send(toBeUpdated)
    ).body;
    // console.log(updatedBlog)
    expect(updatedBlog.likes).toBe(10);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
