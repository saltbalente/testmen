import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { type, style, sections, additionalInstructions } = await request.json()

    // Construir el prompt para la API de DeepSeek
    const prompt = `
Genera una estructura HTML detallada para una landing page esotérica con las siguientes características:

- Tipo de contenido: ${type} (${getTypeDescription(type)})
- Estilo visual: ${style} (${getStyleDescription(style)})
- Secciones a incluir: ${sections.join(", ")}
- Instrucciones adicionales: ${additionalInstructions || "Ninguna"}

La estructura debe incluir comentarios detallados que expliquen cada sección y elemento, con instrucciones específicas sobre:
1. Qué tipo de contenido debe ir en cada sección
2. Qué elementos visuales se recomiendan
3. Qué colores y estilos serían apropiados
4. Qué tipo de imágenes o iconos se deberían usar

Formato deseado:
\`\`\`html
<!-- Comentario explicativo sobre la sección -->
<section class="nombre-seccion">
  <!-- Explicación del elemento -->
  <elemento atributo="valor">Contenido sugerido</elemento>
</section>
\`\`\`

Asegúrate de que todo el contenido esté relacionado con temas esotéricos, brujería, hechicería, tarot, astrología, etc. según el tipo seleccionado.
`

    // Aquí iría la llamada a la API de DeepSeek
    // Por ahora, generamos una estructura de ejemplo basada en los parámetros
    const structure = generateExampleStructure(type, style, sections)

    return NextResponse.json({ structure })
  } catch (error) {
    console.error("Error generating template structure:", error)
    return NextResponse.json({ error: "Failed to generate template structure" }, { status: 500 })
  }
}

function getTypeDescription(type: string): string {
  const descriptions = {
    tarot: "Lectura de cartas, interpretaciones y servicios de tarot",
    astrologia: "Horóscopos, cartas astrales y predicciones",
    hechizos: "Rituales, hechizos de amor, protección y prosperidad",
    videncia: "Servicios de clarividencia, médium y contacto espiritual",
    magia: "Magia blanca, negra, rituales y pociones",
    esoterismo: "Conocimiento esotérico general, servicios variados",
  }
  return descriptions[type] || type
}

function getStyleDescription(style: string): string {
  const descriptions = {
    dark: "Tonos oscuros, elementos místicos, ambiente misterioso",
    celestial: "Estrellas, lunas, elementos cósmicos y colores azules/púrpuras",
    witchy: "Estética de brujería, calderos, velas, hierbas",
    elegant: "Diseño sofisticado, minimalista con toques místicos",
    ancient: "Estilo antiguo, pergaminos, símbolos ancestrales",
  }
  return descriptions[style] || style
}

function generateExampleStructure(type: string, style: string, sections: string[]): string {
  let structure = `<!-- Estructura generada para landing page de ${getTypeDescription(type)} con estilo ${getStyleDescription(style)} -->\n\n`

  if (sections.includes("hero")) {
    structure += `<!-- Sección Hero: Primera impresión visual impactante con llamada a la acción -->
<section class="hero ${style}-theme">
  <!-- Fondo místico con elementos visuales relacionados con ${type} -->
  <div class="hero-background">
    <!-- Usar imágenes de ${getHeroBackgroundSuggestion(type, style)} -->
  </div>
  
  <!-- Contenedor principal con texto y CTA -->
  <div class="hero-content">
    <!-- Título principal - usar fuentes místicas/elegantes -->
    <h1 class="hero-title">Descubre los Secretos del ${getTypeTitle(type)}</h1>
    
    <!-- Subtítulo que explica brevemente los servicios -->
    <p class="hero-subtitle">Conecta con las energías místicas y transforma tu destino con nuestros servicios de ${getTypeDescription(type)}</p>
    
    <!-- Botón de llamada a la acción principal -->
    <button class="cta-button ${style}-button">
      ${getCtaText(type)}
    </button>
    
    <!-- Elemento visual decorativo relacionado con ${type} -->
    <div class="mystic-element">
      <!-- Incluir ${getMysticElement(type)} animado o con efectos hover -->
    </div>
  </div>
</section>\n\n`
  }

  if (sections.includes("services")) {
    structure += `<!-- Sección de Servicios: Mostrar los diferentes servicios esotéricos ofrecidos -->
<section class="services ${style}-services-bg">
  <!-- Título de sección con elemento decorativo -->
  <div class="section-header">
    <h2 class="section-title">Nuestros Servicios Místicos</h2>
    <div class="title-decoration">
      <!-- Decoración con ${getDecorativeElement(type, style)} -->
    </div>
  </div>
  
  <!-- Contenedor de tarjetas de servicios -->
  <div class="services-grid">
    ${getServiceCards(type, style)}
  </div>
</section>\n\n`
  }

  if (sections.includes("about")) {
    structure += `<!-- Sección Sobre Nosotros: Historia y credibilidad -->
<section class="about-us ${style}-about-bg">
  <!-- Contenedor con imagen y texto -->
  <div class="about-container">
    <!-- Imagen del practicante o espacio místico -->
    <div class="about-image">
      <!-- Usar imagen de ${getAboutImageSuggestion(type, style)} -->
    </div>
    
    <!-- Contenido textual -->
    <div class="about-content">
      <h2 class="about-title">Nuestra Sabiduría Ancestral</h2>
      <p class="about-description">
        Con más de 20 años de experiencia en las artes místicas del ${type}, 
        nuestros practicantes han sido iniciados en los conocimientos ancestrales 
        transmitidos a través de generaciones. Cada ritual y consulta se realiza 
        con la máxima dedicación y respeto por las fuerzas esotéricas.
      </p>
      
      <!-- Elementos de credibilidad -->
      <div class="credentials">
        <div class="credential-item">
          <!-- Icono de ${getCredentialIcon(type, 1)} -->
          <span>Certificados en Artes Místicas</span>
        </div>
        <div class="credential-item">
          <!-- Icono de ${getCredentialIcon(type, 2)} -->
          <span>Miembros de la Orden Esotérica Internacional</span>
        </div>
      </div>
    </div>
  </div>
</section>\n\n`
  }

  if (sections.includes("testimonials")) {
    structure += `<!-- Sección de Testimonios: Experiencias de clientes satisfechos -->
<section class="testimonials ${style}-testimonials-bg">
  <h2 class="testimonials-title">Voces del Más Allá</h2>
  <p class="testimonials-subtitle">Descubre cómo nuestros servicios han transformado vidas</p>
  
  <!-- Carrusel de testimonios -->
  <div class="testimonials-slider">
    <!-- Testimonio 1 -->
    <div class="testimonial-card">
      <!-- Imagen de cliente con aura o efecto místico -->
      <div class="client-image">
        <!-- Usar foto con efecto de ${style} -->
      </div>
      <div class="testimonial-content">
        <p class="testimonial-text">
          "Después de mi consulta de ${type}, mi vida cambió completamente. 
          Las energías negativas desaparecieron y finalmente encontré mi camino espiritual."
        </p>
        <p class="client-name">María Estrella</p>
        <div class="mystic-rating">
          <!-- 5 símbolos de ${getMysticRatingSymbol(type)} -->
        </div>
      </div>
    </div>
    
    <!-- Testimonio 2 -->
    <div class="testimonial-card">
      <!-- Estructura similar al testimonio 1 -->
      <!-- Personalizar con otra historia relacionada con ${type} -->
    </div>
    
    <!-- Testimonio 3 -->
    <div class="testimonial-card">
      <!-- Estructura similar al testimonio 1 -->
      <!-- Personalizar con otra historia relacionada con ${type} -->
    </div>
  </div>
  
  <!-- Controles del carrusel con elementos místicos -->
  <div class="slider-controls">
    <!-- Botones con iconos de ${getSliderControlIcons(type, style)} -->
  </div>
</section>\n\n`
  }

  if (sections.includes("gallery")) {
    structure += `<!-- Sección de Galería: Imágenes de rituales, espacios o elementos místicos -->
<section class="mystic-gallery ${style}-gallery-bg">
  <h2 class="gallery-title">Nuestro Santuario Místico</h2>
  
  <!-- Galería de imágenes con efecto hover -->
  <div class="gallery-grid">
    <!-- Imagen 1 -->
    <div class="gallery-item">
      <!-- Imagen de ${getGalleryImageSuggestion(type, style, 1)} -->
      <div class="image-overlay">
        <span class="image-title">${getGalleryImageTitle(type, 1)}</span>
      </div>
    </div>
    
    <!-- Imagen 2 -->
    <div class="gallery-item">
      <!-- Imagen de ${getGalleryImageSuggestion(type, style, 2)} -->
      <div class="image-overlay">
        <span class="image-title">${getGalleryImageTitle(type, 2)}</span>
      </div>
    </div>
    
    <!-- Imagen 3 -->
    <div class="gallery-item">
      <!-- Imagen de ${getGalleryImageSuggestion(type, style, 3)} -->
      <div class="image-overlay">
        <span class="image-title">${getGalleryImageTitle(type, 3)}</span>
      </div>
    </div>
    
    <!-- Imagen 4 -->
    <div class="gallery-item">
      <!-- Imagen de ${getGalleryImageSuggestion(type, style, 4)} -->
      <div class="image-overlay">
        <span class="image-title">${getGalleryImageTitle(type, 4)}</span>
      </div>
    </div>
  </div>
</section>\n\n`
  }

  if (sections.includes("pricing")) {
    structure += `<!-- Sección de Precios: Paquetes de servicios esotéricos -->
<section class="pricing ${style}-pricing-bg">
  <h2 class="pricing-title">Nuestros Rituales y Consultas</h2>
  <p class="pricing-subtitle">Elige el camino místico que mejor se adapte a tus necesidades</p>
  
  <!-- Contenedor de tarjetas de precios -->
  <div class="pricing-cards">
    <!-- Plan Básico -->
    <div class="price-card ${style}-basic">
      <!-- Símbolo místico para el plan básico -->
      <div class="plan-symbol">
        <!-- Usar símbolo de ${getPlanSymbol(type, "basic")} -->
      </div>
      
      <h3 class="plan-name">Iniciación</h3>
      <p class="plan-price">$49</p>
      <ul class="plan-features">
        <li>${getPlanFeature(type, "basic", 1)}</li>
        <li>${getPlanFeature(type, "basic", 2)}</li>
        <li>${getPlanFeature(type, "basic", 3)}</li>
      </ul>
      <button class="plan-button basic-button">Reservar Ahora</button>
    </div>
    
    <!-- Plan Intermedio -->
    <div class="price-card ${style}-standard">
      <!-- Estructura similar al plan básico -->
      <!-- Personalizar con servicios intermedios de ${type} -->
      <div class="plan-symbol">
        <!-- Usar símbolo de ${getPlanSymbol(type, "standard")} -->
      </div>
      
      <h3 class="plan-name">Transformación</h3>
      <p class="plan-price">$99</p>
      <ul class="plan-features">
        <li>${getPlanFeature(type, "standard", 1)}</li>
        <li>${getPlanFeature(type, "standard", 2)}</li>
        <li>${getPlanFeature(type, "standard", 3)}</li>
        <li>${getPlanFeature(type, "standard", 4)}</li>
      </ul>
      <button class="plan-button standard-button">Reservar Ahora</button>
    </div>
    
    <!-- Plan Premium -->
    <div class="price-card ${style}-premium featured-card">
      <!-- Estructura similar al plan básico -->
      <!-- Personalizar con servicios premium de ${type} -->
      <div class="plan-symbol">
        <!-- Usar símbolo de ${getPlanSymbol(type, "premium")} -->
      </div>
      
      <h3 class="plan-name">Iluminación</h3>
      <p class="plan-price">$199</p>
      <ul class="plan-features">
        <li>${getPlanFeature(type, "premium", 1)}</li>
        <li>${getPlanFeature(type, "premium", 2)}</li>
        <li>${getPlanFeature(type, "premium", 3)}</li>
        <li>${getPlanFeature(type, "premium", 4)}</li>
        <li>${getPlanFeature(type, "premium", 5)}</li>
      </ul>
      <button class="plan-button premium-button">Reservar Ahora</button>
    </div>
  </div>
</section>\n\n`
  }

  if (sections.includes("cta")) {
    structure += `<!-- Sección de Llamada a la Acción: Invitación final para contactar -->
<section class="cta ${style}-cta-bg">
  <!-- Fondo con elementos místicos animados -->
  <div class="cta-background">
    <!-- Usar elementos visuales de ${getCtaBackgroundElements(type, style)} -->
  </div>
  
  <!-- Contenido de la CTA -->
  <div class="cta-content">
    <h2 class="cta-title">Descubre Tu Destino Hoy</h2>
    <p class="cta-description">
      Las estrellas se están alineando. Es el momento perfecto para 
      ${getCtaDescription(type)}
    </p>
    
    <!-- Formulario simple de contacto -->
    <form class="cta-form">
      <input type="text" placeholder="Tu nombre" class="cta-input" required>
      <input type="email" placeholder="Tu email" class="cta-input" required>
      <button type="submit" class="cta-submit-button ${style}-button">
        ${getCtaButtonText(type)}
      </button>
    </form>
    
    <!-- Elemento místico decorativo -->
    <div class="cta-decoration">
      <!-- Usar ${getCtaDecoration(type, style)} -->
    </div>
  </div>
</section>\n\n`
  }

  if (sections.includes("contact")) {
    structure += `<!-- Sección de Contacto: Información detallada de contacto -->
<section class="contact ${style}-contact-bg">
  <h2 class="contact-title">Comunícate con el Más Allá</h2>
  
  <!-- Contenedor de información de contacto y formulario -->
  <div class="contact-container">
    <!-- Información de contacto -->
    <div class="contact-info">
      <div class="contact-method">
        <!-- Icono místico para ubicación -->
        <div class="contact-icon">
          <!-- Usar icono de ${getContactIcon(type, "location")} -->
        </div>
        <div class="contact-text">
          <h3>Nuestro Santuario</h3>
          <p>Calle de los Misterios #777, Barrio Esotérico</p>
        </div>
      </div>
      
      <div class="contact-method">
        <!-- Icono místico para teléfono -->
        <div class="contact-icon">
          <!-- Usar icono de ${getContactIcon(type, "phone")} -->
        </div>
        <div class="contact-text">
          <h3>Línea Espiritual</h3>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      
      <div class="contact-method">
        <!-- Icono místico para email -->
        <div class="contact-icon">
          <!-- Usar icono de ${getContactIcon(type, "email")} -->
        </div>
        <div class="contact-text">
          <h3>Mensajes Astrales</h3>
          <p>consultas@${type}mistico.com</p>
        </div>
      </div>
      
      <!-- Horario de atención -->
      <div class="opening-hours">
        <h3>Horarios Místicos</h3>
        <p>Lunes a Viernes: 10:00 - 20:00</p>
        <p>Sábados: 12:00 - 22:00</p>
        <p>Domingos: Solo con cita previa</p>
        <p class="special-note">*Las consultas durante luna llena tienen un poder especial</p>
      </div>
    </div>
    
    <!-- Formulario de contacto completo -->
    <form class="contact-form">
      <div class="form-group">
        <label for="name">Tu Nombre</label>
        <input type="text" id="name" name="name" required>
      </div>
      
      <div class="form-group">
        <label for="email">Tu Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      
      <div class="form-group">
        <label for="phone">Tu Teléfono</label>
        <input type="tel" id="phone" name="phone">
      </div>
      
      <div class="form-group">
        <label for="service">Servicio de Interés</label>
        <select id="service" name="service">
          ${getServiceOptions(type)}
        </select>
      </div>
      
      <div class="form-group">
        <label for="message">Tu Mensaje</label>
        <textarea id="message" name="message" rows="4"></textarea>
      </div>
      
      <div class="form-group consent">
        <input type="checkbox" id="consent" name="consent" required>
        <label for="consent">Acepto ser contactado por fuerzas místicas</label>
      </div>
      
      <button type="submit" class="submit-button ${style}-button">Enviar al Universo</button>
    </form>
  </div>
  
  <!-- Mapa o imagen del local -->
  <div class="location-map">
    <!-- Usar mapa estilizado con elementos de ${style} -->
    <!-- Alternativamente, usar imagen del local con efectos místicos -->
  </div>
</section>\n\n`
  }

  structure += `<!-- Footer: Enlaces y créditos -->
<footer class="mystic-footer ${style}-footer">
  <!-- Logo y enlaces rápidos -->
  <div class="footer-content">
    <div class="footer-logo">
      <!-- Logo místico con elementos de ${type} -->
      <img src="logo-${style}.png" alt="Logo Místico" class="footer-logo-img">
      <span class="footer-brand">Místico ${getTypeTitle(type)}</span>
    </div>
    
    <!-- Enlaces rápidos -->
    <div class="footer-links">
      <div class="footer-column">
        <h4>Servicios</h4>
        <ul>
          ${getFooterServiceLinks(type)}
        </ul>
      </div>
      
      <div class="footer-column">
        <h4>Información</h4>
        <ul>
          <li><a href="#">Sobre Nosotros</a></li>
          <li><a href="#">Blog Místico</a></li>
          <li><a href="#">Testimonios</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>
      
      <div class="footer-column">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Términos y Condiciones</a></li>
          <li><a href="#">Política de Privacidad</a></li>
          <li><a href="#">Aviso Legal</a></li>
        </ul>
      </div>
    </div>
    
    <!-- Redes sociales con iconos místicos -->
    <div class="social-links">
      <h4>Síguenos en el Plano Astral</h4>
      <div class="social-icons">
        <!-- Iconos de redes sociales con elementos de ${style} -->
        <a href="#" class="social-icon facebook-icon"><!-- Icono de Facebook --></a>
        <a href="#" class="social-icon instagram-icon"><!-- Icono de Instagram --></a>
        <a href="#" class="social-icon twitter-icon"><!-- Icono de Twitter --></a>
        <a href="#" class="social-icon tiktok-icon"><!-- Icono de TikTok --></a>
      </div>
    </div>
  </div>
  
  <!-- Línea separadora con elementos místicos -->
  <div class="footer-divider">
    <!-- Usar elementos decorativos de ${getFooterDivider(type, style)} -->
  </div>
  
  <!-- Copyright y créditos -->
  <div class="footer-bottom">
    <p class="copyright">© ${new Date().getFullYear()} Místico ${getTypeTitle(type)}. Todos los derechos reservados en este plano y en el astral.</p>
    <p class="mystic-note">Sitio protegido por ${getMysticProtection(type)}</p>
  </div>
</footer>
`

  return structure
}

// Funciones auxiliares para generar contenido específico según el tipo y estilo
function getTypeTitle(type: string): string {
  const titles = {
    tarot: "Tarot & Cartomancia",
    astrologia: "Astrología Cósmica",
    hechizos: "Hechizos & Rituales",
    videncia: "Videncia & Clarividencia",
    magia: "Magia & Brujería",
    esoterismo: "Esoterismo Universal",
  }
  return titles[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

function getHeroBackgroundSuggestion(type: string, style: string): string {
  if (type === "tarot") return "cartas de tarot dispersas con efectos de luz"
  if (type === "astrologia") return "cielo nocturno con constelaciones y planetas"
  if (type === "hechizos") return "velas encendidas, cristales y símbolos místicos"
  if (type === "videncia") return "bola de cristal con efectos de niebla y luz"
  if (type === "magia") return "caldero con poción brillante y símbolos arcanos"
  return "símbolos esotéricos con efectos de luz y sombra"
}

function getCtaText(type: string): string {
  if (type === "tarot") return "Consulta Tu Destino Ahora"
  if (type === "astrologia") return "Descubre Tu Carta Astral"
  if (type === "hechizos") return "Transforma Tu Realidad"
  if (type === "videncia") return "Conecta Con El Más Allá"
  if (type === "magia") return "Desata El Poder Místico"
  return "Inicia Tu Viaje Esotérico"
}

function getMysticElement(type: string): string {
  if (type === "tarot") return "carta del tarot girando"
  if (type === "astrologia") return "símbolo zodiacal brillante"
  if (type === "hechizos") return "libro de hechizos antiguo con páginas animadas"
  if (type === "videncia") return "bola de cristal con niebla interior"
  if (type === "magia") return "varita mágica con destellos"
  return "pentáculo con símbolos brillantes"
}

function getDecorativeElement(type: string, style: string): string {
  if (style === "dark") return "líneas onduladas oscuras con destellos"
  if (style === "celestial") return "estrellas y lunas"
  if (style === "witchy") return "ramas retorcidas y símbolos de protección"
  if (style === "elegant") return "líneas doradas con gemas"
  return "símbolos místicos antiguos"
}

function getServiceCards(type: string, style: string): string {
  let cards = ""

  if (type === "tarot") {
    cards = `
    <!-- Servicio 1 -->
    <div class="service-card">
      <!-- Icono de cartas de tarot -->
      <div class="service-icon">
        <!-- Usar icono de cartas de tarot -->
      </div>
      <h3 class="service-title">Lectura de Tarot Completa</h3>
      <p class="service-description">
        Descubre los misterios de tu pasado, presente y futuro a través 
        de una lectura completa de 78 cartas.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>
    
    <!-- Servicio 2 -->
    <div class="service-card">
      <!-- Icono de tirada en cruz -->
      <div class="service-icon">
        <!-- Usar icono de tirada en cruz -->
      </div>
      <h3 class="service-title">Tirada Celta</h3>
      <p class="service-description">
        La tirada en cruz celta revela aspectos ocultos de tu situación 
        actual y las influencias que te rodean.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>
    
    <!-- Servicio 3 -->
    <div class="service-card">
      <!-- Icono de cartas de amor -->
      <div class="service-icon">
        <!-- Usar icono de corazón con cartas -->
      </div>
      <h3 class="service-title">Tarot del Amor</h3>
      <p class="service-description">
        Consulta especializada para resolver dudas amorosas, compatibilidad 
        y futuro de tus relaciones.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>`
  } else if (type === "astrologia") {
    cards = `
    <!-- Servicio 1 -->
    <div class="service-card">
      <!-- Icono de carta astral -->
      <div class="service-icon">
        <!-- Usar icono de carta astral -->
      </div>
      <h3 class="service-title">Carta Astral Completa</h3>
      <p class="service-description">
        Análisis detallado de tu carta natal revelando tu personalidad, 
        talentos y desafíos de vida.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>
    
    <!-- Servicio 2 -->
    <div class="service-card">
      <!-- Icono de compatibilidad -->
      <div class="service-icon">
        <!-- Usar icono de dos cartas astrales conectadas -->
      </div>
      <h3 class="service-title">Sinastría Amorosa</h3>
      <p class="service-description">
        Descubre la compatibilidad astral con tu pareja y los aspectos 
        que fortalecen o desafían su relación.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>
    
    <!-- Servicio 3 -->
    <div class="service-card">
      <!-- Icono de predicción -->
      <div class="service-icon">
        <!-- Usar icono de tránsitos planetarios -->
      </div>
      <h3 class="service-title">Predicciones Anuales</h3>
      <p class="service-description">
        Análisis de los tránsitos planetarios del año y cómo 
        influirán en las diferentes áreas de tu vida.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>`
  } else {
    // Servicios genéricos para otros tipos
    cards = `
    <!-- Servicio 1 -->
    <div class="service-card">
      <div class="service-icon">
        <!-- Usar icono relacionado con ${type} -->
      </div>
      <h3 class="service-title">Consulta Básica</h3>
      <p class="service-description">
        Sesión introductoria para conocer los misterios del ${type} 
        y cómo pueden transformar tu vida.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>
    
    <!-- Servicio 2 -->
    <div class="service-card">
      <div class="service-icon">
        <!-- Usar icono relacionado con ${type} avanzado -->
      </div>
      <h3 class="service-title">Ritual Personalizado</h3>
      <p class="service-description">
        Ritual diseñado específicamente para tus necesidades, 
        utilizando técnicas ancestrales de ${type}.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>
    
    <!-- Servicio 3 -->
    <div class="service-card">
      <div class="service-icon">
        <!-- Usar icono de enseñanza -->
      </div>
      <h3 class="service-title">Iniciación y Aprendizaje</h3>
      <p class="service-description">
        Aprende los secretos del ${type} con nuestros maestros 
        y comienza tu propio camino esotérico.
      </p>
      <a href="#" class="service-link">Saber más</a>
    </div>`
  }

  return cards
}

function getAboutImageSuggestion(type: string, style: string): string {
  if (type === "tarot") return "tarotista en su consulta con cartas antiguas"
  if (type === "astrologia") return "astrólogo estudiando cartas astrales"
  if (type === "hechizos") return "practicante realizando un ritual con velas y hierbas"
  if (type === "videncia") return "vidente con las manos sobre una bola de cristal"
  if (type === "magia") return "brujo/a con libro de hechizos y caldero"
  return "maestro esotérico en su espacio sagrado"
}

function getCredentialIcon(type: string, num: number): string {
  if (num === 1) {
    if (type === "tarot") return "pergamino con sello"
    if (type === "astrologia") return "medalla con símbolo zodiacal"
    return "certificado con símbolos místicos"
  } else {
    if (type === "tarot") return "sello de la asociación de tarotistas"
    if (type === "astrologia") return "emblema de la federación astrológica"
    return "símbolo de la orden esotérica"
  }
}

function getMysticRatingSymbol(type: string): string {
  if (type === "tarot") return "cartas de tarot"
  if (type === "astrologia") return "estrellas"
  if (type === "hechizos") return "velas"
  if (type === "videncia") return "ojos místicos"
  if (type === "magia") return "calderos"
  return "pentagramas"
}

function getSliderControlIcons(type: string, style: string): string {
  if (style === "dark") return "flechas con efecto de humo"
  if (style === "celestial") return "lunas creciente y menguante"
  if (style === "witchy") return "escobas apuntando a izquierda y derecha"
  return "manos señalando con efectos místicos"
}

function getGalleryImageSuggestion(type: string, style: string, num: number): string {
  if (type === "tarot") {
    if (num === 1) return "mesa de lectura con cartas dispuestas"
    if (num === 2) return "detalle de cartas antiguas"
    if (num === 3) return "sesión de lectura con cliente"
    return "colección de mazos de tarot"
  } else if (type === "astrologia") {
    if (num === 1) return "observatorio con telescopio"
    if (num === 2) return "carta astral detallada"
    if (num === 3) return "consulta astrológica en proceso"
    return "mapa celeste iluminado"
  } else {
    if (num === 1) return "altar con elementos místicos"
    if (num === 2) return "ritual en proceso"
    if (num === 3) return "herramientas esotéricas"
    return "espacio sagrado de consulta"
  }
}

function getGalleryImageTitle(type: string, num: number): string {
  if (type === "tarot") {
    if (num === 1) return "Santuario de Lectura"
    if (num === 2) return "Cartas Ancestrales"
    if (num === 3) return "Revelando el Destino"
    return "Colección Mística"
  } else if (type === "astrologia") {
    if (num === 1) return "Conexión con los Astros"
    if (num === 2) return "Mapa de tu Destino"
    if (num === 3) return "Consulta Cósmica"
    return "Bóveda Celeste"
  } else {
    if (num === 1) return "Altar Sagrado"
    if (num === 2) return "Ritual de Poder"
    if (num === 3) return "Instrumentos Místicos"
    return "Templo Esotérico"
  }
}

function getPlanSymbol(type: string, level: string): string {
  if (type === "tarot") {
    if (level === "basic") return "carta El Loco"
    if (level === "standard") return "carta La Sacerdotisa"
    return "carta El Mundo"
  } else if (type === "astrologia") {
    if (level === "basic") return "luna"
    if (level === "standard") return "sol"
    return "cosmos completo"
  } else {
    if (level === "basic") return "vela simple"
    if (level === "standard") return "cristal energizado"
    return "pentáculo completo"
  }
}

function getPlanFeature(type: string, level: string, num: number): string {
  if (type === "tarot") {
    if (level === "basic") {
      if (num === 1) return "Tirada de 3 cartas"
      if (num === 2) return "Interpretación básica"
      return "Recomendaciones generales"
    } else if (level === "standard") {
      if (num === 1) return "Tirada de 10 cartas"
      if (num === 2) return "Interpretación detallada"
      if (num === 3) return "Grabación de la sesión"
      return "Seguimiento por email"
    } else {
      if (num === 1) return "Tirada completa de 78 cartas"
      if (num === 2) return "Análisis profundo de cada arcano"
      if (num === 3) return "Sesión de preguntas ilimitadas"
      if (num === 4) return "Amuleto personalizado"
      return "Seguimiento mensual por 3 meses"
    }
  } else {
    // Características genéricas para otros tipos
    if (level === "basic") {
      if (num === 1) return "Consulta básica de 30 minutos"
      if (num === 2) return "Análisis inicial"
      return "Recomendaciones generales"
    } else if (level === "standard") {
      if (num === 1) return "Consulta completa de 60 minutos"
      if (num === 2) return "Análisis detallado"
      if (num === 3) return "Ritual personalizado"
      return "Seguimiento por email"
    } else {
      if (num === 1) return "Consulta premium de 90 minutos"
      if (num === 2) return "Análisis exhaustivo"
      if (num === 3) return "Ritual avanzado con materiales incluidos"
      if (num === 4) return "Objeto de poder personalizado"
      return "Seguimiento mensual por 3 meses"
    }
  }
}

function getCtaBackgroundElements(type: string, style: string): string {
  if (style === "dark") return "niebla y destellos oscuros"
  if (style === "celestial") return "estrellas y constelaciones animadas"
  if (style === "witchy") return "velas flotantes y símbolos brillantes"
  if (style === "elegant") return "líneas doradas y gemas brillantes"
  return "símbolos místicos que aparecen y desaparecen"
}

function getCtaDescription(type: string): string {
  if (type === "tarot") return "descubrir los secretos que las cartas tienen reservados para ti."
  if (type === "astrologia") return "conocer cómo los astros influyen en tu destino y cómo aprovechar su energía."
  if (type === "hechizos") return "transformar tu realidad con rituales ancestrales adaptados a tus necesidades."
  if (type === "videncia") return "conectar con el más allá y recibir mensajes de guía espiritual."
  if (type === "magia") return "desatar el poder místico que reside en tu interior."
  return "iniciar tu viaje en el camino esotérico y descubrir tu verdadero potencial."
}

function getCtaButtonText(type: string): string {
  if (type === "tarot") return "Revelar Mi Destino"
  if (type === "astrologia") return "Consultar Los Astros"
  if (type === "hechizos") return "Iniciar Mi Transformación"
  if (type === "videncia") return "Conectar Con El Más Allá"
  if (type === "magia") return "Despertar Mi Poder"
  return "Comenzar Mi Viaje Místico"
}

function getCtaDecoration(type: string, style: string): string {
  if (type === "tarot") return "cartas de tarot flotantes"
  if (type === "astrologia") return "símbolos zodiacales girando"
  if (type === "hechizos") return "velas con llamas animadas"
  if (type === "videncia") return "bola de cristal con niebla interior"
  if (type === "magia") return "caldero con poción burbujeante"
  return "símbolos esotéricos brillantes"
}

function getContactIcon(type: string, contactType: string): string {
  if (contactType === "location") {
    if (type === "tarot") return "mapa con carta de tarot"
    if (type === "astrologia") return "mapa con símbolo zodiacal"
    return "mapa con símbolo místico"
  } else if (contactType === "phone") {
    if (type === "tarot") return "teléfono con carta de tarot"
    if (type === "astrologia") return "teléfono con estrella"
    return "teléfono con símbolo místico"
  } else {
    if (type === "tarot") return "sobre con carta de tarot"
    if (type === "astrologia") return "sobre con luna"
    return "sobre con símbolo místico"
  }
}

function getServiceOptions(type: string): string {
  if (type === "tarot") {
    return `<option value="lectura-completa">Lectura Completa</option>
            <option value="tirada-celta">Tirada Celta</option>
            <option value="tarot-amor">Tarot del Amor</option>
            <option value="tarot-trabajo">Tarot Laboral</option>`
  } else if (type === "astrologia") {
    return `<option value="carta-natal">Carta Natal</option>
            <option value="sinastria">Sinastría Amorosa</option>
            <option value="transitos">Análisis de Tránsitos</option>
            <option value="prediccion">Predicción Anual</option>`
  } else if (type === "hechizos") {
    return `<option value="amor">Hechizo de Amor</option>
            <option value="prosperidad">Ritual de Prosperidad</option>
            <option value="proteccion">Protección Energética</option>
            <option value="limpieza">Limpieza Espiritual</option>`
  } else {
    return `<option value="consulta-basica">Consulta Básica</option>
            <option value="ritual-personalizado">Ritual Personalizado</option>
            <option value="iniciacion">Iniciación y Aprendizaje</option>
            <option value="otro">Otro Servicio</option>`
  }
}

function getFooterServiceLinks(type: string): string {
  if (type === "tarot") {
    return `<li><a href="#">Lectura Completa</a></li>
            <li><a href="#">Tirada Celta</a></li>
            <li><a href="#">Tarot del Amor</a></li>
            <li><a href="#">Tarot Laboral</a></li>`
  } else if (type === "astrologia") {
    return `<li><a href="#">Carta Natal</a></li>
            <li><a href="#">Sinastría Amorosa</a></li>
            <li><a href="#">Análisis de Tránsitos</a></li>
            <li><a href="#">Predicción Anual</a></li>`
  } else if (type === "hechizos") {
    return `<li><a href="#">Hechizos de Amor</a></li>
            <li><a href="#">Rituales de Prosperidad</a></li>
            <li><a href="#">Protección Energética</a></li>
            <li><a href="#">Limpieza Espiritual</a></li>`
  } else {
    return `<li><a href="#">Consulta Básica</a></li>
            <li><a href="#">Ritual Personalizado</a></li>
            <li><a href="#">Iniciación y Aprendizaje</a></li>
            <li><a href="#">Servicios Especiales</a></li>`
  }
}

function getFooterDivider(type: string, style: string): string {
  if (style === "dark") return "línea ondulada con símbolos oscuros"
  if (style === "celestial") return "estrellas y lunas conectadas"
  if (style === "witchy") return "ramas de árbol con símbolos tallados"
  if (style === "elegant") return "línea dorada con gemas"
  return "símbolos místicos conectados"
}

function getMysticProtection(type: string): string {
  if (type === "tarot") return "el Arcano de la Justicia"
  if (type === "astrologia") return "la Conjunción Cósmica"
  if (type === "hechizos") return "el Círculo de Protección"
  if (type === "videncia") return "el Ojo que Todo lo Ve"
  if (type === "magia") return "el Sello de los Siete Poderes"
  return "el Pentáculo Sagrado"
}
