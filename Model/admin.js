// import mongoose from "mongoose";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    mobile:{
        type: Number,
        required: true,
        unique: true
    },
   
    password:{
        type: String,
        required: true,
    },

    isAdmin: {
        type: Boolean,
        default: true,
    }


},{ timestamps: true });

const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;