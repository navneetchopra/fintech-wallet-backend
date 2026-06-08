const {Pool}=require("pg");
const pool =new Pool({
    user:"postgres",
    host:"localhost",
    database:"fintech_wallet",
    password:"Donotshutup@02",
    port:5432
});
module.exports=pool;