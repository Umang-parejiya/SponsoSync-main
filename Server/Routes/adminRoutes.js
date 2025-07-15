const express = require('express');
const router = express.Router();
const Admin = require('../Model/admin');
const Event = require('../Model/event');
const Sponser = require('../Model/sponser');
const { generateToken ,jwtAuthMiddleware } = require('../middleware/jwt');
const {isAdmin} = require('../middleware/auth');
const dotenv = require('dotenv');
dotenv.config();


const nodemailer = require('nodemailer');


// Configure nodemailer transporter



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sponsosync@gmail.com',
      pass: process.env.NODEMAILER_KEY,
    },
  });
  
  router.get('/events/:id', async (req, res) => {
    try {
      const eventId = req.params.id;
  
      // Fetch the event from the database
      const event = await Event.findById(eventId).populate('createdBy', 'email'); // Populate the createdBy field with the user's email
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }
  
      // Return the event details
      res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Failed to fetch event.' });
    }
  });
  
  // API endpoint to send verification email
  router.post('/events/send-verification-email', async (req, res) => {
    const { email, eventName } = req.body;
  
    const mailOptions = {
      from: 'sponsosync.in@gmail.com',
      to: email,
      subject: 'Event Verification Confirmation',
      text: `Your event "${eventName}" has been verified by the admin. It is now live and visible to sponsors.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Verification email sent successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send verification email.' });
    }
  });
  
  // API endpoint to send deletion email
  router.post('/events/send-deletion-email', async (req, res) => {
    const { email, eventName } = req.body;
  
    const mailOptions = {
      from: 'sponsosync.in@gmail.com',
      to: email,
      subject: 'Event Deletion Confirmation',
      text: `Your event "${eventName}" has been deleted by the admin. If this was a mistake, please contact us.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Deletion email sent successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send deletion email.' });
    }
  });
  // Example route to fetch a specific sponsor by ID
router.get('/sponser/:id', async (req, res) => {
    try {
      const sponsorId = req.params.id;
  
      // Fetch sponsor from the database
      const sponsor = await Sponser.findById(sponsorId); // Assuming you're using Mongoose or a similar ORM
  
      if (!sponsor) {
        return res.status(404).json({ error: 'Sponsor not found.' });
      }
  
      res.status(200).json(sponsor);
    } catch (error) {
      console.error('Error fetching sponsor:', error);
      res.status(500).json({ error: 'Failed to fetch sponsor.' });
    }
  });
  
  // API endpoint to send verification email
  router.post('/sponser/send-verification-email', async (req, res) => {
    const { email } = req.body;
  
    const mailOptions = {
      from: 'sponsosync.in@gmail.com',
      to: email,
      subject: 'Verification of Sponsorship',
      text: 'Your company has been verified for sponsorship. Now you can provide sponsorship to event organizers.',
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Verification email sent successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send verification email.' });
    }
  });
  router.post('/sponser/send-deletion-email', async (req, res) => {
    const { email } = req.body;
  
    const mailOptions = {
      from: 'sponsosync.in@gmail.com',
      to: email,
      subject: 'Sponsorship Rejected Confirmation',
      text: 'Your sponsorship has been Rejected by the admin. If this was a mistake, please contact us.',
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Deletion email sent successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send deletion email.' });
    }
  });
router.post('/signup' ,async(req,res)=>{
    try{
        const data = req.body;
        const newAdmin = new Admin(data);
        const savedAdmin = await newAdmin.save()
        console.log("Data saved Successfully");
        // aasign jwt token
        const payload ={
            id : savedAdmin.id,
            username : savedAdmin.username
        }

        const token = generateToken(payload);
        console.log("token :" ,token);
        res.status(200).json({savedAdmin: savedAdmin ,token: token});

    }catch(err){
        console.error(err);
        // res.status(500).send('Server Error');
        res.status(500).json({error : 'Internal Server Error'});
        return;
    }
})

router.post('/login', async(req,res)=>{
    try{
        const {username ,password} = req.body;
        const admin = await Admin.findOne({username});
        if(!admin || !(admin.password === password)){
            return res.status(401).json({error : 'Invalid Credentials'});
        }
        //genarate token
        const payload ={
            id : admin.id,
            username : admin.username
        }
        const token = generateToken(payload);
        res.status(200).json({token: token});
    }catch(err){
        console.error(err);
        res.status(500).json({error : 'Internal Server Error'});
        return;
    }
});




router.get('/sponser' ,isAdmin,async(req,res)=>{
    try{
        const sponser = await Sponser.find({});
        res.status(200).json({sponser: sponser});

    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
        return;
    }
});



router.put('/sponser/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        const sponsor = await Sponser.findById(id);
        if (!sponsor) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }

        sponsor.isVerified = isVerified;
        await sponsor.save();

        res.status(200).json({ message: 'Sponsor verified successfully', sponsor });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/sponser/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const sponsor = await Sponser.findById(id);
        if (!sponsor) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }

        await sponsor.deleteOne();
        res.status(200).json({ message: 'Sponsor deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Backend routes for event verification
router.get('/events', isAdmin, async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json({ events });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/events/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        event.isVerified = isVerified;
        await event.save();

        res.status(200).json({ message: 'Event verified successfully', event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/events/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await event.deleteOne();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;