(function () {
    "use strict";

    const STORAGE_KEY = "research_tracker_data_v1";

    const DEFAULT_DATA = {
        research: [],
        authors: [],
        journals: [],
        publishers: [],
        settings: {
            theme: "dark"
        }
    };

    function cloneDefaultData() {
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }

    function normalizeData(data) {
        const defaults = cloneDefaultData();

        if (!data || typeof data !== "object") {
            return defaults;
        }

        return {
            research: Array.isArray(data.research) ? data.research : [],
            authors: Array.isArray(data.authors) ? data.authors : [],
            journals: Array.isArray(data.journals) ? data.journals : [],
            publishers: Array.isArray(data.publishers) ? data.publishers : [],
            settings: {
                ...defaults.settings,
                ...(data.settings && typeof data.settings === "object"
                    ? data.settings
                    : {})
            }
        };
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                return cloneDefaultData();
            }

            return normalizeData(JSON.parse(raw));
        } catch (error) {
            console.error("Unable to load Research Tracker data:", error);
            return cloneDefaultData();
        }
    }

    function save(data) {
        try {
            const normalized = normalizeData(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            return true;
        } catch (error) {
            console.error("Unable to save Research Tracker data:", error);
            return false;
        }
    }

    function reset() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error("Unable to clear Research Tracker data:", error);
            return false;
        }
    }

    function getResearch() {
        return load().research;
    }

    function saveResearch(research) {
        const data = load();
        data.research = Array.isArray(research) ? research : [];
        return save(data);
    }

    function getAuthors() {
        return load().authors;
    }

    function saveAuthors(authors) {
        const data = load();
        data.authors = Array.isArray(authors) ? authors : [];
        return save(data);
    }

    function getJournals() {
        return load().journals;
    }

    function saveJournals(journals) {
        const data = load();
        data.journals = Array.isArray(journals) ? journals : [];
        return save(data);
    }

    function getPublishers() {
        return load().publishers;
    }

    function savePublishers(publishers) {
        const data = load();
        data.publishers = Array.isArray(publishers) ? publishers : [];
        return save(data);
    }

    function getSettings() {
        return load().settings;
    }

    function saveSettings(settings) {
        const data = load();

        data.settings = {
            ...data.settings,
            ...(settings && typeof settings === "object" ? settings : {})
        };

        return save(data);
    }

    function exportData() {
        return JSON.stringify(load(), null, 2);
    }

    function importData(json) {
        try {
            const parsed = typeof json === "string" ? JSON.parse(json) : json;
            const normalized = normalizeData(parsed);

            if (!save(normalized)) {
                return false;
            }

            return true;
        } catch (error) {
            console.error("Unable to import Research Tracker data:", error);
            return false;
        }
    }

    function getStorageKey() {
        return STORAGE_KEY;
    }

    window.ResearchStorage = {
        STORAGE_KEY,
        DEFAULT_DATA: cloneDefaultData(),

        load,
        save,
        reset,

        getResearch,
        saveResearch,

        getAuthors,
        saveAuthors,

        getJournals,
        saveJournals,

        getPublishers,
        savePublishers,

        getSettings,
        saveSettings,

        exportData,
        importData,
        getStorageKey
    };
})();