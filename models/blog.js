const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false)
const blogSchema = mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  author: { type: String, required: true, minlength: 3 },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
  },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments:[String]
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
