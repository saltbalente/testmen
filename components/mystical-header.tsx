"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { WandSparklesIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

export default function MysticalHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      className="relative mb-12 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 blur-3xl" />
      </div>

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M50 5 L50 95 M5 50 L95 50 M26 26 L74 74 M26 74 L74 26" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>

      <div className="relative">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight py-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">EBELAG</span>{" "}
          <motion.span
            className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600"
            animate={{
              opacity: [1, 0.8, 1],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            Esotéricos
          </motion.span>
        </h1>

        <motion.div className="absolute -top-6 -right-6 md:top-0 md:right-0" whileHover={{ scale: 1.1, rotate: 5 }}>
          <WandSparklesIcon className="h-8 w-8 text-purple-500" />
          <motion.div
            className="absolute inset-0 bg-purple-500 rounded-full blur-md -z-10 opacity-20"
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </motion.div>
      </div>

      <p className="text-muted-foreground max-w-2xl mx-auto text-center mt-4 relative z-10">
        Crea prompts personalizados para diseños de secciones web vanguardistas y esotéricas basados en tus
        preferencias. Genera código optimizado y dividido en partes manejables.
      </p>

      <motion.button
        className="absolute top-0 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <SunIcon className="h-5 w-5 text-amber-400" />
        ) : (
          <MoonIcon className="h-5 w-5 text-purple-600" />
        )}
      </motion.button>
    </motion.div>
  )
}
