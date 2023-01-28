import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/userRoutes.js";

dotenv.config();
import connectDB from "./config/Database.js";
connectDB();

const PORT = process.env.PORT;
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`Server Listening at PORT: ${PORT}`));

// change
// membuat file refreshToken.js
