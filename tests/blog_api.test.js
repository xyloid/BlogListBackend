const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const blogHelper = require("./blog_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  await blogHelper.prepareBlogs();
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

describe("test about create a blog", () => {
  test("make a post", async () => {
    const newBlog = new Blog({
      title: "new blog",
      author: "author",
      url: "www.blog.new",
    });
    await api
      .post("/api/blogs")
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
      author: "author",
      url: "www.blog.new",
    });

    const response = await api.post("/api/blogs").send(newBlog);

    expect(response.body.likes).toBe(0);
  });

  test("missing author", async () => {
    let newBlog = new Blog({
      title: "title",
      url: "url",
    });

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("missing url", async () => {
    let newBlog = new Blog({
      title: "title",
      author: "author",
    });

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
