import { IUser } from "../../models/user.model";
import { UserDTO } from "../../dtos/user.dto";

interface IUserService {
  getUserByUsername(username: string): Promise<IUser | null>;
  register(user: UserDTO): Promise<IUser | null>;
  updateStatusUser(username: string, status: number): Promise<IUser | null>;
  updateProfile(userUpdate: IUser): Promise<IUser | null>;
}

export { IUserService };
