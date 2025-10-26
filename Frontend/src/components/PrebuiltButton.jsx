import React from 'react'

export default function PrebuiltButton({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 rounded-full font-semibold transition'
  const styles = {
    primary: `${base} bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-lg hover:brightness-95 px-6 py-3`,
    secondary: `${base} bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] px-5 py-2`,
    ghost: `${base} bg-transparent text-[color:var(--foreground)] px-4 py-2`,
  }

  return (
    <button className={`${styles[variant] || styles.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
