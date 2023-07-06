import { Router } from "express";
import { UserModule } from "../app/user/userModule";
import { AuthModule } from "../app/auth/authModule";
import { EnsureAuth } from "../common/middleares/ensureAuth";

export const router = Router();

const userController = UserModule.build().controller;
const authController = AuthModule.build().controller;

router.post("/user", userController.create.bind(userController));
router.post("/login", authController.login.bind(authController));

router.use(EnsureAuth.ensureAuth);

router.patch("/user/:id", userController.updateById.bind(userController));
router.delete("/user/:id", userController.deleteById.bind(userController));
