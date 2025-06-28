module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ["\"Poppins\"", "serif"],
            },
            screens: {
                "lg-custom": { "min": "992px" },
            },
        },
    },
    plugins: [],
};
