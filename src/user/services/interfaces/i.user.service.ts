import { IUser } from "../../models/user.model";

interface IUserService {
  getUserByEmail(email: string): Promise<IUser | null>;
  register(user: IUser): Promise<IUser | null>;
  updateStatusUser(email: string, status: number): Promise<IUser | null>;
  updateProfile(userUpdate: IUser): Promise<IUser | null>;
}

export { IUserService };
