document.addEventListener("DOMContentLoaded", () => {
    const languageSwitcher = document.getElementById("language-switcher");
    const langButtons = document.querySelectorAll(".lang-button");
    let translations = {};

    async function fetchTranslations() {
        try {
            const response = await fetch("translations.json");
            if (!response.ok) {
                console.error(`Error fetching translations: ${response.status} ${response.statusText}`);
                return;
            }
            translations = await response.json();
            const storedLang = localStorage.getItem("language") || "pt";
            setLanguage(storedLang);
        } catch (error) {
            console.error("Could not load translations:", error);
        }
    }

    function setLanguage(lang) {
        if (!translations[lang]) {
            console.warn(`Translations for language '${lang}' not found.`);
            return;
        }
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);

        document.querySelectorAll("[data-translate-key]").forEach(element => {
            const key = element.getAttribute("data-translate-key");
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key]; // Use innerHTML to allow for HTML tags in translations
            } else {
                console.warn(`Translation key '${key}' not found for language '${lang}'.`);
            }
        });

        langButtons.forEach(button => {
            if (button.getAttribute("data-lang") === lang) {
                button.classList.add("active-lang");
            } else {
                button.classList.remove("active-lang");
            }
        });

        // Toggle visibility for CV and Courses content based on language
        toggleLanguageSpecificContent("cv-content", lang);
        toggleLanguageSpecificContent("courses-content", lang);
    }

    function toggleLanguageSpecificContent(baseId, currentLang) {
        const ptElement = document.getElementById(`${baseId}-pt`);
        const enElement = document.getElementById(`${baseId}-en`);

        if (ptElement && enElement) {
            if (currentLang === "pt") {
                ptElement.style.display = "block";
                enElement.style.display = "none";
            } else if (currentLang === "en") {
                ptElement.style.display = "none";
                enElement.style.display = "block";
            } else { // Fallback or if only one language content exists
                 ptElement.style.display = "block"; // Default to PT if lang not found or specific content missing
                 enElement.style.display = "none";
            }
        }
    }

    if (languageSwitcher) {
        languageSwitcher.addEventListener("click", (event) => {
            if (event.target.classList.contains("lang-button")) {
                const selectedLang = event.target.getAttribute("data-lang");
                setLanguage(selectedLang);
            }
        });
    }

    fetchTranslations();
});
