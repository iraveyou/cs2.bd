'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const classes = ['card', 'bg-[#0f1115]', 'rounded-md', 'p-0', 'overflow-hidden', className].filter(Boolean).join(' ')
  return (
    <motion.div
      className={classes}
      whileHover={{ translateY: -4 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}