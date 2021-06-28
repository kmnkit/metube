const HOME = "/";
const ID = "/:id";
const USERS = "/users";
const VIDEOS = "/videos";

const JOIN = "/join";
const LOGIN = "/login";
const SEARCH = "/search";

const EDIT = "/edit";
const WATCH = "/watch";

const UPLOAD = "/upload";
const STATIC = "/static";
const DELETE = "/delete";
const COMMENT = "/comment";
const CHANGE_PW = "/change-password";

const GH_START = "/github/start";
const GH_FINISH = "/github/finish";

const API = "/api";

const routes = {
  id: ID,
  home: HOME,
  users: USERS,
  videos: VIDEOS,
  join: JOIN,
  login: LOGIN,
  search: SEARCH,
  watch: WATCH,
  edit: EDIT,
  upload: UPLOAD,
  static: STATIC,
  delete: DELETE,
  comment: COMMENT,
  api: API,
  changePw: CHANGE_PW,
  ghStart: GH_START,
  ghFinish: GH_FINISH,
};

export default routes;
