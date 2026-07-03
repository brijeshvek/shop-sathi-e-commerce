import { useSelector } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, selectAuthIsLoading } from '../features/auth/authSlice.js'

export const useAuth = () => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthIsLoading)

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin')
  const isSeller = user && user.role === 'seller'
  const isDashboardUser = isAdmin || isSeller

  // Permissions are now injected into the user object from the backend
  const permissions = user?.permissions
  const permissionsLoading = isLoading // since permissions come with user

  return { user, isAuthenticated, isLoading, isAdmin, isSeller, isDashboardUser, permissions, permissionsLoading }
}
