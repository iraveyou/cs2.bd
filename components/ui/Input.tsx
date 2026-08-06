'use client'
import React from 'react'
import clsx from 'clsx'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={clsx('w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]', props.className)}
    />
  )
}
