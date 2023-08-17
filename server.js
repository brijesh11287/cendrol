import app from "./app.js";
import cloudinary from "cloudinary";

import { connectDB } from "./config/database.js";
connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API_KEY,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  secure: true,
});

app.listen(process.env.PORT, () => {
  console.log(`server working on ${process.env.PORT}`);
});
