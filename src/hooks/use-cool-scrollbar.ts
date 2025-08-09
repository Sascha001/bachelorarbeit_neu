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

  useEffect(() => {
    const element = elementRef.current
    if (!element) {
      console.log('❌ No element found for scrollbar hook')
      return
    }

    console.log('✅ Scrollbar hook initialized on element:', element)

    let isScrolling = false

    const showScrollbar = () => {
      console.log('🟢 SHOWING scrollbar - adding class to body')
      document.body.classList.add('scrollbar-show')
      
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
        console.log('🔴 HIDING scrollbar - removing class from body')
        document.body.classList.remove('scrollbar-show')
        isScrolling = false
        timeoutRef.current = null
      }, hideDelay)
    }

    const handleScroll = (e: Event) => {
      console.log('📜 Scroll event detected!', e.target)
      showScrollbar()
      isScrolling = true
      hideScrollbar()
    }

    const handleMouseEnter = (e: Event) => {
      console.log('🖱️ Mouse enter detected!', e.target)
      showScrollbar()
    }

    const handleMouseLeave = (e: Event) => {
      console.log('🖱️ Mouse leave detected!', e.target)
      if (!isScrolling) {
        hideScrollbar()
      }
    }

    // Multiple event binding strategies
    console.log('🔗 Adding event listeners to:', element.tagName)
    
    // Strategy 1: Direct element events
    element.addEventListener('scroll', handleScroll, { passive: true })
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    
    // Strategy 2: Window events as backup
    const windowScrollHandler = () => {
      console.log('📜 Window scroll detected!')
      showScrollbar()
      hideScrollbar()
    }
    
    window.addEventListener('scroll', windowScrollHandler, { passive: true })

    // Initial show for testing
    console.log('🚀 Initial scrollbar show')
    showScrollbar()
    setTimeout(() => {
      hideScrollbar()
    }, 1000)

    return () => {
      console.log('🧹 Cleaning up scrollbar hook')
      
      element.removeEventListener('scroll', handleScroll)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', windowScrollHandler)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      document.body.classList.remove('scrollbar-show')
    }
  }, [hideDelay])

  return elementRef
}