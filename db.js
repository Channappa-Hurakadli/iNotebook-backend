const mongoose =require('mongoose');
// import mongoose from "mongoose"; //es module - .mjs extension
const mongoURI="mongodb://localhost:27017/inotebook";

async function connectToMongo() {
    try {
      await mongoose.connect(mongoURI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.log(err);
    }
  }
  
//   connectToMongo();
module.exports = connectToMongo;