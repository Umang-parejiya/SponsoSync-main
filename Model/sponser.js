// import mongoose from "mongoose";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sponserSchema = new Schema({
    sponsername:{
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        
    },
    
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: 'India' }
    },
    
    
    sponsertype:{
        type: String,
        required: true,
    },
   
    SocialMedia: {
        intragram: { type: String,  },
        facebook: { type: String, },
        
        
        other: { type: String },
    },
   
    price: {
        type: Number,
        required: true,
    },
    
    minimalAudienceCount: {
        type: Number,
        required: true,
        min: 10,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true
    },

    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    interested: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Event', 
        default: []
    },
    logoUrl: {
        type: String,
        required: true
    },
    approved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }]

},{ timestamps: true });

const Sponser = mongoose.model('Sponser',sponserSchema);
module.exports = Sponser;