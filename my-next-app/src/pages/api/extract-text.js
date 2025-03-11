import { IncomingForm } from "formidable";
import fs from "fs/promises"; // Use async fs operations
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import textract from "textract";

// ✅ Disable Next.js bodyParser for formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const form = new IncomingForm({ multiples: true, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("❌ Formidable Error:", err);
        return resolve(res.status(500).json({ success: false, message: "File parsing error" }));
      }

      try {
        if (!files.file) {
          return resolve(res.status(400).json({ success: false, message: "No file uploaded" }));
        }

        // ✅ Ensure files are treated as an array
        const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];

        let extractedTexts = {};

        // ✅ Process each file independently
        for (const file of uploadedFiles) {
          const filePath = file.filepath || file.path;
          const fileExt = path.extname(file.originalFilename || file.name).toLowerCase();
          let text = "";

          if (fileExt === ".pdf") {
            const data = await pdfParse(await fs.readFile(filePath));
            text = data.text;
          } else if (fileExt === ".docx") {
            const { value } = await mammoth.extractRawText({ path: filePath });
            text = value;
          } else if ([".ppt", ".pptx"].includes(fileExt)) {
            text = await new Promise((resolve, reject) => {
              textract.fromFileWithPath(filePath, (err, extractedText) => {
                if (err) reject(err);
                resolve(extractedText);
              });
            });
          } else {
            text = "Unsupported file type";
          }

          extractedTexts[file.originalFilename || file.name] = text;
          console.log(`✅ Extracted from ${file.originalFilename || file.name}:`, text);

          // ✅ Cleanup only after processing all files
        }

        return resolve(res.status(200).json({ success: true, message: "Files processed", data: extractedTexts }));
      } catch (error) {
        console.error("❌ Error processing files:", error);
        return resolve(res.status(500).json({ success: false, message: "Error processing files" }));
      }
    });
  });
}
