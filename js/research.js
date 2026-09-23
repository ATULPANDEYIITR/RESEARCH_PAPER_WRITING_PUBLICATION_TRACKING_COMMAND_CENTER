(function () {
    "use strict";

    const DEFAULT_RESEARCH = [
        {
            id: "sample-1",
            title: "Artificial Intelligence Adoption in Modern Organizations",
            author: "Atul Pandey",
            type: "Research Paper",
            status: "In Progress",
            journal: "Journal of Emerging Technology",
            publisher: "Academic Press",
            date: "2026-09-01",
            deadline: "2026-10-15",
            keywords: ["AI", "Artificial Intelligence", "Organizations"],
            url: "",
            notes: "",
            callForPaperLink: "",
            proposalDeadline: "",
            fullPaperDeadline: "2026-10-15",
            association: "",
            publicationType: "Research Paper",
            priority: "Medium",
            action: "Working",
            comments: "",
            reminder: ""
        },
        {
            id: "sample-2",
            title: "Post-Quantum Cryptography for Enterprise Security",
            author: "Atul Pandey",
            type: "Technical Paper",
            status: "Draft",
            journal: "International Journal of Cybersecurity",
            publisher: "Tech Research Publications",
            date: "2026-08-15",
            deadline: "2026-11-20",
            keywords: ["Post-Quantum Cryptography", "Cybersecurity", "PQC"],
            url: "",
            notes: "",
            callForPaperLink: "",
            proposalDeadline: "",
            fullPaperDeadline: "2026-11-20",
            association: "",
            publicationType: "Technical Paper",
            priority: "Medium",
            action: "Working",
            comments: "",
            reminder: ""
        },
        {
            id: "sample-3",
            title: "Cloud Computing and Distributed Systems",
            author: "Atul Pandey",
            type: "Review Paper",
            status: "Published",
            journal: "Computing Systems Review",
            publisher: "Global Science Publishers",
            date: "2026-07-10",
            deadline: "",
            keywords: ["Cloud Computing", "Distributed Systems"],
            url: "",
            notes: "",
            callForPaperLink: "",
            proposalDeadline: "",
            fullPaperDeadline: "",
            association: "",
            publicationType: "Review Paper",
            priority: "Low",
            action: "Completed",
            comments: "",
            reminder: ""
        }
    ];

    function getStorage() {
        return window.ResearchStorage || null;
    }

    function getUtils() {
        return window.ResearchUtils || {};
    }

    function normalizeResearch(item) {
        const source = item || {};

        return {
            id: source.id || source.researchId || generateId(),
            title: source.title || source.researchTitle || "",
            author: source.author || "",
            type: source.type || source.publicationType || "Research Paper",
            status: source.status || "Draft",
            journal: source.journal || "",
            publisher: source.publisher || "",
            date: source.date || "",
            deadline: source.deadline || source.fullPaperDeadline || "",
            keywords: Array.isArray(source.keywords)
                ? source.keywords
                : parseKeywords(source.keywords || ""),
            url: source.url || "",
            notes: source.notes || "",
            callForPaperLink: source.callForPaperLink || source.callForPaper || "",
            proposalDeadline: source.proposalDeadline || "",
            fullPaperDeadline: source.fullPaperDeadline || source.deadline || "",
            association: source.association || "",
            publicationType: source.publicationType || source.type || "Research Paper",
            priority: source.priority || "Medium",
            action: source.action || "Working",
            comments: source.comments || "",
            reminder: source.reminder || ""
        };
    }

    function generateId() {
        if (getUtils().generateId) {
            return getUtils().generateId();
        }

        return "research-" +
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).slice(2, 9);
    }

    function parseKeywords(value) {
        if (Array.isArray(value)) {
            return value;
        }

        return String(value)
            .split(",")
            .map(function (item) {
                return item.trim();
            })
            .filter(Boolean);
    }

    function getAll() {
        const storage = getStorage();

        if (!storage) {
            return [];
        }

        const data = storage.getResearch();

        if (!Array.isArray(data)) {
            return [];
        }

        return data.map(normalizeResearch);
    }

    function saveAll(records) {
        const storage = getStorage();

        if (!storage) {
            return false;
        }

        const normalized = Array.isArray(records)
            ? records.map(normalizeResearch)
            : [];

        return storage.saveResearch(normalized);
    }

    function initialize() {
        let records = getAll();

        if (records.length === 0) {
            ensureSampleData();
            records = getAll();
        }

        return records;
    }

    function createResearch(data) {
        const now = new Date().toISOString();

        return normalizeResearch({
            ...data,
            id: data && data.id ? data.id : generateId(),
            createdAt: data && data.createdAt ? data.createdAt : now,
            updatedAt: now
        });
    }

    function add(data) {
        const records = getAll();
        const record = createResearch(data);

        records.push(record);
        saveAll(records);

        return record;
    }

    function update(id, data) {
        const records = getAll();
        const index = records.findIndex(function (item) {
            return String(item.id) === String(id);
        });

        if (index === -1) {
            return null;
        }

        const updated = createResearch({
            ...records[index],
            ...data,
            id: records[index].id,
            createdAt: records[index].createdAt
        });

        records[index] = updated;
        saveAll(records);

        return updated;
    }

    function remove(id) {
        const records = getAll();

        const filtered = records.filter(function (item) {
            return String(item.id) !== String(id);
        });

        if (filtered.length === records.length) {
            return false;
        }

        saveAll(filtered);
        return true;
    }

    function getById(id) {
        return getAll().find(function (item) {
            return String(item.id) === String(id);
        }) || null;
    }

    function search(query) {
        const term = String(query || "").trim().toLowerCase();

        if (!term) {
            return getAll();
        }

        return getAll().filter(function (item) {
            const searchable = [
                item.title,
                item.author,
                item.type,
                item.status,
                item.journal,
                item.publisher,
                item.callForPaperLink,
                item.proposalDeadline,
                item.fullPaperDeadline,
                item.association,
                item.publicationType,
                item.priority,
                item.action,
                item.comments,
                item.reminder,
                item.url,
                item.notes,
                Array.isArray(item.keywords)
                    ? item.keywords.join(" ")
                    : item.keywords
            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(term);
        });
    }

    function filter(criteria) {
        const options = criteria || {};

        return getAll().filter(function (item) {
            if (
                options.status &&
                options.status !== "all" &&
                item.status !== options.status
            ) {
                return false;
            }

            if (
                options.type &&
                options.type !== "all" &&
                item.type !== options.type &&
                item.publicationType !== options.type
            ) {
                return false;
            }

            if (
                options.author &&
                options.author !== "all" &&
                item.author !== options.author
            ) {
                return false;
            }

            if (
                options.journal &&
                options.journal !== "all" &&
                item.journal !== options.journal
            ) {
                return false;
            }

            if (
                options.publisher &&
                options.publisher !== "all" &&
                item.publisher !== options.publisher
            ) {
                return false;
            }

            if (
                options.priority &&
                options.priority !== "all" &&
                item.priority !== options.priority
            ) {
                return false;
            }

            if (
                options.action &&
                options.action !== "all" &&
                item.action !== options.action
            ) {
                return false;
            }

            return true;
        });
    }

    function getPublished() {
        return getAll().filter(function (item) {
            return String(item.status).toLowerCase() === "published";
        });
    }

    function getInProgress() {
        return getAll().filter(function (item) {
            const status = String(item.status).toLowerCase();

            return (
                status.includes("progress") ||
                status.includes("working") ||
                status.includes("draft") ||
                status.includes("submitted") ||
                status.includes("accepted")
            );
        });
    }

    function getUpcomingDeadlines(limit) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return getAll()
            .filter(function (item) {
                const deadline =
                    item.fullPaperDeadline ||
                    item.deadline ||
                    item.proposalDeadline;

                if (!deadline) {
                    return false;
                }

                const date = new Date(deadline);

                if (Number.isNaN(date.getTime())) {
                    return false;
                }

                date.setHours(0, 0, 0, 0);

                return date >= today;
            })
            .sort(function (a, b) {
                const dateA = new Date(
                    a.fullPaperDeadline ||
                    a.deadline ||
                    a.proposalDeadline
                );

                const dateB = new Date(
                    b.fullPaperDeadline ||
                    b.deadline ||
                    b.proposalDeadline
                );

                return dateA - dateB;
            })
            .slice(0, limit || 5);
    }

    function getOverdue() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return getAll().filter(function (item) {
            const deadline =
                item.fullPaperDeadline ||
                item.deadline ||
                item.proposalDeadline;

            if (!deadline) {
                return false;
            }

            const date = new Date(deadline);

            if (Number.isNaN(date.getTime())) {
                return false;
            }

            date.setHours(0, 0, 0, 0);

            return date < today &&
                String(item.status).toLowerCase() !== "published";
        });
    }

    function getRecent(limit) {
        return getAll()
            .sort(function (a, b) {
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);

                return dateB - dateA;
            })
            .slice(0, limit || 5);
    }

    function getStatuses() {
        return unique(
            getAll().map(function (item) {
                return item.status;
            })
        );
    }

    function getTypes() {
        return unique(
            getAll().map(function (item) {
                return item.type || item.publicationType;
            })
        );
    }

    function getAuthors() {
        return unique(
            getAll()
                .map(function (item) {
                    return item.author;
                })
                .filter(Boolean)
        );
    }

    function getJournals() {
        return unique(
            getAll()
                .map(function (item) {
                    return item.journal;
                })
                .filter(Boolean)
        );
    }

    function getPublishers() {
        return unique(
            getAll()
                .map(function (item) {
                    return item.publisher;
                })
                .filter(Boolean)
        );
    }

    function getAssociations() {
        return unique(
            getAll()
                .map(function (item) {
                    return item.association;
                })
                .filter(Boolean)
        );
    }

    function getPriorities() {
        return unique(
            getAll()
                .map(function (item) {
                    return item.priority;
                })
                .filter(Boolean)
        );
    }

    function getActions() {
        return unique(
            getAll()
                .map(function (item) {
                    return item.action;
                })
                .filter(Boolean)
        );
    }

    function getStatistics() {
        const records = getAll();

        const statuses = {};
        const types = {};
        const priorities = {};
        const actions = {};

        records.forEach(function (item) {
            statuses[item.status] = (statuses[item.status] || 0) + 1;

            const type = item.publicationType || item.type || "Unknown";
            types[type] = (types[type] || 0) + 1;

            const priority = item.priority || "Unknown";
            priorities[priority] = (priorities[priority] || 0) + 1;

            const action = item.action || "Unknown";
            actions[action] = (actions[action] || 0) + 1;
        });

        return {
            total: records.length,
            published: getPublished().length,
            inProgress: getInProgress().length,
            overdue: getOverdue().length,
            upcoming: getUpcomingDeadlines(9999).length,
            authors: getAuthors().length,
            journals: getJournals().length,
            publishers: getPublishers().length,
            associations: getAssociations().length,
            priorities: priorities,
            actions: actions,
            statuses: statuses,
            types: types
        };
    }

    function ensureSampleData() {
        const records = getAll();

        if (records.length > 0) {
            return records;
        }

        const samples = DEFAULT_RESEARCH.map(normalizeResearch);
        saveAll(samples);

        return samples;
    }

    function clearAll() {
        return saveAll([]);
    }

    function unique(values) {
        return Array.from(
            new Set(
                values
                    .filter(Boolean)
                    .map(function (value) {
                        return String(value).trim();
                    })
                    .filter(Boolean)
            )
        ).sort(function (a, b) {
            return a.localeCompare(b);
        });
    }

    window.ResearchManager = {
        DEFAULT_RESEARCH: DEFAULT_RESEARCH,
        initialize: initialize,
        getAll: getAll,
        saveAll: saveAll,
        createResearch: createResearch,
        add: add,
        update: update,
        remove: remove,
        delete: remove,
        getById: getById,
        search: search,
        filter: filter,
        getPublished: getPublished,
        getInProgress: getInProgress,
        getUpcomingDeadlines: getUpcomingDeadlines,
        getOverdue: getOverdue,
        getRecent: getRecent,
        getStatuses: getStatuses,
        getTypes: getTypes,
        getAuthors: getAuthors,
        getJournals: getJournals,
        getPublishers: getPublishers,
        getAssociations: getAssociations,
        getPriorities: getPriorities,
        getActions: getActions,
        getStatistics: getStatistics,
        ensureSampleData: ensureSampleData,
        clearAll: clearAll
    };
})();