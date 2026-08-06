'use client'

import React from 'react'
import Link from 'next/link'
import { generateBreadcrumbSchema } from '../../lib/seo/schema'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const fullItems = [{ label: 'Home', href: '/' }, ...items]

  const schemaData = generateBreadcrumbSchema(
    fullItems.map((i) => ({ name: i.label, item: i.href }))
  )

  return (
    <>
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-400 py-2">
        <ol className="flex items-center gap-2 flex-wrap">
          {fullItems.map((item, idx) => {
            const isLast = idx === fullItems.length - 1
            return (
              <li key={idx} className="flex items-center gap-2">
                {idx > 0 && <span className="text-slate-600">/</span>}
                {isLast ? (
                  <span className="text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-none">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-[#22c55e] transition">
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
