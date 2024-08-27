import express from "express";
const router = express.Router();
import fs from "fs";

const path = "./data/videos.json";

const readData = () => {
  const videoData = fs.readFileSync(path);
  const parsedVideoData = JSON.parse(videoData);
  //   console.log(videoData);
  console.log(parsedVideoData[0].title);
  return parsedVideoData;
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

export default router;
