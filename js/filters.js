(function () {
    "use strict";

    const U = window.ResearchUtils;

    function getResearch() {
        return window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];
    }

    function getUniqueValues(field) {
        return U.uniqueValues(getResearch(), field);
    }

    function getStatuses() {
        return getUniqueValues("status");
    }

    function getTypes() {
        return getUniqueValues("type");
    }

    function getAuthors() {
        return getUniqueValues("author");
    }

    function getJournals() {
        return getUniqueValues("journal");
    }

    function getPublishers() {
        return getUniqueValues("publisher");
    }

    function filterResearch(filters = {}) {
        let results = getResearch();

        const search = U.normalizeText(
            filters.search
        ).toLowerCase();

        const status = U.normalizeText(
            filters.status
        ).toLowerCase();

        const type = U.normalizeText(
            filters.type
        ).toLowerCase();

        const author = U.normalizeText(
            filters.author
        ).toLowerCase();

        const journal = U.normalizeText(
            filters.journal
        ).toLowerCase();

        const publisher = U.normalizeText(
            filters.publisher
        ).toLowerCase();

        if (search) {
            results = results.filter(item => {
                const keywords = Array.isArray(
                    item.keywords
                )
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

                return searchable.includes(search);
            });
        }

        if (status && status !== "all") {
            results = results.filter(
                item =>
                    U.normalizeText(
                        item.status
                    ).toLowerCase() === status
            );
        }

        if (type && type !== "all") {
            results = results.filter(
                item =>
                    U.normalizeText(
                        item.type
                    ).toLowerCase() === type
            );
        }

        if (author && author !== "all") {
            results = results.filter(
                item =>
                    U.normalizeText(
                        item.author
                    ).toLowerCase() === author
            );
        }

        if (journal && journal !== "all") {
            results = results.filter(
                item =>
                    U.normalizeText(
                        item.journal
                    ).toLowerCase() === journal
            );
        }

        if (publisher && publisher !== "all") {
            results = results.filter(
                item =>
                    U.normalizeText(
                        item.publisher
                    ).toLowerCase() === publisher
            );
        }

        if (filters.fromDate) {
            const from = new Date(
                filters.fromDate
            );

            results = results.filter(item => {
                const date = new Date(item.date);

                return (
                    !Number.isNaN(date.getTime()) &&
                    date >= from
                );
            });
        }

        if (filters.toDate) {
            const to = new Date(
                filters.toDate
            );

            to.setHours(
                23,
                59,
                59,
                999
            );

            results = results.filter(item => {
                const date = new Date(item.date);

                return (
                    !Number.isNaN(date.getTime()) &&
                    date <= to
                );
            });
        }

        if (filters.deadlineState) {
            const state = filters.deadlineState;

            results = results.filter(item => {
                if (!item.deadline) {
                    return state === "none";
                }

                if (state === "overdue") {
                    return U.isOverdue(
                        item.deadline
                    );
                }

                if (state === "soon") {
                    return U.isDueSoon(
                        item.deadline,
                        7
                    );
                }

                if (state === "upcoming") {
                    const days =
                        U.daysUntil(
                            item.deadline
                        );

                    return (
                        days !== null &&
                        days >= 0
                    );
                }

                return true;
            });
        }

        return results;
    }

    function applyResearchFilters(
        filters = {},
        containerId = "researchTableBody"
    ) {
        const container =
            document.getElementById(
                containerId
            );

        const emptyState =
            document.getElementById(
                "researchEmptyState"
            );

        if (!container) {
            return [];
        }

        const results =
            filterResearch(filters);

        if (
            emptyState &&
            results.length === 0
        ) {
            emptyState.hidden = false;
        } else if (emptyState) {
            emptyState.hidden = true;
        }

        if (results.length === 0) {
            container.innerHTML = "";
            return [];
        }

        container.innerHTML = results
            .map(item => {
                const statusClass =
                    U.getStatusClass(
                        item.status
                    );

                const keywords =
                    Array.isArray(
                        item.keywords
                    )
                        ? item.keywords
                        : [];

                return `
                    <tr>
                        <td>
                            <div class="table-primary">
                                ${U.escapeHtml(
                                    item.title ||
                                        "Untitled"
                                )}
                            </div>
                            <div class="table-secondary">
                                ${U.escapeHtml(
                                    item.author ||
                                        "Unknown author"
                                )}
                            </div>
                        </td>

                        <td>
                            ${U.escapeHtml(
                                U.getTypeLabel(
                                    item.type
                                )
                            )}
                        </td>

                        <td>
                            <span class="status-badge ${statusClass}">
                                ${U.escapeHtml(
                                    U.formatStatus(
                                        item.status
                                    )
                                )}
                            </span>
                        </td>

                        <td>
                            ${U.escapeHtml(
                                item.journal ||
                                    "Not specified"
                            )}
                        </td>

                        <td>
                            ${
                                item.date
                                    ? U.escapeHtml(
                                          U.formatDate(
                                              item.date
                                          )
                                      )
                                    : "Not set"
                            }
                        </td>

                        <td>
                            ${
                                item.deadline
                                    ? `<span class="${
                                          U.isOverdue(
                                              item.deadline
                                          )
                                              ? "deadline-overdue"
                                              : ""
                                      }">${U.escapeHtml(
                                          U.formatDate(
                                              item.deadline
                                          )
                                      )}</span>`
                                    : "No deadline"
                            }
                        </td>

                        <td>
                            <div class="table-actions">
                                <button
                                    class="table-action"
                                    type="button"
                                    title="Edit research"
                                    data-edit-research="${U.escapeHtml(
                                        item.id
                                    )}"
                                >
                                    Edit
                                </button>

                                <button
                                    class="table-action danger"
                                    type="button"
                                    title="Delete research"
                                    data-delete-research="${U.escapeHtml(
                                        item.id
                                    )}"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join("");

        return results;
    }

    function populateSelect(
        select,
        values,
        allLabel = "All"
    ) {
        if (!select) {
            return;
        }

        const currentValue =
            select.value;

        select.innerHTML = "";

        const allOption =
            document.createElement(
                "option"
            );

        allOption.value = "all";
        allOption.textContent =
            allLabel;

        select.appendChild(
            allOption
        );

        values.forEach(value => {
            const option =
                document.createElement(
                    "option"
                );

            option.value = value;
            option.textContent = value;

            select.appendChild(
                option
            );
        });

        if (
            Array.from(
                select.options
            ).some(
                option =>
                    option.value ===
                    currentValue
            )
        ) {
            select.value =
                currentValue;
        }
    }

    function populateResearchFilters() {
        const statusFilter =
            document.getElementById(
                "statusFilter"
            );

        const typeFilter =
            document.getElementById(
                "typeFilter"
            );

        populateSelect(
            statusFilter,
            getStatuses(),
            "All Statuses"
        );

        populateSelect(
            typeFilter,
            getTypes(),
            "All Types"
        );
    }

    function readResearchFilters() {
        const searchInput =
            document.getElementById(
                "researchSearch"
            );

        const statusFilter =
            document.getElementById(
                "statusFilter"
            );

        const typeFilter =
            document.getElementById(
                "typeFilter"
            );

        return {
            search:
                searchInput?.value || "",
            status:
                statusFilter?.value || "all",
            type:
                typeFilter?.value || "all"
        };
    }

    function resetResearchFilters() {
        const searchInput =
            document.getElementById(
                "researchSearch"
            );

        const statusFilter =
            document.getElementById(
                "statusFilter"
            );

        const typeFilter =
            document.getElementById(
                "typeFilter"
            );

        if (searchInput) {
            searchInput.value = "";
        }

        if (statusFilter) {
            statusFilter.value = "all";
        }

        if (typeFilter) {
            typeFilter.value = "all";
        }

        return applyResearchFilters(
            {
                search: "",
                status: "all",
                type: "all"
            }
        );
    }

    function setupResearchFilters(
        callback
    ) {
        const searchInput =
            document.getElementById(
                "researchSearch"
            );

        const statusFilter =
            document.getElementById(
                "statusFilter"
            );

        const typeFilter =
            document.getElementById(
                "typeFilter"
            );

        const execute = () => {
            const filters =
                readResearchFilters();

            const results =
                applyResearchFilters(
                    filters
                );

            if (
                typeof callback ===
                "function"
            ) {
                callback(
                    results,
                    filters
                );
            }
        };

        if (searchInput) {
            searchInput.addEventListener(
                "input",
                U.debounce(
                    execute,
                    200
                )
            );
        }

        if (statusFilter) {
            statusFilter.addEventListener(
                "change",
                execute
            );
        }

        if (typeFilter) {
            typeFilter.addEventListener(
                "change",
                execute
            );
        }

        populateResearchFilters();
        execute();

        return execute;
    }

    function getFilterSummary(
        filters = {}
    ) {
        const active = [];

        if (
            U.normalizeText(
                filters.search
            )
        ) {
            active.push(
                `Search: ${U.normalizeText(
                    filters.search
                )}`
            );
        }

        if (
            filters.status &&
            filters.status !== "all"
        ) {
            active.push(
                `Status: ${U.formatStatus(
                    filters.status
                )}`
            );
        }

        if (
            filters.type &&
            filters.type !== "all"
        ) {
            active.push(
                `Type: ${U.getTypeLabel(
                    filters.type
                )}`
            );
        }

        if (
            filters.author &&
            filters.author !== "all"
        ) {
            active.push(
                `Author: ${filters.author}`
            );
        }

        if (
            filters.journal &&
            filters.journal !== "all"
        ) {
            active.push(
                `Journal: ${filters.journal}`
            );
        }

        if (
            filters.publisher &&
            filters.publisher !== "all"
        ) {
            active.push(
                `Publisher: ${filters.publisher}`
            );
        }

        return active;
    }

    window.FilterManager = {
        getResearch,
        getUniqueValues,
        getStatuses,
        getTypes,
        getAuthors,
        getJournals,
        getPublishers,
        filterResearch,
        applyResearchFilters,
        populateSelect,
        populateResearchFilters,
        readResearchFilters,
        resetResearchFilters,
        setupResearchFilters,
        getFilterSummary
    };
})();