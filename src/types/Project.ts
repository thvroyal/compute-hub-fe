export interface Project {
  id: string
  folder: string
  name: string
  categories: string[]
  author: {
    name: string
    id: string
    email: string
  }
  createdAt?: string
}
