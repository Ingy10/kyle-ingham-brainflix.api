import express from "express";
const router = express.Router();
import fs from "fs";
import { v4 as uuid4 } from "uuid";

const path = "./data/videos.json";

const readData = () => {
  try {
    const videoData = fs.readFileSync(path);
    return JSON.parse(videoData);
  } catch (error) {
    console.error(error);
    return [];
  }
};

readData();

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

const findVideo = (id) => {
  const videoListData = readData();
  return videoListData.find((video) => video.id === id);
};

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const chosenVideo = findVideo(id);

  if (!chosenVideo) {
    res.status(404).send("Video not found");
  } else {
    res.status(200).json(chosenVideo);
  }
});

router.post("/", (req, res) => {
  const videoObj = req.body;

  if (!videoObj.title || !videoObj.description) {
    res.status(400).json("Title and Description are required");
  }

  const newVideo = {
    id: uuid4(),
    title: videoObj.title || "example title",
    channel: "Balloon Masters",
    image: "http://localhost:8080/images/Upload-video-preview.jpg",
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
  fs.writeFileSync(path, JSON.stringify(videoData));

  res.status(201).json(newVideo);
});

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
    fs.writeFileSync(path, JSON.stringify(videoData));
    res.status(201).json(selectedVideo.comments);
  } else {
    res.status(404).json("Video not found");
  }
});

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

  fs.writeFileSync(path, JSON.stringify(videoList));
  res.status(200).json(`Comment with ID: ${commentId} has been deleted`);
});

export default router;
