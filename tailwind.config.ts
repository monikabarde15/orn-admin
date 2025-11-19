import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import forms from "@tailwindcss/forms"
import typography from "@tailwindcss/typography"

// Custom rotateY utility
const rotateX = plugin(function ({ addUtilities }) {
  addUtilities({
    ".rotate-y-180": {
      transform: "rotateY(180deg)",
    },
  })
})

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", "class"],
  theme: {
  	container: {
  		center: true
  	},
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: '#4361ee',
  				light: '#eaf1ff',
  				'dark-light': 'rgba(67,97,238,.15)'
  			},
  			secondary: {
  				DEFAULT: '#805dca',
  				light: '#ebe4f7',
  				'dark-light': 'rgb(128 93 202 / 15%)'
  			},
  			success: {
  				DEFAULT: '#00ab55',
  				light: '#ddf5f0',
  				'dark-light': 'rgba(0,171,85,.15)'
  			},
  			danger: {
  				DEFAULT: '#e7515a',
  				light: '#fff5f5',
  				'dark-light': 'rgba(231,81,90,.15)'
  			},
  			warning: {
  				DEFAULT: '#e2a03f',
  				light: '#fff9ed',
  				'dark-light': 'rgba(226,160,63,.15)'
  			},
  			info: {
  				DEFAULT: '#2196f3',
  				light: '#e7f7ff',
  				'dark-light': 'rgba(33,150,243,.15)'
  			},
  			dark: {
  				DEFAULT: '#3b3f5c',
  				light: '#eaeaec',
  				'dark-light': 'rgba(59,63,92,.15)'
  			},
  			black: {
  				DEFAULT: '#0e1726',
  				light: '#e3e4eb',
  				'dark-light': 'rgba(14,23,38,.15)'
  			},
  			white: {
  				DEFAULT: '#ffffff',
  				light: '#e0e6ed',
  				dark: '#888ea8'
  			}
  		},
  		fontFamily: {
  			nunito: [
  				'Nunito',
  				'sans-serif'
  			]
  		},
  		spacing: {
  			'4.5': '18px'
  		},
  		boxShadow: {
  			'3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)'
  		},
  		typography: '({ theme }) => ({\n        DEFAULT: {\n          css: {\n            "--tw-prose-invert-headings": theme("colors.white.dark"),\n            "--tw-prose-invert-links": theme("colors.white.dark"),\n            h1: { fontSize: "40px", marginBottom: "0.5rem", marginTop: 0 },\n            h2: { fontSize: "32px", marginBottom: "0.5rem", marginTop: 0 },\n            h3: { fontSize: "28px", marginBottom: "0.5rem", marginTop: 0 },\n            h4: { fontSize: "24px", marginBottom: "0.5rem", marginTop: 0 },\n            h5: { fontSize: "20px", marginBottom: "0.5rem", marginTop: 0 },\n            h6: { fontSize: "16px", marginBottom: "0.5rem", marginTop: 0 },\n            p: { marginBottom: "0.5rem" },\n            li: { margin: 0 },\n            img: { margin: 0 },\n          },\n        },\n      })',
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    forms({ strategy: "class" }),
    typography,
    rotateX,
  ],
}

export default config