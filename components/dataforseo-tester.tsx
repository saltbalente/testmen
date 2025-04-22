"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function DataForSEOTester() {
  const [credentials, setCredentials] = useState({
    login: "",
    password: "",
  })
  const [endpoint, setEndpoint] = useState("keywords_data/google/locations")
  const [method, setMethod] = useState("GET")
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("test")

  // Lista de endpoints para probar
  const endpoints = [
    // Endpoints básicos para probar conexión
    { value: "keywords_data/google/locations", label: "Google Locations (GET)" },
    { value: "keywords_data/google/languages", label: "Google Languages (GET)" },

    // Endpoints de volumen de búsqueda
    { value: "keywords_data/google_ads/search_volume/live", label: "Google Ads Search Volume" },
    { value: "keywords_data/google/search_volume/live", label: "Google Search Volume" },

    // Endpoints de sugerencias de palabras clave
    { value: "keywords_data/google_ads/keywords_for_keywords/live", label: "Google Ads Keywords For Keywords" },
    { value: "keywords_data/google/keywords_for_keywords/live", label: "Google Keywords For Keywords" },

    // Endpoints de DataForSEO Labs
    { value: "dataforseo_labs/google/keyword_ideas/live", label: "DataForSEO Labs Keyword Ideas" },

    // Endpoints SERP
    { value: "serp/google/organic/live", label: "SERP Google Organic" },
    { value: "serp/google/related_searches/live", label: "SERP Google Related Searches" },
  ]

  // Ejemplos de cuerpos de solicitud para diferentes endpoints
  const requestBodyExamples = {
    "keywords_data/google_ads/search_volume/live": JSON.stringify(
      {
        data: [
          {
            keywords: ["seo tools"],
            location_code: 2840,
            language_code: "en",
          },
        ],
      },
      null,
      2,
    ),
    "keywords_data/google/search_volume/live": JSON.stringify(
      {
        data: [
          {
            keywords: ["seo tools"],
            location_code: 2840,
            language_code: "en",
          },
        ],
      },
      null,
      2,
    ),
    "keywords_data/google_ads/keywords_for_keywords/live": JSON.stringify(
      {
        data: [
          {
            keyword: "seo tools",
            location_code: 2840,
            language_code: "en",
            limit: 10,
          },
        ],
      },
      null,
      2,
    ),
    "keywords_data/google/keywords_for_keywords/live": JSON.stringify(
      {
        data: [
          {
            keyword: "seo tools",
            location_code: 2840,
            language_code: "en",
            limit: 10,
          },
        ],
      },
      null,
      2,
    ),
    "dataforseo_labs/google/keyword_ideas/live": JSON.stringify(
      {
        data: [
          {
            keyword: "seo tools",
            location_code: 2840,
            language_code: "en",
            limit: 10,
          },
        ],
      },
      null,
      2,
    ),
    "serp/google/organic/live": JSON.stringify(
      {
        data: [
          {
            keyword: "seo tools",
            location_code: 2840,
            language_code: "en",
            depth: 10,
          },
        ],
      },
      null,
      2,
    ),
    "serp/google/related_searches/live": JSON.stringify(
      {
        data: [
          {
            keyword: "seo tools",
            location_code: 2840,
            language_code: "en",
          },
        ],
      },
      null,
      2,
    ),
  }

  // Actualizar el cuerpo de la solicitud cuando cambia el endpoint
  const handleEndpointChange = (value: string) => {
    setEndpoint(value)

    // Establecer el método según el endpoint
    if (value.includes("locations") || value.includes("languages")) {
      setMethod("GET")
      setRequestBody("")
    } else {
      setMethod("POST")
      setRequestBody(requestBodyExamples[value as keyof typeof requestBodyExamples] || "")
    }
  }

  // Realizar la solicitud a la API
  const handleTest = async () => {
    if (!credentials.login || !credentials.password) {
      setResponse("Error: Please enter your DataForSEO credentials")
      return
    }

    setLoading(true)
    setResponse("Loading...")

    try {
      const authHeader = "Basic " + btoa(`${credentials.login}:${credentials.password}`)
      const url = `https://api.dataforseo.com/v3/${endpoint}`

      const options: RequestInit = {
        method,
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }

      // Añadir cuerpo si es POST
      if (method === "POST" && requestBody) {
        try {
          // Validar que el JSON sea válido
          JSON.parse(requestBody)
          options.body = requestBody
        } catch (e) {
          setResponse("Error: Invalid JSON in request body")
          setLoading(false)
          return
        }
      }

      console.log(`Making ${method} request to ${url}`)
      if (method === "POST") {
        console.log("Request body:", requestBody)
      }

      const response = await fetch(url, options)
      const data = await response.json()

      setResponse(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResponse(`Error: ${error.message || "Unknown error occurred"}`)
    } finally {
      setLoading(false)
    }
  }

  // Generar código de ejemplo basado en la prueba exitosa
  const generateCode = () => {
    if (!response || response.startsWith("Error") || response === "Loading...") {
      return "// Run a successful test first to generate code"
    }

    try {
      // Verificar si la respuesta es exitosa
      const responseData = JSON.parse(response)
      if (!responseData.status_code || responseData.status_code !== 20000) {
        return `// The last test was not successful. Error: ${responseData.status_message || "Unknown error"}`
      }

      // Generar código TypeScript para la solicitud
      return `// DataForSEO API request example
import { getDataForSEOService } from "@/services/dataforseo-service";

async function fetchDataFromDataForSEO() {
  try {
    // Get the DataForSEO service instance
    const service = getDataForSEOService();
    if (!service) {
      throw new Error("DataForSEO service not initialized");
    }
    
    // Create the auth header
    const authHeader = "Basic " + btoa(\`\${credentials.login}:\${credentials.password}\`);
    
    // Make the API request
    const response = await fetch("https://api.dataforseo.com/v3/${endpoint}", {
      method: "${method}",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      }${
        method === "POST"
          ? `,
      body: \`${requestBody}\``
          : ""
      }
    });
    
    // Parse the response
    const data = await response.json();
    
    // Check if the request was successful
    if (data.status_code === 20000) {
      console.log("Request successful:", data);
      return data;
    } else {
      throw new Error(\`API Error: \${data.status_message}\`);
    }
  } catch (error) {
    console.error("Error fetching data from DataForSEO:", error);
    throw error;
  }
}`
    } catch (e) {
      return "// Could not generate code from the response"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>DataForSEO API Tester</CardTitle>
        <CardDescription>Test different DataForSEO API endpoints to see what works</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="test">Test API</TabsTrigger>
            <TabsTrigger value="code">Generate Code</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="login">DataForSEO Login</Label>
                <Input
                  id="login"
                  value={credentials.login}
                  onChange={(e) => setCredentials({ ...credentials, login: e.target.value })}
                  placeholder="Your DataForSEO login"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">DataForSEO Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Your DataForSEO password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Select value={endpoint} onValueChange={handleEndpointChange}>
                <SelectTrigger id="endpoint">
                  <SelectValue placeholder="Select an endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {endpoints.map((ep) => (
                    <SelectItem key={ep.value} value={ep.value}>
                      {ep.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select
                value={method}
                onValueChange={setMethod}
                disabled={endpoint.includes("locations") || endpoint.includes("languages")}
              >
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select HTTP method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {method === "POST" && (
              <div className="space-y-2">
                <Label htmlFor="request-body">Request Body (JSON)</Label>
                <Textarea
                  id="request-body"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder="Enter JSON request body"
                  className="font-mono text-sm h-40"
                />
              </div>
            )}

            <Button onClick={handleTest} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Test API
            </Button>

            <div className="space-y-2">
              <Label htmlFor="response">Response</Label>
              <Textarea id="response" value={response} readOnly className="font-mono text-sm h-80" />
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="generated-code">Generated Code</Label>
              <Textarea id="generated-code" value={generateCode()} readOnly className="font-mono text-sm h-96" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
