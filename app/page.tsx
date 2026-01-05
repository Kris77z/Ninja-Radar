'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import { usePulseData } from '@/lib/injective'
import { EventManager, Event } from '@/components/ui/event-manager'
import { Box, Globe, Clock, Zap, Activity, ChevronRight, LayoutGrid, Calendar as CalendarIcon, Users } from 'lucide-react'
import { TrailCard } from '@/components/ui/trail-card'

// --- Rolling Number Component ---
const RollingNumber = ({ value }: { value: number }) => {
  const springValue = useSpring(value, { stiffness: 100, damping: 30 })
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  useEffect(() => {
    return springValue.onChange((v) => {
      setDisplayValue(Math.floor(v))
    })
  }, [springValue])

  return <span>{displayValue.toLocaleString()}</span>
}

export default function Home() {
  const { pulse, governance, community, isLoading } = usePulseData()
  const [events, setEvents] = useState<Event[]>([])
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Map Pulse Data to Events
  useEffect(() => {
    if (!pulse && !governance && !community) return

    const newEvents: Event[] = []

    // 1. Burn Auction
    if (pulse?.auctionRound && pulse?.burnCountdown) {
      const now = new Date()
      const endTime = new Date(now.getTime() + pulse.burnCountdown * 1000)

      newEvents.push({
        id: `auction-${pulse.auctionRound}`,
        title: `Burn Auction #${pulse.auctionRound}`,
        description: `Weekly INJ Burn. Amount: ${pulse.burnAmount?.toFixed(2)} INJ focused on ecosystem deflation.`,
        startTime: new Date(endTime.getTime() - 3600000),
        endTime: endTime,
        color: "orange",
        category: "Auction",
        tags: ["Deflationary", "System"],
        location: "Injective Burn Module",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4628c9757?q=80&w=600&auto=format&fit=crop"
      } as any)
    }

    // 2. Governance Proposals
    if (governance?.proposals) {
      governance.proposals.forEach((p: any) => {
        if (!p.votingEndTime) return
        const endTime = new Date(p.votingEndTime)
        if (isNaN(endTime.getTime())) return

        newEvents.push({
          id: `prop-${p.id}`,
          title: `Proposal: ${p.title}`,
          description: `Proposal #${p.id} - Status: ${p.status}. Your vote shapes the Injective future.`,
          startTime: new Date(endTime.getTime() - 86400000),
          endTime: endTime,
          color: "blue",
          category: "Governance",
          tags: ["Vote", "DAO"],
          location: p.location || "On-chain Governance",
          imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop"
        } as any)
      })
    }

    // 3. Community Events
    if (community) {
      community.forEach((e: any) => {
        newEvents.push({
          id: e.id,
          title: e.title,
          description: e.description,
          startTime: new Date(e.startTime),
          endTime: new Date(e.endTime),
          color: e.color || "purple",
          category: e.category,
          tags: e.tags,
          location: e.location || "Global Virtual",
          imageUrl: e.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop"
        } as any)
      })
    }

    setEvents(newEvents)
  }, [pulse, governance, community])

  // Handle Mouse Movement for Popover
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className="min-h-screen w-full bg-[#F8F9FB] text-[#0B182B] font-sans flex flex-col selection:bg-blue-600/10"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >

      {/* SECTION 1: HERO (OpenBuild Inspiration - REMOVED NAVBAR & BUTTONS) */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] -z-10 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 flex flex-col gap-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100 w-fit">
              <Activity className="w-3.5 h-3.5" />
              Live Network Sync
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900">
              Get on the <br />
              <span className="text-blue-600 italic font-serif">Success Way</span> <br />
              to Injective.
            </h1>
            <p className="text-xl text-gray-500 max-w-xl leading-relaxed font-medium">
              Analyze real-time block data, track ecosystem growth, and participate in governance with the most advanced radar for Ninjas.
            </p>
            {/* BUTTONS REMOVED AS REQUESTED */}
          </div>

          {/* Block Data Visualization (Digital Ticker) */}
          <div className="w-full lg:w-[450px] flex flex-col gap-4">
            <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-blue-900/5 flex flex-col gap-6 relative overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2 text-blue-600">
                  <Box className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Network Height</span>
                </div>
                <div className="px-2 py-1 rounded bg-green-50 text-green-600 text-[10px] font-bold flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-green-600 animate-ping" />
                  SYNCING
                </div>
              </div>

              <div className="text-6xl font-black font-mono tracking-tighter text-gray-900 relative">
                {pulse?.blockHeight ? (
                  <RollingNumber value={pulse.blockHeight} />
                ) : (
                  <div className="h-[1em] w-32 bg-gray-100 animate-pulse rounded" />
                )}
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center justify-between text-sm py-3 border-b border-gray-50">
                  <span className="text-gray-400">Average Block Time</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">0.80s</span>
                    <div className="flex gap-0.5 items-end h-3">
                      {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-blue-600 rounded-full"
                          animate={{ height: [`${h * 100}%`, `${h * 60}%`, `${h * 100}%`] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm py-3 border-b border-gray-50">
                  <span className="text-gray-400">Total Transactions</span>
                  <span className="font-bold text-blue-600">1,488,213,456</span>
                </div>
                <div className="flex items-center justify-between text-sm py-3">
                  <span className="text-gray-400">Network Health</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-green-600">OPTIMAL</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-200" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-900/20">
                <Users className="w-6 h-6 mb-3 opacity-60" />
                <div className="text-2xl font-black">2.4M+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Active Users</div>
              </div>
              <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50">
                <LayoutGrid className="w-6 h-6 mb-3 text-blue-600" />
                <div className="text-2xl font-black text-gray-900">150+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dapps Built</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CALENDAR (OpenBuild Grid Style) */}
      <section id="ecosystem" className="py-20 px-6 bg-white border-t border-gray-50 relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-blue-600">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Growth Path</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-none">
                Ecosystem Growth <span className="text-gray-300">&</span> Activity
              </h2>
            </div>
            <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
              Stay updated with the latest governance votes, auctions, and community meetups happening across Injective.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8 px-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-200" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-none">Burn Auction</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Deflationary events</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-200" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-none">Governance</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Community voting</span>
              </div>
            </div>
            <div className="ml-auto hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 italic">
              <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
              <span className="text-xs text-gray-500 font-medium">Hover on items to track live ecosystem data</span>
            </div>
          </div>

          <div className="bg-[#F8F9FB] rounded-[3rem] p-4 md:p-8 border border-gray-100 shadow-inner">
            <div className="h-[800px] w-full">
              <EventManager
                events={events}
                onEventClick={() => { }} // REMOVED CLICK EFFECT
                onEventMouseEnter={(event) => setHoveredEvent(event)}
                onEventMouseLeave={() => setHoveredEvent(null)}
                className="h-full w-full"
                defaultView="month"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING HOVER CARD WITH BOUNDARY DETECTION */}
      <AnimatePresence>
        {hoveredEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              left: mousePos.x + 320 > (typeof window !== 'undefined' ? window.innerWidth : 1200) ? Math.max(mousePos.x - 340, 20) : mousePos.x + 20,
              top: mousePos.y + 450 > (typeof window !== 'undefined' ? window.innerHeight : 800) ? Math.max(mousePos.y - 470, 20) : mousePos.y + 20,
              zIndex: 100,
              pointerEvents: 'none'
            }}
          >
            <TrailCard
              title={hoveredEvent.title}
              location={(hoveredEvent as any).location || "Global Virtual"}
              difficulty={hoveredEvent.category || "General"}
              creators={hoveredEvent.description || "No description provided."}
              distance={hoveredEvent.tags?.[0] || "Network"}
              elevation={hoveredEvent.tags?.[1] || "Active"}
              duration={Math.max(1, Math.round(Math.abs(hoveredEvent.endTime.getTime() - hoveredEvent.startTime.getTime()) / 3600000)) + "h"}
              imageUrl={(hoveredEvent as any).imageUrl || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop"}
              mapImageUrl="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=200&auto=format&fit=crop"
              className="w-80 shadow-2xl border-2 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
