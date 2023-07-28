import { CreateTimelineServiceDto } from "../dtos/createTimelineServiceDto";
import { UpdateTimelineDTO } from "../dtos/updateTimelineDto";
import { TimelineService } from "./timelineService";

describe("TimelineService", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedTimelineRepository = {
    create: jest.fn(),
    getTimelineById: jest.fn(),
    updateTimeline: jest.fn(),
    associateOccurrence: jest.fn(),
  } as any;

  const sut = new TimelineService(mockedTimelineRepository);

  const mockedTimeline = {
    _id: "2",
    name: "timeline",
    occurrences: ["1"],
  };

  describe("create", () => {
    const payload: CreateTimelineServiceDto = {
      patientId: "1",
      body: { name: "timeline" },
    };

    it("should create a timeline associated with a patient", async () => {
      jest.spyOn(mockedTimelineRepository, "create").mockResolvedValue(mockedTimeline);

      const result = await sut.create(payload);

      const expected = mockedTimeline;

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.create).toBeCalledTimes(1);
      expect(mockedTimelineRepository.create).toBeCalledWith({
        patientId: payload.patientId,
        ...payload.body,
      });
    });
    it("should return an error if there are an internal error in the repository", async () => {
      jest.spyOn(mockedTimelineRepository, "create").mockRejectedValue(new Error("err"));

      const result = await sut.create(payload);

      const expected = { error: true, message: "Internal server error", status: 500 };

      expect(result).toEqual(expected);
    });
  });

  describe("getTimelineById", () => {
    it("should return a timeline by its id", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockResolvedValue(mockedTimeline);

      const result = await sut.getTimelineById(mockedTimeline._id);

      const expected = mockedTimeline;

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.getTimelineById).toBeCalledWith(mockedTimeline._id);
    });

    it("should return an error if the timeline is not found", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockResolvedValue(false);

      const result = await sut.getTimelineById(mockedTimeline._id);

      const expected = { error: true, message: "Timeline not found", status: 404 };

      expect(result).toEqual(expected);
    });
  });

  describe("updateTimeline", () => {
    const payload: UpdateTimelineDTO = {
      name: "updatedTimeline",
    };

    it("should return an updated timeline", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockResolvedValue(mockedTimeline);
      jest
        .spyOn(mockedTimelineRepository, "updateTimeline")
        .mockResolvedValue({ ...mockedTimeline, ...payload });

      const result = await sut.updateTimeline(mockedTimeline._id, payload);

      const expected = { ...mockedTimeline, ...payload };

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.getTimelineById).toBeCalledWith(mockedTimeline._id);

      expect(mockedTimelineRepository.updateTimeline).toBeCalledTimes(1);
      expect(mockedTimelineRepository.updateTimeline).toBeCalledWith(mockedTimeline._id, payload);
    });

    it("should return an error if the timeline is not found", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockResolvedValue(false);

      const result = await sut.updateTimeline("invalidId", payload);

      const expected = { error: true, message: "Timeline not found", status: 404 };

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.getTimelineById).toBeCalledWith("invalidId");
    });

    it("should return an error if the payload is empty", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockResolvedValue(mockedTimeline);

      const result = await sut.updateTimeline(mockedTimeline._id, {});

      const expected = { error: true, message: "Empty body", status: 400 };

      expect(result).toEqual(expected);
    });

    it("should return an error if there are an internal error in the repository", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockResolvedValue(mockedTimeline);
      jest.spyOn(mockedTimelineRepository, "updateTimeline").mockRejectedValue(new Error("err"));

      const result = await sut.updateTimeline(mockedTimeline._id, payload);

      const expected = { error: true, message: "Internal server error", status: 500 };

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.getTimelineById).toBeCalledWith(mockedTimeline._id);

      expect(mockedTimelineRepository.updateTimeline).toBeCalledTimes(1);
      expect(mockedTimelineRepository.updateTimeline).toBeCalledWith(mockedTimeline._id, payload);
    });
  });

  describe("getOccurrencesByTimeline", () => {
    it("should return all occurrences of a timeline", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockResolvedValue(mockedTimeline);

      const result = await sut.getOccurrencesByTimeline(mockedTimeline._id);

      const expected = mockedTimeline.occurrences;

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.getTimelineById).toBeCalledWith(mockedTimeline._id);
    });

    it("should return an error if the timeline is not found", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockResolvedValue(false);

      const result = await sut.getOccurrencesByTimeline("invalidId");

      const expected = { error: true, message: "Timeline not found", status: 404 };

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.getTimelineById).toBeCalledWith("invalidId");
    });

    it("should return an error if the occurrences is not found", async () => {
      jest
        .spyOn(mockedTimelineRepository, "getTimelineById")
        .mockResolvedValue({ ...mockedTimeline, occurrences: [] });

      const result = await sut.getOccurrencesByTimeline(mockedTimeline._id);

      const expected = { error: true, message: "Occurrences not found", status: 404 };

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.getTimelineById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.getTimelineById).toBeCalledWith(mockedTimeline._id);
    });

    it("should return an error if there are an internal error in the repository", async () => {
      jest.spyOn(mockedTimelineRepository, "getTimelineById").mockRejectedValue(new Error("err"));

      const result = await sut.getOccurrencesByTimeline(mockedTimeline._id);

      const expected = { error: true, message: "Internal server error", status: 500 };

      expect(result).toEqual(expected);
    });
  });
});
