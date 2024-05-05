//import {v4 as uuidv4 } from "uuid"; react way of importing, in package.json, type: module
import express from "express"; //website
import mongoose from "mongoose";//mongodb
import Customer from "./models/customer" //Schema
const app = express(); //requests
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
dotenvConfig(); // Load .env variables
import {Request, Response} from 'express';

app.use(express.json()); //parses post data from the req.body
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //cors midleware, allow cross origin request from the backend

if (process.env.NODE_ENV !== "production") {
  //dynamic port change for working dev and test
  require("dotenv").config();
}

const PORT = process.env.PORT || 3000; //either one
const CONNECTION = process.env.CONNECTION || ''; //non visible password for safety

const customer = new Customer({
  //from schema
  name: "Name3",
  industry: "Industry3",
});

app.get("/", (req: Request, res: Response) => {
  //home
  res.send("Welcome!!");
});

app.get("/api/customers", async (req: Request, res: Response) => {
  //get req schema customer
  console.log(await mongoose.connection.db.listCollections().toArray()); //shows in the terminal with all entries
  try {
    const result = await Customer.find();
    res.json({ customers: result }); //json same as get pretty much
  } catch (e) {
    res.status(500).json({ error: e.message }); //usual way of sending errors (500)
  }
});

app.get("/api/customers/:id", async (req: Request, res: Response) => {
  //getting data from the database via id
  console.log({ requestParams: req.params, requestQuery: req.query }); //params /, query ?id=, usually params, if more specific after params use query
  try {
    const { id: customerId } = req.params; //destructoring
    const customer = await Customer.findById(customerId);
    if (!customer) {
      //if no user found, id same length
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ customer });
    }
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

app.put("/api/customers/:id", async (req: Request, res: Response) => {
  //updating
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    ); //finds one, replaces, and return the original if no {new: true}
    res.json({ customer });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

app.patch("/api/customers/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId },
      req.body,
      { new: true }
    ); //finds one, updates, and return the original if no {new: true}
    res.json({ customer });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

app.patch("/api/orders/:id", async (req: Request, res: Response) => {
  console.log(req.params);
  const orderId = req.params.id;
  req.body._id = orderId;
  try {
    const result = await Customer.findOneAndUpdate(
      { "orders._id": orderId },
      { $set: { "orders.$": req.body } },
      { new: true } //quotes on orders._id when working with nested
    );

    console.log(result);

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "something went wrong" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.get("/api/orders/:id", async (req: Request, res: Response) => {
  try {
    const result = await Customer.findOne({ "orders._id": req.params.id });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: "something went wrong" });
  }
});
app.delete("/api/customers/:id", async (req: Request, res: Response) => {
  //deleting
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

app.post("/", (req, res) => {
  //home, post
  res.send("This is a post request");
});

app.post("/api/customers", async (req: Request, res: Response) => {
  //display on web page the raw data
  console.log(req.body); //body from post man request
  const customer = new Customer(req.body);
  try {
    await customer.save(); //saves to db
    res.status(201).json({ customer }); //shorthand: property called customer with that customer object, with out {} no visible customer object, just attributes
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const start = async () => {
  //to database
  try {
    await mongoose.connect(CONNECTION);
    app.listen(PORT, () => {
      console.log("App listening on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start(); //database
