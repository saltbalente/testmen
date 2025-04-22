"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type DataForSEOCredentials, getDataForSEOService } from "@/services/dataforseo-service"

export default function DataForSEOSettings() {
  const [apiLogin, setApiLogin] = useState("")
  const [apiPassword, setApiPassword] = useState("")
  const [savedApiLogin, setSavedApiLogin] = useState("")
  const [savedApiPassword, setSavedApiPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"none" | "success" | "error">("none")
  const { toast } = useToast()

  // Load saved credentials on mount
  useEffect(() => {
    const savedLogin = localStorage.getItem("dataforseo_api_login") || ""
    const savedPassword = localStorage.getItem("dataforseo_api_password") || ""

    setApiLogin(savedLogin)
    setApiPassword(savedPassword)
    setSavedApiLogin(savedLogin)
    setSavedApiPassword(savedPassword)

    // If we have saved credentials, initialize the service
    if (savedLogin && savedPassword) {
      getDataForSEOService({
        login: savedLogin,
        password: savedPassword,
      })
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    setConnectionStatus("none")

    try {
      if (!apiLogin || !apiPassword) {
        throw new Error("API login and password are required")
      }

      const credentials: DataForSEOCredentials = {
        login: apiLogin,
        password: apiPassword,
      }

      // Initialize service and test connection
      const service = getDataForSEOService(credentials)
      const result = await service?.testConnection()

      if (!result?.success) {
        throw new Error(result?.message || "Failed to connect to DataForSEO API")
      }

      // Save credentials to localStorage
      localStorage.setItem("dataforseo_api_login", apiLogin)
      localStorage.setItem("dataforseo_api_password", apiPassword)

      setSavedApiLogin(apiLogin)
      setSavedApiPassword(apiPassword)
      setConnectionStatus("success")

      toast({
        title: "Connection successful",
        description: "Your DataForSEO API credentials have been saved",
        variant: "success",
      })
    } catch (error: any) {
      setConnectionStatus("error")
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to DataForSEO API",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>DataForSEO API Settings</CardTitle>
        <CardDescription>Configure your DataForSEO API credentials to fetch keyword data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-login">API Login</Label>
          <Input
            id="api-login"
            value={apiLogin}
            onChange={(e) => setApiLogin(e.target.value)}
            placeholder="Your DataForSEO API login"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-password">API Password</Label>
          <Input
            id="api-password"
            type="password"
            value={apiPassword}
            onChange={(e) => setApiPassword(e.target.value)}
            placeholder="Your DataForSEO API password"
          />
        </div>

        {connectionStatus === "success" && (
          <div className="flex items-center text-green-600">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Connected to DataForSEO API</span>
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="flex items-center text-red-600">
            <XCircle className="mr-2 h-4 w-4" />
            <span>Failed to connect to DataForSEO API</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Your API credentials are stored locally in your browser and never sent to our servers.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing connection...
            </>
          ) : (
            "Save and test connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
