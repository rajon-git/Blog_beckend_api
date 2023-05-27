const express=require("express");
const router=express.Router()
const formidable=require("express-formidable")

const {create,
        list,
        read,
        remove,
        photo,
        update,
        PostsCount,
        listposts,
        postKeyword,
        releatedPosts
    }=require("../controllers/post");
const { requireSignin, isAdmin } = require("../middlewares/auth");

router.post("/post",requireSignin,formidable(),create);
router.get("/posts", list);
router.get("/post/:slug",read);
router.delete("/post/:postId",requireSignin,remove);
router.get("/post/photo/:postId",photo);
router.put("/post/:postId",requireSignin,formidable(),update);
router.get("/posts-count",PostsCount);
router.get("/list-posts/:page",listposts);
router.get("/posts/search/:keyword",postKeyword);
router.get("/related-posts/:postId/:categoryId", releatedPosts);

module.exports=router;