import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { TalkMetadata } from "@gdg/ui-theme";

const TALKS_DIR = path.join(process.cwd(), "../../talks");

export async function GET() {
  try {
    const talks: any[] = [];
    const years = await fs.readdir(TALKS_DIR).catch(() => []);
    
    for (const year of years) {
      if (!/^\d{4}$/.test(year)) continue;
      const yearDir = path.join(TALKS_DIR, year);
      const stat = await fs.stat(yearDir);
      if (!stat.isDirectory()) continue;
      
      const folders = await fs.readdir(yearDir).catch(() => []);
      for (const folder of folders) {
        const talkDir = path.join(yearDir, folder);
        const folderStat = await fs.stat(talkDir);
        if (!folderStat.isDirectory()) continue;
        
        try {
          const metaContent = await fs.readFile(path.join(talkDir, "meta.json"), "utf8");
          const meta = JSON.parse(metaContent);
          talks.push({
            slug: folder,
            year,
            ...meta
          });
        } catch (e) {
          // ignore missing or malformed meta.json
        }
      }
    }
    
    talks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(talks);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extract metadata
    const title = formData.get("title") as string;
    const speaker = formData.get("speaker") as string;
    const category = formData.get("category") as string;
    const tagsRaw = formData.get("tags") as string;
    const language = formData.get("language") as string;
    const level = formData.get("level") as string;
    const event = formData.get("event") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const eventLink = formData.get("eventLink") as string;
    
    const originalSlug = formData.get("originalSlug") as string;
    const originalYear = formData.get("originalYear") as string;

    const file = formData.get("file") as File;

    if (!title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);

    const meta: TalkMetadata = {
      title,
      speaker,
      category,
      tags,
      language,
      level,
      event,
      date,
      description,
      ...(eventLink && { eventLink })
    };

    // Sanitize title for folder name
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_");

    const year = new Date(date).getFullYear().toString();

    const targetDir = path.join(TALKS_DIR, year, sanitizedTitle);
    
    if (originalSlug && originalYear) {
      const originalDir = path.join(TALKS_DIR, originalYear, originalSlug);
      if (originalDir !== targetDir) {
        try {
          await fs.stat(originalDir);
          await fs.mkdir(path.join(TALKS_DIR, year), { recursive: true });
          await fs.rename(originalDir, targetDir);
        } catch (e) {
          // Do nothing if original dir doesn't exist
        }
      }
    }

    // Create directory
    await fs.mkdir(targetDir, { recursive: true });
    
    // Write meta.json
    await fs.writeFile(
      path.join(targetDir, "meta.json"),
      JSON.stringify(meta, null, 2),
      "utf-8"
    );

    // Save PDF
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfPath = path.join(targetDir, file.name);
      await fs.writeFile(pdfPath, buffer);
    }

    return NextResponse.json({ success: true, folder: sanitizedTitle });
  } catch (err: any) {
    console.error("Error creating talk:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
