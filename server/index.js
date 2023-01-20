import express from "express";
import mongoose from "mongoose";
import cors from "cors";
mongoose.set("strictQuery", true);

const app = express();
mongoose.connect(
  "mongodb+srv://ahmaludin:ahmaludin123@cluster0.zfdxwnc.mongodb.net/fotoin?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database Connected"));

app.use(cors());
app.use(express.json());

app.listen("3000", () => console.log("Listening..."));
