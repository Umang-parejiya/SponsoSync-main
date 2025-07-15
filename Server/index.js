const express = require('express');
const db = require('./db');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello World');
});

const userRoutes = require('./Routes/userRoutes');
app.use('/user', userRoutes);

const eventRoutes = require('./Routes/eventRoutes');
app.use('/event', eventRoutes);

const sponserRotes = require('./Routes/sponserRoutes');
app.use('/sponser', sponserRotes);

const adminRoutes = require('./Routes/adminRoutes');
app.use('/admin', adminRoutes);

const geminiapiRoutes = require('./Routes/geminiapiRoutes');
app.use('/gemini', geminiapiRoutes);

app.listen(process.env.PORT || 3000,()=>{
    console.log('Server is running on port 3000');
})

    