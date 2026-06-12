const express = require("express");

const {
    registerUser,
    getUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    loginUser,
    addMoney,
    sendMoney
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


// PUBLIC ROUTES

router.post("/register", registerUser);

router.post("/login", loginUser);


// PROTECTED ROUTES

router.get("/users", authMiddleware, getUsers);

router.get("/users/:id", authMiddleware, getSingleUser);

router.delete("/users/:id", authMiddleware, deleteUser);

router.put("/users/:id", authMiddleware, updateUser);

router.post("/add-money", authMiddleware, addMoney);

router.post("/send-money", authMiddleware, sendMoney);
module.exports = router;