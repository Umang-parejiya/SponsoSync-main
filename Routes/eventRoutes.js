const express = require('express');
const router = express.Router();
const Event = require('../Model/event');
const { generateToken ,jwtAuthMiddleware } = require('../middleware/jwt');
const { isSponserOwner } = require('../middleware/auth');
const User = require('../Model/user'); 


router.post('/new', jwtAuthMiddleware, async (req, res) => {
  try {
      const data = req.body;
      const userId = req.user.id; // Get the user ID from the JWT token
      
      // Check if user has enough credits
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.credits < 4) {
          return res.status(400).json({ error: 'Insufficient credits to create an event' });
      }
      
      // Create and save the event
      const newEvent = new Event(data);
      const savedEvent = await newEvent.save();
      console.log("Data saved Successfully");
      
      // Decrement user's credits by 4
      user.credits -= 4;
      await user.save();
      
      console.log("User credits updated successfully");
      res.status(200).json({ savedEvent: savedEvent, remainingCredits: user.credits });

  } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/' ,async(req,res)=>{
    try{
        const events = await Event.find({});
        res.status(200).json({events: events});

    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
        return;
    }
})

// Update Event's ApprovedBy Field
// Backend: Update Event's ApprovedBy Field
router.put("/:eventId/approve", async (req, res) => {
    const { eventId } = req.params;
    const { sponserId,email } = req.body; // Ensure correct spelling
    console.log("Sponsor ID received:", email);
  
    try {
      // Ensure the event exists
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
  console.log(email)
      // Ensure approvedBy is initialized
      if (!event.approvedBy) {
        event.approvedBy = [];
      }
  
      // Prevent duplicate entries
      if (!event.approvedBy.includes(sponserId)) {
        event.approvedBy.push(sponserId);
        await event.save();
      }
  
      res.status(200).json({ message: "Event approved successfully", event });
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  router.get('/recent', jwtAuthMiddleware, async (req, res) => {
    try {
      const events = await Event.find({ isVerified: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('eventname date _id');
      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recent events' });
    }
  });

router.get('/myevents', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the logged-in user's ID from the token

        const events = await Event.find({ createdBy: userId });

        res.status(200).json({ events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch event by ID
router.get("/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;
  
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.status(200).json({ event });
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

router.put('/edit/:id' ,jwtAuthMiddleware,async(req,res)=>{
    try{
        const id = req.params.id;
        const updatedData = req.body;

        const event = await Event.findByIdAndUpdate(id, updatedData, {
            new: true, //return updated document
            runValidators: true  // check again mongoose validation
        });

        if(!event){
            res.status(404).json({error : 'Person not found'});
            return;
        }

        // console.log('Updated data', person);
        res.status(200).json(event);

    }catch(err){
        console.error(err);
        res.status(500).json({error : 'Internal Server Error'});
        return;
    }
})


router.delete('/:id',async (req,res)=>{
    try{
        const id =req.params.id;

        const event = await Event.findByIdAndDelete(id);
        if(!event){
            res.status(404).json({error : 'Event not found'});
            return;
        }
        console.log('Event deleted successfully');
        res.status(200).json(event);

    }catch(err){
        console.error(err);
        res.status(500).json({error : 'Internal Server Error'});
        return;
    }
})


module.exports = router;