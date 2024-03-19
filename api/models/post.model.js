const mongoose=require('mongoose')

const postSchema= new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        default:"https://images.pexels.com/photos/2690774/pexels-photo-2690774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    category:{
        type:String,
        default:"Uncategorised",
    },

},{timestamps:true})

const Post=mongoose.model('Post',postSchema);

module.exports=Post;
