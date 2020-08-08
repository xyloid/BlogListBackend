const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
    comments:[]
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
    comments:[]
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
    comments:["Wonderful","Respect"]
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
    comments:["I like this one", "me too", "haha"]
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
    comments:[]
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
    comments:[]
  },
];

const intialUsers = [
  { username: "robert", name: "Robert C. Martin", password: "password" },
  { username: "mike", name: "Michael Chan", password: "secret" },
  { username: "edsgar", name: "Edsger W. Dijkstra", password: "programmer" },
];

const prepareBlogs = async () => {
  let blogs = initialBlogs.map((blog) => new Blog(blog));
  let promises = blogs.map((blog) => blog.save());
  await Promise.all(promises);
};

const blogsInDb = async () => {
  let blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const prepareUsers = async () => {
  const saltRounds = 10;
  let users = intialUsers.map(async (user) =>
    new User({
      username: user.username,
      name: user.name,
      passwordHash: await bcrypt.hash(user.password, saltRounds),
      blogs: [],
    }).save()
  );
  await Promise.all(users);
};

const setupBlogAndUser = async () => {
  for (let blog of initialBlogs) {
    let user = await User.findOne({ name: blog.author });
    let blogIn = await Blog.findById(blog._id);
    // console.log(user)
    // console.log(blogIn)
    blogIn.user = user._id;
    await blogIn.save();
    let blogs = user.blogs;
    if (user.blogs) {
      // console.log('concat blogs',blogs)
      blogs = blogs.concat(blog._id);
      // console.log('after concat',blogs)
    } else {
      blogs = [blog._id];
    }
    // console.log('user:',user,blogIn, blogs)
    await User.update({ name: user.name }, { $set: { blogs: blogs } });
    // console.log(user)
  }

  // let tmp = initialBlogs.map(async (blog) => {

  //   // return user
  // });
  // // await Promise.all(tmp)
  // // tmp.map(i=>console.log(i))
};

module.exports = {
  intialUsers,
  prepareUsers,
  initialBlogs,
  prepareBlogs,
  blogsInDb,
  setupBlogAndUser,
};
