(function () {
    "use strict";

    const STORAGE = window.ResearchStorage;
    const U = window.ResearchUtils;

    function getAll() {
        return STORAGE.getPublishers();
    }

    function saveAll(publishers) {
        return STORAGE.savePublishers(
            Array.isArray(publishers) ? publishers : []
        );
    }

    function buildPublisher(data) {
        return {
            id: data.id || U.generateId("publisher"),
            name: U.normalizeText(data.name),
            country: U.normalizeText(data.country),
            website: U.normalizeText(data.website),
            description: U.normalizeText(data.description),
            contact: U.normalizeText(data.contact),
            notes: U.normalizeText(data.notes),
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    function syncFromResearch() {
        const publishers = getAll();

        const research = window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];

        const existingNames = new Map();

        publishers.forEach(publisher => {
            const name = U.normalizeText(
                publisher.name
            ).toLowerCase();

            if (name) {
                existingNames.set(name, publisher);
            }
        });

        let changed = false;

        research.forEach(item => {
            const name = U.normalizeText(item.publisher);

            if (!name) {
                return;
            }

            const key = name.toLowerCase();

            if (!existingNames.has(key)) {
                const publisher = buildPublisher({
                    name
                });

                publishers.push(publisher);
                existingNames.set(key, publisher);
                changed = true;
            }
        });

        if (changed) {
            saveAll(publishers);
        }

        return publishers;
    }

    function initialize() {
        return syncFromResearch();
    }

    function getById(id) {
        return (
            getAll().find(
                publisher => publisher.id === id
            ) || null
        );
    }

    function findByName(name) {
        const target = U.normalizeText(name).toLowerCase();

        if (!target) {
            return null;
        }

        return (
            getAll().find(
                publisher =>
                    U.normalizeText(
                        publisher.name
                    ).toLowerCase() === target
            ) || null
        );
    }

    function add(data) {
        const name = U.normalizeText(data?.name);

        if (!name) {
            return {
                success: false,
                message: "Publisher name is required."
            };
        }

        if (findByName(name)) {
            return {
                success: false,
                message:
                    "A publisher with this name already exists."
            };
        }

        const publishers = getAll();
        const publisher = buildPublisher(data);

        publishers.push(publisher);

        if (!saveAll(publishers)) {
            return {
                success: false,
                message: "Unable to save publisher."
            };
        }

        return {
            success: true,
            item: publisher,
            message: "Publisher added successfully."
        };
    }

    function update(id, data) {
        const publishers = getAll();

        const index = publishers.findIndex(
            publisher => publisher.id === id
        );

        if (index === -1) {
            return {
                success: false,
                message: "Publisher not found."
            };
        }

        const name = U.normalizeText(data?.name);

        if (!name) {
            return {
                success: false,
                message: "Publisher name is required."
            };
        }

        const duplicate = publishers.find(
            publisher =>
                publisher.id !== id &&
                U.normalizeText(
                    publisher.name
                ).toLowerCase() === name.toLowerCase()
        );

        if (duplicate) {
            return {
                success: false,
                message:
                    "Another publisher already has this name."
            };
        }

        publishers[index] = {
            ...publishers[index],
            ...buildPublisher({
                ...publishers[index],
                ...data,
                id: publishers[index].id,
                createdAt: publishers[index].createdAt
            })
        };

        if (!saveAll(publishers)) {
            return {
                success: false,
                message: "Unable to update publisher."
            };
        }

        return {
            success: true,
            item: publishers[index],
            message: "Publisher updated successfully."
        };
    }

    function remove(id) {
        const publishers = getAll();

        const filtered = publishers.filter(
            publisher => publisher.id !== id
        );

        if (filtered.length === publishers.length) {
            return {
                success: false,
                message: "Publisher not found."
            };
        }

        if (!saveAll(filtered)) {
            return {
                success: false,
                message: "Unable to delete publisher."
            };
        }

        return {
            success: true,
            message: "Publisher deleted successfully."
        };
    }

    function search(query) {
        const value = U.normalizeText(query).toLowerCase();

        if (!value) {
            return getAll();
        }

        return getAll().filter(publisher => {
            const searchable = [
                publisher.name,
                publisher.country,
                publisher.website,
                publisher.description,
                publisher.contact,
                publisher.notes
            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(value);
        });
    }

    function getResearchCount(publisherName) {
        const research = window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];

        const target = U.normalizeText(
            publisherName
        ).toLowerCase();

        if (!target) {
            return 0;
        }

        return research.filter(
            item =>
                U.normalizeText(
                    item.publisher
                ).toLowerCase() === target
        ).length;
    }

    function getWithCounts() {
        return getAll().map(publisher => ({
            ...publisher,
            researchCount: getResearchCount(
                publisher.name
            )
        }));
    }

    function getTopPublishers(limit = 10) {
        return getWithCounts()
            .sort(
                (a, b) =>
                    b.researchCount -
                    a.researchCount
            )
            .slice(0, limit);
    }

    function render(
        containerId = "publishersGrid"
    ) {
        const container =
            document.getElementById(
                containerId
            );

        if (!container) {
            return;
        }

        const publishers = getWithCounts();

        if (publishers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">◆</div>
                    <h3>No publishers yet</h3>
                    <p>Add research records with publisher names to build your publisher directory.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = publishers
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            )
            .map(publisher => {
                const initials =
                    U.getInitials(
                        publisher.name,
                        "P"
                    );

                return `
                    <article class="entity-card">
                        <div class="entity-avatar">
                            ${U.escapeHtml(initials)}
                        </div>

                        <div class="entity-content">
                            <h3>
                                ${U.escapeHtml(
                                    publisher.name
                                )}
                            </h3>

                            <p>
                                ${U.escapeHtml(
                                    publisher.country ||
                                        publisher.description ||
                                        "Academic Publisher"
                                )}
                            </p>

                            <div class="entity-meta">
                                <span>
                                    ${
                                        publisher.researchCount
                                    }
                                    research
                                    ${
                                        publisher.researchCount ===
                                        1
                                            ? "item"
                                            : "items"
                                    }
                                </span>

                                ${
                                    publisher.website
                                        ? `<span>Website available</span>`
                                        : ""
                                }
                            </div>
                        </div>
                    </article>
                `;
            })
            .join("");
    }

    window.PublisherManager = {
        initialize,
        getAll,
        saveAll,
        buildPublisher,
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
        getTopPublishers,
        render
    };
})();