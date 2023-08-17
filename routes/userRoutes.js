import express from "express";
import {
  register,
  login,
  logout,
  allusers,
  deleteUser,
  singleUser,
  updateUser,
  updateProfilePicture,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import pictureUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(pictureUpload, register);
router.route("/login").post(login);
router.route("/allusers").get(isAuthenticated, allusers);
router.route("/singleuser").get(isAuthenticated, singleUser);
router.route("/updateuser").put(isAuthenticated, updateUser);
router
  .route("/updatepicture")
  .patch(isAuthenticated, pictureUpload, updateProfilePicture);
router.route("/deleteuser").delete(isAuthenticated, deleteUser);
router.route("/logout").get(logout);

export default router;
