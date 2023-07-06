export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  patients: string;
  // file: string;
}

export interface CreateUserServiceDTO {
  name: string;
  email: string;
  password: string;
  patients: string;
  // file: string;
}

export interface FindUserByEmailDTO {
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  patients?: string;
  // file?: string;
}
