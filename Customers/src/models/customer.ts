//schema
import {HydratedDocument, Schema, model} from 'mongoose';

//example of interfaces
//? is optional
interface IOrder{
  description: string,
  amountIncents?: number
};

interface ICustomer{
  name: string,
  industry?: string,
  orders?: IOrder[]
};

const customerSchema = new Schema<ICustomer>({
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
const Customer = model('customer', customerSchema);
const c: HydratedDocument<ICustomer> = new Customer ({ //c: HydratedDocument<ICustomer> being implicit about the type of c
  name: "test123",
  industry: "test123"
});
console.log(c.name);

export default Customer;