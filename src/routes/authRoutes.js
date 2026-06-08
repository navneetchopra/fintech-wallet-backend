const express=require("express");
const {registerUser,getUsers,getSingleUser,deleteUser,updateUser,loginUser}= require("../controllers/authController");
const router=express.Router();
router.post("/register",registerUser);
router.get("/users",getUsers)
router.get("/users/:id",getSingleUser);
router.delete("/users/:id",deleteUser);
router.put("/users/:id", updateUser);
router.post("/login", loginUser);
module.exports=router;