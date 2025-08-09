'use client'

import { useEffect, useRef } from 'react'

interface ScrollbarOptions {
  hideDelay?: number
  className?: string
}

export function useCoolScrollbar<T extends HTMLElement = HTMLDivElement>(
  options: ScrollbarOptions = {}
) {
  const { hideDelay = 2000, className = 'cool-scrollbar' } = options
  const elementRef = useRef<T>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Add base scrollbar class
    element.classList.add(className)

    const showScrollbar = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      element.classList.remove('fade-out')
      element.classList.add('scrolling', 'fade-in')
      isScrollingRef.current = true
      
      // Remove fade-in class after animation
      setTimeout(() => {
        element.classList.remove('fade-in')
      }, 300)
    }

    const hideScrollbar = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        element.classList.remove('fade-in')
        element.classList.add('fade-out')
        isScrollingRef.current = false
        
        // Remove scrolling class after fade-out animation
        setTimeout(() => {
          element.classList.remove('scrolling', 'fade-out')
        }, 300)
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
      if (isScrollingRef.current) {
        hideScrollbar()
      }
    }

    // Add event listeners
    element.addEventListener('scroll', handleScroll, { passive: true })
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    // Initial hide after short delay
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
    }
  }, [hideDelay, className])

  return elementRef
}