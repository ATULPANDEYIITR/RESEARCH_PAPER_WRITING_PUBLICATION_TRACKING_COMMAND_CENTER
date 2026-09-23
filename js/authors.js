(function () {
    "use strict";

    const STORAGE = window.ResearchStorage;
    const U = window.ResearchUtils;

    function getAll() {
        return STORAGE.getAuthors();
    }

    function saveAll(authors) {
        return STORAGE.saveAuthors(
            Array.isArray(authors) ? authors : []
        );
    }

    function buildAuthor(data) {
        return {
            id: data.id || U.generateId("author"),
            name: U.normalizeText(data.name),
            affiliation: U.normalizeText(data.affiliation),
            email: U.normalizeText(data.email),
            orcid: U.normalizeText(data.orcid),
            website: U.normalizeText(data.website),
            country: U.normalizeText(data.country),
            notes: U.normalizeText(data.notes),
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    function syncFromResearch() {
        const authors = getAll();
        const research = window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];

        const existingNames = new Map();

        authors.forEach(author => {
            const name = U.normalizeText(author.name).toLowerCase();

            if (name) {
                existingNames.set(name, author);
            }
        });

        let changed = false;

        research.forEach(item => {
            const name = U.normalizeText(item.author);

            if (!name) {
                return;
            }

            const key = name.toLowerCase();

            if (!existingNames.has(key)) {
                const author = buildAuthor({
                    name
                });

                authors.push(author);
                existingNames.set(key, author);
                changed = true;
            }
        });

        if (changed) {
            saveAll(authors);
        }

        return authors;
    }

    function initialize() {
        return syncFromResearch();
    }

    function getById(id) {
        return getAll().find(author => author.id === id) || null;
    }

    function findByName(name) {
        const target = U.normalizeText(name).toLowerCase();

        if (!target) {
            return null;
        }

        return (
            getAll().find(
                author =>
                    U.normalizeText(author.name).toLowerCase() ===
                    target
            ) || null
        );
    }

    function add(data) {
        const name = U.normalizeText(data?.name);

        if (!name) {
            return {
                success: false,
                message: "Author name is required."
            };
        }

        if (findByName(name)) {
            return {
                success: false,
                message: "An author with this name already exists."
            };
        }

        const authors = getAll();
        const author = buildAuthor(data);

        authors.push(author);

        if (!saveAll(authors)) {
            return {
                success: false,
                message: "Unable to save author."
            };
        }

        return {
            success: true,
            item: author,
            message: "Author added successfully."
        };
    }

    function update(id, data) {
        const authors = getAll();
        const index = authors.findIndex(author => author.id === id);

        if (index === -1) {
            return {
                success: false,
                message: "Author not found."
            };
        }

        const name = U.normalizeText(data?.name);

        if (!name) {
            return {
                success: false,
                message: "Author name is required."
            };
        }

        const duplicate = authors.find(
            author =>
                author.id !== id &&
                U.normalizeText(author.name).toLowerCase() ===
                    name.toLowerCase()
        );

        if (duplicate) {
            return {
                success: false,
                message: "Another author already has this name."
            };
        }

        authors[index] = {
            ...authors[index],
            ...buildAuthor({
                ...authors[index],
                ...data,
                id: authors[index].id,
                createdAt: authors[index].createdAt
            })
        };

        if (!saveAll(authors)) {
            return {
                success: false,
                message: "Unable to update author."
            };
        }

        return {
            success: true,
            item: authors[index],
            message: "Author updated successfully."
        };
    }

    function remove(id) {
        const authors = getAll();
        const filtered = authors.filter(author => author.id !== id);

        if (filtered.length === authors.length) {
            return {
                success: false,
                message: "Author not found."
            };
        }

        if (!saveAll(filtered)) {
            return {
                success: false,
                message: "Unable to delete author."
            };
        }

        return {
            success: true,
            message: "Author deleted successfully."
        };
    }

    function search(query) {
        const value = U.normalizeText(query).toLowerCase();

        if (!value) {
            return getAll();
        }

        return getAll().filter(author => {
            const searchable = [
                author.name,
                author.affiliation,
                author.email,
                author.orcid,
                author.website,
                author.country,
                author.notes
            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(value);
        });
    }

    function getResearchCount(authorName) {
        const research = window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];

        const target = U.normalizeText(authorName).toLowerCase();

        if (!target) {
            return 0;
        }

        return research.filter(
            item =>
                U.normalizeText(item.author).toLowerCase() === target
        ).length;
    }

    function getWithCounts() {
        return getAll().map(author => ({
            ...author,
            researchCount: getResearchCount(author.name)
        }));
    }

    function getTopAuthors(limit = 10) {
        return getWithCounts()
            .sort((a, b) => b.researchCount - a.researchCount)
            .slice(0, limit);
    }

    function render(containerId = "authorsGrid") {
        const container = document.getElementById(containerId);

        if (!container) {
            return;
        }

        const authors = getWithCounts();

        if (authors.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">◎</div>
                    <h3>No authors yet</h3>
                    <p>Add research records with author names to build your author directory.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = authors
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(author => {
                const initials = U.getInitials(author.name);

                return `
                    <article class="entity-card">
                        <div class="entity-avatar">${U.escapeHtml(initials)}</div>
                        <div class="entity-content">
                            <h3>${U.escapeHtml(author.name)}</h3>
                            <p>${U.escapeHtml(
                                author.affiliation || "Independent Researcher"
                            )}</p>
                            <div class="entity-meta">
                                <span>${author.researchCount} research ${
                                    author.researchCount === 1
                                        ? "item"
                                        : "items"
                                }</span>
                                ${
                                    author.country
                                        ? `<span>${U.escapeHtml(
                                              author.country
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

    window.AuthorManager = {
        initialize,
        getAll,
        saveAll,
        buildAuthor,
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
        getTopAuthors,
        render
    };
})();