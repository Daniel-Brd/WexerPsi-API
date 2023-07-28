import { CreateOccurenceServiceDto } from "../dtos/createOccurrenceServiceDto";
import { UpdateOccurenceDto } from "../dtos/updateOccurrenceDto";
import { OccurrenceService } from "./occurrenceService";

describe("OccurrenceService", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedOccurrenceRepository = {
    create: jest.fn(),
    getOccurrenceById: jest.fn(),
    updateOccurrence: jest.fn(),
  } as any;

  const mockedTimelineService = {
    create: jest.fn(),
    getTimelineById: jest.fn(),
    updateTimeline: jest.fn(),
    getOccurrencesByTimeline: jest.fn(),
  } as any;

  const mockedFileService = {
    create: jest.fn(),
  } as any;

  const sut = new OccurrenceService(
    mockedOccurrenceRepository,
    mockedTimelineService,
    mockedFileService
  );

  const mockedTimeline = {
    _id: "1",
    name: "timeline",
    occurrences: ["1"],
  };

  const mockedOccurrence = {
    _id: "2",
    title: "title",
    content: "content",
    kind: "Fato Relevante",
    files: [
      { name: "file1.jpg", mimetype: "image/jpeg" },
      { name: "file2.png", mimetype: "image/png" },
      { name: "file3.pdf", mimetype: "application/pdf" },
    ],
  };

  describe("create", () => {
    const payload: CreateOccurenceServiceDto = {
      title: "title",
      content: "content",
      kind: "Fato Relevante",
      files: [
        { name: "file1.jpg", mimetype: "image/jpeg" },
        { name: "file2.png", mimetype: "image/png" },
        { name: "file3.pdf", mimetype: "application/pdf" },
      ],
    };

    let fileId = 0;
    const mockedFiles = payload.files
      ? payload.files.map((file) => {
          fileId++;
          return { _id: fileId, ...file };
        })
      : [];

    it("should create an occurrence associated with a timeline", async () => {
      jest.spyOn(mockedTimelineService, "getTimelineById").mockResolvedValue(mockedTimeline);
      jest.spyOn(mockedFileService, "create").mockResolvedValue(mockedFiles);
      jest.spyOn(mockedOccurrenceRepository, "create").mockResolvedValue({
        ...mockedOccurrence,
        files: mockedFiles.map((file) => file._id.toString()),
      });

      const result = await sut.create(payload, mockedTimeline._id);

      const expected = {
        ...mockedOccurrence,
        files: mockedFiles.map((file) => file._id.toString()),
      };

      expect(result).toEqual(expected);

      expect(mockedTimelineService.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineService.getTimelineById).toBeCalledWith(mockedTimeline._id);

      expect(mockedFileService.create).toBeCalledTimes(1);
      expect(mockedFileService.create).toBeCalledWith(payload.files);

      expect(mockedOccurrenceRepository.create).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.create).toBeCalledWith({
        timelineId: mockedTimeline._id,
        ...payload,
        files: mockedFiles.map((file) => file._id.toString()),
      });
    });

    it("should return an error if the timeline is not found", async () => {
      jest.spyOn(mockedTimelineService, "getTimelineById").mockResolvedValue(false);

      const result = await sut.create(payload, "invalidId");

      const expected = {
        error: true,
        message: "Timeline not found",
        status: 404,
      };

      expect(result).toEqual(expected);

      expect(mockedTimelineService.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineService.getTimelineById).toBeCalledWith("invalidId");
    });

    it("should return an error if something goes wrong in file upload", async () => {
      jest.spyOn(mockedTimelineService, "getTimelineById").mockResolvedValue(mockedTimeline);
      jest.spyOn(mockedFileService, "create").mockResolvedValue({ error: true });

      const result = await sut.create(payload, mockedTimeline._id);

      const expected = { error: true, message: "Cannot upload files", status: 400 };

      expect(result).toEqual(expected);

      expect(mockedTimelineService.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineService.getTimelineById).toBeCalledWith(mockedTimeline._id);

      expect(mockedFileService.create).toBeCalledTimes(1);
      expect(mockedFileService.create).toBeCalledWith(payload.files);
    });

    it("should return an error if there are an internal error in the repository", async () => {
      jest.spyOn(mockedTimelineService, "getTimelineById").mockResolvedValue(mockedTimeline);
      jest.spyOn(mockedFileService, "create").mockResolvedValue(mockedFiles);
      jest.spyOn(mockedOccurrenceRepository, "create").mockRejectedValue(new Error("err"));

      const result = await sut.create(payload, mockedTimeline._id);

      const expected = { error: true, message: "Internal server error", status: 500 };

      expect(result).toEqual(expected);

      expect(mockedTimelineService.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineService.getTimelineById).toBeCalledWith(mockedTimeline._id);

      expect(mockedFileService.create).toBeCalledTimes(1);
      expect(mockedFileService.create).toBeCalledWith(payload.files);

      expect(mockedOccurrenceRepository.create).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.create).toBeCalledWith({
        timelineId: mockedTimeline._id,
        ...payload,
        files: mockedFiles.map((file) => file._id.toString()),
      });
    });

    describe("getOccurrenceById", () => {
      it("should return an occurrence by its id", async () => {
        jest
          .spyOn(mockedOccurrenceRepository, "getOccurrenceById")
          .mockResolvedValue(mockedOccurrence);

        const result = await sut.getOccurrenceById(mockedOccurrence._id);

        const expected = mockedOccurrence;

        expect(result).toEqual(expected);

        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledWith(mockedOccurrence._id);
      });

      it("should return an error if the occurrence is not found", async () => {
        jest
          .spyOn(mockedOccurrenceRepository, "getOccurrenceById")
          .mockRejectedValue(new Error("err"));

        const result = await sut.getOccurrenceById("invalidId");

        const expected = { error: true, message: "Occurrence not found", status: 404 };

        expect(result).toEqual(expected);

        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledWith("invalidId");
      });
    });

    describe("updateOccurrence", () => {
      const payload: UpdateOccurenceDto = {
        title: "updated title",
        content: "updated content",
        kind: "Sessão",
        files: [
          { name: "updated file1.png", mimetype: "image/png" },
          { name: "updated file2.pdf", mimetype: "application/pdf" },
          { name: "updated file3.jpg", mimetype: "image/jpeg" },
        ],
      };

      it("should update and return an occurrence", async () => {
        jest
          .spyOn(mockedOccurrenceRepository, "getOccurrenceById")
          .mockResolvedValue(mockedOccurrence);
        jest.spyOn(mockedFileService, "create").mockResolvedValue(mockedFiles);
        jest
          .spyOn(mockedOccurrenceRepository, "updateOccurrence")
          .mockResolvedValue({ ...mockedOccurrence, ...payload });

        const result = await sut.updateOccurrence(mockedOccurrence._id, payload);

        const expected = { ...mockedOccurrence, ...payload };

        expect(result).toEqual(expected);

        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledWith(mockedOccurrence._id);

        expect(mockedFileService.create).toBeCalledTimes(1);
        expect(mockedFileService.create).toBeCalledWith(payload.files);

        expect(mockedOccurrenceRepository.updateOccurrence).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.updateOccurrence).toBeCalledWith(
          mockedOccurrence._id,
          payload
        );
      });

      it("should return an error if the occurrence is not found", async () => {
        jest.spyOn(mockedOccurrenceRepository, "getOccurrenceById").mockResolvedValue(false);

        const result = await sut.updateOccurrence("invalidId", payload);

        const expected = { error: true, message: "Occurrence not found", status: 404 };

        expect(result).toEqual(expected);

        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledWith("invalidId");
      });

      it("should return an error if the payload is empty", async () => {
        jest
          .spyOn(mockedOccurrenceRepository, "getOccurrenceById")
          .mockResolvedValue(mockedOccurrence);

        const result = await sut.updateOccurrence(mockedOccurrence._id, {});

        const expected = { error: true, message: "Empty body", status: 400 };

        expect(result).toEqual(expected);

        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledWith(mockedOccurrence._id);
      });

      it("should return an error if something goes wrong in file upload", async () => {
        jest
          .spyOn(mockedOccurrenceRepository, "getOccurrenceById")
          .mockResolvedValue(mockedOccurrence);
        jest.spyOn(mockedFileService, "create").mockResolvedValue({ error: true });

        const result = await sut.updateOccurrence(mockedOccurrence._id, payload);

        const expected = { error: true, message: "Cannot upload files", status: 400 };

        expect(result).toEqual(expected);

        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledWith(mockedOccurrence._id);

        expect(mockedFileService.create).toBeCalledTimes(1);
        expect(mockedFileService.create).toBeCalledWith(payload.files);
      });

      it("should return an error if there are an internal error in the repository", async () => {
        jest
          .spyOn(mockedOccurrenceRepository, "getOccurrenceById")
          .mockResolvedValue(mockedOccurrence);
        jest.spyOn(mockedFileService, "create").mockResolvedValue(mockedFiles);
        jest
          .spyOn(mockedOccurrenceRepository, "updateOccurrence")
          .mockRejectedValue(new Error("err"));

        const result = await sut.updateOccurrence(mockedOccurrence._id, payload);

        const expected = { error: true, message: "Internal server error", status: 500 };

        expect(result).toEqual(expected);

        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.getOccurrenceById).toBeCalledWith(mockedOccurrence._id);

        expect(mockedFileService.create).toBeCalledTimes(1);
        expect(mockedFileService.create).toBeCalledWith(payload.files);

        expect(mockedOccurrenceRepository.updateOccurrence).toBeCalledTimes(1);
        expect(mockedOccurrenceRepository.updateOccurrence).toBeCalledWith(
          mockedOccurrence._id,
          payload
        );
      });
    });
  });
});
