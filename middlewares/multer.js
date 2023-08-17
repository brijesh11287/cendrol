import multer from "multer";

const storage = multer.memoryStorage();

const pictureUpload = multer({ storage }).single("file");

export default pictureUpload;
