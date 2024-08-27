import express from "express";
const router = express.Router();
import fs from "fs";

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

export default router;
