"use client";

import { useEffect } from "react";

export function GoogleTranslateWidget() {
  useEffect(() => {
    // Check if the script is already loaded
    if (document.getElementById("google-translate-script")) {
      return;
    }

    // Add CSS to hide the Google Translate top bar and customize look
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        top: 0px !important;
      }
      .skiptranslate, .goog-te-banner-frame {
        display: none !important;
      }
      .goog-te-gadget {
        font-family: inherit !important;
        font-size: 14px !important;
        color: transparent !important;
      }
      .goog-te-gadget .goog-te-combo {
        padding: 6px 12px;
        border-radius: 9999px;
        border: 1px solid #e2e8f0;
        background-color: white;
        color: #0f172a;
        font-size: 13px;
        font-weight: 600;
        outline: none;
        cursor: pointer;
        transition: all 0.2s;
      }
      .dark .goog-te-gadget .goog-te-combo {
        background-color: #1e293b;
        color: #f8fafc;
        border-color: #334155;
      }
      .goog-te-gadget .goog-te-combo:hover {
        border-color: #6366f1;
      }
      .goog-logo-link, .goog-logo-link:link, .goog-logo-link:visited, .goog-logo-link:hover, .goog-logo-link:active {
        display: none !important;
      }
      .goog-te-gadget span {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Setup global callback
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,gu,hi",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Load google translate script
    const addScript = document.createElement("script");
    addScript.id = "google-translate-script";
    addScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);
  }, []);

  return (
    <div className="flex items-center min-w-[120px] h-10">
      <div id="google_translate_element" className="google-translate-element"></div>
    </div>
  );
}
