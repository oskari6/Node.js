const express = require ('express');
const app = express();
//get access, Cannot get / to "test2"
app.get('/', (req, res)=>{
    res.send("test 2");
});
//port for accesing
app.listen(3000, console.log("test"));
//need to install npm first
