// assets/js/i18n.js

// Idiomas disponibles (ES / EN / FR)
const SUPPORTED_LANGS = ["es", "en", "fr"];
const STORAGE_KEY = "gsp_lang";

// Detecta idioma inicial
function getInitialLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  return "es";
}

let currentLang = getInitialLang();

// Helpers para nombres de dataset
function getDatasetKey(base, lang) {
  // base: "i18n", "i18nTitle", "i18nPlaceholder", "i18nAriaLabel"
  // lang: "es" | "en" | "fr"
  const langSuffix =
    lang === "es" ? "Es" :
    lang === "en" ? "En" :
    "Fr"; // francés
  return `${base}${langSuffix}`; // p.ej. "i18nEs", "i18nTitleEn"
}

function applyTextTranslation(lang) {
  const key = getDatasetKey("i18n", lang);

  const nodes = document.querySelectorAll(
    "[data-i18n-es], [data-i18n-en], [data-i18n-fr]"
  );

  nodes.forEach((el) => {
    const value = el.dataset[key];
    if (value !== undefined) {
      el.innerHTML = value; // respeta <strong>, etc.
    }
  });
}

function applyTitleTranslation(lang) {
  const key = getDatasetKey("i18nTitle", lang);

  const nodes = document.querySelectorAll(
    "[data-i18n-title-es], [data-i18n-title-en], [data-i18n-title-fr]"
  );

  nodes.forEach((el) => {
    const value = el.dataset[key];
    if (value !== undefined) {
      el.title = value;
    }
  });
}

function applyPlaceholderTranslation(lang) {
  const key = getDatasetKey("i18nPlaceholder", lang);

  const nodes = document.querySelectorAll(
    "[data-i18n-placeholder-es], [data-i18n-placeholder-en], [data-i18n-placeholder-fr]"
  );

  nodes.forEach((el) => {
    const value = el.dataset[key];
    if (value !== undefined) {
      el.placeholder = value;
    }
  });
}

function applyAriaLabelTranslation(lang) {
  const key = getDatasetKey("i18nAriaLabel", lang);

  const nodes = document.querySelectorAll(
    "[data-i18n-aria-label-es], [data-i18n-aria-label-en], [data-i18n-aria-label-fr]"
  );

  nodes.forEach((el) => {
    const value = el.dataset[key];
    if (value !== undefined) {
      el.setAttribute("aria-label", value);
    }
  });
}

function setHtmlLang(lang) {
  const html = document.documentElement;
  if (!html) return;

  if (lang === "es") html.lang = "es";
  else if (lang === "en") html.lang = "en";
  else html.lang = "fr"; // francés
}

// Función general
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  setHtmlLang(lang);
  applyTextTranslation(lang);
  applyTitleTranslation(lang);
  applyPlaceholderTranslation(lang);
  applyAriaLabelTranslation(lang);
}

// Cambia de idioma al hacer clic en 🌐
function setupLanguageButton() {
  const btn = document.getElementById("btn-language");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const idx = SUPPORTED_LANGS.indexOf(currentLang);
    const nextIdx = (idx + 1) % SUPPORTED_LANGS.length;
    const nextLang = SUPPORTED_LANGS[nextIdx];
    applyLanguage(nextLang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLang);
  setupLanguageButton();
});
