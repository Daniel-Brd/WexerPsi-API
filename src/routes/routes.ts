import { Router } from "express";
import { UserModule } from "../app/user/userModule";
import { AuthModule } from "../app/auth/authModule";
import { EnsureAuth } from "../common/middleares/ensureAuth";
import { PatientModule } from "../app/patient/patientModule";
import { TimelineModule } from "../app/timeline/timelineModule";
import { OccurenceModule } from "../app/occurrence/occurrenceModule";
import { upload } from "../config/storageConfig";

export const router = Router();

const userController = UserModule.build().controller;
const authController = AuthModule.build().controller;
const patientController = PatientModule.build().controller;
const timelineController = TimelineModule.build().controller;
const occurrenceController = OccurenceModule.build().controller;

router.post("/users", upload.single("file"), userController.create.bind(userController));
router.post("/login", authController.login.bind(authController));

router.use(EnsureAuth.ensureAuth);

router.patch("/users/:id", upload.single("file"), userController.updateById.bind(userController));
router.delete("/users/:id", userController.deleteById.bind(userController));

router.post("/users/:id/patients", patientController.create.bind(patientController));
router.get("/users/:id/patients", patientController.getPatientByUser.bind(patientController));
router.get("/patients/:id", patientController.getPatientById.bind(patientController));
router.patch("/patients/:id", patientController.updatePatient.bind(patientController));

router.post("/patients/:id/timelines", timelineController.create.bind(timelineController));
router.get(
  "/patients/:id/timelines",
  patientController.getTimelinesByPatient.bind(patientController)
);
router.get("/timelines/:id", timelineController.getTimelineById.bind(timelineController));
router.patch("/timelines/:id", timelineController.updateTimeline.bind(timelineController));

router.post(
  "/timelines/:id/occurrences",
  upload.array("files"),
  occurrenceController.create.bind(occurrenceController)
);
router.get(
  "/timelines/:id/occurrences",
  timelineController.getOccurencesByTimeline.bind(timelineController)
);
router.get("/occurrences/:id", occurrenceController.getOccurrenceById.bind(occurrenceController));
upload.array("files"),
  router.patch(
    "/occurrences/:id",
    upload.array("files"),
    occurrenceController.updateOccurrence.bind(occurrenceController)
  );
