import get from 'lodash.get'
import { Project } from 'types/Project'
import { DETAILS_PROJECT } from 'utils/constants'

export const getDetailProjectData = (project: Project) => {
  return DETAILS_PROJECT.map((type) => {
    const { path, format } = type
    const value = get(project, path, '-')
    return {
      ...type,
      value: format ? format(value) : value
    }
  })
}
