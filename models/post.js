const mongoose=require("mongoose");
const {Schema}=mongoose;
const Category=require("../models/category")
const postSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxLength:160
    },
    slug:{
        type:String,
        lowercase:true
    },
    description:{
        type:{},
        trim:true,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Category"
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    
},{timestamps:true,versionKey:false});
const Post=mongoose.model("Post",postSchema);
module.exports=Post;
