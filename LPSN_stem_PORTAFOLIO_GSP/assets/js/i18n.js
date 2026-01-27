// assets/js/i18n.js
(function () {
  const SUPPORTED_LANGS = ['es', 'en', 'fr'];
  const STORAGE_KEY = 'lpsn-lang';

  function applyLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = 'es';

    // Cambia el atributo lang del <html>
    document.documentElement.setAttribute('lang', lang);

    // Guarda preferencia
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // Si falla localStorage, no rompemos nada
    }

    // 1) TEXTOS / HTML: data-i18n-es / -en / -fr
    document.querySelectorAll('[data-i18n-es]').forEach((el) => {
      const value = el.getAttribute(`data-i18n-${lang}`);
      if (!value) return;

      // Si es input/textarea, podrías querer actualizar value, pero en general
      // estos textos son <p>, <h1>, <span>, etc.
      el.innerHTML = value;
    });

    // 2) PLACEHOLDERS
    document
      .querySelectorAll('[data-i18n-placeholder-es]')
      .forEach((el) => {
        const value = el.getAttribute(`data-i18n-placeholder-${lang}`);
        if (value) {
          el.setAttribute('placeholder', value);
        }
      });

    // 3) ARIA-LABELS
    document
      .querySelectorAll('[data-i18n-aria-label-es]')
      .forEach((el) => {
        const value = el.getAttribute(`data-i18n-aria-label-${lang}`);
        if (value) {
          el.setAttribute('aria-label', value);
        }
      });

    // 4) TITLES (tooltips de botones/enlaces)
    document
      .querySelectorAll('[data-i18n-title-es]')
      .forEach((el) => {
        const value = el.getAttribute(`data-i18n-title-${lang}`);
        if (value) {
          el.setAttribute('title', value);
        }
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Cargar idioma guardado o ES por defecto
    let currentLang = 'es';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        currentLang = saved;
      }
    } catch (e) {}

    applyLanguage(currentLang);

    const btnLanguage = document.getElementById('btn-language');
    if (!btnLanguage) return;

    btnLanguage.addEventListener('click', () => {
      const index = SUPPORTED_LANGS.indexOf(currentLang);
      const nextLang = SUPPORTED_LANGS[(index + 1) % SUPPORTED_LANGS.length];
      currentLang = nextLang;
      applyLanguage(currentLang);

      // Opcional: podrías cambiar el title del botón según el idioma activo
      const titleMap = {
        es: 'Cambiar idioma ES/EN/FR',
        en: 'Change language ES/EN/FR',
        fr: 'Changer de langue ES/EN/FR',
      };
      btnLanguage.setAttribute('title', titleMap[currentLang] || titleMap.es);
    });
  });
})();
