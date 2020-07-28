const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const blogHelper = require("./blog_helper");
const Blog = require("../models/blog");
const User = require("../models/user");



beforeAll(async()=>{
    // setup users
    await User.deleteMany({})
    await blogHelper.prepareUsers()
    await blogHelper.setupBlogAndUser()
})

// beforeEach(()=>{
//     jest.useFakeTimers()
// })

test('dummy test',async ()=>{
    console.log('dummy test')
})

afterAll(()=>{
    mongoose.connection.close()
})