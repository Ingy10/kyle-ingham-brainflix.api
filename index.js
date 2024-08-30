import express from "express";
import cors from "cors";
import videoRouter from "./routes/videos.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(`./public/images`));

app.use("/videos", videoRouter);

app.listen(PORT, () => {
  console.log(`Successfully listening on ${PORT}`);
});
