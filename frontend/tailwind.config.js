/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F6CD28",
        background: "#F5F5F5",
        label: "#616161",
        input: "#A0AEC0",
        danger: "#DF0C00",
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        heading: ["Open Sans", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
      },
      fontSize: {
        heading: ["25px", { lineHeight: "2.5rem", fontWeight: "700" }],
        sub_heading: ["18px", { lineHeight: "2rem", fontWeight: "700" }],
        body_bold: ["15px", { lineHeight: "1.5rem", fontWeight: "700" }],
        body: ["15px", { lineHeight: "1.5rem", fontWeight: "500" }],
        body_label: ["15px", { lineHeight: "1.5rem", fontWeight: "500" }],
        tab_heading: ["22px", { lineHeight: "2.5rem", fontWeight: "700" }],
        tab_sub_heading: ["16px", { lineHeight: "2rem", fontWeight: "700" }],
        tab_body: ["14px", { lineHeight: "1.5rem", fontWeight: "500" }],
        tab_body_bold: ["14px", { lineHeight: "1.5rem", fontWeight: "700" }],
        tab_body_label: ["14px", { lineHeight: "1.5rem", fontWeight: "500" }],
        mobile_heading: ["20px", { lineHeight: "2.5rem", fontWeight: "700" }],
        mobile_sub_heading: ["14px", { lineHeight: "2rem", fontWeight: "700" }],
        mobile_body: ["12px", { lineHeight: "1.5rem", fontWeight: "500" }],
        mobile_body_bold: ["12px", { lineHeight: "1.5rem", fontWeight: "700" }],
        mobile_body_label: [
          "12px",
          { lineHeight: "1.5rem", fontWeight: "500" },
        ],
      },
    },
  },
  plugins: [],
};
