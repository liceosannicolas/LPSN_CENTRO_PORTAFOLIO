document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const btnTheme = document.getElementById("btn-theme");
  const btnHome = document.getElementById("btn-home");
  const btnFontInc = document.getElementById("btn-font-inc");
  const btnFontDec = document.getElementById("btn-font-dec");
  const btnNarrator = document.getElementById("btn-narrator");
  const btnLanguage = document.getElementById("btn-language");
  const searchInput = document.getElementById("search-input");

  // THEME
  const storedTheme = localStorage.getItem("gsp-pei-theme");
  if (storedTheme === "light") {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
  }

  btnTheme?.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const isLight = body.classList.contains("light-theme");
    localStorage.setItem("gsp-pei-theme", isLight ? "light" : "dark");
  });

  // HOME
  btnHome?.addEventListener("click", () => {
    // Si ya estamos en la página principal, solo subir al inicio
    const path = window.location.pathname || "";
    const isIndex = path.endsWith("index.html") || path.endsWith("/");
    if (isIndex) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Volver siempre al index del portafolio actual
      window.location.href = "index.html";
    }
  });

  // FONT SIZE
  let baseFontSize = 16;
  const applyFontSize = () => {
    document.documentElement.style.fontSize = baseFontSize + "px";
  };
  btnFontInc?.addEventListener("click", () => {
    if (baseFontSize < 20) {
      baseFontSize += 1;
      applyFontSize();
    }
  });
  btnFontDec?.addEventListener("click", () => {
    if (baseFontSize > 14) {
      baseFontSize -= 1;
      applyFontSize();
    }
  });

  // NARRATOR
  let speaking = false;
  btnNarrator?.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      alert("El narrador no está disponible en este navegador.");
      return;
    }
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      speaking = false;
      return;
    }
    const main = document.getElementById("main-content");
    if (!main) return;
    const text = main.innerText;
    if (!text.trim()) return;
    const utter = new SpeechSynthesisUtterance(text);
    if (document.documentElement.lang === "en") {
      utter.lang = "en-US";
    } else if (document.documentElement.lang === "fr") {
      utter.lang = "fr-FR";
    } else {
      utter.lang = "es-ES";
    }
    utter.onend = () => {
      speaking = false;
    };
    speaking = true;
    synth.speak(utter);
  });

  // LANGUAGE ES / EN / FR
  let currentLang = "es";
  const translatable = document.querySelectorAll("[data-i18n-es]");
  const translatablePlaceholders = document.querySelectorAll("[data-i18n-placeholder-es]");
  const translatableTitles = document.querySelectorAll("[data-i18n-title-es]");
  const translatableAriaLabels = document.querySelectorAll("[data-i18n-aria-label-es]");

  const getI18nValue = (el, baseAttr) => {
    let text = "";
    if (currentLang === "en") {
      text = el.getAttribute(baseAttr + "-en") || el.getAttribute(baseAttr + "-es") || "";
    } else if (currentLang === "fr") {
      // Si no hay versión en francés, se usa inglés y luego español como respaldo
      text =
        el.getAttribute(baseAttr + "-fr") ||
        el.getAttribute(baseAttr + "-en") ||
        el.getAttribute(baseAttr + "-es") ||
        "";
    } else {
      text = el.getAttribute(baseAttr + "-es") || "";
    }
    return text;
  };

  const updateLanguage = () => {
    // Ajustar atributo lang del documento
    if (currentLang === "en") {
      document.documentElement.lang = "en";
    } else if (currentLang === "fr") {
      document.documentElement.lang = "fr";
    } else {
      document.documentElement.lang = "es";
    }

    // Textos internos (innerHTML)
    translatable.forEach(el => {
      const text = getI18nValue(el, "data-i18n");
      if (text) {
        el.innerHTML = text;
      }
    });

    // Placeholders
    translatablePlaceholders.forEach(el => {
      const text = getI18nValue(el, "data-i18n-placeholder");
      if (text) {
        el.setAttribute("placeholder", text);
      }
    });

    // Titles
    translatableTitles.forEach(el => {
      const text = getI18nValue(el, "data-i18n-title");
      if (text) {
        el.setAttribute("title", text);
      }
    });

    // Aria-labels
    translatableAriaLabels.forEach(el => {
      const text = getI18nValue(el, "data-i18n-aria-label");
      if (text) {
        el.setAttribute("aria-label", text);
      }
    });

    // Tooltip del botón de idioma
    if (btnLanguage) {
      if (currentLang === "es") {
        btnLanguage.title = "Cambiar idioma ES/EN/FR";
      } else if (currentLang === "en") {
        btnLanguage.title = "Switch language ES/EN/FR";
      } else {
        btnLanguage.title = "Changer la langue ES/EN/FR";
      }
    }
  };

  if (btnLanguage) {
    btnLanguage.addEventListener("click", () => {
      if (currentLang === "es") {
        currentLang = "en";
      } else if (currentLang === "en") {
        currentLang = "fr";
      } else {
        currentLang = "es";
      }
      updateLanguage();
    });
  }

  // Inicializar idioma según el atributo lang actual
  const docLang = document.documentElement.lang;
  if (docLang === "en") {
    currentLang = "en";
  } else if (docLang === "fr") {
    currentLang = "fr";
  } else {
    currentLang = "es";
  }
  updateLanguage();

  // SEARCH (simple filter by data-search-tags and text)
  const cards = Array.from(document.querySelectorAll("[data-search-tags], .card"));

  // ANIMACIONES CON Anime.js v4
  const cardsForAnimation = Array.from(document.querySelectorAll(".card"));
  if (window.anime && typeof window.anime.animate === "function" && cardsForAnimation.length) {
    const { animate } = window.anime;

    // Animación de entrada en cascada
    animate(cardsForAnimation, {
      opacity: { from: 0, to: 1 },
      y: { from: 18, to: 0 },
      duration: 700,
      delay: (_, i) => 80 * i,
      easing: "outCubic"
    });

    // Animación suave al pasar el mouse
    cardsForAnimation.forEach(card => {
      let hoverAnimation;
      card.addEventListener("mouseenter", () => {
        if (hoverAnimation) hoverAnimation.pause?.();
        hoverAnimation = animate(card, {
          scale: { to: 1.03 },
          duration: 260,
          easing: "outCubic"
        });
      });

      card.addEventListener("mouseleave", () => {
        if (hoverAnimation) hoverAnimation.pause?.();
        hoverAnimation = animate(card, {
          scale: { to: 1 },
          duration: 260,
          easing: "outCubic"
        });
      });
    });
  }

  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    cards.forEach(card => {
      const haystack =
        (card.getAttribute("data-search-tags") || "") +
        " " +
        card.textContent.toLowerCase();
      if (!query || haystack.includes(query)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });

  // Register service worker (best-effort)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
