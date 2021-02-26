import UserModel, { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/i.user.service";

class UserService implements IUserService {
  public async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return UserModel.findOne({ email }).lean();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async register(user: IUser): Promise<IUser | null> {
    try {
      return UserModel.create(user);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async getUserById(id: string): Promise<IUser | null> {
    try {
      return UserModel.findById(id).lean();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async updateStatusUser(
    email: string,
    status: number
  ): Promise<IUser | null> {
    try {
      return UserModel.findOneAndUpdate({ email }, { status });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async updateProfile(userUpdate: IUser): Promise<IUser | null> {
    try {
      return UserModel.findOneAndUpdate(
        { email: userUpdate.email },
        userUpdate
      ).lean();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updatePassword(
    email: string,
    passwordHash: string
  ): Promise<IUser | null> {
    try {
      return UserModel.findOneAndUpdate(
        { email },
        { hashed_password: passwordHash }
      ).lean();
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { UserService };
