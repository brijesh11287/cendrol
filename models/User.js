import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name required"],
    maxlength: [50, "Exceeded number of characters"],
  },
  Email: {
    type: String,
    required: [true, "Email required"],
    validate: validator.isEmail,
  },
  Mobile: {
    type: String,
    minlength: [10, "minimum 10 characters"],
    maxlength: [10, "maximum 10 characters"],
  },
  Password: {
    type: String,
    select: false,
    required: [true, "Password required"],
  },
  Profile_picture: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    Date: Date.now(),
  },
});

schema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcrypt.hash(this.Password, 10);
  next();
});

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

schema.methods.comparePassword = async function (Password) {
  return await bcrypt.compare(Password, this.Password);
};

export const User = mongoose.model("User", schema);
