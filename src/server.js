require("dotenv").config();
const express=require("express");
const authRoutes=require("./routes/authRoutes");
const app=express();
const pool=require("./config/db");
app.use(express.json());
app.use("/api/auth",authRoutes);

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

