import { wedgesTW } from "@lemonsqueezy/wedges";
import tailwindAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";
import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "node_modules/@lemonsqueezy/wedges/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'scrollbar-thin',
    'scrollbar-track-transparent',
    'scrollbar-thumb-gray-300',
    'hover:scrollbar-thumb-gray-400'
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        beige: "#F9F4EE",
        lwgreen: "#B0CDB2",
        lwgreenlight: "#c1e0c1",
        lwgreendark: "#465246",
        
        glacier: {
          50: '#f3fdfd',
          100: '#E2FCFC',  // Your original color
          200: '#c5f7f7',
          300: '#94f1f1',
          400: '#4ce6e6',
          500: '#25d1d1',
          600: '#1ba7a7',
          700: '#147d7d',
          800: '#0d5454',
          900: '#062a2a'
        },
        
        blush: {
          50: '#fef6f6',
          100: '#FBECEB',  // Your original color
          200: '#f5d5d3',
          300: '#edb3b0',
          400: '#e18480',
          500: '#d65d58',
          600: '#c43f39',
          700: '#a32f2a',
          800: '#82201c',
          900: '#61100d'
        },
        
        parchment: {
          50: '#ffffe9',
          100: '#FFFFE3',  // Your original color
          200: '#ffffb3',
          300: '#ffff80',
          400: '#ffff4d',
          500: '#ffff1a',
          600: '#e6e600',
          700: '#b3b300',
          800: '#808000',
          900: '#4d4d00'
        },
        
        sage: {
          50: '#f4fef5',
          100: '#E2FDE6',  // Your original color
          200: '#b8f9c2',
          300: '#8df49e',
          400: '#62ef7a',
          500: '#37ea56',
          600: '#1bc53a',
          700: '#15952c',
          800: '#0f651e',
          900: '#093510'
        },
        sand: {
          50: "#FDF7F1",
          100: "#FCF0E4",
          200: "#F6DFC4",
          300: "#ECB983", // Base color
          400: "#E5A05F",
          500: "#DB8544",
          600: "#C26832",
          700: "#A0522A",
          800: "#814225",
          900: "#663420",
          950: "#4A2417",
        },
        ocean: {
          50: "#F2F7FB",
          100: "#E4F0F7",
          200: "#B9D8EC",
          300: "#83B9EC",
          400: "#5FA0E5",
          500: "#4485DB",
          600: "#3268C2",
          700: "#2A52A0",
          800: "#254281",
          900: "#1F3563",
          950: "#17254A",
        },
        terra: {
          50: "#FDF5F1",
          100: "#FCEBE4",
          200: "#F6CFC4",
          300: "#EC9B83",
          400: "#E57F5F",
          500: "#DB6544",
          600: "#C24832",
          700: "#A03A2A",
          800: "#813025",
          900: "#662620",
          950: "#4A1B17",
        },
        filter: {
          50: "#F9F7F6",
          100: "#F3EFED",
          200: "#E8E0DB",
          300: "#D9C8BF",
          400: "#C4A99A",
          500: "#AB8776", // Main filter header color
          600: "#8E6959",
          700: "#725147",
          800: "#573D36",
          900: "#3D2B27",
          950: "#261B18",
        },
        // Set 2: Cool Trust
        navy: {
          50: "#F4F7F9",
          100: "#E9EFF4",
          200: "#D3DFE9",
          300: "#B7C9D9",
          400: "#96ACC5",
          500: "#7790B1", // Main filter header color
          600: "#5D738F",
          700: "#4B5B72",
          800: "#394556",
          900: "#2A323E",
          950: "#1B2028",
        },
        // Set 3: Modern Slate
        modern: {
          50: "#F6F7F9",
          100: "#ECEEF2",
          200: "#D9DEE5",
          300: "#C1C8D4",
          400: "#A3AdbD",
          500: "#8691A3", // Main filter header color
          600: "#6B7485",
          700: "#565D6B",
          800: "#424752",
          900: "#31343C",
          950: "#212327",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
        amulya: ["Amulya", "system-ui", "sans-serif"],
        synonym: ["Synonym", "system-ui", "sans-serif"],
        sentient: ["Sentient", "system-ui", "serif"],
        gambetta: ["Gambetta", "system-ui", "serif"],
        jp: ["Noto Sans JP", "system-ui", "sans-serif"],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#000000 !important',
            'p': {
              fontFamily: 'inherit',
              fontWeight: '300',
              color: '#000000 !important',
              opacity: '1 !important',
            },
            'h1': {
              fontSize: '2.25em', // Default size
              '@screen lg': {
                fontSize: '2.5em',
              },
              '@screen sm': {
                fontSize: '2em',
              },
            },
            'h2': {
              fontSize: '1.75em',
              '@screen lg': {
                fontSize: '2em',
              },
              '@screen sm': {
                fontSize: '1.5em',
              },
            },
            'h3': {
              fontSize: '1.5em',
              '@screen lg': {
                fontSize: '1.75em',
              },
              '@screen sm': {
                fontSize: '1.25em',
              },
            },
            'h4': {
              fontSize: '1.25em',
              '@screen lg': {
                fontSize: '1.5em',
              },
              '@screen sm': {
                fontSize: '1.125em',
              },
            },
            'h1, h2, h3, h4, h5, h6, strong, b': {
              fontFamily: 'inherit',
              fontWeight: '700',
              color: '#000000 !important',
            },
            'a': {
              textDecoration: 'none',
              color: '#000000 !important',
              '&:hover': {
                textDecoration: 'none',
                color: '#000000 !important',
              },
            },
            // Tiptap specific styles
            '.ProseMirror': {
              color: '#000000 !important',
              'p, h1, h2, h3, h4, h5, h6, a, strong, b': {
                color: '#000000 !important',
              },
            },
            'ul': {
              'list-style-type': 'disc',
              'li::marker': {
                color: '#78716C !important',
              },
            },
            'ol': {
              'li::marker': {
                color: '#78716C !important',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    tailwindScrollbar({ nocompatible: true }),
    wedgesTW(),
    tailwindAnimate,
    tailwindTypography,
  ],
};

