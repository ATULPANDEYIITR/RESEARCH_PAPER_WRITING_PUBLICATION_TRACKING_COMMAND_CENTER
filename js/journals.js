(function () {
    "use strict";

    const STORAGE = window.ResearchStorage;
    const U = window.ResearchUtils;

    function getAll() {
        return STORAGE.getJournals();
    }

    function saveAll(journals) {
        return STORAGE.saveJournals(
            Array.isArray(journals) ? journals : []
        );
    }

    function buildJournal(data) {
        return {
            id: data.id || U.generateId("journal"),
            name: U.normalizeText(data.name),
            abbreviation: U.normalizeText(data.abbreviation),
            publisher: U.normalizeText(data.publisher),
            issn: U.normalizeText(data.issn),
            website: U.normalizeText(data.website),
            field: U.normalizeText(data.field),
            country: U.normalizeText(data.country),
            impactFactor: U.normalizeText(data.impactFactor),
            notes: U.normalizeText(data.notes),
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    function syncFromResearch() {
        const journals = getAll();

        const research = window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];

        const existingNames = new Map();

        journals.forEach(journal => {
            const name = U.normalizeText(journal.name).toLowerCase();

            if (name) {
                existingNames.set(name, journal);
            }
        });

        let changed = false;

        research.forEach(item => {
            const name = U.normalizeText(item.journal);

            if (!name) {
                return;
            }

            const key = name.toLowerCase();

            if (!existingNames.has(key)) {
                const journal = buildJournal({
                    name,
                    publisher: item.publisher || ""
                });

                journals.push(journal);
                existingNames.set(key, journal);
                changed = true;
            } else if (
                item.publisher &&
                !existingNames.get(key).publisher
            ) {
                existingNames.get(key).publisher = U.normalizeText(
                    item.publisher
                );
                existingNames.get(key).updatedAt =
                    new Date().toISOString();
                changed = true;
            }
        });

        if (changed) {
            saveAll(journals);
        }

        return journals;
    }

    function initialize() {
        return syncFromResearch();
    }

    function getById(id) {
        return getAll().find(journal => journal.id === id) || null;
    }

    function findByName(name) {
        const target = U.normalizeText(name).toLowerCase();

        if (!target) {
            return null;
        }

        return (
            getAll().find(
                journal =>
                    U.normalizeText(journal.name).toLowerCase() ===
                    target
            ) || null
        );
    }

    function add(data) {
        const name = U.normalizeText(data?.name);

        if (!name) {
            return {
                success: false,
                message: "Journal name is required."
            };
        }

        if (findByName(name)) {
            return {
                success: false,
                message: "A journal with this name already exists."
            };
        }

        const journals = getAll();
        const journal = buildJournal(data);

        journals.push(journal);

        if (!saveAll(journals)) {
            return {
                success: false,
                message: "Unable to save journal."
            };
        }

        return {
            success: true,
            item: journal,
            message: "Journal added successfully."
        };
    }

    function update(id, data) {
        const journals = getAll();
        const index = journals.findIndex(journal => journal.id === id);

        if (index === -1) {
            return {
                success: false,
                message: "Journal not found."
            };
        }

        const name = U.normalizeText(data?.name);

        if (!name) {
            return {
                success: false,
                message: "Journal name is required."
            };
        }

        const duplicate = journals.find(
            journal =>
                journal.id !== id &&
                U.normalizeText(journal.name).toLowerCase() ===
                    name.toLowerCase()
        );

        if (duplicate) {
            return {
                success: false,
                message: "Another journal already has this name."
            };
        }

        journals[index] = {
            ...journals[index],
            ...buildJournal({
                ...journals[index],
                ...data,
                id: journals[index].id,
                createdAt: journals[index].createdAt
            })
        };

        if (!saveAll(journals)) {
            return {
                success: false,
                message: "Unable to update journal."
            };
        }

        return {
            success: true,
            item: journals[index],
            message: "Journal updated successfully."
        };
    }

    function remove(id) {
        const journals = getAll();
        const filtered = journals.filter(journal => journal.id !== id);

        if (filtered.length === journals.length) {
            return {
                success: false,
                message: "Journal not found."
            };
        }

        if (!saveAll(filtered)) {
            return {
                success: false,
                message: "Unable to delete journal."
            };
        }

        return {
            success: true,
            message: "Journal deleted successfully."
        };
    }

    function search(query) {
        const value = U.normalizeText(query).toLowerCase();

        if (!value) {
            return getAll();
        }

        return getAll().filter(journal => {
            const searchable = [
                journal.name,
                journal.abbreviation,
                journal.publisher,
                journal.issn,
                journal.website,
                journal.field,
                journal.country,
                journal.impactFactor,
                journal.notes
            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(value);
        });
    }

    function getResearchCount(journalName) {
        const research = window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];

        const target = U.normalizeText(journalName).toLowerCase();

        if (!target) {
            return 0;
        }

        return research.filter(
            item =>
                U.normalizeText(item.journal).toLowerCase() ===
                target
        ).length;
    }

    function getWithCounts() {
        return getAll().map(journal => ({
            ...journal,
            researchCount: getResearchCount(journal.name)
        }));
    }

    function getTopJournals(limit = 10) {
        return getWithCounts()
            .sort((a, b) => b.researchCount - a.researchCount)
            .slice(0, limit);
    }

    function render(containerId = "journalsGrid") {
        const container = document.getElementById(containerId);

        if (!container) {
            return;
        }

        const journals = getWithCounts();

        if (journals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">▣</div>
                    <h3>No journals yet</h3>
                    <p>Add research records with journal names to build your journal directory.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = journals
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(journal => {
                const initials = U.getInitials(journal.name, "J");

                return `
                    <article class="entity-card">
                        <div class="entity-avatar">${U.escapeHtml(
                            initials
                        )}</div>

                        <div class="entity-content">
                            <h3>${U.escapeHtml(journal.name)}</h3>

                            <p>${U.escapeHtml(
                                journal.publisher ||
                                    journal.field ||
                                    "Academic Journal"
                            )}</p>

                            <div class="entity-meta">
                                <span>${journal.researchCount} research ${
                                    journal.researchCount === 1
                                        ? "item"
                                        : "items"
                                }</span>

                                ${
                                    journal.issn
                                        ? `<span>ISSN ${U.escapeHtml(
                                              journal.issn
                                          )}</span>`
                                        : ""
                                }

                                ${
                                    journal.impactFactor
                                        ? `<span>IF ${U.escapeHtml(
                                              journal.impactFactor
                                          )}</span>`
                                        : ""
                                }
                            </div>
                        </div>
                    </article>
                `;
            })
            .join("");
    }

    window.JournalManager = {
        initialize,
        getAll,
        saveAll,
        buildJournal,
        syncFromResearch,
        getById,
        findByName,
        add,
        update,
        remove,
        delete: remove,
        search,
        getResearchCount,
        getWithCounts,
        getTopJournals,
        render
    };
})();