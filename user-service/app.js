const express = require("express");
const app = express();

app.get("/", (req,res)=>{
    res.send("User Service Running after 19th upgrade");
});

app.listen(3000, ()=>{
    console.log("Server running");
});
