import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

import UserModel, { IUser, UserType } from "../models/user.model";

class UserDTO {
  private id: string;

  @IsNotEmpty({
    message: "fullname is not empty",
  })
  @IsString()
  private fullname: string;

  @IsNotEmpty({
    message: "email is not empty",
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
  @MinLength(4, {
    message: "password length must be longer than or equal to 4 characters",
  })
  @MaxLength(28, {
    message: "password length must be shorter than or equal to 28 characters",
  })
  private password: string;

  constructor() {
    this.id = "";
    this.fullname = "";
    this.email = "";
    this.usertype = UserType.pub;
    this.password = "";
  }

  public toUser(user: IUser): UserDTO {
    const userDTO = new UserDTO();
    userDTO.id = user._id;
    userDTO.fullname = user.fullname;
    userDTO.email = user.email;
    userDTO.usertype = UserType.pub;
    userDTO.password = user.hashed_password;
    return userDTO;
  }

  public toUserCreate(user: UserDTO): UserDTO {
    const userDTO = new UserDTO();
    userDTO.fullname = user.fullname;
    userDTO.email = user.email;
    userDTO.usertype = UserType.pub;
    userDTO.password = user.password;
    return userDTO;
  }

  public toUserUpdate(
    fullname: string,
    hashedPassword: string,
    email: string
  ): UserDTO {
    const userDTO = new UserDTO();
    userDTO.fullname = fullname || "";
    userDTO.password = hashedPassword || "";
    userDTO.email = email || "";
    return userDTO;
  }

  public toUserModel(
    userDTO: UserDTO,
    passwordHash: string,
    salt: string
  ): IUser {
    const user: IUser = new UserModel();
    user.fullname = userDTO.fullname;
    user.email = userDTO.email;
    user.hashed_password = passwordHash;
    user.salt = salt;
    user.usertype = UserType.pub;
    return user;
  }
  //getter and setter
  getId(): string {
    return this.id;
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
  setPassword(password: string): void {
    this.password = password;
  }
}

export { UserDTO };
