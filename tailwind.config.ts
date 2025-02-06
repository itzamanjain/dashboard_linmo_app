import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom-mobile-417': '417px',
        '2xl': '1440px',
        '3xl': '1728px',
      },
      maxWidth: {
        'sm-web': '400px',
        'md-web': '480px',
        'lg-web': '624px',
      },
      colors: {
        black: '#0F0F0F',
        gray: '#ADADAD',
        green: '#DAFF00',
        darkgray: '#808080',
        darkMetal: '#292929',
        sandstone: '#7A7663',
        rangoonGreen: '#1A1A1A',
        custard: '#E9FF66',
        navyGreen: '#4C570B',
        onyx: '#141414',
        swampGreen: '#758708',
        darkJungle: '#1F1F1F',
        orange: '#EE764E',
        olive: '#23270E',
        iron: '#D6D6D6',
        flame: '#EB5929',
        charcoal: '#414141',
        cinder: '#141318',
        davyGray: '#595959',
        yellowyGreen: '#CBF147',
        brownGreen: '#606F09',
        ash: '#7A7663',
        woodsmoke: "#0F0F0F",
        graphite: "#191B0E",
        buff: "#F0FF99",
        mantis: "#6EC36C"
      },
      fontSize: {
        'custom-32': '2rem',
        'custom-22': '1.375rem',
        'custom-26': '1.625rem',
        'custom-10': '0.625rem'
      },
      lineHeight: {
        'custom-22': '1.375rem',
        'custom-18': '1.125rem',
        'custom-14': '0.875rem'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      padding: {
        'custom-70': '4.375rem'
      },
      gap: {
        'custom-2': '0.125rem'
      }
    },
  },
  plugins: [],
};
export default config;
