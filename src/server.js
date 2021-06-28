import express from "express";
import morgan from "morgan";
import flash from "express-flash";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import rootRouter from "./routers/rootRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(flash());
app.use(localsMiddleware);
app.use(routes.upload, express.static("uploads"));
app.use(routes.static, express.static("assets"));
app.use(routes.home, rootRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;
