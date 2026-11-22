// Shared neutral and evergreen scales used by existing role-specific screens.
const neutral = {50:"#f7f8f7",100:"#eff2f0",200:"#dce2de",300:"#c3ccc6",400:"#96a49b",500:"#63746a",600:"#526158",700:"#34443b",800:"#25322b",900:"#1c2721",950:"#141d18"};
const evergreen = {50:"#eff8f3",100:"#dcefe4",200:"#b8deca",300:"#8dcaab",400:"#65b68e",500:"#37845f",600:"#266c4e",700:"#215b43",800:"#1e4938",900:"#193d30",950:"#10291f"};
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: { extend: {
    colors: {gray:neutral, slate:neutral, blue:evergreen, indigo:evergreen, purple:evergreen},
    borderRadius: {"2xl":"8px","3xl":"8px",xl:"8px"},
    boxShadow: {md:"0 1px 3px rgb(26 42 32 / .08)",lg:"0 2px 6px rgb(26 42 32 / .08)",xl:"0 4px 12px rgb(26 42 32 / .10)","2xl":"0 8px 24px rgb(26 42 32 / .12)"},
  } },
  plugins: [],
};
