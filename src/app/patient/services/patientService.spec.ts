import { CreatePatientDTO } from "../dtos/createPatientDto";
import { CreatePatientServiceDTO } from "../dtos/createPatientServiceDto";
import { PatientService } from "./patientService";

describe("PatientService", () => {
  const mockedPatientRepository = {
    create: jest.fn(),
    getPatientByUser: jest.fn(),
    getPatientById: jest.fn(),
    updatePatient: jest.fn(),
    associateTimeline: jest.fn(),
  } as any;

  const mockedUserRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    deleteById: jest.fn(),
    updateById: jest.fn(),
    associatePatient: jest.fn(),
  } as any;

  const sut = new PatientService(mockedPatientRepository, mockedUserRepository);

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

  describe("create", () => {
    const payload: CreatePatientServiceDTO = {
      userId: "1",
      body: {
        name: "Aurora Maria",
        birthdate: new Date("25/01/1998"),
        contact: "auroramaria@gmail.com",
        demands: "demands",
        personalAnnotations: "annotations",
      },
    };
    it("should create a patient associated with a user", async () => {
      await mockedUserRepository.findById.mockResolvedValue(mockedUser);
      await mockedPatientRepository.create.mockResolvedValue(payload);

      const result = await sut.create(payload);

      const expected = payload;

      expect(result).toEqual(expected);

      expect(mockedUserRepository.findById).toBeCalledTimes(1);
      expect(mockedUserRepository.findById).toBeCalledWith(payload.userId);

      expect(mockedPatientRepository.create).toBeCalledTimes(1);
      expect(mockedPatientRepository.create).toBeCalledWith({
        ...payload.body,
        user: payload.userId,
      });
    });

    it("should return an error if the user is not found", async () => {
      await mockedUserRepository.findById.mockResolvedValue(false);

      const result = await sut.create(payload);

      const expected = { error: true, message: "User not found", status: 404 };

      expect(result).toEqual(expected);

      expect(mockedUserRepository.findById).toBeCalledTimes(2);
      expect(mockedUserRepository.findById).toBeCalledWith(payload.userId);
    });

    it("should return an error if there are an internal error in the repository", async () => {
      await mockedPatientRepository.create.mockResolvedValue(false);

      const result = await sut.create(payload);

      const expected = { error: true, message: "Internal server error", status: 500 };

      expect(result).toEqual(expected);
    });
  });
});
