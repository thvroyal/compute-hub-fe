export interface Project {
  id: string
  folder: string
  name: string
  categories: string[]
  description: string
  createdAt: string
  status: string
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
