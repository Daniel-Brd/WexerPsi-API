import { LoginDTO } from "../dtos/loginDto";
import { AuthService } from "./authService";
import * as bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";

jest.mock("bcrypt");

describe("AuthService", () => {
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

  const sut = new AuthService(mockedUserRepository);

  describe("login", () => {
    const payload: LoginDTO = {
      email: "ottomoises@gmail.com",
      password: "123456",
    };

    it("should authenticate an user and return their token and infos", async () => {
      jest
        .spyOn(mockedUserRepository, "findByEmail")
        .mockResolvedValue(mockedUser);
      jest.spyOn(bcrypt, "compareSync").mockReturnValue(true);

      jest.spyOn(JWT, "sign").mockReturnValue("token" as never);

      const result = await sut.login(payload);

      const expected = { token: "token", user: mockedUser };

      expect(result).toEqual(expected);

      expect(mockedUserRepository.findByEmail).toBeCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toBeCalledWith(payload.email);

      expect(bcrypt.compareSync).toBeCalledTimes(1);
      expect(bcrypt.compareSync).toBeCalledWith(
        payload.password,
        mockedUser.password
      );

      expect(JWT.sign).toBeCalledTimes(1);
      expect(JWT.sign).toBeCalledWith(
        { id: mockedUser._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "60min" }
      );
    });

    it("should return an error if the email is not found", async () => {
      jest.spyOn(mockedUserRepository, "findByEmail").mockResolvedValue(false);
      jest.spyOn(bcrypt, "compareSync").mockReturnValue(false);

      const result = await sut.login(payload);

      const expected = {
        error: true,
        message: "Invalid e-mail or password",
        status: 400,
      };

      expect(result).toEqual(expected);

      expect(mockedUserRepository.findByEmail).toBeCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toBeCalledWith(payload.email);
    });

    it("should return an error if the password is incorrect", async () => {
      jest
        .spyOn(mockedUserRepository, "findByEmail")
        .mockResolvedValue(mockedUser);

      const result = await sut.login(payload);

      const expected = {
        error: true,
        message: "Invalid e-mail or password",
        status: 400,
      };

      expect(result).toEqual(expected);

      expect(mockedUserRepository.findByEmail).toBeCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toBeCalledWith(payload.email);

      expect(bcrypt.compareSync).toBeCalledTimes(1);
      expect(bcrypt.compareSync).toBeCalledWith(
        payload.password,
        mockedUser.password
      );
    });
  });
});
