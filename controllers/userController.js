import { User } from "../models/User.js";
import "express-async-errors";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import dataURI from "../utils/dataURI.js";
import cloudinary from "cloudinary";

export const register = async (req, res, next) => {
  const { Name, Email, Mobile, Password } = req.body;

  const file = req.file;

  // console.log(file);

  if (!Name || !Email || !Mobile || !Password || !file) {
    return next(new ErrorHandler("Please provide all details", 400));
  }

  const user = await User.findOne({ Email });
  if (user) return next(new ErrorHandler("Email already Exists", 409));

  // uplaoding file on cloud using cloudinary

  const fileUri = dataURI(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  const data = await User.create({
    Name,
    Email,
    Mobile,
    Password,
    Profile_picture: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  res.status(201).json({
    message: "User Created Successfully",
    data,
  });
};

export const allusers = async (req, res, next) => {
  const data = await User.find();
  if (!data) return next(new ErrorHandler("No user found", 404));

  res.status(200).json({
    data,
  });
};
export const singleUser = async (req, res, next) => {
  const { id } = req.body;
  const data = await User.findById(id);
  if (!data) return next(new ErrorHandler("No user found", 404));

  res.status(200).json({
    data,
  });
};

export const updateUser = async (req, res, next) => {
  const { Name, Email, Mobile, Password } = req.body;

  const user = await User.findById(req.user._id);

  console.log(user);

  user.Name = Name;
  user.Email = Email;
  user.Mobile = Mobile;
  user.Password = Password;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
  });
};

export const login = async (req, res, next) => {
  const { Email, Password } = req.body;

  if (!Email || !Password)
    return next(new ErrorHandler("Please provide all details", 400));
  const user = await User.findOne({ Email }).select("+Password");

  if (!user)
    return next(new ErrorHandler("please provide correct details", 401));

  const isMatch = await user.comparePassword(Password);

  if (!isMatch)
    return next(new ErrorHandler("incorrect email and password", 401));

  sendToken(res, user, `Welcome Back, ${user.Name}`, 200);
};

export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      mesaage: "Logged out successfully",
    });
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.body;
  const user = await User.findById(id);

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};

export const updateProfilePicture = async (req, res, next) => {
  const file = req.file;

  const user = await User.findById(req.user._id);

  const fileUri = dataURI(file);

  const mycloud = await cloudinary.v2.uploader.destroy(
    user.Profile_picture.public_id
  );

  const cloud = await cloudinary.v2.uploader.upload(fileUri.content);

  // console.log(mycloud.public_id);

  user.Profile_picture = {
    public_id: cloud.public_id,
    url: cloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Picture updated",
  });
};
