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

  const titles = blogsInDb.map((n) => n.title)
  expect(titles).toContain("new blog")
});

afterAll(() => {
  mongoose.connection.close();
});
