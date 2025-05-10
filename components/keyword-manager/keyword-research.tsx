"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Download, AlertCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getDataForSEOService, type KeywordData } from "@/services/dataforseo-service"
import { v4 as uuidv4 } from "uuid"
import type { Keyword } from "@/types/keyword"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface KeywordResearchProps {
  onImportKeywords: (keywords: Keyword[]) => void
}

export default function KeywordResearch({ onImportKeywords }: KeywordResearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("2840") // Default to United States
  const [language, setLanguage] = useState("en") // Default to English
  const [searchType, setSearchType] = useState<"volume" | "suggestions">("volume")
  const [error, setError] = useState<string>("")
  const [warning, setWarning] = useState<string>("")
  const [info, setInfo] = useState<string>("")
  const [keywords, setKeywords] = useState<KeywordData[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<KeywordData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()

  async function handleSearch() {
    if (!searchQuery.trim()) {
      setError("Please enter a search query")
      return
    }

    setLoading(true)
    setError("")
    setWarning("")
    setInfo("")
    setKeywords([])
    setSelectedKeywords([])

    try {
      console.log(`Searching for keywords: ${searchQuery}`)

      // Get the DataForSEO service
      const service = getDataForSEOService()
      if (!service) {
        setError("DataForSEO service not initialized. Please check your credentials.")
        setLoading(false)
        return
      }

      // Try to get keyword data based on search type
      let result
      if (searchType === "volume") {
        console.log("Searching for keyword volume data...")
        result = await service.searchKeywords(searchQuery, Number.parseInt(location), language)
      } else {
        console.log("Searching for keyword suggestions...")
        result = await service.getKeywordSuggestions(searchQuery, Number.parseInt(location), language)
      }

      console.log(`Got ${result.keywords.length} keywords`)

      if (result.keywords.length === 0) {
        setWarning("No keywords found. Try a different search term.")
        setLoading(false)
        return
      }

      // Check if results might be fallback data
      const isFallbackData =
        result.keywords.length > 0 &&
        result.keywords.every(
          (k) =>
            k.search_volume === 0 ||
            (k.search_volume >= 50 && k.search_volume <= 1000 && Number.isInteger(k.search_volume)),
        )

      if (isFallbackData) {
        setWarning("Limited data available from DataForSEO. Showing estimated values.")
      }

      setKeywords(result.keywords)
      setLoading(false)
    } catch (error: any) {
      console.error("Error searching keywords:", error)
      setError(error.message || "Failed to search keywords. Please try again.")
      setLoading(false)
    }
  }

  const toggleKeywordSelection = (keyword: KeywordData) => {
    if (selectedKeywords.some((k) => k.keyword === keyword.keyword)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k.keyword !== keyword.keyword))
    } else {
      setSelectedKeywords([...selectedKeywords, keyword])
    }
  }

  const handleImportSelected = () => {
    if (selectedKeywords.length === 0) {
      toast({
        title: "No keywords selected",
        description: "Please select at least one keyword to import",
        variant: "destructive",
      })
      return
    }

    // Convert DataForSEO keyword format to our app's keyword format
    const keywordsToImport: Keyword[] = selectedKeywords.map((kw) => ({
      id: uuidv4(),
      keyword: kw.keyword,
      volume: kw.search_volume,
      competition: kw.competition,
      cpc: kw.cpc,
      cpcOriginal: `$${kw.cpc.toFixed(2)}`,
      tags: [],
    }))

    onImportKeywords(keywordsToImport)

    toast({
      title: "Keywords imported",
      description: `Imported ${keywordsToImport.length} keywords`,
      variant: "success",
    })
  }

  const selectAll = () => {
    setSelectedKeywords([...keywords])
  }

  const deselectAll = () => {
    setSelectedKeywords([])
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Keyword Research</CardTitle>
        <CardDescription>Search for keywords and their metrics using DataForSEO</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {warning && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}

        {info && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>{info}</AlertDescription>
          </Alert>
        )}

        <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "volume" | "suggestions")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="volume">Search Volume</TabsTrigger>
            <TabsTrigger value="suggestions">Keyword Suggestions</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="search-query">Keyword</Label>
            <div className="flex space-x-2">
              <Input
                id="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a keyword"
                disabled={loading}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation} disabled={loading}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2840">United States</SelectItem>
                  <SelectItem value="2826">United Kingdom</SelectItem>
                  <SelectItem value="2124">Canada</SelectItem>
                  <SelectItem value="2036">Australia</SelectItem>
                  <SelectItem value="2724">Spain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage} disabled={loading}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {keywords.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Results ({keywords.length})</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={selectAll} disabled={keywords.length === 0}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll} disabled={selectedKeywords.length === 0}>
                  Deselect All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportSelected}
                  disabled={selectedKeywords.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Import Selected ({selectedKeywords.length})
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-2 p-2 font-medium bg-muted text-muted-foreground text-sm">
                <div className="col-span-1"></div>
                <div className="col-span-5">Keyword</div>
                <div className="col-span-2 text-right">Volume</div>
                <div className="col-span-2 text-right">CPC</div>
                <div className="col-span-2 text-right">Competition</div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-12 gap-2 p-2 text-sm border-t hover:bg-muted/50 cursor-pointer ${
                      selectedKeywords.some((k) => k.keyword === keyword.keyword) ? "bg-muted/50" : ""
                    }`}
                    onClick={() => toggleKeywordSelection(keyword)}
                  >
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedKeywords.some((k) => k.keyword === keyword.keyword)}
                        onChange={() => toggleKeywordSelection(keyword)}
                        className="rounded"
                      />
                    </div>
                    <div className="col-span-5 truncate">{keyword.keyword}</div>
                    <div className="col-span-2 text-right">{keyword.search_volume.toLocaleString()}</div>
                    <div className="col-span-2 text-right">${keyword.cpc.toFixed(2)}</div>
                    <div className="col-span-2 text-right">{(keyword.competition * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
