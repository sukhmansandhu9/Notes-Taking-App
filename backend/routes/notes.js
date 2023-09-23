const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the notes using: GET "/api/notes/fetchallnotes" . Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }); // Finding all the notes matching the id
    res.json(notes); // Sending all the notes
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

//Route 2: Add a new Note using: POST "/api/notes/addnote" . Login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be of 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        // mongodb schema
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save(); // Saving the data in mongodb
      res.json(savedNote); // Sending the savedNotes
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);
//Route 3: Update an existing  Note using: PUT "/api/notes/updatenote" . Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    // Allow updation if user own this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});
//Route 4: Deleting an existing  Note using: DELETE "/api/notes/updatenote" . Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Find the note to be deleted and delete it

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    // Allow deletion if user own this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});
module.exports = router;
