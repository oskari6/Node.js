"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import {v4 as uuidv4 } from "uuid"; react way of importing, in package.json, type: module
const express_1 = __importDefault(require("express")); //website
const mongoose_1 = __importDefault(require("mongoose")); //mongodb
const customer_1 = __importDefault(require("./models/customer")); //Schema
const app = (0, express_1.default)(); //requests
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load .env variables
app.use(express_1.default.json()); //parses post data from the req.body
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)()); //cors midleware, allow cross origin request from the backend
if (process.env.NODE_ENV !== "production") {
    //dynamic port change for working dev and test
    require("dotenv").config();
}
const PORT = process.env.PORT || 3000; //either one
const CONNECTION = process.env.CONNECTION || ''; //non visible password for safety
const customer = new customer_1.default({
    //from schema
    name: "Name3",
    industry: "Industry3",
});
app.get("/", (req, res) => {
    //home
    res.send("Welcome!!");
});
app.get("/api/customers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get req schema customer
    console.log(yield mongoose_1.default.connection.db.listCollections().toArray()); //shows in the terminal with all entries
    try {
        const result = yield customer_1.default.find();
        res.json({ customers: result }); //json same as get pretty much
    }
    catch (e) {
        res.status(500).json({ error: e.message }); //usual way of sending errors (500)
    }
}));
app.get("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting data from the database via id
    console.log({ requestParams: req.params, requestQuery: req.query }); //params /, query ?id=, usually params, if more specific after params use query
    try {
        const { id: customerId } = req.params; //destructoring
        const customer = yield customer_1.default.findById(customerId);
        if (!customer) {
            //if no user found, id same length
            res.status(404).json({ error: "User not found" });
        }
        else {
            res.json({ customer });
        }
    }
    catch (e) {
        res.status(500).json({ error: "something went wrong" });
    }
}));
app.put("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //updating
    try {
        const customerId = req.params.id;
        const customer = yield customer_1.default.findOneAndReplace({ _id: customerId }, req.body, { new: true }); //finds one, replaces, and return the original if no {new: true}
        res.json({ customer });
    }
    catch (e) {
        res.status(500).json({ error: "something went wrong" });
    }
}));
app.patch("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = yield customer_1.default.findOneAndUpdate({ _id: customerId }, req.body, { new: true }); //finds one, updates, and return the original if no {new: true}
        res.json({ customer });
    }
    catch (e) {
        res.status(500).json({ error: "something went wrong" });
    }
}));
app.patch("/api/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const orderId = req.params.id;
    req.body._id = orderId;
    try {
        const result = yield customer_1.default.findOneAndUpdate({ "orders._id": orderId }, { $set: { "orders.$": req.body } }, { new: true } //quotes on orders._id when working with nested
        );
        console.log(result);
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: "something went wrong" });
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: "something went wrong" });
    }
}));
app.get("/api/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield customer_1.default.findOne({ "orders._id": req.params.id });
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: "Order not found" });
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: "something went wrong" });
    }
}));
app.delete("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //deleting
    try {
        const customerId = req.params.id;
        const result = yield customer_1.default.deleteOne({ _id: customerId });
        res.json({ deletedCount: result.deletedCount });
    }
    catch (e) {
        res.status(500).json({ error: "something went wrong" });
    }
}));
app.post("/", (req, res) => {
    //home, post
    res.send("This is a post request");
});
app.post("/api/customers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //display on web page the raw data
    console.log(req.body); //body from post man request
    const customer = new customer_1.default(req.body);
    try {
        yield customer.save(); //saves to db
        res.status(201).json({ customer }); //shorthand: property called customer with that customer object, with out {} no visible customer object, just attributes
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    //to database
    try {
        yield mongoose_1.default.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log("App listening on port " + PORT);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start(); //database
