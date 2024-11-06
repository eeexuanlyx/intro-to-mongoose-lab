const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Customer = require("./models/customer.js");
const prompt = require("prompt-sync")();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit();
};

const createCustomer = async () => {
  const name = prompt("What is your name? ");
  const age = prompt("What is your age? ");
  const customer = await Customer.create({ name, age });
  console.log("New customer created:", customer);
};

const viewCustomers = async () => {
  const customers = await Customer.find();
  console.log("All customers:");
  customers.forEach((customer) =>
    console.log(
      `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
    )
  );
};

const updateCustomer = async () => {
  const customers = await Customer.find();
  console.log("\nBelow is a list of customers:");
  customers.forEach((customer) =>
    console.log(
      `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
    )
  );

  const id = prompt(
    "\nCopy and paste the id of the customer you would like to update here: "
  );
  const name = prompt("What is the customer's new name? ");
  const age = prompt("What is the customer's new age? ");
  const customer = await Customer.findByIdAndUpdate(
    id,
    { name, age },
    { new: true }
  );

  if (customer) {
    console.log("Customer updated:", customer);
  } else {
    console.log("Customer not found.");
  }
};

const deleteCustomer = async () => {
  const customers = await Customer.find();
  console.log("\nBelow is a list of customers:");
  customers.forEach((customer) =>
    console.log(
      `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
    )
  );

  const id = prompt(
    "\nCopy and paste the id of the customer you would like to delete here: "
  );
  const customer = await Customer.findByIdAndDelete(id);

  if (customer) {
    console.log("Customer deleted:", customer);
  } else {
    console.log("Customer not found.");
  }
};

const runQueries = async () => {
  await connectDB();

  const queries = prompt(
    "\nWelcome to the CRM. What would you like to do?\n" +
      "1. Create a customer\n" +
      "2. View all customers\n" +
      "3. Update a customer\n" +
      "4. Delete a customer\n" +
      "5. Quit\n" +
      "Choose an option (1-5): "
  );

  switch (queries) {
    case "1":
      await createCustomer();
      break;
    case "2":
      await viewCustomers();
      break;
    case "3":
      await updateCustomer();
      break;
    case "4":
      await deleteCustomer();
      break;
    case "5":
      await disconnectDB();
      return;
    default:
      console.log("Invalid option. Please choose again.");
  }

  await runQueries();
};

runQueries();
