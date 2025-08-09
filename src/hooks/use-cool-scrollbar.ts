'use client'

import { useEffect, useRef } from 'react'

interface ScrollbarOptions {
  hideDelay?: number
}

export function useCoolScrollbar<T extends HTMLElement = HTMLDivElement>(
  options: ScrollbarOptions = {}
) {
  const { hideDelay = 2000 } = options
  const elementRef = useRef<T>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const bodyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const showScrollbar = () => {
      // Clear existing timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (bodyTimeoutRef.current) {
        clearTimeout(bodyTimeoutRef.current)
      }
      
      // Show scrollbar on body (global)
      document.body.classList.add('scrollbar-show')
    }

    const hideScrollbar = () => {
      if (bodyTimeoutRef.current) {
        clearTimeout(bodyTimeoutRef.current)
      }
      
      bodyTimeoutRef.current = setTimeout(() => {
        document.body.classList.remove('scrollbar-show')
      }, hideDelay)
    }

    const handleScroll = () => {
      showScrollbar()
      hideScrollbar()
    }

    const handleMouseEnter = () => {
      showScrollbar()
    }

    const handleMouseLeave = () => {
      hideScrollbar()
    }

    // Add event listeners
    element.addEventListener('scroll', handleScroll, { passive: true })
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    // Show initially for 1 second
    showScrollbar()
    setTimeout(() => {
      hideScrollbar()
    }, 1000)

    return () => {
      element.removeEventListener('scroll', handleScroll)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (bodyTimeoutRef.current) {
        clearTimeout(bodyTimeoutRef.current)
      }
      
      // Clean up body class
      document.body.classList.remove('scrollbar-show')
    }
  }, [hideDelay])

  return elementRef
}