"use strict";

const video = document.querySelector("video");

const playBtn = document.getElementById("playPause");
const soundBtn = document.getElementById("sound");
const volumeRange = document.getElementById("volumeRange");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const textarea = document.querySelector("textarea");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.className = video.paused
    ? "fas fa-2x fa-play-circle"
    : "fas fa-2x fa-pause-circle";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  volumeRange.value = video.muted ? 0 : volumeValue;
  soundBtn.className = video.muted
    ? "fas fa-volume-mute fa-2x"
    : "fas fa-volume-up fa-2x";
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    soundBtn.className = "fas fa-volume-mute fa-2x";
  }
  if (value === "0") {
    soundBtn.className = "fas fa-volume-off fa-2x";
  } else {
    soundBtn.className = "fas fa-volume-up fa-2x";
  }
  video.volume = volumeValue = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  video.focus();
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    video.className = "compressed";
    fullScreenBtn.className = "fas fa-expand fa-2x";
  } else {
    videoContainer.requestFullscreen();
    video.className = "expanded";
    fullScreenBtn.className = "fas fa-compress fa-2x";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const videoClick = () => handlePlayClick();

const handleEnded = () => (playBtn.className = "fas fa-play-circle fa-2x");

const handleView = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const handleKeyDown = (event) => {
  if (event.target === textarea) return;
  const { which } = event;
  if (which === 32) {
    handlePlayClick();
  } else if (which === 70) {
    handleFullscreen();
  }
};

const handleDurationChange = (event) => {
  if (event.target.duration !== Infinity) {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
  }
};

playBtn.addEventListener("click", handlePlayClick);
soundBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);

video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("ended", handleEnded);
video.addEventListener("ended", handleView);
video.addEventListener("click", videoClick);
video.addEventListener("durationchange", handleDurationChange);
document.addEventListener("keydown", handleKeyDown);
