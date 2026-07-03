import { format } from 'date-fns'

export const formatDate = (date, formatStr = 'dd MMM yyyy, hh:mm a') => {
  if (!date) return '-'
  try {
    return format(new Date(date), formatStr)
  } catch (error) {
    return '-'
  }
}
