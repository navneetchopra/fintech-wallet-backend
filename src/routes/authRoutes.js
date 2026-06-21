const express = require("express");
const validate = require("../middlewares/validate");

const {
  registerSchema,
  loginSchema,
  addMoneySchema,
  sendMoneySchema,
} = require("../validation/authValidation");

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

router.post("/register",validate(registerSchema), registerUser);

router.post("/login",validate(loginSchema),loginUser);


// PROTECTED ROUTES

// router.get("/users", authMiddleware, getUsers);

// router.get("/users/:id", authMiddleware, getSingleUser);

// router.delete("/profile", authMiddleware, deleteProfile);

router.put("/profile", authMiddleware,updateProfile);

router.post("/add-money", authMiddleware,validate(addMoneySchema), addMoney);

router.post("/send-money", authMiddleware,validate(sendMoneySchema), sendMoney);

router.get("/transactions", authMiddleware, getTransactions);
router.get("/balance", authMiddleware, checkBalance);
router.get("/me",authMiddleware,getMyProfile);
module.exports = router;