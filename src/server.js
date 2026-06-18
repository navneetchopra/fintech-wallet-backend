require("dotenv").config();
const express=require("express");
const cors=require(cors());
const authRoutes=require("./routes/authRoutes");
const app=express();
const pool=require("./config/db");
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    app: "Fintech Wallet API",
    status: "Running",
    version: "1.0.0",
  });
});
pool.connect()
  .then(() => {
    console.log("PostgreSQL connected success");
  })
  .catch((err) => {
    console.log("FULL ERROR =>", err);
  });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

