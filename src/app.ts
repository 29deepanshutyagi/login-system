import dotenv from 'dotenv';
dotenv.config();

// Dependencies
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';

//import Routes
import authRoutes from './routes/auth';

// Import middleware
import { urlNotFound, globalErrorHandling } from './middlewares/errorHandling';

// Instantiate Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(logger('dev'));

// Routes 
app.use('/',authRoutes);

// 404
// Must be beneath all routes.
app.use(urlNotFound);

// All errors are passed to this.
app.use(globalErrorHandling);


const PORT = process.env.PORT || 3000;
// DB connectionString
const db = {
    uri:process.env.MONGODB_URL,
    options:{
        useUnifiedTopology:true,
        useNewUrlParser:true
    }
};

// Connect to DB
// Start Server
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/login-system', db.options)
.then(result=>{
    console.log('mongoDB Connected ...');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} ...`);
    });
});