export interface Project {
  id: string
  folder: string
  name: string
  categories: string[]
  author?: {
    id: string
    name: string
    email: string
    image?: string
  }
  computeInfo?: {
    totalInput: number
    totalOutput: number
  }
}
