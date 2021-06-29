import multer from "multer";

const isHeroku = process.env.NODE_ENV === "production";

/** Return a summary for CreatedAt Datetime for a Video
 *
 * @param { Date } day CreatedAt Datetime for a Video
 * @returns { String } Summary string for CreateAt Datetime
 */
const calculateNumOfDays = (day) => {
  const today = new Date();
  const value = new Date(day);
  const betweenTime = Math.floor(
    (today.getTime() - value.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) return `${betweenTime}분전`;
  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) return `${betweenTimeHour}시간전`;
  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) return `${betweenTimeDay}일전`;
  return `${Math.floor(betweenTimeDay / 365)}년전`;
};

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Metube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  res.locals.calcDate = calculateNumOfDays;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  }
  req.flash("error", "Log in first.");
  return res.redirect("/login");
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  }
  req.flash("error", "Authorized");
  return res.redirect("/users/my-profile");
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});
