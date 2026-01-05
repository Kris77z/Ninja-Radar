'use client'

import useSWR from 'swr'

export interface PulseData {
  tps: number
  blockHeight: number
  burnAmount: number
  burnCountdown: number
  auctionRound: number
}

export interface GovernanceData {
  activeProposals: number
  proposals: Array<{
    id: string
    title: string
    status: number
    votingEndTime: string
  }>
}

export interface NinjaEvent {
  id: string
  title: string
  date: Date
  type: 'Governance' | 'Auction' | 'Hackathon' | 'Community' | 'Upgrade'
  description: string
  url?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function usePulseData() {
  const { data, error, isLoading } = useSWR('/api/pulse', fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds for "live" feel
    revalidateOnFocus: true
  })

  return {
    pulse: data?.data?.pulse as PulseData | undefined,
    governance: data?.data?.governance as GovernanceData | undefined,
    community: data?.data?.community?.events as any[] | undefined,
    isLoading,
    isError: error || !data?.success
  }
}

// Static events data (would come from a CMS or API in production)
export function getStaticEvents(): NinjaEvent[] {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  return [
    {
      id: '1',
      title: 'INJ Burn Auction #142',
      date: new Date(currentYear, currentMonth, 28, 14, 0),
      type: 'Auction',
      description: 'Weekly token burn event. Estimated 12,000 INJ to be burned.',
      url: 'https://hub.injective.network/auction'
    },
    {
      id: '2',
      title: 'IIP-394: Upgrade Proposal',
      date: new Date(currentYear, currentMonth, 25, 10, 0),
      type: 'Governance',
      description: 'Major chain upgrade to enable RWA module.',
      url: 'https://hub.injective.network/governance'
    },
    {
      id: '3',
      title: 'Ninja Labs Hacking Session',
      date: new Date(currentYear, currentMonth, 26, 18, 0),
      type: 'Community',
      description: 'Live coding session with Injective core devs.',
      url: 'https://discord.gg/injective'
    },
    {
      id: '4',
      title: 'iBuild Hackathon Deadline',
      date: new Date(currentYear, currentMonth, 30, 23, 59),
      type: 'Hackathon',
      description: 'Final deadline for all hackathon tracks.',
      url: 'https://dorahacks.io'
    },
    {
      id: '5',
      title: 'Yield Farming Workshop',
      date: new Date(currentYear, currentMonth, 27, 12, 0),
      type: 'Community',
      description: 'Newbie friendly guide to Mito Vaults.',
      url: 'https://injective.com'
    },
    {
      id: '6',
      title: 'MultiVM Upgrade',
      date: new Date(currentYear, currentMonth + 1, 5, 16, 0),
      type: 'Upgrade',
      description: 'Network upgrade enabling EVM and SVM support.',
      url: 'https://injective.com/blog'
    }
  ]
}
