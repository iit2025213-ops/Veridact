import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base backgrounds
        'surface-base': '#0F172A',       // slate-900 — page background
        'surface-card': '#1E293B',       // slate-800 — card/panel background
        'surface-elevated': '#253347',   // slightly lighter — hover states, modals
        'surface-border': '#334155',     // slate-700 — all borders/dividers

        // Typography
        'text-primary': '#F1F5F9',       // slate-100
        'text-secondary': '#CBD5E1',     // slate-300
        'text-muted': '#94A3B8',         // slate-400
        'text-disabled': '#475569',      // slate-600

        // Brand accent
        'accent-primary': '#34D399',     // emerald-400 — primary buttons, links, highlights
        'accent-hover': '#10B981',       // emerald-500 — hover state
        'accent-subtle': '#064E3B',      // emerald-950 — subtle tinted backgrounds

        // Verdict colors
        'verdict-authentic': '#34D399',      // emerald-400
        'verdict-suspicious': '#FB923C',     // orange-400
        'verdict-fake': '#F87171',           // red-400
        'verdict-inconclusive': '#94A3B8',   // slate-400

        // Status colors
        'status-pending': '#FBBF24',         // amber-400
        'status-review': '#60A5FA',          // blue-400
        'status-complete': '#34D399',        // emerald-400
        'status-closed': '#94A3B8',          // slate-400
        'status-referred': '#C084FC',        // purple-400
        'status-critical': '#F87171',        // red-400
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1':      ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2':      ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3':      ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4':      ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body':    ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
        'badge':   ['0.6875rem', { lineHeight: '1', fontWeight: '600' }],
      },
      borderRadius: {
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        'full': '9999px',
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
        'accent':     '0 0 0 1px #34D399, 0 0 12px rgba(52,211,153,0.15)',
        'modal':      '0 20px 60px rgba(0,0,0,0.6)',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        brand: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'forensic-grid': `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2334D399' stroke-width='0.3' opacity='0.12'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
