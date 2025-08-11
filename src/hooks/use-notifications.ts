'use client'

import { useState } from 'react'

export interface Notification {
  id: string
  type: "trade-validation" | "general"
  title: string
  description: string
  timestamp: Date
  isRead: boolean
  tradeId?: string
}

// Mock notification data - in real app this would come from state management
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "trade-validation",
    title: "Trade Validierung verfügbar",
    description: "Ihr AAPL Trade vom 25.01.2025 kann jetzt bewertet werden",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: false,
    tradeId: "trade_123"
  },
  {
    id: "2",
    type: "trade-validation", 
    title: "Trade Validierung verfügbar",
    description: "Ihr MSFT Trade vom 20.01.2025 kann jetzt bewertet werden",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isRead: false,
    tradeId: "trade_456"
  },
  {
    id: "3",
    type: "trade-validation", 
    title: "Trade Validierung verfügbar",
    description: "Ihr NVDA Trade vom 18.01.2025 kann jetzt bewertet werden",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    isRead: false,
    tradeId: "trade_789"
  }
]

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter(n => !n.isRead).length
  const unreadValidationCount = notifications.filter(n => !n.isRead && n.type === "trade-validation").length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  return {
    notifications,
    unreadCount,
    unreadValidationCount,
    markAsRead,
    markAllAsRead,
    setNotifications
  }
}