const express = require("express");
const app = express();

app.get("/", (req,res)=>{
    res.send("Product Test 4 Running");
});

app.listen(3000, ()=>{
    console.log("Server running");
});
