"use client"

import { useEffect, useRef } from 'react'

export function useCoolScrollbar() {
  const scrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    let scrollTimeout: NodeJS.Timeout
    let isScrolling = false

    const handleScroll = () => {
      // Show scrollbar immediately when scrolling starts
      if (!isScrolling) {
        element.classList.add('scrolling')
        element.classList.remove('fade-out')
        isScrolling = true
      }

      // Clear existing timeout
      clearTimeout(scrollTimeout)

      // Set new timeout to hide scrollbar after scrolling stops
      scrollTimeout = setTimeout(() => {
        element.classList.remove('scrolling')
        element.classList.add('fade-out')
        isScrolling = false
        
        // Remove fade-out class after animation completes
        setTimeout(() => {
          element.classList.remove('fade-out')
        }, 500)
      }, 1000) // Hide after 1 second of no scrolling
    }

    const handleMouseEnter = () => {
      clearTimeout(scrollTimeout)
      element.classList.remove('fade-out')
    }

    const handleMouseLeave = () => {
      if (!isScrolling) {
        scrollTimeout = setTimeout(() => {
          element.classList.add('fade-out')
          setTimeout(() => {
            element.classList.remove('fade-out')
          }, 500)
        }, 500) // Hide after 0.5 seconds when mouse leaves
      }
    }

    // Add event listeners
    element.addEventListener('scroll', handleScroll, { passive: true })
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    // Cleanup
    return () => {
      clearTimeout(scrollTimeout)
      element.removeEventListener('scroll', handleScroll)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return scrollRef
}