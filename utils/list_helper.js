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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
