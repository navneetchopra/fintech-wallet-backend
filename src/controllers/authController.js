const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "invalid email",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING *`,
      [name, email, hashedpassword],
    );
    await pool.query(
      `INSERT INTO wallets(user_id)
            VALUES($1)`,
      [result.rows[0].id],
    );
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// const getUsers=async(req,res)=>{
//     try{
//         const result=await pool.query(
//             `SELECT * FROM USERS`
//         );
//         res.status(200).json({
//             success:true,
//             users:result.rows[0]
//         });
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({
//             success:false,
//             message:"Internal Server Error"
//         });
//     }
// };
// const getSingleUser=async(req,res)=>
// {
//     try{
//         const{id}=req.params;
//         const result=await pool.query(
//             `SELECT * FROM users WHERE id=$1`,[id]
//     );
//     res.status(200).json({
//         success:true,
//         users:result.rows[0]
//     });
//     }catch(error){
//         console.log(error);
//         res.status(500).json({
//             success:false,
//             message:"Internal Server error"
//         });
//     }
// };
// const deleteProfile=async(req,res)=>{
//     try{
//         const id=req.user.id;
//         const result=await pool.query(
//             `DELETE FROM USERS WHERE id=$1 RETURNING *`,[id]
//         );
//         res.status(200).json({
//             success:true,
//             message:"User deleted succesfully",
//             user:result.rows[0]
//         });

//     }catch(error){
//         console.log(error);
//         res.status(500).json({
//             success:false,
//             message:"Internal server error"
//         });
//     }
// };
const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `UPDATE users
             SET name=$1, email=$2, password=$3
             WHERE id=$4
             RETURNING *`,
      [name, email, hashedpassword, id],
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // Find user by email
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    const user = result.rows[0];

    // User not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    // Wrong password
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const addMoney = async (req, res) => {
  try {
    const userId=req.user.id;
    const {amount } = req.body;

    if (amount == null) {
      return res.status(400).json({
        success: false,
        message: "User id and amount required",
      });
    }
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }
    const result = await pool.query(
      `UPDATE wallets
             SET balance = balance + $1
             WHERE user_id = $2
             RETURNING *`,
      [amount, userId]
    );

    res.status(200).json({
      success: true,
      message: "Money added successfully",
      wallet: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const sendMoney = async (req, res) => {
  const client = await pool.connect();

  try {
    const sender_id = req.user.id;
    const { receiver_id, amount } = req.body;
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }
    if (sender_id === receiver_id) {
      return res.status(400).json({
        success: false,
        message: "Cannot send money to yourself",
      });
    }

    await client.query("BEGIN");
    const senderWallet = await client.query(
      `SELECT * FROM wallets
     WHERE user_id = $1`,
      [sender_id],
    );

    if (senderWallet.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sender wallet not found",
      });
    }

    const balance = Number(senderWallet.rows[0].balance);

    if (balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }
    const receiverWallet = await client.query(
      `SELECT * FROM wallets
     WHERE user_id = $1`,
      [receiver_id],
    );

    if (receiverWallet.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Receiver wallet not found",
      });
    }
    await client.query(
      `UPDATE wallets
     SET balance = balance - $1
     WHERE user_id = $2`,
      [amount, sender_id],
    );
    await client.query(
      `UPDATE wallets
     SET balance = balance + $1
     WHERE user_id = $2`,
      [amount, receiver_id],
    );
    await client.query(
      `INSERT INTO transactions
     (sender_id, receiver_id, amount)
     VALUES ($1, $2, $3)`,
      [sender_id, receiver_id, amount],
    );
    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Money transferred successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  } finally {
    client.release();
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        t.amount,
        u1.name AS sender_name,
        u2.name AS receiver_name,
        t.created_at
     FROM transactions t
     JOIN users u1
        ON t.sender_id = u1.id
     JOIN users u2
        ON t.receiver_id = u2.id
     WHERE t.sender_id = $1
        OR t.receiver_id = $1
     ORDER BY t.created_at DESC`,
      [userId],
    );

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const checkBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
            SELECT *FROM wallets
            WHERE user_id=$1
            `,
      [userId],
    );
    res.status(200).json({
      success: true,
      message: "Balance fetched",
      balance: result.rows[0].balance,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
u.id,
u.name,
u.email,
w.balance
FROM users u
JOIN wallets w
ON u.id = w.user_id
WHERE u.id = $1;`,
      [userId],
    );

    res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  registerUser,
  updateProfile,
  loginUser,
  addMoney,
  sendMoney,
  getTransactions,
  checkBalance,
  getMyProfile,
};
