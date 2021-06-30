const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtns = document.querySelectorAll("#btn__comment-del>button");

const handleSubmit = async (event) => {
  event.preventDefault();
  const {
    dataset: { id: videoId },
  } = videoContainer;
  console.log(videoId);
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  if (text === "") return;
  await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  window.location.reload();
};

const handleDelBtn = async (event) => {
  event.preventDefault();
  const {
    dataset: { id: commentId },
  } = event.target;
  await fetch(`/api/comment/${commentId}/delete`, {
    method: "GET",
  });
  window.location.reload();
};

const init = () => {
  delBtns.forEach((btn) => btn.addEventListener("click", handleDelBtn));
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
};

init();
