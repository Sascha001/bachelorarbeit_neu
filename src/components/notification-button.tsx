"use client"

import * as React from "react"
import { Bell, BellDot } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications, type Notification } from "@/hooks/use-notifications"

export function NotificationButton() {
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const [isOpen, setIsOpen] = React.useState(false)


  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    
    if (notification.type === "trade-validation" && notification.tradeId) {
      // Navigate to validation page with trade ID
      window.location.href = `/statistik/validierung?tradeId=${notification.tradeId}`
    }
    
    setIsOpen(false)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `vor ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `vor ${diffInDays}d`
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-lg border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
          aria-label={`Benachrichtigungen ${unreadCount > 0 ? `(${unreadCount} ungelesen)` : ''}`}
        >
          <div className="relative w-5 h-5">
            {unreadCount > 0 ? (
              <BellDot className="h-5 w-5 text-primary" />
            ) : (
              <Bell className="h-5 w-5 text-primary" />
            )}
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
          <div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 border-primary/20 bg-card shadow-lg" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-primary/10">
          <h4 className="font-semibold text-foreground">Benachrichtigungen</h4>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} ungelesene Nachrichten
            </p>
          )}
        </div>
        <ScrollArea className="max-h-80">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Keine Benachrichtigungen vorhanden
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-3 rounded-lg hover:bg-primary/5 transition-colors duration-200 ${
                    !notification.isRead ? 'bg-primary/5 border border-primary/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-primary mt-2">
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}