const jwt=require("jsonwebtoken");
const pool = require("../config/db");
const bcrypt=require("bcrypt");
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }
        const hashedpassword=await bcrypt.hash(password,10);
        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, email, hashedpassword]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const getUsers=async(req,res)=>{
    try{
        const result=await pool.query(
            `SELECT * FROM USERS`
        );
        res.status(200).json({
            success:true,
            users:result.rows[0]
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
};
const getSingleUser=async(req,res)=>
{
    try{
        const{id}=req.params;
        const result=await pool.query(
            `SELECT * FROM users WHERE id=$1`,[id]
    );
    res.status(200).json({
        success:true,
        users:result.rows[0]
    });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal Server error"
        });
    }
};
const deleteUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const result=await pool.query(
            `DELETE FROM USERS WHERE id=$1 RETURNING *`,[id]
        );
        res.status(200).json({
            success:true,
            message:"User deleted succesfully",
            user:result.rows[0]
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};
const updateUser = async (req, res) => {

    try {

        const { id } = req.params;

        const { name, email, password } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET name=$1, email=$2, password=$3
             WHERE id=$4
             RETURNING *`,
            [name, email, password, id]
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
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
                message: "Email and password required"
            });

        }

        // Find user by email
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];

        // User not found
        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        // Wrong password
        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });

        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Success response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};
module.exports = {
    registerUser,
    getUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    loginUser
};
