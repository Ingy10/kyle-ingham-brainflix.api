import express from "express";
const router = express.Router();
import fs from "fs";
import { v4 as uuid4 } from "uuid";

const path = "./data/videos.json";

const readData = () => {
  try {
    const videoData = fs.readFileSync(path);
    const parsedVideoData = JSON.parse(videoData);
    console.log(videoData);
    console.log(parsedVideoData);
    return parsedVideoData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

readData();

router.get("/", (req, res) => {
  const videoData = readData();
  const videoListData = videoData.map((video) => ({
    id: video.id,
    title: video.title,
    channel: video.channel,
    image: video.image,
  }));
  console.log(videoListData);
  res.status(200).json(videoListData);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const videoListData = readData();

  const chosenVideo = videoListData.find((video) => video.id === id);
  console.log(chosenVideo);

  if (!chosenVideo) {
    res.status(404).send("Video not found");
  } else {
    res.status(200).json(chosenVideo);
  }
});

router.post("/", (req, res) => {
  const videoObj = req.body;
  const newVideo = {
    id: uuid4(),
    title: videoObj.title || "example title",
    channel: "Balloon Masters",
    image: "",
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

export default router;
