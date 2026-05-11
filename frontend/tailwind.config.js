/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
      },
      fontFamily: {
        "app-planessential-com-inter-medium":
          "var(--app-planessential-com-inter-medium-font-family)",
        "app-planessential-com-noto-sans-khmer-bold":
          "var(--app-planessential-com-noto-sans-khmer-bold-font-family)",
        "app-planessential-com-noto-sans-khmer-medium":
          "var(--app-planessential-com-noto-sans-khmer-medium-font-family)",
        "app-planessential-com-noto-sans-khmer-regular":
          "var(--app-planessential-com-noto-sans-khmer-regular-font-family)",
        "app-planessential-com-noto-sans-khmer-regular-underline":
          "var(--app-planessential-com-noto-sans-khmer-regular-underline-font-family)",
        "app-planessential-com-noto-sans-khmer-semibold":
          "var(--app-planessential-com-noto-sans-khmer-semibold-font-family)",
        "apple-com-SF-pro-bold": "var(--apple-com-SF-pro-bold-font-family)",
        "apple-com-SF-pro-regular":
          "var(--apple-com-SF-pro-regular-font-family)",
        "apple-com-SF-pro-regular-underline":
          "var(--apple-com-SF-pro-regular-underline-font-family)",
        "apple-com-SF-pro-semibold":
          "var(--apple-com-SF-pro-semibold-font-family)",
        "planessential-com-metal-regular":
          "var(--planessential-com-metal-regular-font-family)",
        "planessential-com-montserrat-bold":
          "var(--planessential-com-montserrat-bold-font-family)",
        "planessential-com-montserrat-medium":
          "var(--planessential-com-montserrat-medium-font-family)",
        "planessential-com-montserrat-regular":
          "var(--planessential-com-montserrat-regular-font-family)",
        "planessential-com-montserrat-regular-strikethrough":
          "var(--planessential-com-montserrat-regular-strikethrough-font-family)",
        "planessential-com-moulpali-regular":
          "var(--planessential-com-moulpali-regular-font-family)",
      },
    },
  },
  plugins: [],
};