import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
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

  private phone: string;

  private birthday: Date;

  constructor() {
    this.id = "";
    this.fullname = "";
    this.email = "";
    this.usertype = UserType.pub;
    this.password = "";
    this.phone = "";
    this.birthday = new Date();
  }

  public toUser(user: IUser): UserDTO {
    const userDTO = new UserDTO();
    userDTO.id = user._id;
    userDTO.fullname = user.fullname;
    userDTO.email = user.email;
    userDTO.usertype = UserType.pub;
    userDTO.password = user.hashed_password;
    userDTO.phone = user.phone || "";
    userDTO.birthday = user.birthday || "";
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

class UserUpdateDTO {
  @IsOptional()
  @IsString()
  private fullname: string;

  @IsEmail()
  private email: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(12)
  @Matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)
  private phone: string;

  @IsOptional()
  @IsDate()
  private birthday: Date | null;

  constructor() {
    this.fullname = "";
    this.email = "";
    this.phone = "";
    this.birthday = new Date();
  }

  public toUserUpdate(
    fullname: string,
    email: string,
    phone: string,
    birthday: Date | null
  ): UserUpdateDTO {
    const userDTO = new UserUpdateDTO();
    userDTO.fullname = fullname;
    userDTO.email = email;
    userDTO.phone = phone;
    userDTO.birthday = birthday;
    return userDTO;
  }
}

export { UserDTO, UserUpdateDTO };
