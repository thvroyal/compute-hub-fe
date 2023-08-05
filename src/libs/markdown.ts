// import fs from 'fs'
import { remark } from 'remark'
import html from 'remark-html'
import matter from 'gray-matter'

export async function getMarkdownFileContent(
  url: string
): Promise<{ [key: string]: string; contentHtml: string }> {
  try {
    // Make the HTTP request using fetch
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch the file content')
    }

    // Read the response body as text
    const data = await response.text()

    // Parse the downloaded file contents
    const matterResult = matter(data)

    // Process the content with the 'remark' and 'html' plugins
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)

    const contentHtml = processedContent.toString()

    return {
      contentHtml,
      ...matterResult.data
    }
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    console.error('Error fetching file content:', error)
    throw error
  }
}
