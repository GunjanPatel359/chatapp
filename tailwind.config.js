// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
    		backgroundImage: {
    			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
				light_color_50:"var(--light-color-50)",
				light_color_100:"var(--light-color-100)",
				light_color_200:"var(--light-color-200)",
				light_color_300:"var(--light-color-300)",
				light_color_400:"var(--light-color-400)",
				light_color_500:"var(--light-color-500)",
				light_color_600:"var(--light-color-600)",
				light_color_700:"var(--light-color-700)",
				light_color_800:"var(--light-color-800)",
				light_color_900:"var(--light-color-900)",
				light_color_950:"var(--light-color-950)",
				
				dark_color_50:"var(--dark-color-50)",
				dark_color_100:"var(--dark-color-100)",
				dark_color_200:"var(--dark-color-200)",
				dark_color_300:"var(--dark-color-300)",
				dark_color_400:"var(--dark-color-400)",
				dark_color_500:"var(--dark-color-500)",
				dark_color_600:"var(--dark-color-600)",
				dark_color_700:"var(--dark-color-700)",
				dark_color_800:"var(--dark-color-800)",
				dark_color_900:"var(--dark-color-900)",
				dark_color_950:"var(--dark-color-950)",
			}
    	}
    },
	plugins: [
		require("tailwindcss-animate"),
		function ({ addUtilities }) {
			addUtilities({
				'.scrollbar-none': {
					'::-webkit-scrollbar': { display: 'none' },
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
				},
			});
		}
	],
};

export default config;
