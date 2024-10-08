const mongoose =require('mongoose');
// import mongoose from "mongoose"; //es module - .mjs extension
const mongoURI="mongodb://localhost:27017/";

async function connectToMongo() {
    try {
      await mongoose.connect('mongodb://localhost:27017');
      console.log('Connected to MongoDB');
    } catch (err) {
      console.log(err);
    }
  }
  
//   connectToMongo();
module.exports = connectToMongo;