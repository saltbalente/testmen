"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Symbol = {
  id: number
  symbol: string
  x: string
  y: string
  size: string
  rotation: number
  duration: number
  delay: number
}

const esotericSymbols = [
  "✧",
  "☽",
  "☀",
  "⚹",
  "⚝",
  "♆",
  "⚸",
  "☿",
  "♃",
  "♄",
  "⚶",
  "♇",
  "⚷",
  "♅",
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
  "⚯",
  "⚳",
]

export default function FloatingSymbols() {
  const [symbols, setSymbols] = useState<Symbol[]>([])

  useEffect(() => {
    // Crear símbolos aleatorios
    const symbolCount = Math.min(Math.max(window.innerWidth / 100, 5), 20)
    const newSymbols: Symbol[] = []

    for (let i = 0; i < symbolCount; i++) {
      newSymbols.push({
        id: i,
        symbol: esotericSymbols[Math.floor(Math.random() * esotericSymbols.length)],
        x: `${Math.random() * 90 + 5}%`,
        y: `${Math.random() * 90 + 5}%`,
        size: `${Math.random() * 1.5 + 1}rem`,
        rotation: Math.random() * 360,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * -20,
      })
    }

    setSymbols(newSymbols)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {symbols.map((sym, index) => (
        <motion.div
          key={`floating-symbol-${sym.id}`}
          className="absolute text-purple-300/20 dark:text-purple-200/10"
          style={{
            left: sym.x,
            top: sym.y,
            fontSize: sym.size,
          }}
          animate={{
            y: ["0%", "10%", "-5%", "3%", "0%"],
            x: ["0%", "3%", "-3%", "5%", "0%"],
            rotate: [sym.rotation, sym.rotation + 20, sym.rotation - 10, sym.rotation + 5, sym.rotation],
            opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
          }}
          transition={{
            duration: sym.duration,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Number.POSITIVE_INFINITY,
            delay: sym.delay,
          }}
        >
          {sym.symbol}
        </motion.div>
      ))}
    </div>
  )
}
