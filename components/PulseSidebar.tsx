'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Flame, Box, LayoutDashboard, GanttChart, Radio, Settings } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { usePulseData } from '@/lib/injective'
import { cn } from '@/lib/utils'

export function PulseSidebar() {
    const { pulse, isLoading, isError } = usePulseData()
    const [displayedCountdown, setDisplayedCountdown] = useState(0)

    // Local countdown timer that ticks every second
    useEffect(() => {
        if (pulse?.burnCountdown) {
            setDisplayedCountdown(pulse.burnCountdown)
        }
    }, [pulse?.burnCountdown])

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayedCountdown(prev => Math.max(0, prev - 1))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    function formatTime(seconds: number) {
        const d = Math.floor(seconds / 86400)
        const h = Math.floor((seconds % 86400) / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        if (d > 0) return `${d}d ${h}h ${m}m`
        return `${h}h ${m}m ${s}s`
    }

    return (
        <div className="hidden md:flex flex-col w-64 h-screen border-r border-border bg-card/80 backdrop-blur-xl relative z-20 shadow-sm">
            {/* Brand */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ boxShadow: ['0 0 10px rgba(6,182,212,0.5)', '0 0 20px rgba(6,182,212,0.5)', '0 0 10px rgba(6,182,212,0.5)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    NINJA <span className="text-primary">RADAR</span>
                </h1>
            </div>

            <Separator className="opacity-50" />

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 space-y-2">
                <NavItem icon={LayoutDashboard} label="Dashboard" active />
                <NavItem icon={GanttChart} label="Governance" />
                <NavItem icon={Flame} label="Burn Auction" />
                <NavItem icon={Radio} label="Ecosystem" />
                <NavItem icon={Settings} label="Settings" />
            </div>

            {/* The Pulse HUD */}
            <div className="p-4 m-4 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50 animate-pulse" />

                <div className="space-y-4">

                    {/* Block Height */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                            <Box className="w-3 h-3" /> Current Block
                        </span>
                        <div className="font-mono text-lg text-primary tracking-wider">
                            {isLoading ? (
                                <span className="animate-pulse">Loading...</span>
                            ) : pulse?.blockHeight ? (
                                `#${pulse.blockHeight.toLocaleString()}`
                            ) : (
                                <span className="text-muted-foreground">--</span>
                            )}
                        </div>
                    </div>

                    <Separator className="bg-primary/10" />

                    {/* TPS */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Network TPS
                        </span>
                        <div className="font-mono text-xl font-bold text-foreground flex items-end gap-2">
                            {isLoading ? '...' : pulse?.tps?.toLocaleString() || '--'}
                            <span className="text-[10px] text-green-600 mb-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Live
                            </span>
                        </div>
                    </div>

                    <Separator className="bg-primary/10" />

                    {/* Burn Countdown */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" /> Next Burn #{pulse?.auctionRound || '...'}
                        </span>
                        <div className="font-mono text-sm text-foreground">
                            {formatTime(displayedCountdown)}
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                                initial={{ width: "100%" }}
                                animate={{ width: `${(displayedCountdown / (7 * 24 * 3600)) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function NavItem({ icon: Icon, label, active }: { icon: React.ElementType, label: string, active?: boolean }) {
    return (
        <button className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            active
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
        )}>
            <Icon className="w-4 h-4" />
            {label}
        </button>
    )
}
