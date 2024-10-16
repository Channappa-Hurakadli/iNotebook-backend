const express = require("express");
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();

// ROUTE-1 : fetch all notes of a user using GET: /api/notes/fecthallnotes .. login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE-2 : Add a new note for user using POST: /api/notes/addnotes .. login required
router.post("/addnotes",fetchuser,[
    body("title", "Enter the valid title").isLength({ min: 3 }),
    body("description","Description must be of at least 4 characters").isLength({ min: 4 })],async (req, res) => {

    try {
      const { title, description, tag } = req.body;

      // if there are errors return the error and 'bad request'
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const note = new Notes({
        title,description,tag,user:req.user.id
      })
      const savedNote= await note.save();

      res.json(savedNote);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE-3 : Update a previous note from user using PUT: /api/notes/updatenotes/:id .. login required
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
    try {
      const {title,description,tag}=req.body;

      //create a new note object
      const newNote ={};
      if(title){newNote.title = title};
      if(description){newNote.description = description};
      if(tag){newNote.tag = tag};

      //find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      if(!note){return res.status(404).send("Not Found")};
      
      if(note.user.toString() !== req.user.id ){
        return res.status(401).json({error:"Not Allowed"})
      }
      note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});

      res.json({note});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

// ROUTE-4 : Delete a note from user using DELETE: /api/notes/deletelnotes/:id .. login required
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
    try {
      //find the note to be deleted and delete it
      let note = await Notes.findById(req.params.id);
      if(!note){return res.status(404).send("Not Found")};
      
      //Allow deletion only if user owns this notes
      if(note.user.toString() !== req.user.id ){
        return res.status(401).json({error:"Not Allowed"})
      }
      note = await Notes.findByIdAndDelete(req.params.id);

      res.json({"Succes":"Note has been deleted",note:note});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = router;
