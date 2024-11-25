import React, { useState, useEffect } from "react";
import grapesjs from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import grapesjsCustomCode from "grapesjs-custom-code";
import { addAllBlogs } from "@/categories/blogs";
import { addAllContacts } from "@/categories/contacts";
import { addAllTestimonials } from "@/categories/testimonials";
import { addAllTeams } from "@/categories/teams";
import { addAllStatistics } from "@/categories/statistics";
import { addAllPricing } from "@/categories/pricing";
import { addAllHeroSections } from "@/categories/hero";
import { addAllHeaders } from "@/categories/header";
import { addAllGallerys } from "@/categories/gallery";
import { addAllFooters } from "@/categories/footer";
import "grapesjs/dist/css/grapes.min.css";
import "@/styles/main.scss";

function App() {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: "#editor",
      plugins: [gjsPresetWebpage, grapesjsBlocksBasic, grapesjsCustomCode],
      pluginsOpts: {
        gjsPresetWebpage: {
          blocks: true,
          blocksBasicOpts: true,
        },
      },
      storageManager: {
        type: "local",
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
      },
    });

    editor.on("storage:store", () => {
      const htmlContent = editor.getHtml();
      const cssContent = editor.getCss();

      fetch("http://localhost:3000/configuration", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: htmlContent,
          css: cssContent,
        }),
      })
        .then((response) => response.json())
        .catch((error) => alert("Error saving configuration:", error));
    });

    editor.on("load", () => {
      const iframe = editor.Canvas.getFrameEl();
      const head = iframe.contentDocument.head;

      const tailwindStyles = document.createElement("link");
      tailwindStyles.rel = "stylesheet";
      tailwindStyles.href =
        "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
      head.appendChild(tailwindStyles);
    });

    addAllHeaders(editor);
    addAllHeroSections(editor);
    addAllGallerys(editor);
    addAllStatistics(editor);
    addAllBlogs(editor);
    addAllPricing(editor);
    addAllTeams(editor);
    addAllContacts(editor);
    addAllTestimonials(editor);
    addAllFooters(editor);

    editor.on("load", () => {
      const blockCategories = editor.BlockManager.getCategories();
      blockCategories.each((category) => category.set("open", false));
    });

    setEditor(editor);
  }, []);

  return (
    <div className="App">
      <div id="editor"></div>
    </div>
  );
}

export default App;
