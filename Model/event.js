const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    eventname: { type: String, required: true },
    eventtype: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    eventSocialMedia: {
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    eventDescription: { type: String, required: true },
    proposal: { type: String, required: true },
    offers: { type: [String], default: [] },
    eventOrganizer: { type: String, required: true },
    audienceCount: { type: Number, required: true, min: 10 },
    imageUrl: { type: String, required: true },
    isVerified : { type: Boolean, default: false },
    createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // References the User model
            required: true
        },
    approvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sponser" }]
      
    
  },
  
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
