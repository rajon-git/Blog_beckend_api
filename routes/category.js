const express=require("express");
const router=express.Router();
const {requireSignin, isAdmin}=require("../middlewares/auth")

const {create,update,removeCategory,categoryList,singleCategory,post_By_Category}=require("../controllers/category");

router.post("/category", requireSignin, isAdmin, create);
router.put("/category/:categoryId",requireSignin,isAdmin,update);
router.delete("/category/:categoryId",requireSignin,isAdmin,removeCategory);
router.get("/categories",categoryList);
router.get("/category/:slug",singleCategory);
router.post("/postbycategory/:slug",post_By_Category)
module.exports=router;