import { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import textract from "textract";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "next-auth/react";

// ✅ Disable Next.js bodyParser for formidable
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  await connectDB();
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
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

        const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];
        let extractedTexts = {};

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
          return resolve(res.status(404).json({ success: false, message: "User not found" }));
        }

        if (!user.Docs) {
          user.Docs = new Map(); // Ensure Docs exists as a Map
        }

        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i];
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

          extractedTexts[i + 1] = text;
          console.log(`✅ Extracted from ${file.originalFilename || file.name}:`, text);

          // ✅ Store in MongoDB as { "1": "text1", "2": "text2" }
          user.Docs.set(`${i + 1}`, text);
        }

        await user.save();

        return resolve(
          res.status(200).json({ success: true, message: "Files uploaded and saved", data: extractedTexts })
        );
      } catch (error) {
        console.error("❌ Error processing files:", error);
        return resolve(res.status(500).json({ success: false, message: "Error processing files" }));
      }
    });
  });
}
