import fs from "fs";
import * as pdfjslib from "pdfjs-dist/legacy/build/pdf.mjs";
import {askAi} from "../services/openrouete.service.js";

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No resume file uploaded" });
        }
        const filepath = req.file.path;
        const fileBuffer = await fs.promises.readFile(filepath);
        const unit8Array = new Uint8Array(fileBuffer);
        const pdf = await pdfjslib.getDocument({ data: unit8Array }).promise;
        let resumeText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            resumeText += pageText + "\n";

        }
        resumeText = resumeText.replace(/\s+/g, " ").trim();
        const messages = [
            {
                role: "system",
                content: 
                `Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`
            },
            {
                role: "user",
                content: resumeText
            }
        ];
        const airesponse = await askAi(messages);
        const parsedResponse = JSON.parse(airesponse);
        fs.unlinkSync(filepath);
        res.json({
            role:parsedResponse.role,
            experience: parsedResponse.experience,
            projects: parsedResponse.projects,
            skills: parsedResponse.skills,
            resumeText
        })
    } catch (error) {
        console.error("Error analyzing resume:", error);
        if(req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: error.message});
    }
}
