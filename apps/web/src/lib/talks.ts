import fs from 'fs';
import path from 'path';
import { TalkMetadata } from '@gdg/ui-theme';

export interface TalkWithSlug extends TalkMetadata {
  slug: string;
  pdfPath: string;
}

const TALKS_DIR = path.join(process.cwd(), '../../talks');

export function getTalks(): TalkWithSlug[] {
  const talks: TalkWithSlug[] = [];
  
  if (!fs.existsSync(TALKS_DIR)) {
    return talks;
  }

  const years = fs.readdirSync(TALKS_DIR).filter(file => {
    const fullPath = path.join(TALKS_DIR, file);
    return fs.statSync(fullPath).isDirectory() && /^\d{4}$/.test(file);
  });

  for (const year of years) {
    const yearDir = path.join(TALKS_DIR, year);
    const talkFolders = fs.readdirSync(yearDir).filter(file => {
      return fs.statSync(path.join(yearDir, file)).isDirectory();
    });

    for (const folder of talkFolders) {
      const talkDir = path.join(yearDir, folder);
      const metaPath = path.join(talkDir, 'meta.json');
      
      if (fs.existsSync(metaPath)) {
        try {
          const content = fs.readFileSync(metaPath, 'utf8');
          const meta: TalkMetadata = JSON.parse(content);
          
          // Find PDF
          const files = fs.readdirSync(talkDir);
          const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
          
          talks.push({
            ...meta,
            slug: folder,
            pdfPath: pdfFile ? `/talks/${year}/${folder}/${pdfFile}` : '',
          });
        } catch (e) {
          console.error(`Error reading ${metaPath}`, e);
        }
      }
    }
  }

  // Sort by date descending
  return talks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getUniqueTags(talks: TalkWithSlug[]): string[] {
  const tags = new Set<string>();
  talks.forEach(t => t.tags?.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
