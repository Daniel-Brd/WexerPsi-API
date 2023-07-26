import { Types } from "mongoose";
import { CreateFileDto } from "../../file/dtos/createFileDto";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  patients?: string;
  file: Types.ObjectId;
}

export interface CreateUserServiceDTO {
  name: string;
  email: string;
  password: string;
  patients?: string;
  file: CreateFileDto;
}

export interface FindUserByEmailDTO {
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  file?: CreateFileDto;
}
