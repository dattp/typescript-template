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
      const userCreate = { ...user, password: password, salt };
      return UserModel.create(userCreate);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export { UserService };
