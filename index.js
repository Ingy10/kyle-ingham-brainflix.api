import express from "express";
import cors from "cors";
import videoRouter from "./routes/videos.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/videos", videoRouter);

app.get("/", (_request, response) => {
  response.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Successfully listening on ${PORT}`);
});
