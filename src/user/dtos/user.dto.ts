import { IUser } from "../models/user.model";

enum UserType {
  pub = "pub",
  customer = "customer",
}

class UserDTO {
  private id: string;
  private username: string;
  private fullname: string;
  private email: string;
  private usertype: UserType;

  constructor() {
    this.id = "";
    this.username = "";
    this.fullname = "";
    this.email = "";
    this.usertype = UserType.pub;
  }

  public toUser(user: IUser): UserDTO | null {
    if (!user) return null;
    const userDTO = new UserDTO();
    userDTO.id = user._id;
    userDTO.username = user.username;
    userDTO.fullname = user.fullname;
    userDTO.email = user.email;
    userDTO.usertype = user.usertype;
    return userDTO;
  }
  //getter and setter
}

export { UserDTO };
