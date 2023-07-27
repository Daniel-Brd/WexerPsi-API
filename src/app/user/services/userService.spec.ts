import { CreateUserServiceDTO, FindUserByEmailDTO, UpdateUserDTO } from "../dtos/createUserDto";
import { UserService } from "./userService";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");

const bcryptHashSyncSpy = jest.spyOn(bcrypt, "hashSync");

describe("UserService", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedUserRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    deleteById: jest.fn(),
    updateById: jest.fn(),
    associatePatient: jest.fn(),
  } as any;

  const mockedFileService = {
    create: jest.fn(),
  } as any;

  const sut = new UserService(mockedUserRepository, mockedFileService);

  describe("create", () => {
    const payload: CreateUserServiceDTO = {
      name: "Otto Moises",
      email: "ottomoises@gmail.com",
      password: "123456",
      file: {
        name: "photo.jpg",
        mimetype: "image/jpeg",
      },
    };

    const userToCreate: CreateUserServiceDTO = {
      ...payload,
      password: "$2a$10$Er9Sk5JFHb6wUpf6zIN73u/K579Ftpl8syF3AgDrrUhD6i/iznPpi",
    };

    it("should create a new user", async () => {
      await mockedFileService.create.mockResolvedValue([{ ...payload.file, _id: "1" }]);
      await mockedUserRepository.create.mockResolvedValue({ ...userToCreate, _id: "1" });

      bcryptHashSyncSpy.mockReturnValue(userToCreate.password as never);

      const result = await sut.create(payload);

      const expected = { ...userToCreate, _id: "1" };

      expect(result).toEqual(expected);

      expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(payload.email);

      expect(mockedFileService.create).toHaveBeenCalledTimes(1);
      expect(mockedFileService.create).toHaveBeenCalledWith([payload.file]);

      expect(bcryptHashSyncSpy).toHaveBeenCalledTimes(1);
      expect(bcryptHashSyncSpy).toHaveBeenCalledWith(payload.password, 8);

      expect(mockedUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.create).toHaveBeenCalledWith({ ...userToCreate, file: "1" });
    });

    it("should return an error if the email is already registered", async () => {
      await mockedFileService.create.mockResolvedValue([{ ...payload.file, _id: "1" }]);
      await mockedUserRepository.create.mockResolvedValue({ ...userToCreate, _id: "1" });
      await mockedUserRepository.findByEmail.mockResolvedValue(payload);

      const result = await sut.create(payload);

      const expected = { error: true, message: "E-mail already registered", status: 400 };

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(payload.email);
    });

    it("should return an error if something goes wrong in file upload", async () => {
      await mockedFileService.create.mockResolvedValue({
        error: true,
        message: "internal server error",
        status: 500,
      });

      const result = await sut.create(payload);

      const expected = { error: true, message: "Cannot upload photo", status: 400 };

      expect(result).toEqual(expected);
      expect(mockedFileService.create).toHaveBeenCalledWith([payload.file]);
    });
  });

  const mockedUser = {
    _id: "1",
    name: "Otto Moises",
    email: "ottomoises@gmail.com",
    password: "$2a$10$Er9Sk5JFHb6wUpf6zIN73u/K579Ftpl8syF3AgDrrUhD6i/iznPpi",
    file: {
      name: "photo.jpg",
      mimetype: "image/jpeg",
    },
  };

  describe("findByEmail", () => {
    const payload: FindUserByEmailDTO = {
      email: "ottomoises@gmail.com",
    };

    it("should return a user by his e-mail", async () => {
      await mockedUserRepository.findByEmail.mockResolvedValue(mockedUser);

      const result = await sut.findByEmail(payload);

      const expected = mockedUser;

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findByEmail).toBeCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toBeCalledWith(payload.email);
    });

    it("should return an error if the email is not found", async () => {
      await mockedUserRepository.findByEmail.mockResolvedValue(false);

      const result = await sut.findByEmail({ email: "wrongemail@gmail.com" });

      const expected = { error: true, message: "E-mail not found", status: 404 };

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findByEmail).toBeCalledWith("wrongemail@gmail.com");
    });
  });

  describe("deleteById", () => {
    const payload = "1";

    const userToDelete = mockedUser;

    it("should delete a user by its id ", async () => {
      await mockedUserRepository.deleteById.mockResolvedValue(mockedUser);

      const result = await sut.deleteById(payload);

      const expected = userToDelete;

      expect(result).toEqual(expected);
      expect(mockedUserRepository.deleteById).toBeCalledTimes(1);
      expect(mockedUserRepository.deleteById).toBeCalledWith(payload);
    });

    it("should return an error if the user is not found", async () => {
      await mockedUserRepository.deleteById.mockResolvedValue(false);

      const result = await sut.deleteById(payload);

      const expected = { error: true, message: "User not found", status: 404 };

      expect(result).toEqual(expected);
      expect(mockedUserRepository.deleteById).toBeCalledWith(payload);
    });
  });

  describe("updateById", () => {
    const payload: UpdateUserDTO = {
      name: "Updated Name",
      email: "updatedemail@gmail.com",
      password: "123",
      file: {
        name: "updatedphoto.png",
        mimetype: "image/png",
      },
    };

    it("should update a user by its id", async () => {
      await mockedUserRepository.updateById.mockResolvedValue(payload);
      await mockedFileService.create.mockResolvedValue([{ ...payload.file, _id: "1" }]);

      bcryptHashSyncSpy.mockReturnValue(payload.password as never);

      const result = await sut.updateById(mockedUser._id, payload);

      const expected = payload;

      expect(result).toEqual(expected);

      expect(mockedFileService.create).toHaveBeenCalledTimes(1);
      expect(mockedFileService.create).toHaveBeenCalledWith([payload.file]);

      expect(bcryptHashSyncSpy).toHaveBeenCalledTimes(1);
      expect(bcryptHashSyncSpy).toHaveBeenCalledWith(payload.password, 8);

      expect(mockedUserRepository.updateById).toBeCalledTimes(1);
      expect(mockedUserRepository.updateById).toBeCalledWith(mockedUser._id, {
        ...payload,
        file: { ...payload.file, _id: "1" },
      });
    });

    it("should return an error if the payload is empty", async () => {
      await mockedUserRepository.updateById.mockResolvedValue(payload);
      await mockedFileService.create.mockResolvedValue([{ ...payload.file, _id: "1" }]);

      const result = await sut.updateById(mockedUser._id, {});

      const expected = { error: true, message: "Empty body", status: 400 };

      expect(result).toEqual(expected);
    });

    it("should return an error if something goes wrong in file upload", async () => {
      await mockedFileService.create.mockResolvedValue({
        error: true,
        message: "internal server error",
        status: 500,
      });

      const result = await sut.updateById(mockedUser._id, payload);

      const expected = { error: true, message: "Cannot upload photo", status: 400 };

      expect(result).toEqual(expected);
      expect(mockedFileService.create).toHaveBeenCalledWith([payload.file]);
    });

    it("should return an error if the user is not found", async () => {
      await mockedUserRepository.updateById.mockResolvedValue(false);
      await mockedFileService.create.mockResolvedValue([{ ...payload.file, _id: "1" }]);

      bcryptHashSyncSpy.mockReturnValue(payload.password as never);

      const result = await sut.updateById(mockedUser._id, payload);

      const expected = { error: true, message: "User not found", status: 404 };

      expect(result).toEqual(expected);
      expect(mockedUserRepository.updateById).toBeCalledWith(mockedUser._id, {
        ...payload,
        file: { ...payload.file, _id: "1" },
      });
    });
  });
});
