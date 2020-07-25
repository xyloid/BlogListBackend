const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const blogHelper = require('./blog_helper')
const Blog = require('../models/blog')

beforeEach(async ()=>{
    await Blog.deleteMany({})

    await blogHelper.prepareBlogs()
})

test('blog list are returned as json', async ()=>{
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('number of blogs return should be correct', async ()=>{
    let blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(blogHelper.initialBlogs.length)
})

test('id property is defined', async ()=>{
    let response = await api.get('/api/blogs')
    let blogs =response.body    
    blogs.map(blog=>{expect(blog.id).toBeDefined()})
})


afterAll(()=>{
    mongoose.connection.close()
})