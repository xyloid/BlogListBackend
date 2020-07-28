const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const blogHelper = require("./blog_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const blog = require("../models/blog");


let token = ""

// beforeAll(async()=>{

// })

beforeEach(async()=>{
    // setup users
    await User.deleteMany({})
    await Blog.deleteMany({})
    await blogHelper.prepareBlogs()
    await blogHelper.prepareUsers()
    await blogHelper.setupBlogAndUser()

    let response = await api.post('/api/login').send({username:"mike",password:"secret"})
    token = response.body.token
    // console.log(response.body,token)
})

describe("users", ()=>{
    test("users", async()=>{
        const users = await api.get("/api/users")
        // console.log(users.body)
    })
})

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

describe('single blog entry test', ()=>{
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


})

afterAll(()=>{
    mongoose.connection.close()
})