import UserModel, { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/i.user.service";
import { UserDTO } from "../dtos/user.dto";
import { Helper } from "../../utils/helper";

class UserService implements IUserService {
  public async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      return UserModel.findOne({ username }).lean();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async register(user: UserDTO): Promise<IUser | null> {
    try {
      const salt = Helper.createSalt();
      const password = Helper.hashPassword(user.getPassword(), salt);
      const userCreate = { ...user, password, salt };
      const userModel = new UserModel(userCreate);
      return UserModel.create(userModel);
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
    username: string,
    status: number
  ): Promise<IUser | null> {
    try {
      return UserModel.findOneAndUpdate({ username }, { status });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async updateProfile(userUpdate: IUser): Promise<IUser | null> {
    try {
      if (userUpdate.password) {
        const salt = Helper.createSalt();
        const password = Helper.hashPassword(userUpdate.password, salt);
        userUpdate = { ...userUpdate, password, salt } as IUser;
      }
      return UserModel.findOneAndUpdate(
        { username: userUpdate.username },
        userUpdate
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { UserService };
