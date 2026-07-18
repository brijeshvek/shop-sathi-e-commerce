import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAxiosLoading } from '../../features/loading/loadingSlice.js'

export const GlobalLoader = () => {
  const isAxiosLoading = useSelector(selectIsAxiosLoading)
  
  // Check if any RTK Query or Mutation is pending
  const isRtkLoading = useSelector((state) => {
    const queries = state.api?.queries || {}
    const mutations = state.api?.mutations || {}
    return (
      Object.values(queries).some((q) => q.status === 'pending') ||
      Object.values(mutations).some((m) => m.status === 'pending')
    )
  })

  const isLoading = isAxiosLoading || isRtkLoading

  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let interval
    if (isLoading) {
      setVisible(true)
      setProgress(10)
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90
          return prev + Math.floor(Math.random() * 10) + 2
        })
      }, 200)
    } else {
      setProgress(100)
      const timeout = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 500)
      return () => clearTimeout(timeout)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* Sleek, glowing gradient progress bar */}
      <div 
        className="h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out shadow-[0_1px_10px_rgba(99,102,241,0.5)]"
        style={{ width: `${progress}%` }}
      />
      {/* Subtle glowing pulse in the corner */}
      <div className="absolute right-4 top-4 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200 shadow-sm flex items-center justify-center animate-pulse">
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></div>
      </div>
    </div>
  )
}

export default GlobalLoader
