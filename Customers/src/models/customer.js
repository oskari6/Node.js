"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//schema
const mongoose_1 = require("mongoose");
;
;
const customerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    industry: String,
    orders: [
        {
            description: String,
            amountInCents: Number
        }
    ]
});
//module.exports = mongoose.model("customers", customerSchema); //without ts
const Customer = (0, mongoose_1.model)('customer', customerSchema);
const c = new Customer({
    name: "test123",
    industry: "test123"
});
console.log(c.name);
exports.default = Customer;
