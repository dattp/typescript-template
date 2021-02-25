import mongoose, { Schema, Document } from "mongoose";

export enum UserType {
  pub = "pub",
  customer = "customer",
}

/**
 * status: 0 - deleted, 1 - active, 2 - pending
 */
export interface IUser extends Document {
  fullname: string;
  email: string;
  usertype: UserType;
  hashed_password: string;
  salt: string;
  status: number;
}

const UserSchema: Schema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  // Gets the Mongoose enum from the TypeScript enum
  usertype: {
    type: String,
    required: true,
    enum: Object.values(UserType),
    default: UserType.pub,
  },
  hashed_password: { type: String, required: true },
  salt: { type: String, required: true },
  status: { type: Number, required: true, default: 2 },
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>("User", UserSchema);
