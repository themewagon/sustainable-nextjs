import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { getImgPath } from "./imagePath";

const postsDirectory = join(process.cwd(), "markdown/Blog");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    // [key: string]: string;
    [key: string]: string | object;
  };

  const items: any = {};

  function processImages(content: string) {
    // Process markdown images and apply getImgPath to image paths
    // Keep markdown format but update paths - markdownToHtml will convert to HTML
    return content.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (match, altText, imagePath) => {
        // If imagePath starts with /images, apply getImgPath
        if (imagePath.startsWith("/images")) {
          const processedPath = getImgPath(imagePath);
          return `![${altText}](${processedPath})`;
        }
        return match;
      }
    );
  }

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      // You can modify the content here to include Images
      items[field] = processImages(content);
    }

    if (field === "metadata") {
      // Include metadata, including the image information with getImgPath applied
      items[field] = {
        ...data,
        coverImage: data.coverImage ? getImgPath(data.coverImage) : null,
        authorImage: data.authorImage ? getImgPath(data.authorImage) : null,
      };
    }

    if (typeof data[field] !== "undefined") {
      // Apply getImgPath to image-related fields
      if (field === "coverImage" || field === "authorImage") {
        items[field] = data[field] ? getImgPath(data[field]) : data[field];
      } else {
        items[field] = data[field];
      }
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}
