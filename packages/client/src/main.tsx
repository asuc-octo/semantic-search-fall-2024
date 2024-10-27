import { createRoot } from "react-dom/client";
import "./reset.css";
import App from "./App.tsx";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")!).render(
  <Theme>
    <App />
  </Theme>
);
