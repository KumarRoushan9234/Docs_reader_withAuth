import { exec } from "child_process";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  let filePath, command;

  try {
    switch (language) {
      case "python":
        filePath = path.join(tempDir, "script.py");
        fs.writeFileSync(filePath, code);
        command = `python3 ${filePath}`;
        break;

      case "javascript":
        filePath = path.join(tempDir, "script.js");
        fs.writeFileSync(filePath, code);
        command = `node ${filePath}`;
        break;

      case "cpp":
        filePath = path.join(tempDir, "script.cpp");
        fs.writeFileSync(filePath, code);
        command = `g++ ${filePath} -o ${tempDir}/script && ${tempDir}/script`;
        break;

      case "java":
        filePath = path.join(tempDir, "Main.java");
        fs.writeFileSync(filePath, code);
        command = `javac ${filePath} && java -cp ${tempDir} Main`;
        break;

      default:
        return res.status(400).json({ error: "Unsupported language" });
    }

    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      fs.unlinkSync(filePath); // Delete temp file

      if (error) return res.status(500).json({ output: stderr || error.message });
      res.status(200).json({ output: stdout });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
