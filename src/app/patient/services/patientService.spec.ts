import { CreatePatientServiceDTO } from "../dtos/createPatientServiceDto";
import { UpdatePatientDTO } from "../dtos/updatePatientDto";
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
        birthdate: new Date("1998-01-25"),
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
      await mockedUserRepository.findById.mockResolvedValue(mockedUser);
      await mockedPatientRepository.create.mockResolvedValue(false);

      const result = await sut.create(payload);

      const expected = { error: true, message: "Internal server error", status: 500 };

      expect(result).toEqual(expected);
    });
  });

  const mockedPatient = {
    _id: "2",
    user: "1",
    timelines: ["1"],
    name: "Aurora Maria",
    birthdate: new Date("1998-01-25"),
    contact: "auroramaria@gmail.com",
    demands: "demands",
    personalAnnotations: "annotations",
  };

  describe("getPatientByUser", () => {
    it("should return all patients of a user", async () => {
      await mockedUserRepository.findById.mockResolvedValue(mockedUser);
      await mockedPatientRepository.getPatientByUser.mockResolvedValue([mockedPatient]);

      const result = await sut.getPatientByUser(mockedPatient.user);

      const expected = [mockedPatient];

      expect(result).toEqual(expected);

      // expect(mockedUserRepository.findById).toBeCalledTimes(1);
      expect(mockedUserRepository.findById).toBeCalledWith(mockedPatient.user);

      expect(mockedPatientRepository.getPatientByUser).toBeCalledTimes(1);
      expect(mockedPatientRepository.getPatientByUser).toBeCalledWith(mockedPatient.user);
    });

    it("should return a error if a user is no found", async () => {
      await mockedUserRepository.findById.mockResolvedValue(false);

      const result = await sut.getPatientByUser(mockedPatient.user);

      const expected = { error: true, message: "User not found", status: 404 };

      expect(result).toEqual(expected);
    });

    it("should return an error if a patient is no found", async () => {
      await mockedUserRepository.findById.mockResolvedValue(mockedUser);
      await mockedPatientRepository.getPatientById.mockResolvedValue(false);

      const result = await sut.getPatientById(mockedPatient.user);

      const expected = { error: true, message: "Patient not found", status: 404 };

      expect(result).toEqual(expected);
    });

    describe("updatePatient", () => {
      const payload: UpdatePatientDTO = {
        name: "Updated Name",
        birthdate: new Date("1994-03-20"),
        contact: "updatedemail@gmail.com",
        demands: "updated demands",
        personalAnnotations: "updated annotations",
      };

      it("should update a patient by its id", async () => {
        await mockedPatientRepository.updatePatient.mockResolvedValue({
          ...mockedPatient,
          ...payload,
        });
        await mockedPatientRepository.getPatientById.mockResolvedValue(mockedPatient);

        const result = await sut.updatePatient(mockedPatient._id, payload);

        const expected = { ...mockedPatient, ...payload };

        expect(result).toEqual(expected);

        expect(mockedPatientRepository.updatePatient).toBeCalledTimes(1);
        expect(mockedPatientRepository.updatePatient).toBeCalledWith(mockedPatient._id, payload);

        // expect(mockedPatientRepository.getPatientById).toBeCalledTimes(1);
        expect(mockedPatientRepository.getPatientById).toBeCalledWith(mockedPatient._id);
      });

      it("should return an error if the payload is empty", async () => {
        await mockedPatientRepository.updatePatient.mockResolvedValue({
          ...mockedPatient,
          ...payload,
        });

        const result = await sut.updatePatient(mockedPatient._id, {});

        const expected = { error: true, message: "Empty body", status: 400 };

        expect(result).toEqual(expected);
      });

      it("should return a error if a patient is no found", async () => {
        await mockedPatientRepository.getPatientById.mockResolvedValue(false);

        const result = await sut.updatePatient("invalidId", payload);

        const expected = { error: true, message: "Patient not found", status: 404 };

        expect(result).toEqual(expected);
      });

      it("should return an error if there are an internal error in the repository", async () => {
        await mockedPatientRepository.getPatientById.mockResolvedValue(mockedPatient);
        await mockedPatientRepository.updatePatient.mockResolvedValue(false);

        const result = await sut.updatePatient(mockedPatient._id, payload);

        const expected = { error: true, message: "Internal server error", status: 500 };

        expect(result).toEqual(expected);
      });
    });

    describe("getTimelinesByPatient", () => {
      it("should return all timelines of a patient", async () => {
        await mockedPatientRepository.getPatientById.mockResolvedValue(mockedPatient);

        const result = await sut.getTimelinesByPatient(mockedPatient._id);

        const expected = mockedPatient.timelines;

        expect(result).toEqual(expected);

        // expect(mockedPatientRepository.getPatientById).toBeCalledTimes(1);
        expect(mockedPatientRepository.getPatientById).toBeCalledWith(mockedPatient._id);
      });

      it("should return a error if a patient is no found", async () => {
        await mockedPatientRepository.getPatientById.mockResolvedValue(false);

        const result = await sut.getTimelinesByPatient("invalidId");

        const expected = { error: true, message: "Patient not found", status: 404 };

        expect(result).toEqual(expected);
      });
    });
  });
});
