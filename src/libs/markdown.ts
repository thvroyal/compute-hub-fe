import fs from 'fs'
import { remark } from 'remark'
import html from 'remark-html'
import matter from 'gray-matter'

export async function getMarkdownFileContent(
  fileName: string
): Promise<{ [key: string]: string; contentHtml: string }> {
  const fileContents = fs.readFileSync(fileName, 'utf8')

  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  return {
    contentHtml,
    ...matterResult.data
  }
}
