import { Router } from "express";
import { userModule } from "../app/user/userModule";

export const router = Router();

const userController = userModule.build().controller;

router.post("/user", userController.create.bind(userController));
