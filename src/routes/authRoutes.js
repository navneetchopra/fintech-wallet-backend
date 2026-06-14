const express = require("express");

const {
    registerUser,
    updateProfile,
    loginUser,
    addMoney,
    sendMoney,
    getTransactions,
    checkBalance,
    getMyProfile
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


// PUBLIC ROUTES

router.post("/register", registerUser);

router.post("/login", loginUser);


// PROTECTED ROUTES

// router.get("/users", authMiddleware, getUsers);

// router.get("/users/:id", authMiddleware, getSingleUser);

// router.delete("/profile", authMiddleware, deleteProfile);

router.put("/profile", authMiddleware,updateProfile);

router.post("/add-money", authMiddleware, addMoney);

router.post("/send-money", authMiddleware, sendMoney);

router.get("/transactions", authMiddleware, getTransactions);
router.get("/balance", authMiddleware, checkBalance);
router.get("/me",authMiddleware,getMyProfile);
module.exports = router;