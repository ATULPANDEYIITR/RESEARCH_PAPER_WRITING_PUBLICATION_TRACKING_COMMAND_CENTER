(function () {
    "use strict";

    const U = window.ResearchUtils;

    function getResearch() {
        return window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];
    }

    function searchResearch(query) {
        const value = U.normalizeText(query).toLowerCase();

        if (!value) {
            return getResearch();
        }

        return getResearch().filter(item => {
            const keywords = Array.isArray(item.keywords)
                ? item.keywords.join(" ")
                : String(item.keywords || "");

            const searchable = [
                item.title,
                item.author,
                item.type,
                item.status,
                item.journal,
                item.publisher,
                keywords,
                item.notes
            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(value);
        });
    }

    function searchAuthors(query) {
        if (!window.AuthorManager) {
            return [];
        }

        return window.AuthorManager.search(query);
    }

    function searchJournals(query) {
        if (!window.JournalManager) {
            return [];
        }

        return window.JournalManager.search(query);
    }

    function searchPublishers(query) {
        if (!window.PublisherManager) {
            return [];
        }

        return window.PublisherManager.search(query);
    }

    function globalSearch(query) {
        const value = U.normalizeText(query);

        if (!value) {
            return {
                research: [],
                authors: [],
                journals: [],
                publishers: [],
                total: 0
            };
        }

        const research = searchResearch(value);
        const authors = searchAuthors(value);
        const journals = searchJournals(value);
        const publishers = searchPublishers(value);

        return {
            research,
            authors,
            journals,
            publishers,
            total:
                research.length +
                authors.length +
                journals.length +
                publishers.length
        };
    }

    function highlightText(text, query) {
        const safeText = U.escapeHtml(text);

        if (!query) {
            return safeText;
        }

        const escapedQuery = String(query).replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        if (!escapedQuery) {
            return safeText;
        }

        const expression = new RegExp(
            `(${escapedQuery})`,
            "gi"
        );

        return safeText.replace(
            expression,
            "<mark>$1</mark>"
        );
    }

    function createResearchResult(item, query = "") {
        return `
            <div class="search-result search-result-research">
                <div class="search-result-icon">R</div>
                <div class="search-result-content">
                    <h4>
                        ${highlightText(item.title || "Untitled", query)}
                    </h4>
                    <p>
                        ${U.escapeHtml(
                            item.author || "Unknown author"
                        )}
                        ${
                            item.journal
                                ? ` · ${U.escapeHtml(item.journal)}`
                                : ""
                        }
                    </p>
                    <span class="status-badge ${U.getStatusClass(
                        item.status
                    )}">
                        ${U.escapeHtml(
                            U.formatStatus(item.status)
                        )}
                    </span>
                </div>
            </div>
        `;
    }

    function createAuthorResult(item, query = "") {
        return `
            <div class="search-result search-result-author">
                <div class="search-result-icon">A</div>
                <div class="search-result-content">
                    <h4>
                        ${highlightText(item.name || "Unknown", query)}
                    </h4>
                    <p>
                        ${U.escapeHtml(
                            item.affiliation ||
                                "Independent Researcher"
                        )}
                    </p>
                </div>
            </div>
        `;
    }

    function createJournalResult(item, query = "") {
        return `
            <div class="search-result search-result-journal">
                <div class="search-result-icon">J</div>
                <div class="search-result-content">
                    <h4>
                        ${highlightText(item.name || "Unknown", query)}
                    </h4>
                    <p>
                        ${U.escapeHtml(
                            item.publisher ||
                                item.field ||
                                "Academic Journal"
                        )}
                    </p>
                </div>
            </div>
        `;
    }

    function createPublisherResult(item, query = "") {
        return `
            <div class="search-result search-result-publisher">
                <div class="search-result-icon">P</div>
                <div class="search-result-content">
                    <h4>
                        ${highlightText(item.name || "Unknown", query)}
                    </h4>
                    <p>
                        ${U.escapeHtml(
                            item.country ||
                                "Academic Publisher"
                        )}
                    </p>
                </div>
            </div>
        `;
    }

    function renderResults(
        container,
        results,
        query = "",
        options = {}
    ) {
        if (!container) {
            return;
        }

        const maxResults =
            Number.isFinite(options.maxResults)
                ? options.maxResults
                : 50;

        const allResults = [];

        results.research.forEach(item => {
            allResults.push({
                type: "research",
                item
            });
        });

        results.authors.forEach(item => {
            allResults.push({
                type: "author",
                item
            });
        });

        results.journals.forEach(item => {
            allResults.push({
                type: "journal",
                item
            });
        });

        results.publishers.forEach(item => {
            allResults.push({
                type: "publisher",
                item
            });
        });

        const visibleResults = allResults.slice(
            0,
            maxResults
        );

        if (visibleResults.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⌕</div>
                    <h3>No results found</h3>
                    <p>Try a different research title, author, journal, publisher, or keyword.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = visibleResults
            .map(result => {
                if (result.type === "research") {
                    return createResearchResult(
                        result.item,
                        query
                    );
                }

                if (result.type === "author") {
                    return createAuthorResult(
                        result.item,
                        query
                    );
                }

                if (result.type === "journal") {
                    return createJournalResult(
                        result.item,
                        query
                    );
                }

                return createPublisherResult(
                    result.item,
                    query
                );
            })
            .join("");
    }

    function setupInput(input, output, options = {}) {
        if (!input || !output) {
            return null;
        }

        const executeSearch = U.debounce(() => {
            const query = input.value;
            const results = globalSearch(query);

            renderResults(
                output,
                results,
                query,
                options
            );

            if (typeof options.onSearch === "function") {
                options.onSearch(results, query);
            }
        }, options.delay || 200);

        input.addEventListener(
            "input",
            executeSearch
        );

        input.addEventListener(
            "keydown",
            event => {
                if (event.key === "Escape") {
                    input.value = "";
                    executeSearch();
                    input.blur();
                }
            }
        );

        return executeSearch;
    }

    function renderQuickSearch(
        query,
        containerId = "quickSearchResults"
    ) {
        const container =
            document.getElementById(containerId);

        if (!container) {
            return;
        }

        const results = globalSearch(query);

        renderResults(
            container,
            results,
            query,
            {
                maxResults: 8
            }
        );
    }

    function getSuggestions(query, limit = 8) {
        const value = U.normalizeText(query).toLowerCase();

        if (!value) {
            return [];
        }

        const suggestions = new Set();

        getResearch().forEach(item => {
            [
                item.title,
                item.author,
                item.journal,
                item.publisher,
                ...(Array.isArray(item.keywords)
                    ? item.keywords
                    : [])
            ].forEach(value => {
                const text = U.normalizeText(value);

                if (
                    text &&
                    text.toLowerCase().includes(value)
                ) {
                    suggestions.add(text);
                }
            });
        });

        return Array.from(suggestions)
            .sort((a, b) =>
                a.localeCompare(b)
            )
            .slice(0, limit);
    }

    function clearSearch(input, output) {
        if (input) {
            input.value = "";
        }

        if (output) {
            output.innerHTML = "";
        }
    }

    window.SearchManager = {
        getResearch,
        searchResearch,
        searchAuthors,
        searchJournals,
        searchPublishers,
        globalSearch,
        highlightText,
        createResearchResult,
        createAuthorResult,
        createJournalResult,
        createPublisherResult,
        renderResults,
        setupInput,
        renderQuickSearch,
        getSuggestions,
        clearSearch
    };
})();