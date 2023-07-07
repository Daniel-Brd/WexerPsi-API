import { Router } from "express";
import { UserModule } from "../app/user/userModule";
import { AuthModule } from "../app/auth/authModule";
import { EnsureAuth } from "../common/middleares/ensureAuth";
import { PatientModule } from "../app/patient/patientModule";

export const router = Router();

const userController = UserModule.build().controller;
const authController = AuthModule.build().controller;
const patientController = PatientModule.build().controller;

router.post("/user", userController.create.bind(userController));
router.post("/login", authController.login.bind(authController));

router.use(EnsureAuth.ensureAuth);

router.patch("/user/:id", userController.updateById.bind(userController));
router.delete("/user/:id", userController.deleteById.bind(userController));
router.post(
  "/user/:id/patient",
  patientController.create.bind(patientController)
);
router.get(
  "/user/:id/patient",
  patientController.getPatientByUser.bind(patientController)
);
router.get(
  "/patient/:id",
  patientController.getPatientById.bind(patientController)
);
