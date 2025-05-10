"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useState, useRef, useCallback, useMemo } from "react"

export interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  intensity?: "light" | "medium" | "strong" // Intensidad del efecto glass
  glowEffect?: boolean // Efecto de brillo en los bordes
  interactive?: boolean // Efectos de interacción avanzados
  parallax?: boolean // Efecto parallax al mover el mouse
  theme?: "default" | "dark" | "neon" | "frost" // Temas predefinidos
  glareEffect?: boolean // Efecto de reflejo al mover el mouse
  blurAmount?: "sm" | "md" | "lg" | "xl" // Control del nivel de blur
  borderGlow?: boolean // Borde con efecto de brillo
  premium?: boolean // Activar características premium
  premiumTier?: "silver" | "gold" | "platinum" // Niveles premium
  morphEffect?: boolean // Efecto de transformación morfológica
  audioFeedback?: boolean // Retroalimentación de audio sutil al interactuar
  customAnimation?: string // Animación CSS personalizada
  performanceMode?: boolean // Modo de alto rendimiento
  exclusiveEffects?: string[] // Efectos exclusivos para premium
}

export default function GlassCard({
  children,
  className,
  hoverEffect = true,
  intensity = "medium",
  glowEffect = false,
  interactive = false,
  parallax = false,
  theme = "default",
  glareEffect = false,
  blurAmount = "md",
  borderGlow = false,
  premium = false,
  premiumTier,
  morphEffect = false,
  audioFeedback = false,
  customAnimation,
  performanceMode = false,
  exclusiveEffects,
}: GlassCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Mapeo de intensidades a valores de opacidad
  const intensityMap = {
    light: { bg: "bg-white/5", border: "border-white/10", glow: "opacity-20" },
    medium: { bg: "bg-white/10", border: "border-white/20", glow: "opacity-40" },
    strong: { bg: "bg-white/15", border: "border-white/30", glow: "opacity-60" },
  }

  // Mapeo de temas a colores
  const themeMap = {
    default: { from: "from-purple-500", to: "to-blue-500", border: "border-white/20" },
    dark: { from: "from-slate-800", to: "to-slate-900", border: "border-slate-700/40" },
    neon: { from: "from-green-500", to: "to-cyan-500", border: "border-green-400/30" },
    frost: { from: "from-blue-300", to: "to-cyan-200", border: "border-blue-200/40" },
  }

  // Mapeo de blur
  const blurMap = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  }

  // Efecto parallax
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!parallax && !interactive && !glareEffect) return

      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left // x position within the element
      const y = e.clientY - rect.top // y position within the element

      // Normalize positions (0 to 1)
      const normalizedX = x / rect.width
      const normalizedY = y / rect.height

      setPosition({ x: normalizedX, y: normalizedY })
    },
    [parallax, interactive, glareEffect],
  )

  // Calcular transformaciones para efectos interactivos
  const transform = useMemo(() => {
    if (!interactive || !isHovered) return ""

    const rotateX = (position.y - 0.5) * -10 // -5 to 5 degrees
    const rotateY = (position.x - 0.5) * 10 // -5 to 5 degrees

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [interactive, isHovered, position])

  // Calcular posición del efecto de reflejo
  const glarePosition = useMemo(() => {
    if (!glareEffect || !isHovered) return { x: "50%", y: "50%" }

    return {
      x: `${position.x * 100}%`,
      y: `${position.y * 100}%`,
    }
  }, [glareEffect, isHovered, position])

  // Calcular desplazamiento para efecto parallax
  const parallaxOffset = useMemo(() => {
    if (!parallax || !isHovered) return { x: 0, y: 0 }

    return {
      x: (position.x - 0.5) * 20, // -10px to 10px
      y: (position.y - 0.5) * 20, // -10px to 10px
    }
  }, [parallax, isHovered, position])

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-xl border shadow-xl overflow-hidden transition-all duration-300",
        intensityMap[intensity].border,
        intensityMap[intensity].bg,
        blurMap[blurAmount],
        themeMap[theme].border,
        hoverEffect && "hover:shadow-2xl hover:scale-[1.02]",
        interactive && "transition-transform duration-200",
        glowEffect &&
          "after:absolute after:inset-0 after:-z-10 after:rounded-xl after:opacity-0 after:blur-xl after:transition-opacity hover:after:opacity-100",
        borderGlow && "ring-1 ring-white/20 hover:ring-white/40 transition-all",
        premium && "premium-card", // Clase base para tarjetas premium
        premium && premiumTier === "silver" && "premium-silver",
        premium && premiumTier === "gold" && "premium-gold",
        premium && premiumTier === "platinum" && "premium-platinum",
        premium && morphEffect && "premium-morph",
        premium && performanceMode && "high-performance",
        className,
      )}
      style={{
        transform: transform,
        transition: "transform 0.2s ease-out, box-shadow 0.3s ease-out",
        ...(premium && customAnimation && { animation: customAnimation }),
        ...(premium && {
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          WebkitPerspective: "1000",
          perspective: "1000",
          WebkitTransformStyle: "preserve-3d",
          transformStyle: "preserve-3d",
        }),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => {
        setIsHovered(true)
        // Audio feedback para usuarios premium
        if (premium && audioFeedback) {
          const audio = new Audio("/sounds/hover-premium.mp3")
          audio.volume = 0.2
          audio.play().catch(() => {})
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      data-premium={premium ? premiumTier : undefined}
      data-effects={premium && exclusiveEffects ? exclusiveEffects.join(",") : undefined}
      aria-label={premium ? `Tarjeta premium nivel ${premiumTier}` : undefined}
    >
      {/* Fondo con gradiente */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-xl bg-gradient-to-br",
          themeMap[theme].from + "/10",
          themeMap[theme].to + "/10",
          "transition-opacity duration-300",
          isHovered && "opacity-80",
        )}
      />

      {/* Efecto de reflejo */}
      {glareEffect && (
        <div
          className="absolute inset-0 -z-5 rounded-full opacity-0 bg-gradient-radial from-white/40 to-transparent pointer-events-none transition-opacity"
          style={{
            width: "150%",
            height: "150%",
            top: "-25%",
            left: "-25%",
            opacity: isHovered ? 0.15 : 0,
            transform: `translate(${glarePosition.x}, ${glarePosition.y}) translate(-50%, -50%)`,
            transition: "opacity 0.3s ease-out",
          }}
        />
      )}

      {/* Efectos exclusivos para premium */}
      {premium && exclusiveEffects && exclusiveEffects.includes("particles") && (
        <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
          <div className="premium-particles"></div>
        </div>
      )}

      {/* Efecto de borde premium */}
      {premium && (
        <div
          className={cn(
            "absolute inset-0 rounded-xl border-2 border-transparent z-5 pointer-events-none",
            premiumTier === "silver" && "premium-border-silver",
            premiumTier === "gold" && "premium-border-gold",
            premiumTier === "platinum" && "premium-border-platinum",
          )}
        />
      )}

      {/* Contenido con efecto parallax */}
      <div
        className="relative z-10"
        style={
          parallax
            ? {
                transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
                transition: isHovered ? "transform 0.1s ease-out" : "transform 0.3s ease-out",
              }
            : {}
        }
      >
        {children}
      </div>
    </div>
  )
}
