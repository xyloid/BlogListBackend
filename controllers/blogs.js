const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// const getTokenFrom = request =>{
//   const authorization = request.get('authorization')
//   if(authorization && authorization.toLowerCase().startsWith('bearer ')){
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  // const token = getTokenFrom(request)
  const token = response.token

  const decodedToken = jwt.verify(token,process.env.SECRET)

  if(!token || !decodedToken.id){
    return response.status(401).json({error:'token missing or invalid'})
  }

  // Get userId

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "can not find user" });
  }

  const blog = new Blog({
    title: body.title,
    author: user.name,
    url: body.url,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const token = response.token
  
  const decodedToken = jwt.verify(token,process.env.SECRET)

  if(!token || !decodedToken.id){
    return response.status(401).json({error:'token missing or invalid'})
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "can not find user" });
  }


  const blogToDelete = await Blog.findById(request.params.id);
console.log("User found ",user)
console.log('Blog found ', blogToDelete)
  if(user._id.toString() === blogToDelete.user.toString()){
    await Blog.findByIdAndRemove(request.params.id);
    // We don't need to update user blog list here. Interesting
    response.status(204).end();
  }else{
    response.status(400).json({ error: "user has no permisson" });
  }

  
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const newBlog = {
    title: body.title,
    url: body.url,
    likes: body.likes,
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
