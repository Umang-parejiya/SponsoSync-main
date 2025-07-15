const express = require('express');
const router = express.Router();
const Sponser = require('../Model/sponser');
const { generateToken ,jwtAuthMiddleware } = require('../middleware/jwt');
const { isSponserOwner } = require('../middleware/auth');
const { sendEmail } = require('./emailService');
const nodemailer = require('nodemailer');
const axios = require('axios'); 
const User = require('../Model/user');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sponsosync@gmail.com',
      pass: process.env.NODEMAILER_KEY,
    },
  });
router.get('/recent', jwtAuthMiddleware, async (req, res) => {
    console.log('Received request at /recent'); // Add this
    try {
      console.log('User making request:', req.user); // Check if user is properly authenticated
      const sponsors = await Sponser.find({ isVerified: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('sponsername createdAt _id');
      console.log('Found sponsors:', sponsors); // Verify query results
      res.json({ sponsors });
    } catch (error) {
      console.error('Error in /recent:', error); // Get full error details
      res.status(500).json({ error: 'Failed to fetch recent sponsors' });
    }
});
router.get('/:sponsorId', jwtAuthMiddleware, async (req, res) => {
    try {
        // Validate sponsorId format
        if (!mongoose.Types.ObjectId.isValid(req.params.sponsorId)) {
            return res.status(400).json({ error: 'Invalid sponsor ID format' });
        }

        const sponsor = await Sponser.findById(req.params.sponsorId)
            .select('-__v -password') // Exclude unnecessary fields
            .lean();

        if (!sponsor) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }

        // Ensure arrays exist if they're undefined
        sponsor.interested = sponsor.interested || [];
        sponsor.approved = sponsor.approved || [];

        res.status(200).json({ 
            success: true,
            sponser: sponsor // Change this to match frontend expectation
            // OR keep as 'sponsor' and update frontend
        });
    } catch (err) {
        console.error('Error fetching sponsor:', err);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Failed to fetch sponsor details' 
        });
    }
});
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
            return res.status(400).json({ error: 'Insufficient credits to create a sponsor' });
        }
        
        // Create and save the sponsor
        const newSponser = new Sponser(data);
        const savedSponser = await newSponser.save();
        console.log("Sponsor data saved successfully");
        
        // Decrement user's credits by 4
        user.credits -= 4;
        await user.save();
        
        console.log("User credits updated successfully");
        res.status(200).json({ 
            savedSponser: savedSponser, 
            remainingCredits: user.credits 
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/' ,jwtAuthMiddleware,async(req,res)=>{
    try{
        const sponser = await Sponser.find({});
        res.status(200).json({sponser: sponser});

    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
        return;
    }
});






router.get('/admin/mysponserslist', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the logged-in user's ID from the token

        const sponsers = await Sponser.find({ createdBy: userId });

        res.status(200).json({ sponsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/admin/update/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract logged-in user's ID
        const { id } = req.params; // Get sponsor ID from URL
        const updateData = req.body; // Get updated data from request

        // Find and update the sponsor created by this user
        const updatedSponsor = await Sponser.findOneAndUpdate(
            { _id: id, createdBy: userId }, // Ensure user is updating their own data
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedSponsor) {
            return res.status(404).json({ error: 'Sponsor not found or unauthorized' });
        }

        res.status(200).json({ message: 'Sponsor updated successfully', updatedSponsor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/admin/delete/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract logged-in user's ID
        const { id } = req.params; // Get sponsor ID from URL

        // Find and delete the sponsor created by this user
        const deletedSponsor = await Sponser.findOneAndDelete({ _id: id, createdBy: userId });

        if (!deletedSponsor) {
            return res.status(404).json({ error: 'Sponsor not found or unauthorized' });
        }

        res.status(200).json({ message: 'Sponsor deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





router.post("/:sponsorId/apply", jwtAuthMiddleware, async (req, res) => {
    try {
        const { sponsorId } = req.params;
        const { eventId } = req.body;
        const userId = req.user.id; // Get user ID from JWT middleware
        const token = req.headers.authorization?.split(' ')[1];
  
        // Validate input
        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required" });
        }
  
        // Find the user and check credits
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
  
        // Check if user has enough credits
        if (user.credits < 5) {
            return res.status(400).json({ message: "Insufficient credits (minimum 5 required)" });
        }
  
        // Find the sponsor by ID
        const sponsor = await Sponser.findById(sponsorId);
        if (!sponsor) {
            return res.status(404).json({ message: "Sponsor not found" });
        }
  
        const sponsorEmail = sponsor.email;
        if (!sponsorEmail) {
            return res.status(400).json({ message: "Sponsor email not found" });
        }
  
        // Check if already applied
        if (sponsor.interested.includes(eventId)) {
            return res.status(400).json({ message: "Already applied for this event" });
        }
  
        // Add event to sponsor's interested list
        sponsor.interested.push(eventId);
        await sponsor.save();
  
        // Deduct credits from user
        user.credits -= 5;
        await user.save();
  
        // Fetch event details
        let event;
        try {
            const eventRes = await axios.get(`http://localhost:3000/event/${eventId}`);
            event = eventRes.data.event;
        } catch (err) {
            console.error("Error fetching event data:", err.message);
            return res.status(500).json({ message: "Failed to fetch event data" });
        }
  
        // Send email notification
        const mailOptions = {
            from: 'sponsosync.in@gmail.com',
            to: sponsorEmail,
            subject: 'New Event Added for Your Sponsorship',
            text: `Your support is invaluable to us, and we believe this event aligns perfectly with your brand's vision and goals.
  
  Event Details:
  - Name: ${event.eventname}
  - Organizer: ${event.eventOrganizer}
  - Description: ${event.eventDescription}
  - Start Date: ${event.startDate}
  - Audience Count: ${event.audienceCount}
  
  Thank you for considering this opportunity.`
        };
  
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error("Email sending error:", error);
                
                // Rollback changes if email fails
                sponsor.interested.pull(eventId);
                await sponsor.save();
                user.credits += 5;
                await user.save();
                
                return res.status(500).json({ error: "Failed to send email" });
            }
            
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ 
                message: "Successfully applied for the event", 
                sponsor,
                remainingCredits: user.credits 
            });
        });
  
    } catch (error) {
        console.error("Error applying for sponsor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
  });



const mongoose = require("mongoose");

router.put('/:sponsorId/approve', async (req, res) => {
    const { sponsorId } = req.params;
    const { eventId } = req.body;
  
    try {
      // Validate eventId
      if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
  
      const sponsor = await Sponser.findById(sponsorId);
      if (!sponsor) {
        return res.status(404).json({ error: "Sponsor not found" });
      }
  
      // Check if event is already approved
      if (sponsor.approved.includes(eventId)) {
        return res.status(400).json({ error: "Event already approved" });
      }
  
      // Add to approved and remove from interested
      sponsor.approved.push(eventId);
      sponsor.interested = sponsor.interested.filter(id => id.toString() !== eventId);
  
      await sponsor.save();
  
      res.status(200).json({
        message: "Event approved successfully",
        approvedEvents: sponsor.approved,
        interestedEvents: sponsor.interested
      });
    } catch (err) {
      console.error("Error approving event:", err);
      res.status(500).json({ 
        error: "Failed to approve event",
        details: err.message 
      });
    }
  });
  
module.exports = router;

