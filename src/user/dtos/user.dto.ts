import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

import { IUser } from "../models/user.model";

enum UserType {
  pub = "pub",
  customer = "customer",
}

class UserDTO {
  private id: string;

  @IsNotEmpty({
    message: "username is not empty",
  })
  @IsString()
  @MinLength(4)
  @MaxLength(28)
  @Matches(/^[a-z0-9-_.]+$/)
  private username: string;

  @IsNotEmpty({
    message: "fullname is not empty",
  })
  @IsString()
  private fullname: string;

  @IsNotEmpty({
    message: "username is not empty",
  })
  @IsEmail()
  private email: string;

  @IsNotEmpty({
    message: "usertype is not empty",
  })
  @IsString()
  private usertype: UserType;

  @IsNotEmpty({
    message: "password is not empty",
  })
  @IsString()
  @MinLength(4)
  @MaxLength(28)
  private password: string;

  constructor() {
    this.id = "";
    this.username = "";
    this.fullname = "";
    this.email = "";
    this.usertype = UserType.pub;
    this.password = "";
  }

  public toUser(user: IUser): UserDTO {
    const userDTO = new UserDTO();
    userDTO.id = user._id;
    userDTO.username = user.username;
    userDTO.fullname = user.fullname;
    userDTO.email = user.email;
    userDTO.usertype = UserType.pub;
    userDTO.password = user.password;
    return userDTO;
  }
  //getter and setter
  getId(): string {
    return this.id;
  }
  getUsername(): string {
    return this.username;
  }
  getFullname(): string {
    return this.fullname;
  }
  getEmail(): string {
    return this.email;
  }
  getUsertype(): string {
    return this.usertype;
  }
  getPassword(): string {
    return this.password;
  }
}

export { UserDTO };
