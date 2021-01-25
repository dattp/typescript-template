import { IUser } from "../../models/user.model";

interface IUserService {
  getUserByUsername(username: string): Promise<IUser>;
}

export { IUserService };
