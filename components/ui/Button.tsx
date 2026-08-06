'use client'
import React from 'react'

type Variant = 'default' | 'primary' | 'ghost'

export default function Button({
  children,
  className = '',
  variant = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; className?: string }) {
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold transition'
  const variants: Record<Variant, string> = {
    default: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    primary: 'bg-[#ff6a00] text-black hover:bg-[#ff8533]',
    ghost: 'bg-transparent text-slate-200 hover:bg-slate-900',
  }
  const classes = [base, variants[variant], className].filter(Boolean).join(' ')
  return (
    <button {...props} className={classes}>
      {children}
    </button>
  )
}
