const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://oskarisulkakoski:6B1J0NOjHUzx73YI@mycluster.zmp1ioy.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";
const client = new MongoClient(uri, {
    serverApi:{
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    }
  });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("I hear ya")
});

app.get("/api/users", (req,res) => {
    client.connect(err => {
        const collection = client.db("test").collection("devices");

        collection.find().toArray((error, documents) => {
            if(error){
                throw error;
            }
            res.send(documents);
        });
    });
});

app.post("/api/users", (req, res) => {
    client.connect(err => {
        const collection = client.db("test").collection("users");

        collection.insertOne(req.body, (error, results) => {
            if(error){
                throw error;
            }
            res.send(result.insertedId);
        });
        client.close();
    });
});

app.listen(3000, () => {
    console.log("started")
});