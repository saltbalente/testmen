"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { ExternalLink, History, Star, Search, PlusCircle, Settings, Sparkles } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export function GoogleKeywordPlanner() {
  const [url, setUrl] = useState("https://ads.google.com/aw/keywordplanner/home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [savedUrls, setSavedUrls] = useState<Array<{ id: string; name: string; url: string; date: string }>>([])
  const [recentUrls, setRecentUrls] = useState<Array<{ url: string; date: string }>>([])

  // Cargar datos guardados desde localStorage
  useEffect(() => {
    const savedLoginState = localStorage.getItem("google_ads_logged_in")
    if (savedLoginState === "true") {
      setIsLoggedIn(true)
    }

    const savedUrl = localStorage.getItem("google_ads_last_url")
    if (savedUrl) {
      setUrl(savedUrl)
    }

    // Cargar URLs guardadas
    const savedUrlsData = localStorage.getItem("google_ads_saved_urls")
    if (savedUrlsData) {
      try {
        setSavedUrls(JSON.parse(savedUrlsData))
      } catch (e) {
        console.error("Error al cargar URLs guardadas:", e)
      }
    }

    // Cargar URLs recientes
    const recentUrlsData = localStorage.getItem("google_ads_recent_urls")
    if (recentUrlsData) {
      try {
        setRecentUrls(JSON.parse(recentUrlsData))
      } catch (e) {
        console.error("Error al cargar URLs recientes:", e)
      }
    }
  }, [])

  // Función para abrir Google Keyword Planner en una nueva ventana
  const openKeywordPlanner = () => {
    // Guardar la URL actual en el historial reciente
    const newRecentUrl = { url, date: new Date().toLocaleString() }
    const updatedRecentUrls = [newRecentUrl, ...recentUrls.filter((item) => item.url !== url)].slice(0, 10)
    setRecentUrls(updatedRecentUrls)
    localStorage.setItem("google_ads_recent_urls", JSON.stringify(updatedRecentUrls))

    // Guardar la última URL utilizada
    localStorage.setItem("google_ads_last_url", url)

    // Abrir en una nueva ventana
    const newWindow = window.open(url, "GoogleKeywordPlanner", "width=1200,height=800")

    // Verificar si la ventana se abrió correctamente
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      toast({
        title: "Bloqueador de ventanas emergentes detectado",
        description: "Por favor, permite las ventanas emergentes para este sitio y vuelve a intentarlo.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Google Keyword Planner abierto",
        description: "Se ha abierto Google Keyword Planner en una nueva ventana.",
      })

      // Intentar detectar cuando el usuario inicia sesión
      setTimeout(() => {
        try {
          if (!newWindow.closed) {
            // Si la ventana sigue abierta después de un tiempo, asumimos que el usuario ha iniciado sesión
            setIsLoggedIn(true)
            localStorage.setItem("google_ads_logged_in", "true")
          }
        } catch (e) {
          // Error de seguridad de origen cruzado - no podemos acceder a la ventana
          console.log("No se puede acceder a la ventana debido a restricciones de seguridad")
        }
      }, 30000) // Verificar después de 30 segundos
    }
  }

  // Función para guardar la URL actual
  const saveCurrentUrl = () => {
    const urlName = prompt("Introduce un nombre para esta URL:")
    if (urlName) {
      const newSavedUrl = {
        id: Date.now().toString(),
        name: urlName,
        url,
        date: new Date().toLocaleString(),
      }

      const updatedSavedUrls = [newSavedUrl, ...savedUrls]
      setSavedUrls(updatedSavedUrls)
      localStorage.setItem("google_ads_saved_urls", JSON.stringify(updatedSavedUrls))

      toast({
        title: "URL guardada",
        description: `La URL "${urlName}" ha sido guardada.`,
      })
    }
  }

  // Función para eliminar una URL guardada
  const removeSavedUrl = (id: string) => {
    const updatedSavedUrls = savedUrls.filter((item) => item.id !== id)
    setSavedUrls(updatedSavedUrls)
    localStorage.setItem("google_ads_saved_urls", JSON.stringify(updatedSavedUrls))

    toast({
      title: "URL eliminada",
      description: "La URL ha sido eliminada de tus favoritos.",
    })
  }

  // Función para cargar una URL guardada o reciente
  const loadUrl = (loadUrl: string) => {
    setUrl(loadUrl)
    toast({
      title: "URL cargada",
      description: "La URL ha sido cargada. Haz clic en 'Abrir Google Keyword Planner' para acceder.",
    })
  }

  // Función para limpiar el historial reciente
  const clearRecentHistory = () => {
    setRecentUrls([])
    localStorage.removeItem("google_ads_recent_urls")

    toast({
      title: "Historial limpiado",
      description: "Se ha limpiado el historial de URLs recientes.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="saved">Favoritos</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card className="border border-purple-500/30 bg-purple-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-400" />
                Google Keyword Planner
              </CardTitle>
              <CardDescription>Investiga palabras clave para tus campañas esotéricas y espirituales</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isLoggedIn ? "bg-green-500" : "bg-amber-500"}`}></div>
                <span className="text-sm">
                  {isLoggedIn ? "Sesión activa detectada" : "No se ha detectado sesión activa"}
                </span>
                {isLoggedIn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-xs"
                    onClick={() => {
                      setIsLoggedIn(false)
                      localStorage.removeItem("google_ads_logged_in")
                      toast({
                        title: "Sesión cerrada",
                        description: "Se ha cerrado la sesión guardada de Google Ads.",
                      })
                    }}
                  >
                    Cerrar sesión
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL de Google Keyword Planner</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ads.google.com/aw/keywordplanner/home"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={saveCurrentUrl}
                    className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
                    title="Guardar URL"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="border border-purple-500/20 bg-purple-500/5">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Enlaces rápidos</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => {
                          setUrl("https://ads.google.com/aw/keywordplanner/home")
                          toast({
                            title: "URL actualizada",
                            description: "Se ha cargado la página principal de Keyword Planner.",
                          })
                        }}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Página principal
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => {
                          setUrl("https://ads.google.com/aw/keywordplanner/ideas/new")
                          toast({
                            title: "URL actualizada",
                            description: "Se ha cargado la herramienta de ideas de palabras clave.",
                          })
                        }}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Descubrir palabras clave
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => {
                          setUrl("https://ads.google.com/aw/keywordplanner/metrics")
                          toast({
                            title: "URL actualizada",
                            description: "Se ha cargado la herramienta de métricas de palabras clave.",
                          })
                        }}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Obtener métricas
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-purple-500/20 bg-purple-500/5">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>Historial reciente</span>
                      {recentUrls.length > 0 && (
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearRecentHistory}>
                          Limpiar
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 max-h-[150px] overflow-y-auto">
                    {recentUrls.length > 0 ? (
                      <div className="space-y-2">
                        {recentUrls.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-purple-500/10 cursor-pointer text-sm"
                            onClick={() => loadUrl(item.url)}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <History className="h-3 w-3 flex-shrink-0 text-purple-400" />
                              <span className="truncate">{item.url.replace("https://", "")}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4">No hay historial reciente</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                onClick={openKeywordPlanner}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Google Keyword Planner
              </Button>
            </CardFooter>
          </Card>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-400"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Nota importante
            </h3>
            <p className="text-sm text-muted-foreground">
              Debido a las restricciones de seguridad de Google, no es posible integrar Google Keyword Planner
              directamente en esta aplicación. Al hacer clic en "Abrir Google Keyword Planner", se abrirá una nueva
              ventana con la URL especificada.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Consejos para palabras clave esotéricas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <Badge
                variant="outline"
                className="justify-start bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
              >
                Tarot + [ciudad]
              </Badge>
              <Badge
                variant="outline"
                className="justify-start bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
              >
                Lectura de aura
              </Badge>
              <Badge
                variant="outline"
                className="justify-start bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
              >
                Astrología personalizada
              </Badge>
              <Badge
                variant="outline"
                className="justify-start bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
              >
                Limpieza energética
              </Badge>
              <Badge
                variant="outline"
                className="justify-start bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
              >
                Rituales de abundancia
              </Badge>
              <Badge
                variant="outline"
                className="justify-start bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
              >
                Sanación espiritual
              </Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-400" />
                URLs guardadas
              </CardTitle>
              <CardDescription>Accede rápidamente a tus URLs favoritas de Google Keyword Planner</CardDescription>
            </CardHeader>

            <CardContent>
              {savedUrls.length > 0 ? (
                <div className="space-y-2">
                  {savedUrls.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-md border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10"
                    >
                      <div className="space-y-1 truncate pr-4">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                        <p className="text-xs text-muted-foreground">Guardado el {item.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => loadUrl(item.url)}>
                          Cargar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => removeSavedUrl(item.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">No hay URLs guardadas</h3>
                  <p className="text-sm">
                    Guarda tus URLs favoritas de Google Keyword Planner para acceder rápidamente a ellas.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setActiveTab("dashboard")
                  toast({
                    title: "Añade una URL favorita",
                    description: "Introduce una URL y haz clic en el icono de estrella para guardarla.",
                  })
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir nueva URL
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Configuración
              </CardTitle>
              <CardDescription>Personaliza la experiencia de Google Keyword Planner</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="remember-session">Recordar sesión</Label>
                  <p className="text-xs text-muted-foreground">Guarda el estado de inicio de sesión entre visitas</p>
                </div>
                <Switch
                  id="remember-session"
                  checked={isLoggedIn}
                  onCheckedChange={(checked) => {
                    setIsLoggedIn(checked)
                    localStorage.setItem("google_ads_logged_in", checked.toString())
                    toast({
                      title: checked ? "Sesión guardada" : "Sesión olvidada",
                      description: checked
                        ? "Se recordará tu sesión entre visitas."
                        : "No se recordará tu sesión entre visitas.",
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-url">URL predeterminada</Label>
                <Input
                  id="default-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://ads.google.com/aw/keywordplanner/home"
                />
                <p className="text-xs text-muted-foreground">
                  Esta URL se cargará por defecto al abrir Google Keyword Planner
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400 hover:text-red-500"
                  onClick={() => {
                    if (confirm("¿Estás seguro de que quieres eliminar todos los datos guardados?")) {
                      localStorage.removeItem("google_ads_logged_in")
                      localStorage.removeItem("google_ads_last_url")
                      localStorage.removeItem("google_ads_saved_urls")
                      localStorage.removeItem("google_ads_recent_urls")

                      setIsLoggedIn(false)
                      setUrl("https://ads.google.com/aw/keywordplanner/home")
                      setSavedUrls([])
                      setRecentUrls([])

                      toast({
                        title: "Datos eliminados",
                        description: "Se han eliminado todos los datos guardados de Google Keyword Planner.",
                      })
                    }
                  }}
                >
                  Eliminar todos los datos guardados
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Esta acción eliminará todas las URLs guardadas, el historial y la configuración.
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => {
                  localStorage.setItem("google_ads_last_url", url)
                  toast({
                    title: "Configuración guardada",
                    description: "La configuración ha sido guardada correctamente.",
                  })
                  setActiveTab("dashboard")
                }}
                className="w-full"
              >
                Guardar configuración
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
