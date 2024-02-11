import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"; // Import dotenv for loading environment variables

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cors());

// Define the port where your server will listen
const PORT = process.env.PORT || 5000;

app.get("/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

app.post("/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).send("title and content fields required");
    }

    try {
      const note = await prisma.note.create({
        data: { title, content },
      });
      res.json(note);
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
});

app.put("/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if (!title || !content) {
      return res.status(400).send("title and content fields required");
    }

    if (!id || isNaN(id)) {
      return res.status(400).send("ID must be a valid number");
    }

    try {
      const updatedNote = await prisma.note.update({
        where: { id },
        data: { title, content },
      });
      res.json(updatedNote);
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
});

app.delete("/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).send("ID field required");
    }

    try {
      await prisma.note.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
