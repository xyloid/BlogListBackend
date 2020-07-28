const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  .populate("user", { username: 1, name: 1 })
  response.json(blogs)
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if(blog){
    response.json(blog)
  }else{
    response.status(404).end()
  }
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

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.json(savedBlog);
  
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
