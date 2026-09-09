/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // toggle by adding/removing "dark" on <html>
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                // neutral surfaces (backgrounds, panels, raised elements)
                surface: {
                    0: 'var(--surface-0)', // page / canvas background
                    1: 'var(--surface-1)', // cards, nodes, panels
                    2: 'var(--surface-2)', // hover / subtle raised state
                    3: 'var(--surface-3)', // pressed / strongest raised state
                },
                border: {
                    DEFAULT: 'var(--border)',
                    strong: 'var(--border-strong)',
                },
                ink: {
                    DEFAULT: 'var(--text-primary)',
                    muted: 'var(--text-secondary)',
                    faint: 'var(--text-muted)',
                },
                // the single accent — orange. Used for interactive/active states only.
                route: {
                    DEFAULT: 'var(--accent)',
                    hover: 'var(--accent-hover)',
                    soft: 'var(--accent-soft)',
                    border: 'var(--accent-border)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            borderRadius: {
                node: '10px',
                panel: '14px',
            },
            boxShadow: {
                node: '0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.03)',
                'node-dark': '0 1px 2px rgba(0,0,0,0.5)',
                panel: '0 8px 24px rgba(0,0,0,0.08)',
                'panel-dark': '0 8px 24px rgba(0,0,0,0.5)',
            },
        },
    },
    plugins: [],
};