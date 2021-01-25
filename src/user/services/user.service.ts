import UserModel, { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/i.user.service";
class UserService implements IUserService {
  public async getUserByUsername(username: string): Promise<IUser> {
    try {
      return UserModel.findOne({ username }).lean();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export { UserService };
