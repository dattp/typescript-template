import { v4 as uuidv4 } from "uuid";

import UserModel, { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/i.user.service";
import { UserDTO } from "../dtos/user.dto";
import { Helper } from "../../utils/helper";

class UserService implements IUserService {
  public async getUserByUsername(username: string): Promise<IUser> {
    try {
      return UserModel.findOne({ username }).lean();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async register(user: UserDTO): Promise<IUser> {
    try {
      const salt = Helper.createSalt();
      const password = Helper.hashPassword(user.getPassword(), salt);
      const token = uuidv4();
      const userCreate = { ...user, password, salt, token };
      return UserModel.create(userCreate);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async getUserById(id: string): Promise<IUser> {
    try {
      return UserModel.findById(id).lean();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async updateStatusUser(
    username: string,
    status: number
  ): Promise<IUser> {
    try {
      return UserModel.findOneAndUpdate({ username }, { status });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export { UserService };
