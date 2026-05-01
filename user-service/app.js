const express = require("express");
const app = express();

app.get("/", (req,res)=>{
    res.send("User Service Running after 17th upgrade");
});

app.listen(3000, ()=>{
    console.log("Server running");
});
