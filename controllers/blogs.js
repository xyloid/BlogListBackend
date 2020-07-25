const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { request } = require("../app");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogsRouter.post("/", (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    ...body,
  });

  blog
    .save()
    .then((savedBlog) => {
      response.json(savedBlog);
    })
    .catch((error) => {
      next(error);
    });
});

blogsRouter.delete('/:id',async (request, response, next)=>{
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter;
