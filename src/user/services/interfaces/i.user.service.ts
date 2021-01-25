import { IUser } from "../../models/user.model";
import { UserDTO } from "../../dtos/user.dto";

interface IUserService {
  getUserByUsername(username: string): Promise<IUser>;
  register(user: UserDTO): Promise<IUser>;
}

export { IUserService };
