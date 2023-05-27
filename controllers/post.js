const Post=require("../models/post");
const slugify=require("slugify")
const fs=require("fs");
const formidable=require("express-formidable");

//create post
const create = async (req, res) => {
    try {
      const { name, description, category } =
        req.fields;
      const { photo } = req.files;
  
      // validation
      switch (true) {
        case !name?.trim():
          return res.json({ error: "Name is required" });
        case !description?.trim():
          return res.json({ error: "Description is required" });
        case !category?.trim():
          return res.json({ error: "Category is required" });
        case photo && photo.size > 1000000:
          return res.json({ error: "Image should be less than 1mb in size" });
      }
  
    
      const post = new Post({ ...req.fields, slug: slugify(name) });
  
      if (photo) {
        post.photo.data = fs.readFileSync(photo.path);
        post.photo.contentType = photo.type;
      }
  
      await post.save();
      res.json(post);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err.message);
    }
  };

//list of posts
const list=async(req,res)=>{
    try{
        const posts=await Post.find({})
        .populate("category")
        .select("-photo")
        .limit(12)
        .sort({createdAt: -1});
        res.json(posts);
    }catch(error){
        console.log(error);
    }
}

//read post
const read = async (req, res) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category");
  
      res.json(post);
    } catch (err) {
      console.log(err);
    }
  };

  //remove a post
  const remove=async(req,res)=>{
    try{
       const post=await Post.findByIdAndDelete(req.params.postId)
       .select("-photo");
       res.json(post);
    }catch(error){
        console.log(error)
    }
  }

  //photo 
  const photo=async(req,res)=>{
    try{
    const post=await Post.findById(req.params.postId).select("photo");
    if(post.photo.data){
      res.set("Content-Type",product.photo.contentType);
      res.set("Cross-Origin-Resource-Policy", "cross-origin")
      return res.send(post.photo.data);
    }
  }catch(error){
    console.log(error);
  }
}
//update a post 
const update = async (req, res) => {
  try {
    const { name, description, category } =
      req.fields;
    const { photo } = req.files;
  
    // validation
    switch (true) {
      case !name?.trim():
      return  res.json({ error: "Name is required" });
      case !description?.trim():
      return  res.json({ error: "Description is required" });
      case !category?.trim():
      return  res.json({ error: "Category is required" });
      case photo && photo.size > 1000000:
      return  res.json({ error: "Image should be less than 1mb in size" });
    }
    
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      post.photo.data = fs.readFileSync(photo.path);
      post.photo.contentType = photo.type;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};


//postCount
const PostsCount=async(req,res)=>{
  try{
    const total=await Post.find({}).estimatedDocumentCount();
    res.json(total);
  }catch(error){
    console.log(error);
  }
}

//listPostss
const listposts=async(req,res)=>{
  try{
    const perPage=2;
    const page=req.params.page ? req.params.page :1;
    const posts=await Post.find({})
    .select("-photo")
    .limit(perPage)
    .sort("-createdAt")
    .skip((page-1)*perPage)
    res.json(posts)
    }catch(error){
    console.log(error)
  }
}
  
//postKeyword
const postKeyword=async(req,res)=>{
  try{
    const {keyword}=req.params;
    const results=await Post.find({
      $or:[
        {name:{$regex:keyword, $options:"i"}},
        {description:{$regex:keyword, $options:"i"}}
      ]
    }).select("-photo");
    res.json(results);
  }catch(error){
    console.log(error);
  }
}

//related posts
const releatedPosts=async (req,res)=>{
  try{
    const {postId,categoryId}=req.params;
    const related=await Post.find({
      category:categoryId,
      _id: {$ne:postId}
    })
        .select("-photo")
        .populate("category")
        .limit(3);
    res.json(related);
  }catch (error){
    console.log(error)
  }
};

module.exports= {create,list,read,remove,photo,update,PostsCount
,listposts,postKeyword,releatedPosts}