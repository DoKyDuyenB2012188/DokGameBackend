const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apps = require('./models/App');
const authRouter = require('./routes/auth');
const storeRouter = require('./routes/store');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = async ()=> {
    mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@dokgame.lgauzq6.mongodb.net/store?retryWrites=true&w=majority`).then((result)=>{
        console.log('MongoDB connected');
    }).catch(error => {
        console.log(error.message);
        process.exit(1);
    })
}
connectDB();
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/store', storeRouter);
app.use('/api/user', userRouter);
const PORT = 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));
