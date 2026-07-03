import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../features/auth/authApi.js'
import { logOut } from '../features/auth/authSlice.js'
import toast from 'react-hot-toast'

export const useAutoLogout = (timeoutMs = 10 * 60 * 1000) => { // Default 10 minutes
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [logoutApi] = useLogoutMutation()
    const timerRef = useRef(null)

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap()
        } catch (error) {
            console.error('Auto logout API failed:', error)
        } finally {
            dispatch(logOut())
            toast('You have been logged out due to inactivity.', { icon: '😴' })
            navigate('/login')
        }
    }

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(handleLogout, timeoutMs)
    }

    useEffect(() => {
        // Initialize timer
        resetTimer()

        // Events that reset the timer
        const events = ['mousemove', 'keydown', 'click', 'scroll']

        const handleActivity = () => {
            resetTimer()
        }

        events.forEach(event => {
            window.addEventListener(event, handleActivity)
        })

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity)
            })
        }
    }, [timeoutMs]) // Only re-run if timeout changes
}

export default useAutoLogout
