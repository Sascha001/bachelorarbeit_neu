'use client'

import { useEffect, useRef } from 'react'

interface ScrollbarOptions {
  hideDelay?: number
}

export function useCoolScrollbar<T extends HTMLElement = HTMLDivElement>(
  options: ScrollbarOptions = {}
) {
  const { hideDelay = 1000 } = options  // Reduced to 1 second like in your example
  const elementRef = useRef<T>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }

    // Add scroll container class
    element.classList.add('scroll-container')

    const showScrollbar = () => {
      element.classList.add('show-scrollbar')
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const hideScrollbar = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        element.classList.remove('show-scrollbar')
        timeoutRef.current = null
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

    return () => {
      element.removeEventListener('scroll', handleScroll)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      element.classList.remove('scroll-container', 'show-scrollbar')
    }
  }, [hideDelay])

  return elementRef
}