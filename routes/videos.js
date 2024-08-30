import express from "express";
import fs from "fs";
import { v4 as uuid4 } from "uuid";
import multer from "multer";
import path from "path";

const router = express.Router();
const root = path.resolve();
const videoDataPath = path.resolve("data", "videos.json");

// configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(root, "public", "images"));
  },
  filename: function (req, file, cb) {
    const uniqueName = uuid4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Function to read data from .json data file
const readData = () => {
  try {
    const videoData = fs.readFileSync(videoDataPath);
    return JSON.parse(videoData);
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Endpoint to get all videos
router.get("/", (_req, res) => {
  const videoData = readData();
  const videoListData = videoData.map((video) => ({
    id: video.id,
    title: video.title,
    channel: video.channel,
    image: video.image,
  }));
  if (videoListData) {
    res.status(200).json(videoListData);
  } else {
    res.status(404).send("Videos not found");
  }
});

// function to find video by id
const findVideo = (id) => {
  const videoListData = readData();
  return videoListData.find((video) => video.id === id);
};

// Endpoint to get specific video by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const chosenVideo = findVideo(id);

  if (!chosenVideo) {
    res.status(404).send("Video not found");
  } else {
    res.status(200).json(chosenVideo);
  }
});

// Endpoint to add a new video
router.post("/", upload.single("image"), (req, res) => {
  const videoObj = req.body;

  if (!videoObj.title || !videoObj.description) {
    res.status(400).json("Title and Description are required");
  }

  const newVideo = {
    id: uuid4(),
    title: videoObj.title || "example title",
    channel: "Balloon Masters",
    image: req.file
      ? `/images/${req.file.filename}`
      : "/images/Upload-video-preview.jpg",
    description: videoObj.description || "example description",
    views: 0,
    likes: 0,
    duration: "3:33",
    video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
  };

  const videoData = readData();
  videoData.push(newVideo);
  fs.writeFileSync(videoDataPath, JSON.stringify(videoData));

  res.status(201).json(newVideo);
});

// Endpoint to add a comment to a specific video
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const commentObj = req.body;
  const newComment = {
    name: commentObj.name,
    comment: commentObj.comment,
    id: uuid4(),
    likes: 0,
    timestamp: Date.now(),
  };

  const videoData = readData();
  let selectedVideo = findVideo(id);

  if (selectedVideo) {
    let index = videoData.findIndex((video) => video.id === id);
    selectedVideo.comments.push(newComment);
    videoData[index] = selectedVideo;
    fs.writeFileSync(videoDataPath, JSON.stringify(videoData));
    res.status(201).json(selectedVideo.comments);
  } else {
    res.status(404).json("Video not found");
  }
});

// Endpoint to delete a comment from a specific video
router.delete("/:id/comments/:commentId", (req, res) => {
  const { id, commentId } = req.params;
  const videoList = readData();
  const videoIndex = videoList.findIndex((video) => video.id === id);

  if (videoIndex === -1) {
    return res.status(404).json("Video not found");
  }

  const video = videoList[videoIndex];
  const originalCommentCount = video.comments.length;
  video.comments = video.comments.filter((comment) => comment.id !== commentId);

  if (video.comments.length === originalCommentCount) {
    return res.status(404).json("Comment not found");
  }

  fs.writeFileSync(videoDataPath, JSON.stringify(videoList));
  res.status(200).json(`Comment with ID: ${commentId} has been deleted`);
});

export default router;
