const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DB_URL = process.env.DB_URL;  


const mongoURL = DB_URL;
// const mongoURL = 'mongodb://127.0.0.1:27017/SponsoSync'; //true


mongoose.connect(mongoURL,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})


const db = mongoose.connection;



db.on('connected', () => {
    console.log('Connected to MongoDB Server');
    
});

db.on('error', (err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
});

db.on('disconnected', () => {
    console.log(`MongoDB connection disconnected with ${mongoURL}`);
});

module.exports = db;