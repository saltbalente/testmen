"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Code2,
  Layout,
  Layers,
  ImageIcon,
  Type,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  Underline,
  Link,
  List,
  ListOrdered,
  LayoutList,
  Table,
  ChevronsLeftRight,
  FileCode,
  Palette,
  Paintbrush,
  Rows,
  BracesIcon,
  PlusCircle,
  Terminal,
  Save,
  CopyIcon,
  DownloadIcon,
  Upload,
  Menu,
  CheckSquare,
  RefreshCw,
  Coffee,
  Baseline,
  Box,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Smartphone,
  Tablet,
  Monitor,
  FileIcon as FileHtml,
  TrashIcon,
} from "lucide-react"

// Template básico de Blogspot
const BASIC_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:js='false' b:defaultwidgetversion='2' b:layoutsVersion='3'>
<head>
  <meta charset='utf-8'/>
  <meta content='width=device-width, initial-scale=1' name='viewport'/>
  <title><data:blog.title/></title>

  <!-- Meta Tags -->
  <b:include data='blog' name='all-head-content'/>

  <!-- Styles -->
  <style>
  /* Reset CSS */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Roboto', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f9f9f9;
  }
  a {
    color: #1a73e8;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  /* Layout */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  header {
    padding: 20px 0;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  main {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0;
  }
  .main-content {
    flex: 2;
    min-width: 0;
  }
  .sidebar {
    flex: 1;
    min-width: 250px;
    padding-left: 20px;
  }
  footer {
    background-color: #f1f1f1;
    padding: 20px 0;
    text-align: center;
    margin-top: 30px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    main {
      flex-direction: column;
    }
    .sidebar {
      padding-left: 0;
      margin-top: 20px;
    }
  }
  </style>
</head>
<body>
  <b:section id='navbar' maxwidgets='1' showaddelement='no'/>
  
  <div class='container'>
    <header>
      <b:section id='header' maxwidgets='1' showaddelement='no'/>
    </header>
    
    <main>
      <div class='main-content'>
        <b:section id='main' showaddelement='no'/>
      </div>
      
      <aside class='sidebar'>
        <b:section id='sidebar' showaddelement='no'/>
      </aside>
    </main>
    
    <footer>
      <b:section id='footer' showaddelement='no'/>
    </footer>
  </div>

  <!-- Blogger Scripts -->
  <b:include data='blog' name='google-analytics'/>
</body>
</html>`

// Tipo para las etiquetas HTML
type HtmlTag = {
  name: string
  description: string
  attributes?: string[]
  example: string
  category: string
  icon: React.ReactNode
}

// Tipo para la fuente
type Font = {
  family: string
  category: string
  variants: string[]
}

// Tipo para un color guardado
type SavedColor = {
  id: string
  name: string
  value: string
  createdAt: Date
}

// Tipo para un gradiente guardado
type SavedGradient = {
  id: string
  name: string
  colors: string[]
  type: "linear" | "radial"
  angle: number
  createdAt: Date
}

// Tipo para un preajuste de meta etiquetas
type MetaTagPreset = {
  id: string
  name: string
  description: string
  tags: MetaTag[]
}

// Tipo para una meta etiqueta
type MetaTag = {
  name: string
  property?: string
  content: string
  type: "seo" | "social" | "mobile" | "other"
}

// Definir las etiquetas HTML con sus propiedades
const HTML_TAGS: HtmlTag[] = [
  {
    name: "div",
    description: "Elemento de división, contenedor genérico",
    attributes: ["id", "class", "style"],
    example: '<div class="container">Contenido</div>',
    category: "layout",
    icon: <Box size={16} />,
  },
  {
    name: "span",
    description: "Contenedor en línea para texto y elementos",
    attributes: ["id", "class", "style"],
    example: '<span class="highlight">Texto destacado</span>',
    category: "inline",
    icon: <Baseline size={16} />,
  },
  {
    name: "header",
    description: "Sección introductoria o de navegación",
    attributes: ["id", "class", "style"],
    example: "<header><h1>Título del sitio</h1></header>",
    category: "semantic",
    icon: <PanelTop size={16} />,
  },
  {
    name: "nav",
    description: "Sección de navegación",
    attributes: ["id", "class", "style"],
    example: '<nav><ul><li><a href="#">Inicio</a></li></ul></nav>',
    category: "semantic",
    icon: <Menu size={16} />,
  },
  {
    name: "main",
    description: "Contenido principal de la página",
    attributes: ["id", "class", "style"],
    example: "<main><article>Contenido principal</article></main>",
    category: "semantic",
    icon: <Layout size={16} />,
  },
  {
    name: "article",
    description: "Contenido independiente y distribuible",
    attributes: ["id", "class", "style"],
    example: "<article><h2>Título del artículo</h2><p>Contenido...</p></article>",
    category: "semantic",
    icon: <FileCode size={16} />,
  },
  {
    name: "section",
    description: "Sección genérica de contenido",
    attributes: ["id", "class", "style"],
    example: "<section><h2>Sección</h2><p>Contenido...</p></section>",
    category: "semantic",
    icon: <Layers size={16} />,
  },
  {
    name: "aside",
    description: "Contenido relacionado indirectamente",
    attributes: ["id", "class", "style"],
    example: "<aside><h3>Contenido relacionado</h3></aside>",
    category: "semantic",
    icon: <PanelLeft size={16} />,
  },
  {
    name: "footer",
    description: "Pie de página o sección",
    attributes: ["id", "class", "style"],
    example: "<footer>&copy; 2023 Mi Sitio</footer>",
    category: "semantic",
    icon: <PanelBottom size={16} />,
  },
  {
    name: "h1",
    description: "Encabezado de nivel 1 (principal)",
    attributes: ["id", "class", "style"],
    example: "<h1>Título principal</h1>",
    category: "heading",
    icon: <Heading1 size={16} />,
  },
  {
    name: "h2",
    description: "Encabezado de nivel 2",
    attributes: ["id", "class", "style"],
    example: "<h2>Subtítulo</h2>",
    category: "heading",
    icon: <Heading2 size={16} />,
  },
  {
    name: "h3",
    description: "Encabezado de nivel 3",
    attributes: ["id", "class", "style"],
    example: "<h3>Título de sección</h3>",
    category: "heading",
    icon: <Heading3 size={16} />,
  },
  {
    name: "p",
    description: "Párrafo de texto",
    attributes: ["id", "class", "style"],
    example: "<p>Este es un párrafo de texto.</p>",
    category: "text",
    icon: <AlignLeft size={16} />,
  },
  {
    name: "ul",
    description: "Lista no ordenada",
    attributes: ["id", "class", "style"],
    example: "<ul><li>Elemento 1</li><li>Elemento 2</li></ul>",
    category: "list",
    icon: <List size={16} />,
  },
  {
    name: "ol",
    description: "Lista ordenada",
    attributes: ["id", "class", "style"],
    example: "<ol><li>Primer elemento</li><li>Segundo elemento</li></ol>",
    category: "list",
    icon: <ListOrdered size={16} />,
  },
  {
    name: "li",
    description: "Elemento de lista",
    attributes: ["id", "class", "style"],
    example: "<li>Elemento de lista</li>",
    category: "list",
    icon: <CheckSquare size={16} />,
  },
  {
    name: "a",
    description: "Hipervínculo",
    attributes: ["id", "class", "style", "href", "target", "rel"],
    example: '<a href="https://ejemplo.com">Enlace</a>',
    category: "inline",
    icon: <Link size={16} />,
  },
  {
    name: "img",
    description: "Imagen",
    attributes: ["id", "class", "style", "src", "alt", "width", "height"],
    example: '<img src="imagen.jpg" alt="Descripción"</img>',
    category: "media",
    icon: <ImageIcon size={16} />,
  },
  {
    name: "figure",
    description: "Contenedor para imágenes con leyenda",
    attributes: ["id", "class", "style"],
    example: '<figure><img src="imagen.jpg" alt="Descripción"</img><figcaption>Leyenda</figcaption></figure>',
    category: "media",
    icon: <ImageIcon size={16} />,
  },
  {
    name: "figcaption",
    description: "Leyenda para figura",
    attributes: ["id", "class", "style"],
    example: "<figcaption>Leyenda para la imagen</figcaption>",
    category: "media",
    icon: <Type size={16} />,
  },
  {
    name: "blockquote",
    description: "Bloque de cita",
    attributes: ["id", "class", "style", "cite"],
    example: "<blockquote>Cita importante</blockquote>",
    category: "text",
    icon: <AlignLeft size={16} />,
  },
  {
    name: "pre",
    description: "Texto preformateado",
    attributes: ["id", "class", "style"],
    example: "<pre>Texto con formato preservado</pre>",
    category: "code",
    icon: <Code2 size={16} />,
  },
  {
    name: "code",
    description: "Código en línea",
    attributes: ["id", "class", "style"],
    example: "<code>let x = 10;</code>",
    category: "code",
    icon: <Terminal size={16} />,
  },
  {
    name: "table",
    description: "Tabla",
    attributes: ["id", "class", "style", "border"],
    example: "<table><tr><th>Encabezado</th></tr><tr><td>Dato</td></tr></table>",
    category: "table",
    icon: <Table size={16} />,
  },
  {
    name: "tr",
    description: "Fila de tabla",
    attributes: ["id", "class", "style"],
    example: "<tr><td>Celda</td></tr>",
    category: "table",
    icon: <Rows size={16} />,
  },
  {
    name: "th",
    description: "Celda de encabezado de tabla",
    attributes: ["id", "class", "style", "colspan", "rowspan"],
    example: "<th>Encabezado</th>",
    category: "table",
    icon: <Box size={16} />,
  },
  {
    name: "td",
    description: "Celda de datos de tabla",
    attributes: ["id", "class", "style", "colspan", "rowspan"],
    example: "<td>Datos</td>",
    category: "table",
    icon: <Box size={16} />,
  },
  {
    name: "form",
    description: "Formulario",
    attributes: ["id", "class", "style", "action", "method"],
    example: '<form action="/enviar" method="post">...</form>',
    category: "form",
    icon: <LayoutList size={16} />,
  },
  {
    name: "input",
    description: "Campo de entrada",
    attributes: ["id", "class", "style", "type", "name", "value", "placeholder"],
    example: '<input type="text" name="nombre" placeholder="Nombre"></input>',
    category: "form",
    icon: <Type size={16} />,
  },
  {
    name: "textarea",
    description: "Área de texto",
    attributes: ["id", "class", "style", "name", "rows", "cols"],
    example: '<textarea name="mensaje" rows="4">Mensaje</textarea>',
    category: "form",
    icon: <AlignLeft size={16} />,
  },
  {
    name: "button",
    description: "Botón",
    attributes: ["id", "class", "style", "type"],
    example: '<button type="submit">Enviar</button>',
    category: "form",
    icon: <CheckSquare size={16} />,
  },
  {
    name: "details",
    description: "Detalles desplegables",
    attributes: ["id", "class", "style", "open"],
    example: "<details><summary>Título</summary><p>Contenido</p></details>",
    category: "interactive",
    icon: <ChevronsLeftRight size={16} />,
  },
  {
    name: "summary",
    description: "Encabezado para detalles",
    attributes: ["id", "class", "style"],
    example: "<summary>Haga clic para ver más</summary>",
    category: "interactive",
    icon: <Type size={16} />,
  },
  {
    name: "mark",
    description: "Texto resaltado",
    attributes: ["id", "class", "style"],
    example: "<mark>Texto resaltado</mark>",
    category: "inline",
    icon: <Underline size={16} />,
  },
  {
    name: "time",
    description: "Fecha/hora",
    attributes: ["id", "class", "style", "datetime"],
    example: '<time datetime="2023-01-01">1 de enero de 2023</time>',
    category: "inline",
    icon: <Coffee size={16} />,
  },
  {
    name: "progress",
    description: "Barra de progreso",
    attributes: ["id", "class", "style", "value", "max"],
    example: '<progress value="70" max="100">70%</progress>',
    category: "interactive",
    icon: <RefreshCw size={16} />,
  },
]

// Lista de meta tags comunes
const COMMON_META_TAGS: MetaTagPreset[] = [
  {
    id: "seo-basic",
    name: "SEO Básico",
    description: "Meta etiquetas básicas para SEO",
    tags: [
      { name: "description", content: "Descripción de tu sitio web en 150-160 caracteres", type: "seo" },
      { name: "keywords", content: "palabra clave 1, palabra clave 2, palabra clave 3", type: "seo" },
      { name: "robots", content: "index, follow", type: "seo" },
      { name: "author", content: "Nombre del autor", type: "seo" },
      { name: "viewport", content: "width=device-width, initial-scale=1", type: "mobile" },
    ],
  },
  {
    id: "open-graph",
    name: "Open Graph (Facebook)",
    description: "Meta etiquetas para compartir en Facebook",
    tags: [
      { property: "og:title", content: "Título de tu página", type: "social" },
      { property: "og:description", content: "Descripción de tu página", type: "social" },
      { property: "og:image", content: "https://ejemplo.com/imagen.jpg", type: "social" },
      { property: "og:url", content: "https://ejemplo.com/pagina", type: "social" },
      { property: "og:type", content: "website", type: "social" },
    ],
  },
  {
    id: "twitter-cards",
    name: "Twitter Cards",
    description: "Meta etiquetas para compartir en Twitter",
    tags: [
      { name: "twitter:card", content: "summary_large_image", type: "social" },
      { name: "twitter:title", content: "Título de tu página", type: "social" },
      { name: "twitter:description", content: "Descripción de tu página", type: "social" },
      { name: "twitter:image", content: "https://ejemplo.com/imagen.jpg", type: "social" },
      { name: "twitter:site", content: "@usuario", type: "social" },
    ],
  },
  {
    id: "mobile-optimization",
    name: "Optimización Móvil",
    description: "Meta etiquetas para dispositivos móviles",
    tags: [
      { name: "viewport", content: "width=device-width, initial-scale=1", type: "mobile" },
      { name: "theme-color", content: "#ffffff", type: "mobile" },
      { name: "mobile-web-app-capable", content: "yes", type: "mobile" },
      { name: "apple-mobile-web-app-capable", content: "yes", type: "mobile" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent", type: "mobile" },
    ],
  },
  {
    id: "favicon-links",
    name: "Favicons",
    description: "Links para favicons",
    tags: [
      { name: "link rel='icon'", content: "href='favicon.ico' type='image/x-icon'", type: "other" },
      { name: "link rel='apple-touch-icon'", content: "href='apple-touch-icon.png'", type: "mobile" },
      { name: "link rel='manifest'", content: "href='site.webmanifest'", type: "mobile" },
    ],
  },
]

export default function BlogspotStudio() {
  // Estados principales
  const [template, setTemplate] = useState(BASIC_TEMPLATE)
  const [activeTab, setActiveTab] = useState("editor")
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [previewMode, setPreviewMode] = useState<"split" | "full">("split")
  const [savedTemplates, setSavedTemplates] = useState<Array<{ id: string; name: string; code: string; date: Date }>>(
    [],
  )

  // Estados para el editor de etiquetas HTML
  const [selectedTag, setSelectedTag] = useState<HtmlTag | null>(null)
  const [tagFilter, setTagFilter] = useState("")
  const [tagCategory, setTagCategory] = useState<string>("all")
  const [tagAttributes, setTagAttributes] = useState<{ [key: string]: string }>({})
  const [tagContent, setTagContent] = useState("")

  // Estados para el generador de meta etiquetas
  const [metaTags, setMetaTags] = useState<MetaTag[]>([])
  const [currentMetaTag, setCurrentMetaTag] = useState<MetaTag>({ name: "", content: "", type: "seo" })

  // Estados para el selector de fuentes
  const [fonts, setFonts] = useState<Font[]>([])
  const [selectedFont, setSelectedFont] = useState<Font | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string>("regular")
  const [fontPreviewText, setFontPreviewText] = useState("The quick brown fox jumps over the lazy dog")
  const [fontSearchQuery, setFontSearchQuery] = useState("")
  const [fontCategory, setFontCategory] = useState<string>("all")

  // Estados para el selector de colores
  const [colorFormat, setColorFormat] = useState<"hex" | "rgb">("hex")
  const [currentColor, setCurrentColor] = useState("#3b82f6")
  const [savedColors, setSavedColors] = useState<SavedColor[]>([])
  const [colorName, setColorName] = useState("")

  // Estados para el generador de gradientes
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear")
  const [gradientAngle, setGradientAngle] = useState(90)
  const [gradientColors, setGradientColors] = useState<string[]>(["#3b82f6", "#8b5cf6"])
  const [gradientName, setGradientName] = useState("")
  const [savedGradients, setSavedGradients] = useState<SavedGradient[]>([])

  // Referencia para la vista previa
  const previewRef = useRef<HTMLIFrameElement>(null)

  // Cargar datos guardados al inicio
  useEffect(() => {
    // Cargar plantillas guardadas
    try {
      const storedTemplates = localStorage.getItem("blogspot-templates")
      if (storedTemplates) {
        setSavedTemplates(
          JSON.parse(storedTemplates).map((t: any) => ({
            ...t,
            date: new Date(t.date),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading saved templates:", error)
    }

    // Cargar colores guardados
    try {
      const storedColors = localStorage.getItem("blogspot-colors")
      if (storedColors) {
        setSavedColors(
          JSON.parse(storedColors).map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading saved colors:", error)
    }

    // Cargar gradientes guardados
    try {
      const storedGradients = localStorage.getItem("blogspot-gradients")
      if (storedGradients) {
        setSavedGradients(
          JSON.parse(storedGradients).map((g: any) => ({
            ...g,
            createdAt: new Date(g.createdAt),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading saved gradients:", error)
    }

    // Cargar Google Fonts
    fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAOES8EmKhuJELQYdtjk0ICDuYLUfKTzGE")
      .then((response) => response.json())
      .then((data) => {
        setFonts(data.items || [])
      })
      .catch((error) => {
        console.error("Error fetching Google Fonts:", error)
        // Cargar algunas fuentes predeterminadas si hay un error
        setFonts([
          { family: "Roboto", category: "sans-serif", variants: ["regular", "700"] },
          { family: "Open Sans", category: "sans-serif", variants: ["regular", "700"] },
          { family: "Lato", category: "sans-serif", variants: ["regular", "700"] },
          { family: "Montserrat", category: "sans-serif", variants: ["regular", "700"] },
          { family: "Poppins", category: "sans-serif", variants: ["regular", "700"] },
          { family: "Playfair Display", category: "serif", variants: ["regular", "700"] },
          { family: "Merriweather", category: "serif", variants: ["regular", "700"] },
        ])
      })
  }, [])

  // Actualizar la vista previa cuando cambia el template
  useEffect(() => {
    const updatePreview = () => {
      if (previewRef.current) {
        const doc = previewRef.current.contentDocument
        if (doc) {
          doc.open()
          doc.write(template)
          doc.close()
        }
      }
    }

    updatePreview()
  }, [template, previewDevice])

  // Guardar datos cuando cambian
  useEffect(() => {
    localStorage.setItem("blogspot-templates", JSON.stringify(savedTemplates))
  }, [savedTemplates])

  useEffect(() => {
    localStorage.setItem("blogspot-colors", JSON.stringify(savedColors))
  }, [savedColors])

  useEffect(() => {
    localStorage.setItem("blogspot-gradients", JSON.stringify(savedGradients))
  }, [savedGradients])

  // Funciones para el manejo de etiquetas HTML
  const filteredTags = HTML_TAGS.filter((tag) => {
    const matchesFilter =
      tag.name.includes(tagFilter.toLowerCase()) || tag.description.toLowerCase().includes(tagFilter.toLowerCase())
    const matchesCategory = tagCategory === "all" || tag.category === tagCategory
    return matchesFilter && matchesCategory
  })

  const generateTagCode = () => {
    let attributes = ""
    for (const key in tagAttributes) {
      if (tagAttributes[key]) {
        attributes += ` ${key}="${tagAttributes[key]}"`
      }
    }

    if (!selectedTag) return ""

    // Tags that don't need closing tags
    const selfClosingTags = ["img", "input", "meta", "link", "br", "hr"]

    if (selfClosingTags.includes(selectedTag.name)) {
      // Ensure Blogger-compatible img tag
      if (selectedTag.name === "img") {
        return `<${selectedTag.name}${attributes}></img>`
      }
      return `<${selectedTag.name}${attributes}></${selectedTag.name}>`
    }

    return `<${selectedTag.name}${attributes}>${tagContent}</${selectedTag.name}>`
  }

  const insertTagToTemplate = () => {
    const tagCode = generateTagCode()
    if (!tagCode) return

    // Insert the tag at cursor position or at the end of the template
    setTemplate((prev) => {
      // For simplicity, just append to the end for now
      return prev.replace("</body>", `  ${tagCode}\n</body>`)
    })

    toast({
      title: "Etiqueta insertada",
      description: `${selectedTag?.name} ha sido insertada en el template`,
    })
  }

  // Funciones para el generador de meta etiquetas
  const addMetaTag = () => {
    if (!currentMetaTag.name && !currentMetaTag.property) {
      toast({
        title: "Error",
        description: "Debe especificar un nombre o propiedad para la meta etiqueta",
        variant: "destructive",
      })
      return
    }

    if (!currentMetaTag.content) {
      toast({
        title: "Error",
        description: "Debe especificar el contenido de la meta etiqueta",
        variant: "destructive",
      })
      return
    }

    setMetaTags([...metaTags, currentMetaTag])
    setCurrentMetaTag({ name: "", content: "", type: "seo" })
  }

  const removeMetaTag = (index: number) => {
    setMetaTags(metaTags.filter((_, i) => i !== index))
  }

  const applyMetaTagsToTemplate = () => {
    const metaTagsCode = metaTags
      .map((tag) => {
        if (tag.property) {
          return `  <meta property="${tag.property}" content="${tag.content}" />`
        }
        return `  <meta name="${tag.name}" content="${tag.content}" />`
      })
      .join("\n")

    setTemplate((prev) => {
      return prev.replace("</head>", `\n  <!-- Meta Tags Generated -->\n${metaTagsCode}\n</head>`)
    })

    toast({
      title: "Meta etiquetas aplicadas",
      description: `${metaTags.length} meta etiquetas han sido aplicadas al template`,
    })
  }

  const applyMetaTagPreset = (preset: MetaTagPreset) => {
    setMetaTags([...metaTags, ...preset.tags])

    toast({
      title: "Preset aplicado",
      description: `${preset.name} ha sido aplicado`,
    })
  }

  // Funciones para el selector de fuentes
  const applyFontToTemplate = () => {
    if (!selectedFont) return

    const fontFamily = selectedFont.family
    const variant = selectedVariant
    const weightMap: { [key: string]: string } = {
      regular: "400",
      italic: "400",
      "700": "700",
      "700italic": "700",
    }

    const weight = weightMap[variant] || "400"
    const isItalic = variant.includes("italic")

    // Preparar el enlace para la fuente
    const fontLink = `<link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@${weight}&display=swap" rel="stylesheet" />`

    // Añadir CSS para usar la fuente
    const fontCSS = `
  /* Font: ${fontFamily} */
  body {
    font-family: '${fontFamily}', ${selectedFont.category};
    font-weight: ${weight};
    ${isItalic ? "font-style: italic;" : ""}
  }`

    // Añadir al template
    setTemplate((prev) => {
      // Añadir el enlace a la fuente en el head
      let updated = prev.replace("</head>", `  ${fontLink}\n</head>`)

      // Añadir CSS para usar la fuente
      updated = updated.replace("</style>", `${fontCSS}\n</style>`)

      return updated
    })

    toast({
      title: "Fuente aplicada",
      description: `${fontFamily} (${variant}) ha sido aplicada al template`,
    })
  }

  const filteredFonts = fonts.filter((font) => {
    const matchesSearch = font.family.toLowerCase().includes(fontSearchQuery.toLowerCase())
    const matchesCategory = fontCategory === "all" || font.category === fontCategory
    return matchesSearch && matchesCategory
  })

  // Funciones para el selector de colores
  const saveCurrentColor = () => {
    const newColor: SavedColor = {
      id: Date.now().toString(),
      name: colorName || `Color ${savedColors.length + 1}`,
      value: currentColor,
      createdAt: new Date(),
    }

    setSavedColors((prev) => [...prev, newColor])
    setColorName("")

    toast({
      title: "Color guardado",
      description: `${newColor.name} ha sido guardado`,
    })
  }

  const applyColorToTemplate = (color: string, element: string) => {
    // Añadir CSS para el color
    const colorCSS = `
  /* Custom Color */
  ${element} {
    color: ${color};
  }`

    // Añadir al template
    setTemplate((prev) => {
      return prev.replace("</style>", `${colorCSS}\n</style>`)
    })

    toast({
      title: "Color aplicado",
      description: `El color ha sido aplicado a ${element}`,
    })
  }

  const deleteColor = (id: string) => {
    setSavedColors((prev) => prev.filter((color) => color.id !== id))
  }

  // Funciones para el generador de gradientes
  const getCurrentGradient = () => {
    if (gradientType === "linear") {
      return `linear-gradient(${gradientAngle}deg, ${gradientColors.join(", ")})`
    } else {
      return `radial-gradient(circle, ${gradientColors.join(", ")})`
    }
  }

  const saveCurrentGradient = () => {
    const newGradient: SavedGradient = {
      id: Date.now().toString(),
      name: gradientName || `Gradiente ${savedGradients.length + 1}`,
      colors: [...gradientColors],
      type: gradientType,
      angle: gradientAngle,
      createdAt: new Date(),
    }

    setSavedGradients((prev) => [...prev, newGradient])
    setGradientName("")

    toast({
      title: "Gradiente guardado",
      description: `${newGradient.name} ha sido guardado`,
    })
  }

  const applyGradientToTemplate = (gradientCSS: string, element: string) => {
    // Añadir CSS para el gradiente
    const css = `
  /* Custom Gradient */
  ${element} {
    background: ${gradientCSS};
  }`

    // Añadir al template
    setTemplate((prev) => {
      return prev.replace("</style>", `${css}\n</style>`)
    })

    toast({
      title: "Gradiente aplicado",
      description: `El gradiente ha sido aplicado a ${element}`,
    })
  }

  const deleteGradient = (id: string) => {
    setSavedGradients((prev) => prev.filter((gradient) => gradient.id !== id))
  }

  // Funciones para guardar y cargar templates
  const saveCurrentTemplate = () => {
    // Mostrar un diálogo para ingresar el nombre
    const name = prompt("Ingrese un nombre para el template:", "Mi Template")
    if (!name) return

    const newTemplate = {
      id: Date.now().toString(),
      name,
      code: template,
      date: new Date(),
    }

    setSavedTemplates((prev) => [...prev, newTemplate])

    toast({
      title: "Template guardado",
      description: `${name} ha sido guardado`,
    })
  }

  const loadTemplate = (id: string) => {
    const templateToLoad = savedTemplates.find((t) => t.id === id)
    if (!templateToLoad) return

    if (confirm("¿Está seguro de cargar este template? Se perderán los cambios no guardados.")) {
      setTemplate(templateToLoad.code)

      toast({
        title: "Template cargado",
        description: `${templateToLoad.name} ha sido cargado`,
      })
    }
  }

  const deleteTemplate = (id: string) => {
    if (confirm("¿Está seguro de eliminar este template?")) {
      setSavedTemplates((prev) => prev.filter((t) => t.id !== id))

      toast({
        title: "Template eliminado",
        description: "El template ha sido eliminado",
      })
    }
  }

  const exportTemplate = () => {
    const element = document.createElement("a")
    const file = new Blob([template], { type: "text/xml" })
    element.href = URL.createObjectURL(file)
    element.download = "template-blogspot.xml"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const copyTemplateToClipboard = () => {
    navigator.clipboard.writeText(template)

    toast({
      title: "Copiado al portapapeles",
      description: "El template ha sido copiado al portapapeles",
    })
  }

  // Renderizado del componente
  return (
    <div className="relative min-h-screen">
      <div className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Blogspot Studio</h1>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={saveCurrentTemplate} variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Guardar el template actual</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={exportTemplate} variant="outline" size="sm">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exportar el template como archivo XML</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={copyTemplateToClipboard} variant="outline" size="sm">
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar el template al portapapeles</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Cargar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Templates Guardados</DialogTitle>
                  <DialogDescription>Seleccione un template para cargarlo</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {savedTemplates.length > 0 ? (
                    <div className="grid gap-4">
                      {savedTemplates.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h3 className="font-medium">{t.name}</h3>
                            <p className="text-sm text-muted-foreground">{new Date(t.date).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => loadTemplate(t.id)}>
                              Cargar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteTemplate(t.id)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No hay templates guardados</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Panel de herramientas */}
          <div
            className={`${previewMode === "full" ? "hidden" : ""} w-full lg:w-1/2 lg:overflow-hidden rounded-md border`}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start overflow-auto">
                <TabsTrigger value="editor">
                  <FileHtml className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="tags">
                  <Code2 className="h-4 w-4 mr-2" />
                  Etiquetas HTML
                </TabsTrigger>
                <TabsTrigger value="meta">
                  <BracesIcon className="h-4 w-4 mr-2" />
                  Meta Tags
                </TabsTrigger>
                <TabsTrigger value="fonts">
                  <Type className="h-4 w-4 mr-2" />
                  Fuentes
                </TabsTrigger>
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4 mr-2" />
                  Colores
                </TabsTrigger>
                <TabsTrigger value="gradients">
                  <Paintbrush className="h-4 w-4 mr-2" />
                  Gradientes
                </TabsTrigger>
              </TabsList>

              {/* Editor de código */}
              <TabsContent value="editor" className="p-0">
                <Card className="border-0 rounded-none">
                  <CardContent className="p-0">
                    <div className="p-2 bg-muted flex justify-between items-center">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("¿Restaurar el template básico? Se perderán los cambios no guardados.")) {
                              setTemplate(BASIC_TEMPLATE)
                            }
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Restaurar Básico
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" onClick={copyTemplateToClipboard}>
                          <CopyIcon className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={template}
                      onChange={(e) => setTemplate(e.target.value)}
                      className="font-mono text-sm h-[600px] resize-none rounded-none border-x-0"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Editor de etiquetas HTML */}
              <TabsContent value="tags">
                <Card className="border-0 rounded-none">
                  <CardHeader>
                    <CardTitle>Etiquetas HTML</CardTitle>
                    <CardDescription>Seleccione una etiqueta para insertarla en el template</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Buscar etiquetas..."
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="flex-1"
                      />

                      <Select value={tagCategory} onValueChange={setTagCategory}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="layout">Diseño</SelectItem>
                          <SelectItem value="semantic">Semánticas</SelectItem>
                          <SelectItem value="heading">Encabezados</SelectItem>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="list">Listas</SelectItem>
                          <SelectItem value="inline">En línea</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="table">Tablas</SelectItem>
                          <SelectItem value="form">Formularios</SelectItem>
                          <SelectItem value="interactive">Interactivos</SelectItem>
                          <SelectItem value="code">Código</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border rounded-md">
                      <ScrollArea className="h-[300px]">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4">
                          {filteredTags.map((tag) => (
                            <div
                              key={tag.name}
                              className={`p-2 border rounded-md cursor-pointer hover:bg-accent/50 ${selectedTag?.name === tag.name ? "bg-accent/50" : ""}`}
                              onClick={() => setSelectedTag(tag)}
                            >
                              <div className="flex items-center gap-2">
                                {tag.icon}
                                <span className="font-mono">{`<${tag.name}>`}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{tag.description}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {selectedTag && (
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="flex items-center gap-2">
                          {selectedTag.icon}
                          <h3 className="font-medium">Configuración de {`<${selectedTag.name}>`}</h3>
                        </div>

                        {selectedTag.attributes && selectedTag.attributes.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Atributos</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedTag.attributes.map((attr) => (
                                <div key={attr} className="space-y-1">
                                  <Label htmlFor={`attr-${attr}`}>{attr}</Label>
                                  <Input
                                    id={`attr-${attr}`}
                                    value={tagAttributes[attr] || ""}
                                    onChange={(e) => setTagAttributes({ ...tagAttributes, [attr]: e.target.value })}
                                    placeholder={`Valor para ${attr}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Contenido</h4>
                          <Textarea
                            value={tagContent}
                            onChange={(e) => setTagContent(e.target.value)}
                            placeholder="Contenido de la etiqueta"
                            className="min-h-[100px]"
                          />
                        </div>

                        <div className="p-2 bg-muted rounded-md">
                          <h4 className="text-sm font-medium mb-1">Vista previa</h4>
                          <pre className="text-xs font-mono p-2 bg-background rounded whitespace-pre-wrap overflow-auto">
                            {generateTagCode()}
                          </pre>
                        </div>

                        <Button onClick={insertTagToTemplate}>Insertar en Template</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Editor de meta etiquetas */}
              <TabsContent value="meta">
                <Card className="border-0 rounded-none">
                  <CardHeader>
                    <CardTitle>Meta Etiquetas</CardTitle>
                    <CardDescription>Cree meta etiquetas para SEO, redes sociales y optimización</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select
                        value={currentMetaTag.type}
                        onValueChange={(val) => setCurrentMetaTag({ ...currentMetaTag, type: val as any })}
                      >
                        <SelectTrigger className="w-full sm:w-[120px]">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seo">SEO</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="mobile">Móvil</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex flex-1 gap-2">
                        <div className="w-1/2">
                          <Input
                            placeholder={
                              currentMetaTag.type === "social" ? "property (og:title)" : "name (description)"
                            }
                            value={currentMetaTag.property || currentMetaTag.name}
                            onChange={(e) => {
                              const value = e.target.value
                              if (currentMetaTag.type === "social" && value.startsWith("og:")) {
                                setCurrentMetaTag({ ...currentMetaTag, property: value, name: "" })
                              } else {
                                setCurrentMetaTag({ ...currentMetaTag, name: value, property: "" })
                              }
                            }}
                          />
                        </div>
                        <div className="w-1/2">
                          <Input
                            placeholder="content"
                            value={currentMetaTag.content}
                            onChange={(e) => setCurrentMetaTag({ ...currentMetaTag, content: e.target.value })}
                          />
                        </div>
                      </div>

                      <Button type="button" onClick={addMetaTag}>
                        Añadir
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Presets</h3>
                      <ScrollArea className="whitespace-nowrap pb-2">
                        <div className="flex gap-2 pb-1">
                          {COMMON_META_TAGS.map((preset) => (
                            <Button
                              key={preset.id}
                              variant="outline"
                              size="sm"
                              onClick={() => applyMetaTagPreset(preset)}
                            >
                              {preset.name}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="border rounded-md">
                      <ScrollArea className="h-[240px]">
                        <div className="p-4 space-y-2">
                          {metaTags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 border rounded-md bg-muted/50"
                            >
                              <div className="flex-1 flex items-center gap-2">
                                <Badge
                                  variant={
                                    tag.type === "seo"
                                      ? "default"
                                      : tag.type === "social"
                                        ? "secondary"
                                        : tag.type === "mobile"
                                          ? "outline"
                                          : "destructive"
                                  }
                                >
                                  {tag.type}
                                </Badge>
                                <div className="font-mono text-xs">
                                  {tag.property
                                    ? `<meta property="${tag.property}" content="${tag.content}" />`
                                    : `<meta name="${tag.name}" content="${tag.content}" />`}
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeMetaTag(index)}>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                          {metaTags.length === 0 && (
                            <p className="text-center py-4 text-muted-foreground">
                              No hay meta etiquetas. Añada una o utilice un preset.
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    <Button onClick={applyMetaTagsToTemplate} disabled={metaTags.length === 0}>
                      Aplicar al Template
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Selector de fuentes */}
              <TabsContent value="fonts">
                <Card className="border-0 rounded-none">
                  <CardHeader>
                    <CardTitle>Fuentes de Google</CardTitle>
                    <CardDescription>Explore y aplique fuentes de Google a su template</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Buscar fuentes..."
                        value={fontSearchQuery}
                        onChange={(e) => setFontSearchQuery(e.target.value)}
                        className="flex-1"
                      />

                      <Select value={fontCategory} onValueChange={setFontCategory}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="sans-serif">Sans Serif</SelectItem>
                          <SelectItem value="serif">Serif</SelectItem>
                          <SelectItem value="display">Display</SelectItem>
                          <SelectItem value="handwriting">Handwriting</SelectItem>
                          <SelectItem value="monospace">Monospace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border rounded-md">
                      <ScrollArea className="h-[240px]">
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {filteredFonts.slice(0, 30).map((font) => (
                            <div
                              key={font.family}
                              className={`p-2 border rounded-md cursor-pointer hover:bg-accent/50 ${selectedFont?.family === font.family ? "bg-accent/50" : ""}`}
                              onClick={() => setSelectedFont(font)}
                            >
                              <div className="font-medium">{font.family}</div>
                              <div className="text-xs text-muted-foreground">{font.category}</div>
                              <div
                                className="mt-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                                style={{
                                  fontFamily: `'${font.family}', ${font.category}`,
                                  fontWeight: font.variants.includes("700") ? 700 : 400,
                                }}
                              >
                                {fontPreviewText}
                              </div>
                            </div>
                          ))}

                          {filteredFonts.length === 0 && (
                            <p className="col-span-full text-center py-4 text-muted-foreground">
                              No se encontraron fuentes. Intente con otra búsqueda.
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    {selectedFont && (
                      <div className="space-y-4 border rounded-md p-4">
                        <h3 className="font-medium">{selectedFont.family}</h3>

                        <div className="space-y-2">
                          <Label htmlFor="font-variant">Variante</Label>
                          <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                            <SelectTrigger id="font-variant">
                              <SelectValue placeholder="Seleccione una variante" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedFont.variants.map((variant) => (
                                <SelectItem key={variant} value={variant}>
                                  {variant === "regular"
                                    ? "Normal 400"
                                    : variant === "italic"
                                      ? "Italic 400"
                                      : variant === "700"
                                        ? "Bold 700"
                                        : variant === "700italic"
                                          ? "Bold 700 Italic"
                                          : variant}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="font-preview">Vista previa</Label>
                          <Input
                            id="font-preview"
                            value={fontPreviewText}
                            onChange={(e) => setFontPreviewText(e.target.value)}
                            placeholder="Texto de vista previa"
                          />

                          <div
                            className="mt-2 p-4 border rounded-md"
                            style={{
                              fontFamily: `'${selectedFont.family}', ${selectedFont.category}`,
                              fontWeight: selectedVariant.includes("700") ? 700 : 400,
                              fontStyle: selectedVariant.includes("italic") ? "italic" : "normal",
                            }}
                          >
                            {fontPreviewText}
                          </div>
                        </div>

                        <Button onClick={applyFontToTemplate}>Aplicar al Template</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Selector de colores */}
              <TabsContent value="colors">
                <Card className="border-0 rounded-none">
                  <CardHeader>
                    <CardTitle>Colores</CardTitle>
                    <CardDescription>Seleccione colores para su template</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <RadioGroup
                          defaultValue="hex"
                          value={colorFormat}
                          onValueChange={(value) => setColorFormat(value as "hex" | "rgb")}
                          className="flex items-center gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hex" id="hex" />
                            <Label htmlFor="hex">Hexadecimal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rgb" id="rgb" />
                            <Label htmlFor="rgb">RGB</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-1/2">
                          <div
                            className="w-full h-40 rounded-md border"
                            style={{ backgroundColor: currentColor }}
                          ></div>
                        </div>

                        <div className="w-full sm:w-1/2 space-y-4">
                          <div>
                            <Label htmlFor="color-picker">Seleccionar color</Label>
                            <Input
                              id="color-picker"
                              type="color"
                              value={currentColor}
                              onChange={(e) => setCurrentColor(e.target.value)}
                              className="w-full h-10"
                            />
                          </div>

                          <div>
                            <Label htmlFor="color-value">Valor</Label>
                            <Input
                              id="color-value"
                              value={
                                colorFormat === "hex"
                                  ? currentColor
                                  : `rgb(${Number.parseInt(currentColor.slice(1, 3), 16)}, ${Number.parseInt(currentColor.slice(3, 5), 16)}, ${Number.parseInt(currentColor.slice(5, 7), 16)})`
                              }
                              readOnly
                              onClick={(e) => {
                                ;(e.target as HTMLInputElement).select()
                                navigator.clipboard.writeText((e.target as HTMLInputElement).value)
                                toast({
                                  title: "Copiado al portapapeles",
                                  description: "El valor del color ha sido copiado",
                                })
                              }}
                            />
                          </div>

                          <div>
                            <Label htmlFor="color-name">Nombre (opcional)</Label>
                            <Input
                              id="color-name"
                              value={colorName}
                              onChange={(e) => setColorName(e.target.value)}
                              placeholder="Mi color personalizado"
                            />
                          </div>

                          <Button onClick={saveCurrentColor}>Guardar Color</Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Colores Guardados</h3>

                      <div className="border rounded-md">
                        <ScrollArea className="h-[200px]">
                          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {savedColors.map((color) => (
                              <div key={color.id} className="border rounded-md overflow-hidden">
                                <div className="h-16 w-full" style={{ backgroundColor: color.value }}></div>
                                <div className="p-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-sm">{color.name}</span>
                                    <Button variant="ghost" size="icon" onClick={() => deleteColor(color.id)}>
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="text-xs font-mono">{color.value}</div>

                                  <div className="mt-2 flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-xs h-6 px-2 flex-1"
                                      onClick={() => applyColorToTemplate(color.value, "body")}
                                    >
                                      Body
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-xs h-6 px-2 flex-1"
                                      onClick={() => applyColorToTemplate(color.value, "a")}
                                    >
                                      Links
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {savedColors.length === 0 && (
                              <p className="col-span-full text-center py-4 text-muted-foreground">
                                No hay colores guardados.
                              </p>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Generador de gradientes */}
              <TabsContent value="gradients">
                <Card className="border-0 rounded-none">
                  <CardHeader>
                    <CardTitle>Gradientes</CardTitle>
                    <CardDescription>Cree gradientes modernos para su template</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <RadioGroup
                          defaultValue="linear"
                          value={gradientType}
                          onValueChange={(value) => setGradientType(value as "linear" | "radial")}
                          className="flex items-center gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="linear" id="linear" />
                            <Label htmlFor="linear">Lineal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="radial" id="radial" />
                            <Label htmlFor="radial">Radial</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {gradientType === "linear" && (
                        <div className="space-y-2">
                          <Label htmlFor="angle">Ángulo: {gradientAngle}°</Label>
                          <Slider
                            id="angle"
                            min={0}
                            max={360}
                            step={1}
                            value={[gradientAngle]}
                            onValueChange={(values) => setGradientAngle(values[0])}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Colores</Label>
                        <div className="flex flex-wrap gap-2">
                          {gradientColors.map((color, index) => (
                            <div key={index} className="space-y-1">
                              <Input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const newColors = [...gradientColors]
                                  newColors[index] = e.target.value
                                  setGradientColors(newColors)
                                }}
                                className="w-14 h-10 p-1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  if (gradientColors.length > 2) {
                                    setGradientColors(gradientColors.filter((_, i) => i !== index))
                                  }
                                }}
                                disabled={gradientColors.length <= 2}
                              >
                                <TrashIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}

                          <Button
                            variant="outline"
                            className="h-10 w-10"
                            onClick={() => setGradientColors([...gradientColors, "#ffffff"])}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Vista previa</Label>
                        <div
                          className="w-full h-40 rounded-md border"
                          style={{ background: getCurrentGradient() }}
                        ></div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gradient-code">Código CSS</Label>
                        <Input
                          id="gradient-code"
                          value={getCurrentGradient()}
                          readOnly
                          onClick={(e) => {
                            ;(e.target as HTMLInputElement).select()
                            navigator.clipboard.writeText((e.target as HTMLInputElement).value)
                            toast({
                              title: "Copiado al portapapeles",
                              description: "El código del gradiente ha sido copiado",
                            })
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gradient-name">Nombre (opcional)</Label>
                        <Input
                          id="gradient-name"
                          value={gradientName}
                          onChange={(e) => setGradientName(e.target.value)}
                          placeholder="Mi gradiente personalizado"
                        />
                      </div>

                      <Button onClick={saveCurrentGradient}>Guardar Gradiente</Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Gradientes Guardados</h3>

                      <div className="border rounded-md">
                        <ScrollArea className="h-[200px]">
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {savedGradients.map((gradient) => {
                              const gradientCSS =
                                gradient.type === "linear"
                                  ? `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(", ")})`
                                  : `radial-gradient(circle, ${gradient.colors.join(", ")})`

                              return (
                                <div key={gradient.id} className="border rounded-md overflow-hidden">
                                  <div className="h-24 w-full" style={{ background: gradientCSS }}></div>
                                  <div className="p-2">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-sm">{gradient.name}</span>
                                      <Button variant="ghost" size="icon" onClick={() => deleteGradient(gradient.id)}>
                                        <TrashIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="text-xs font-mono truncate">{gradientCSS}</div>

                                    <div className="mt-2 flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs h-6 px-2 flex-1"
                                        onClick={() => applyGradientToTemplate(gradientCSS, "body")}
                                      >
                                        Body
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs h-6 px-2 flex-1"
                                        onClick={() => applyGradientToTemplate(gradientCSS, "header")}
                                      >
                                        Header
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}

                            {savedGradients.length === 0 && (
                              <p className="col-span-full text-center py-4 text-muted-foreground">
                                No hay gradientes guardados.
                              </p>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Vista previa */}
          <div className={`${previewMode === "full" ? "w-full" : "w-full lg:w-1/2"} h-full`}>
            <Card className="h-full flex flex-col">
              <CardHeader className="py-2 px-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewDevice("desktop")}
                      className={previewDevice === "desktop" ? "bg-accent" : ""}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewDevice("tablet")}
                      className={previewDevice === "tablet" ? "bg-accent" : ""}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewDevice("mobile")}
                      className={previewDevice === "mobile" ? "bg-accent" : ""}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewMode(previewMode === "split" ? "full" : "split")}
                    >
                      {previewMode === "split" ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 border-t">
                <div
                  className={`w-full h-full bg-background ${
                    previewDevice === "mobile"
                      ? "max-w-[375px]"
                      : previewDevice === "tablet"
                        ? "max-w-[768px]"
                        : "w-full"
                  } mx-auto`}
                >
                  <iframe ref={previewRef} className="w-full h-full border-0" title="Vista previa"></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>Blogspot Studio - Herramienta avanzada para crear y editar templates de Blogger</p>
        </div>
      </div>
    </div>
  )
}
