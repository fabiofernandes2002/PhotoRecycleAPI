import mongoose from 'mongoose'; 
const { Schema } = mongoose; 
const blogSchema= new Schema({

 }); 
// creates a new model Blog using the defined schema above 
const Blog = mongoose.model('Blog', blogSchema); 
const newBlog= new Blog(); 
// creates a Document (instance of a Model) 
newBlog._idinstanceofmongoose.Types.ObjectId; 
// true: by default, Mongoose creates a new _idfield of type ObjectIdto the document