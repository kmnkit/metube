import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
import routes from "../routes";

const HTTP_NOT_FOUND = 404;

/**
 * Return a summary for CreatedAt Datetime for a Video
 *
 * @param {Date} day CreatedAt Datetime for a Video
 * @returns {String} Summary string for CreateAt Datetime
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

/**
 * Render Home Page with Videos
 *
 * @param {express.req} req
 * @param {express.res} res
 */
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

/**
 * Render a Video Page
 *
 * @param {express.req} req
 * @param {express.res} res
 */
export const watch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res
      .status(HTTP_NOT_FOUND)
      .render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", {
    pageTitle: video.title,
    video,
    calculateNumOfDays,
  });
};

//#region Get and Post Edit video
/**
 * Render Edit Page for a Video
 *
 * @param {express.req} req
 * @param {express.res} res
 */
export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id: me },
    },
  } = req;
  const video = await Video.findById(id);
  if (String(video.owner) !== String(me)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res
      .status(HTTP_NOT_FOUND)
      .render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: `Edit ${video.title} `, video });
};

/**
 * Post video Edit
 *
 * @param {express.req} req
 * @param {express.res} res
 * @returns
 */
export const postEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id: me },
    },
  } = req;
  const video = await Video.findById(id);
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res
      .status(HTTP_NOT_FOUND)
      .render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(me)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect(routes.home);
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Edit Successed");
  return res.redirect(`${routes.videos}/${id}`);
};
//#endregion
//#region Get and Post Upload a Video
/**
 * Render an Upload page for a video
 *
 * @param {express.res} res
 */
export const getUpload = (_, res) =>
  res.render("upload", { pageTitle: "Upload Video" });
/**
 * Post a Video
 *
 * @param {express.req} req
 * @param {express.res} res
 */
export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id: owner },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
      owner,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(owner);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
//#endregion
/**
 * Delete a Video
 *
 * @param {express.req} req
 * @param {express.res} res
 */
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id: me },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(HTTP_NOT_FOUND)
      .render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(me)) {
    return res.status(403).redirect(routes.home);
  }
  await Video.findByIdAndDelete(id);
  return res.redirect(routes.home);
};
