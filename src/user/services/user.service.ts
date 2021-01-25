import UserModel, { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/i.user.service";
import { UserDTO } from "../dtos/user.dto";

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
      const userCreate = { ...user, salt: "123sdfjgls" };
      return UserModel.create(userCreate);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export { UserService };
