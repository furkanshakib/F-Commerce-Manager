const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Initialize the App
const app = express();
app.use(express.json()); // Allows app to understand JSON data
app.use(cors()); // Allows frontend to talk to backend

// 2. Database Connection (We will set this up in the next step)
// If you don't have a database URL yet, this will just wait.
const PORT = 5000;

// 3. Create the Data Model (What an Order looks like)
const OrderSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    address: String,
    products: String, // e.g., "2x T-Shirt, 1x Cake"
    totalPrice: Number,
    courier: String, // "Pathao" or "Steadfast"
    status: { type: String, default: "Pending" }, // Pending, Shipped, Delivered
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// 4. THE ROUTES (The API Endpoints)

// A. Test Route (To check if server is working)
app.get('/', (req, res) => {
    res.send("F-Commerce Manager Backend is Running!");
});

// B. Create a New Order (When customer submits the form)
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
        console.log("New Order Received!");
    } catch (err) {
        res.status(500).json(err);
    }
});

// C. Get All Orders (For your Admin Dashboard)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 }); // Newest first
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 5. Start the Server
// We only connect to the database if a URL is provided, otherwise just start server
const MONGO_URI = "mongodb+srv://admin:taalguss@cluster0.r9eb6gd.mongodb.net/?appName=Cluster0";

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Database Connected Successfully"))
    .catch(err => console.log(err));
} else {
    console.log("WAITING: Database connection string is missing.");
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});