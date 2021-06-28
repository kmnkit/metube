import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";
import routes from "../routes";

const videoRouter = express.Router();
const idWithRe = `${routes.id}([0-9a-f]{24})`;
videoRouter.get(idWithRe, watch);
videoRouter
  .route(`${idWithRe}/edit`)
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route(`${idWithRe}/delete`)
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route(routes.upload)
  .all(protectorMiddleware)
  .get(getUpload)
  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload
  );
export default videoRouter;
