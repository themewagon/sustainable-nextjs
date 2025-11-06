import { remark } from "remark";
import html from "remark-html";
import { getImgPath } from "./imagePath";

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  let htmlContent = result.toString();
  
  // Process image src attributes in the HTML to apply getImgPath
  htmlContent = htmlContent.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, (match, srcPath) => {
    // Only process paths that start with /images
    if (srcPath.startsWith('/images')) {
      const processedPath = getImgPath(srcPath);
      return match.replace(srcPath, processedPath);
    }
    return match;
  });
  
  return htmlContent;
}