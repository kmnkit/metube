import express from "express";
import {
  see,
  getEdit,
  postEdit,
  logout,
  startGithubLogin,
  finishGithubLogin,
  postChangePassword,
  getChangePassword,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";
import routes from "../routes";

const userRouter = express.Router();

userRouter.get(routes.logout, protectorMiddleware, logout);
userRouter
  .route(routes.edit)
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route(routes.changePw)
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get(routes.ghStart, publicOnlyMiddleware, startGithubLogin);
userRouter.get(routes.ghFinish, publicOnlyMiddleware, finishGithubLogin);
userRouter.get(routes.id, see);

export default userRouter;
