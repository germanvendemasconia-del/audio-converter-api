import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("audio"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = inputPath + ".wav";

  const command = `ffmpeg -i ${inputPath} -acodec pcm_s16le -ar 16000 -ac 1 ${outputPath}`;

  exec(command, (err) => {
    if (err) {
      return res.status(500).send("Error converting audio");
    }

    res.download(outputPath, "audio.wav", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(3000, () => console.log("🚀 API running on port 3000"));
