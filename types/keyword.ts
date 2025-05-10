export interface Keyword {
  id: string
  keyword: string
  volume?: number
  competition?: number
  cpc?: number
  cpcOriginal?: string
  category?: string
  notes?: string
  tags?: string[]
  score?: number
  difficulty?: number
  opportunity?: number
  intent?: "informational" | "navigational" | "transactional" | "commercial"
  seasonality?: Record<string, number>
  trends?: number[]
  entities?: {
    name: string
    type: string
    relevance: number
  }[]
  categories?: string[]
}

export interface KeywordCategory {
  id: string
  name: string
  color: string
  description?: string
}

export interface KeywordFilter {
  search?: string
  categories?: string[]
  minVolume?: number
  maxVolume?: number
  minCompetition?: number
  maxCompetition?: number
  minCpc?: number
  maxCpc?: number
  hasNotes?: boolean
  hasTags?: boolean
  tags?: string[]
  intent?: string[]
}

export interface ImportRecord {
  id: string
  date: string
  source: string
  keywords: Keyword[]
}

export interface KeywordProject {
  id: string
  name: string
  description?: string
  keywords: Keyword[]
  createdAt: string
  updatedAt: string
}
