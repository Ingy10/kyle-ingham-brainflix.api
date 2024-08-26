import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
  response.send("Hello World!");
});

app.listen(8080, () => {
  console.log("Successfully listening on 8080");
});
