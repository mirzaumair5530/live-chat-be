import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ email: 1 });

export default model("users", schema);
