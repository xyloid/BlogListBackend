const lodash = require("lodash");
const { runInContext } = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    const result = blogs.reduce((prev, current) => {
      return prev.likes > current.likes ? prev : current;
    }, blogs[0]);
    return {
      title: result.title,
      author: result.author,
      likes: result.likes,
    };
  }
};

const mostBlogs = (blogs) => {
  let max = lodash.maxBy(
    lodash.toArray(lodash.groupBy(blogs, (blog) => blog.author)),
    (item) => {
      return item.length;
    }
  );
  return { author: max[0].author, blogs: max.length };
};

const mostLikes = (blogs) => {
  let group = lodash.toArray(
    lodash.toArray(lodash.groupBy(blogs, (blog) => blog.author))
  );

  let max = lodash.maxBy(group, (item) =>
    item.reduce((sum, i) => sum + i.likes, 0)
  );
  return {
    author: max[0].author,
    likes: max.reduce((sum, i) => sum + i.likes, 0),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
