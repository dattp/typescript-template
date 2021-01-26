import mongoose, { Schema, Document } from "mongoose";

enum UserType {
  pub = "pub",
  customer = "customer",
}

/**
 * status: 0 - deleted, 1 - active, 2 - pending
 */
export interface IUser extends Document {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  usertype: UserType;
  password: string;
  salt: string;
  status: number;
  token: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  // Gets the Mongoose enum from the TypeScript enum
  usertype: { type: String, required: true, enum: Object.values(UserType) },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  status: { type: Number, required: true, default: 2 },
  token: { type: String },
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>("User", UserSchema);
