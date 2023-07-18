import moment from 'moment'

export const AUTH_PAGES = ['/login', '/register']

export const DETAILS_PROJECT = [
  {
    key: 'unprocessed_unit',
    label: 'Unprocessed Unit',
    path: ''
  },
  {
    key: 'estimated_time',
    label: 'Estimated Time',
    value: '30hrs',
    path: ''
  },
  {
    key: 'authors',
    label: 'Authors',
    path: 'author.name'
  },
  {
    key: 'created_at',
    label: 'Created At',
    path: 'createdAt',
    format(value: string) {
      return moment(value).format('DD/MM/YYYY hh:mm')
    }
  }
]
