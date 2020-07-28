const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", (request, response) => {
  Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .then((blogs) => {
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

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  // Get userId

  const user = await User.findById(body.userId);

  if (!user) {
    return response.status(400).json({ error: "can not find user" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
  });

  blog
    .save()
    .then((savedBlog) => {
      user.blogs = user.blogs.concat(savedBlog._id);
      user.save();
      response.json(savedBlog);
    })
    .catch((error) => {
      next(error);
    });
});

blogsRouter.delete("/:id", async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const newBlog = {
    title: body.title,
    url: body.url,
    likes:body.likes,
    author: body.author,
  };

  //   console.log("newblog",newBlog)

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      newBlog,
      { new: true }
    );
    response.json(updatedBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
