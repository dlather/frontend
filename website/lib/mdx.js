import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Paths to markdown directories (relative to the project root)
const basicsDir = path.join(process.cwd(), '../basics');
const advancedDir = path.join(process.cwd(), '../advanced');

// Get all markdown files from a directory
function getFilesFromDir(dir) {
  try {
    return fs.readdirSync(dir).filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

// Parse file name into a title
function parseTitle(fileName) {
  return fileName
    .replace(/\.md$/, '')
    .replace(/\./g, ' ')
    .replace(/-/g, ' ')
    .replace(/^[a-z]/, match => match.toUpperCase())
    .replace(/\.prototype\./g, '.prototype.')
    .replace(/\b[a-z]/g, match => match.toUpperCase());
}

// Convert markdown to MDX-compatible format
function convertToMDX(content) {
  // Replace {% hint style="info" %} with MDX-compatible info box
  let mdxContent = content.replace(
    /{% hint style="info" %}([\s\S]*?){% endhint %}/g,
    (match, content) => {
      return `> **Info:** ${content.trim()}`;
    }
  );

  // Replace {% hint style="warning" %} with MDX-compatible warning box
  mdxContent = mdxContent.replace(
    /{% hint style="warning" %}([\s\S]*?){% endhint %}/g,
    (match, content) => {
      return `> **Warning:** ${content.trim()}`;
    }
  );

  return mdxContent;
}

// Get all markdown files with metadata
export function getAllDocs() {
  // Get basic concept docs
  const basicFiles = getFilesFromDir(basicsDir);
  const basicDocs = basicFiles.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    return {
      slug,
      fileName,
      title: parseTitle(fileName),
      category: 'basics'
    };
  });

  // Get advanced concept docs
  const advancedFiles = getFilesFromDir(advancedDir);
  const advancedDocs = advancedFiles.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    return {
      slug,
      fileName,
      title: parseTitle(fileName),
      category: 'advanced'
    };
  });

  return [...basicDocs, ...advancedDocs];
}

// Get a single doc by slug with navigation info
export function getDocBySlug(slug, category) {
  const allDocs = getAllDocs();
  const currentIndex = allDocs.findIndex(doc => doc.slug === slug && doc.category === category);
  
  if (currentIndex === -1) {
    return null;
  }
  
  const currentDoc = allDocs[currentIndex];
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  
  const filePath = path.join(process.cwd(), `../${category}/${currentDoc.fileName}`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);
  
  return {
    ...currentDoc,
    content: convertToMDX(content),
    navigation: {
      next: nextDoc ? { title: nextDoc.title, slug: nextDoc.slug, category: nextDoc.category } : null,
      prev: prevDoc ? { title: prevDoc.title, slug: prevDoc.slug, category: prevDoc.category } : null
    }
  };
} 