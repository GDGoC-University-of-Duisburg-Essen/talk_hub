import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const TALKS_DIR = path.join(process.cwd(), "../../talks");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extract metadata
    const title = formData.get("title") as string;
    const speaker = formData.get("speaker") as string;
    const year = formData.get("year") as string;
    const category = formData.get("category") as string;
    const tagsRaw = formData.get("tags") as string;
    const language = formData.get("language") as string;
    const level = formData.get("level") as string;
    const event = formData.get("event") as string;
    const date = formData.get("date") as string;
    const registrationUrlRaw = formData.get("registrationUrl") as string | null;
    const description = formData.get("description") as string;
    
    const file = formData.get("file") as File;

    if (!title || !year || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
    const registrationUrl = registrationUrlRaw?.trim();

    const meta = {
      title,
      speaker,
      category,
      tags,
      language,
      level,
      event,
      date,
      description,
      ...(registrationUrl ? { registrationUrl } : {})
    };

    // Sanitize title for folder name
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_");
    
    const targetDir = path.join(TALKS_DIR, year, sanitizedTitle);
    
    // Create directory
    await fs.mkdir(targetDir, { recursive: true });
    
    // Write meta.json
    await fs.writeFile(
      path.join(targetDir, "meta.json"),
      JSON.stringify(meta, null, 2),
      "utf-8"
    );

    // Save PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfPath = path.join(targetDir, file.name);
    await fs.writeFile(pdfPath, buffer);

    return NextResponse.json({ success: true, folder: sanitizedTitle });
  } catch (err: any) {
    console.error("Error creating talk:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
