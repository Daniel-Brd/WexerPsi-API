import { CreateFileDto } from "../dtos/createFileDto";
import { FileService } from "./fileService";

describe("FileService", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedFileRepository = {
    create: jest.fn(),
  } as any;

  const sut = new FileService(mockedFileRepository);

  describe("create", () => {
    const payload: CreateFileDto[] = [
      { name: "file.pdf", mimetype: "application/pdf" },
      { name: "image.jpg.", mimetype: "image/jpeg" },
    ];

    let fileId = 0;
    const mockedFiles = payload.map((file) => {
      fileId++;
      return { _id: fileId, ...file };
    });

    it("should upload and return a file", async () => {
      jest.spyOn(mockedFileRepository, "create").mockResolvedValue(mockedFiles);

      const result = await sut.create(payload);

      const expected = mockedFiles;

      expect(result).toEqual(expected);
      
      expect(mockedFileRepository.create).toBeCalledTimes(1)
      expect(mockedFileRepository.create).toBeCalledWith(payload)
    });

    it("should return an error if the timeline is not found", async () => {
      jest
        .spyOn(mockedFileRepository, "create")
        .mockRejectedValue(new Error("err"));

      const result = await sut.create(payload);

      const expected = {
        error: true,
        message: "internal server error",
        status: 500,
      };

      expect(result).toEqual(expected);

      expect(mockedFileRepository.create).toBeCalledTimes(1)
      expect(mockedFileRepository.create).toBeCalledWith(payload)
    });
  });
});
