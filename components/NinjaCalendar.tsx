'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay } from 'date-fns'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getStaticEvents, NinjaEvent } from '@/lib/injective'
import { cn } from '@/lib/utils'

export function NinjaCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState<NinjaEvent[]>([])

    // Generate Calendar Grid
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    useEffect(() => {
        // Load static events
        setEvents(getStaticEvents())
    }, [])

    const getEventsForDay = (day: Date) => {
        return events.filter(e => isSameDay(e.date, day))
    }

    const getTypeColor = (type: NinjaEvent['type']) => {
        switch (type) {
            case 'Governance': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
            case 'Auction': return 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
            case 'Hackathon': return 'bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200'
            case 'Upgrade': return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
        }
    }

    const prevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    return (
        <div className="w-full h-full flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-primary" />
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {events.length} events mapped • On-chain + Community
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth} className="border-border hover:bg-accent hover:text-accent-foreground">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={goToToday} className="border-border hover:bg-accent hover:text-accent-foreground text-sm">
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="border-border hover:bg-accent hover:text-accent-foreground">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 bg-white/40 border border-border/60 rounded-xl backdrop-blur-sm overflow-hidden flex flex-col shadow-sm">
                {/* Day Names */}
                <div className="grid grid-cols-7 border-b border-border/50 bg-white/60">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="p-3 text-center text-sm font-medium text-muted-foreground">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-white/30">
                    {calendarDays.map((day, idx) => {
                        const dayEvents = getEventsForDay(day)
                        const isCurrentMonth = isSameMonth(day, monthStart)
                        const isToday = isSameDay(day, new Date())

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "min-h-[120px] p-2 border-r border-b border-border/40 relative group transition-colors hover:bg-white/60 flex flex-col gap-1",
                                    !isCurrentMonth && "bg-slate-50/50 opacity-60",
                                    isToday && "bg-primary/5 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={cn(
                                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                                        isToday ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                {/* Event Dots/Bars */}
                                <div className="flex-1 flex flex-col gap-1 mt-1 overflow-hidden">
                                    {dayEvents.slice(0, 3).map(event => (
                                        <TooltipProvider key={event.id} delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <motion.a
                                                        href={event.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={cn(
                                                            "text-[10px] px-1.5 py-1 rounded truncate border cursor-pointer font-medium text-left block transition-colors shadow-sm",
                                                            getTypeColor(event.type)
                                                        )}
                                                    >
                                                        <span className="opacity-75 mr-1">{format(event.date, 'HH:mm')}</span>
                                                        {event.title}
                                                    </motion.a>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="bg-popover text-popover-foreground border-border p-3 max-w-xs shadow-md">
                                                    <p className="font-bold text-primary mb-1">{event.title}</p>
                                                    <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] border-border">{event.type}</Badge>
                                                        <span className="text-[10px] text-muted-foreground">{format(event.date, 'MMM d, HH:mm')}</span>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <span className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
