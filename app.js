       const days =
            deadline
                ? daysUntil(deadline)
                : null;

        let deadlineClass =
            "rt-deadline-normal";

        if (days !== null) {
            if (days < 0) {
                deadlineClass =
                    "rt-deadline-overdue";
            } else if (days === 0) {
                deadlineClass =
                    "rt-deadline-today";
            } else if (days <= 7) {
                deadlineClass =
                    "rt-deadline-soon";
            }
        }

        const keywords =
            Array.isArray(record.keywords)
                ? record.keywords.slice(0, 3)
                : [];

        return `
            <tr
                class="rt-clickable-record"
                data-research-row="${escapeHTML(id)}"
                tabindex="0"
            >

                <td>
                    <input
                        type="checkbox"
                        data-research-select="${escapeHTML(id)}"
                        ${APP.state.selectedResearch.has(id)
                            ? "checked"
                            : ""}
                    >
                </td>

                <td>
                    <button
                        type="button"
                        class="rt-favorite-button ${favorite ? "is-favorite" : ""}"
                        data-favorite-research="${escapeHTML(id)}"
                        aria-label="${favorite ? "Remove favorite" : "Add favorite"}"
                        title="${favorite ? "Remove favorite" : "Add favorite"}"
                    >
                        ${favorite ? "★" : "☆"}
                    </button>
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            record.title ||
                            "Untitled Research"
                        )}
                    </strong>

                    <div style="
                        margin-top:5px;
                        color:#777;
                        font-size:10px;
                    ">
                        ${escapeHTML(id)}
                    </div>
                </td>

                <td>
                    ${escapeHTML(
                        record.author ||
                        "Unknown"
                    )}
                </td>

                <td>
                    <span class="rt-status-chip ${statusClass(record.status)}">
                        ${escapeHTML(
                            record.status ||
                            "Not set"
                        )}
                    </span>
                </td>

                <td>
                    ${escapeHTML(
                        record.publicationType ||
                        record.type ||
                        "Not set"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.journal ||
                        "—"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.publisher ||
                        "—"
                    )}
                </td>

                <td>
                    <span class="rt-deadline-box ${deadlineClass}">
                        ${deadline
                            ? (
                                days < 0
                                    ? `${Math.abs(days)}d overdue`
                                    : days === 0
                                        ? "Today"
                                        : `${days}d`
                            )
                            : "—"}
                    </span>
                </td>

                <td>
                    ${keywords.length
                        ? keywords.map(keyword => `
                            <span class="rt-tag" style="
                                color:#fff;
                                background:rgba(35,156,255,.10);
                                border:1px solid rgba(35,156,255,.22);
                                margin:2px;
                            ">
                                ${escapeHTML(keyword)}
                            </span>
                        `).join("")
                        : "—"}
                </td>

            </tr>
        `;
    };

    const attachResearchRowHandlers = () => {
        $$("[data-research-row]").forEach(row => {
            row.addEventListener("click", event => {
                if (
                    event.target.closest(
                        "[data-research-select]"
                    ) ||
                    event.target.closest(
                        "[data-favorite-research]"
                    ) ||
                    event.target.closest("button") ||
                    event.target.closest("a") ||
                    event.target.closest("input")
                ) {
                    return;
                }

                const id =
                    row.getAttribute(
                        "data-research-row"
                    );

                if (id) {
                    openDetail(id, true);
                }
            });

            row.addEventListener("keydown", event => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();

                    const id =
                        row.getAttribute(
                            "data-research-row"
                        );

                    if (id) {
                        openDetail(id, true);
                    }
                }
            });
        });

        $$("[data-research-select]").forEach(input => {
            input.addEventListener("click", event => {
                event.stopPropagation();
            });

            input.addEventListener("change", event => {
                const id =
                    event.target.getAttribute(
                        "data-research-select"
                    );

                if (!id) return;

                if (event.target.checked) {
                    APP.state.selectedResearch.add(id);
                } else {
                    APP.state.selectedResearch.delete(id);
                }

                updateSelectionBar();
            });
        });

        $$("[data-favorite-research]").forEach(button => {
            button.addEventListener("click", event => {
                event.stopPropagation();

                const id =
                    button.getAttribute(
                        "data-favorite-research"
                    );

                if (id) {
                    toggleFavorite(id);
                    refreshResearchPage();
                }
            });
        });
    };

    /* ================================================================
       BULK OPERATIONS
       ================================================================ */

    const ensureSelectionBar = () => {
        if (byId("rtSelectionBar")) return;

        const bar = document.createElement("div");

        bar.id = "rtSelectionBar";
        bar.className = "rt-selection-bar";

        bar.innerHTML = `
            <span class="rt-selection-count">
                0 selected
            </span>

            <button
                type="button"
                class="rt-mini-button"
                data-bulk-action="published"
            >
                Published
            </button>

            <button
                type="button"
                class="rt-mini-button"
                data-bulk-action="working"
            >
                Working
            </button>

            <button
                type="button"
                class="rt-mini-button"
                data-bulk-action="delete"
            >
                Delete
            </button>

            <button
                type="button"
                class="rt-mini-button"
                data-bulk-action="clear"
            >
                Clear
            </button>
        `;

        document.body.appendChild(bar);

        $$("[data-bulk-action]", bar).forEach(button => {
            button.addEventListener("click", () => {
                bulkAction(
                    button.getAttribute(
                        "data-bulk-action"
                    )
                );
            });
        });
    };

    const updateSelectionBar = () => {
        ensureSelectionBar();

        const bar =
            byId("rtSelectionBar");

        const count =
            APP.state.selectedResearch.size;

        const countElement =
            $(".rt-selection-count", bar);

        if (countElement) {
            countElement.textContent =
                `${count} selected`;
        }

        bar.classList.toggle(
            "is-visible",
            count > 0
        );
    };

    const bulkAction = action => {
        const selected =
            Array.from(
                APP.state.selectedResearch
            );

        if (!selected.length) return;

        if (action === "clear") {
            APP.state.selectedResearch.clear();
            refreshResearchPage();
            return;
        }

        const records = getResearch();

        if (action === "delete") {
            const confirmed =
                window.confirm(
                    `Delete ${selected.length} selected research records?`
                );

            if (!confirmed) return;

            const selectedSet =
                new Set(selected);

            const remaining =
                records.filter(
                    item =>
                        !selectedSet.has(
                            safeString(item.id)
                        )
                );

            saveRecords(remaining);

            selected.forEach(id => {
                APP.state.favorites.delete(id);
            });

            logActivity(
                "bulk-delete",
                `Deleted ${selected.length} research records`
            );

            APP.state.selectedResearch.clear();

            savePreferences();
            refreshApplication();

            toast(
                `${selected.length} records deleted.`,
                "success"
            );

            return;
        }

        let newStatus = "";

        if (action === "published") {
            newStatus = "Published";
        }

        if (action === "working") {
            newStatus = "Working";
        }

        if (!newStatus) return;

        const selectedSet =
            new Set(selected);

        records.forEach(record => {
            if (
                selectedSet.has(
                    safeString(record.id)
                )
            ) {
                record.status = newStatus;
                record.updatedAt = nowISO();
            }
        });

        saveRecords(records);

        logActivity(
            "bulk-status",
            `Changed status of ${selected.length} records to ${newStatus}`
        );

        APP.state.selectedResearch.clear();

        refreshApplication();

        toast(
            `${selected.length} records updated.`,
            "success"
        );
    };

    /* ================================================================
       GLOBAL SEARCH
       ================================================================ */

    const globalSearch = query => {
        const value = normalize(query);

        if (!value) return [];

        return getResearch()
            .map(record => {
                const fields = [
                    ["Title", record.title],
                    ["Author", record.author],
                    ["Status", record.status],
                    ["Type", record.type],
                    ["Publication", record.publicationType],
                    ["Journal", record.journal],
                    ["Publisher", record.publisher],
                    ["Association", record.association],
                    ["Keywords", record.keywords],
                    ["Comments", record.comments],
                    ["Notes", record.notes]
                ];

                const searchable =
                    fields
                        .map(([label, field]) =>
                            `${label} ${safeString(field)}`
                        )
                        .join(" ");

                const normalized =
                    normalize(searchable);

                if (!normalized.includes(value)) {
                    return null;
                }

                let score = 1;

                if (
                    normalize(record.title)
                        .includes(value)
                ) {
                    score += 10;
                }

                if (
                    normalize(record.author)
                        .includes(value)
                ) {
                    score += 4;
                }

                if (
                    normalize(record.status)
                        .includes(value)
                ) {
                    score += 2;
                }

                return {
                    record,
                    score
                };
            })
            .filter(Boolean)
            .sort(
                (a, b) =>
                    b.score - a.score
            )
            .map(entry => entry.record);
    };

    const showGlobalSearchResults = query => {
        const input = byId("globalSearch");

        if (!input) return;

        let panel =
            byId("rtGlobalSearchResults");

        if (!panel) {
            panel = document.createElement("div");

            panel.id =
                "rtGlobalSearchResults";

            panel.style.cssText = `
                position:fixed;
                top:72px;
                right:20px;
                z-index:7000;
                width:min(620px,calc(100vw - 30px));
                max-height:70vh;
                overflow:auto;
                padding:8px;
                border:1px solid rgba(255,255,255,.12);
                border-radius:18px;
                background:#0d0d12;
                box-shadow:0 30px 90px rgba(0,0,0,.65);
                backdrop-filter:blur(18px);
            `;

            document.body.appendChild(panel);
        }

        if (!query.trim()) {
            panel.remove();
            return;
        }

        const results =
            globalSearch(query)
                .slice(0, 12);

        if (!results.length) {
            panel.innerHTML = `
                <div style="
                    padding:22px;
                    color:#888;
                    text-align:center;
                ">
                    No research found.
                </div>
            `;

            return;
        }

        panel.innerHTML =
            results.map(record => `
                <button
                    type="button"
                    data-global-result="${escapeHTML(record.id)}"
                    style="
                        width:100%;
                        display:block;
                        padding:14px;
                        border:0;
                        border-bottom:1px solid rgba(255,255,255,.06);
                        text-align:left;
                        color:#fff;
                        background:transparent;
                        cursor:pointer;
                    "
                >
                    <strong>
                        ${escapeHTML(record.title || "Untitled")}
                    </strong>

                    <div style="
                        margin-top:5px;
                        color:#888;
                        font-size:11px;
                    ">
                        ${escapeHTML(record.author || "")}
                        ${record.status
                            ? " • " + escapeHTML(record.status)
                            : ""}
                    </div>
                </button>
            `).join("");

        $$("[data-global-result]", panel)
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        const id =
                            button.getAttribute(
                                "data-global-result"
                            );

                        panel.remove();

                        if (id) {
                            showSection(
                                "research",
                                {
                                    pushHistory: true
                                }
                            );

                            setTimeout(() => {
                                openDetail(id, true);
                            }, 80);
                        }
                    }
                );
            });
    };

    /* ================================================================
       SAVED SEARCHES
       ================================================================ */

    const saveCurrentSearch = () => {
        const search =
            getResearchSearchValue();

        if (!search) {
            toast(
                "Enter a research search first.",
                "warning"
            );
            return;
        }

        const name =
            window.prompt(
                "Name this saved search:",
                search
            );

        if (!name) return;

        APP.state.savedSearches.push({
            id:
                "search-" +
                Date.now(),
            name,
            query: search,
            status:
                byId("statusFilter")?.value || "",
            type:
                byId("typeFilter")?.value || "",
            author:
                byId("authorFilter")?.value || "",
            journal:
                byId("journalFilter")?.value || "",
            publisher:
                byId("publisherFilter")?.value || ""
        });

        savePreferences();

        toast(
            "Search saved.",
            "success"
        );
    };

    const runSavedSearch = saved => {
        showSection(
            "research",
            {
                pushHistory: true
            }
        );

        setTimeout(() => {
            setField(
                "researchSearch",
                saved.query
            );

            setField(
                "statusFilter",
                saved.status
            );

            setField(
                "typeFilter",
                saved.type
            );

            setField(
                "authorFilter",
                saved.author
            );

            setField(
                "journalFilter",
                saved.journal
            );

            setField(
                "publisherFilter",
                saved.publisher
            );

            refreshResearchPage();
        }, 50);
    };

    /* ================================================================
       COMMAND PALETTE
       ================================================================ */

    const commandDefinitions = () => [
        {
            title: "Go to Dashboard",
            keywords: "dashboard home",
            action: () =>
                showSection("dashboard")
        },

        {
            title: "Go to Research",
            keywords: "research papers publications",
            action: () =>
                showSection("research")
        },

        {
            title: "Go to Authors",
            keywords: "authors researchers",
            action: () =>
                showSection("authors")
        },

        {
            title: "Go to Journals",
            keywords: "journals publications",
            action: () =>
                showSection("journals")
        },

        {
            title: "Go to Publishers",
            keywords: "publishers",
            action: () =>
                showSection("publishers")
        },

        {
            title: "Open Calendar",
            keywords: "calendar deadline dates",
            action: () =>
                showSection("calendar")
        },

        {
            title: "Open Analytics",
            keywords: "analytics statistics charts",
            action: () =>
                showSection("analytics")
        },

        {
            title: "Add Research",
            keywords: "new create research",
            action: addResearch
        },

        {
            title: "Export JSON",
            keywords: "backup export data json",
            action: exportJSON
        },

        {
            title: "Export CSV",
            keywords: "export spreadsheet csv",
            action: exportCSV
        },

        {
            title: "Save Current Search",
            keywords: "save search filter",
            action: saveCurrentSearch
        },

        {
            title: "Toggle Compact View",
            keywords: "density compact comfortable",
            action: toggleDensity
        },

        {
            title: "Toggle Focus Mode",
            keywords: "focus distraction free",
            action: toggleFocusMode
        }
    ];

    const openCommandPalette = () => {
        if (byId("rtCommandOverlay")) return;

        APP.state.commandPaletteOpen = true;

        const overlay =
            document.createElement("div");

        overlay.id = "rtCommandOverlay";
        overlay.className = "rt-command-overlay";

        overlay.innerHTML = `
            <div
                class="rt-command"
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
            >
                <input
                    type="text"
                    class="rt-command-input"
                    id="rtCommandInput"
                    placeholder="Search commands..."
                    autocomplete="off"
                >

                <div
                    class="rt-command-list"
                    id="rtCommandList"
                ></div>
            </div>
        `;

        document.body.appendChild(overlay);

        const input =
            byId("rtCommandInput");

        const renderCommands = query => {
            const normalized =
                normalize(query);

            const commands =
                commandDefinitions()
                    .filter(command => {
                        if (!normalized) return true;

                        return normalize(
                            command.title +
                            " " +
                            command.keywords
                        ).includes(normalized);
                    })
                    .slice(0, 15);

            const list =
                byId("rtCommandList");

            if (!list) return;

            list.innerHTML =
                commands.map(
                    (command, index) => `
                        <button
                            type="button"
                            class="rt-command-item ${index === 0 ? "is-active" : ""}"
                            data-command-index="${index}"
                        >
                            <span>
                                ${escapeHTML(command.title)}
                            </span>
                        </button>
                    `
                ).join("");

            $$("[data-command-index]", list)
                .forEach(button => {
                    button.addEventListener(
                        "click",
                        () => {
                            const index =
                                Number(
                                    button.getAttribute(
                                        "data-command-index"
                                    )
                                );

                            const selected =
                                commands[index];

                            closeCommandPalette();

                            selected?.action();
                        }
                    );
                });
        };

        input.addEventListener(
            "input",
            () => renderCommands(
                input.value
            )
        );

        overlay.addEventListener(
            "click",
            event => {
                if (event.target === overlay) {
                    closeCommandPalette();
                }
            }
        );

        renderCommands("");

        setTimeout(() => input.focus(), 30);
    };

    const closeCommandPalette = () => {
        const overlay =
            byId("rtCommandOverlay");

        overlay?.remove();

        APP.state.commandPaletteOpen = false;
    };

    /* ================================================================
       DENSITY / FOCUS
       ================================================================ */

    const toggleDensity = () => {
        APP.state.density =
            APP.state.density === "comfortable"
                ? "compact"
                : "comfortable";

        document.body.classList.toggle(
            "rt-compact-mode",
            APP.state.density === "compact"
        );

        savePreferences();

        toast(
            APP.state.density === "compact"
                ? "Compact view enabled."
                : "Comfortable view enabled.",
            "info"
        );
    };

    const toggleFocusMode = () => {
        APP.state.focusMode =
            !APP.state.focusMode;

        document.body.classList.toggle(
            "rt-focus-mode",
            APP.state.focusMode
        );

        savePreferences();

        toast(
            APP.state.focusMode
                ? "Focus mode enabled."
                : "Focus mode disabled.",
            "info"
        );
    };

    /* ================================================================
       EXPORT
       ================================================================ */

    const exportJSON = () => {
        const payload = {
            exportedAt: nowISO(),
            application: "Research Tracker",
            version: APP.version,
            research: getResearch(),
            favorites:
                Array.from(
                    APP.state.favorites
                ),
            activity:
                getActivity()
        };

        const filename =
            `research-tracker-backup-${new Date()
                .toISOString()
                .slice(0, 10)}.json`;

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        payload,
                        null,
                        2
                    )
                ],
                {
                    type: "application/json"
                }
            );

        downloadBlob(
            blob,
            filename
        );

        toast(
            "JSON backup exported.",
            "success"
        );
    };

    const csvEscape = value => {
        const text = safeString(value)
            .replace(/"/g, '""');

        return `"${text}"`;
    };

    const exportCSV = () => {
        const records =
            getResearch();

        if (!records.length) {
            toast(
                "There is no research data to export.",
                "warning"
            );
            return;
        }

        const headers = [
            "ID",
            "Title",
            "Author",
            "Research Type",
            "Publication Type",
            "Status",
            "Journal",
            "Publisher",
            "Association",
            "Priority",
            "Action",
            "Research Date",
            "Proposal Deadline",
            "Full Paper Deadline",
            "Deadline",
            "Call For Papers",
            "URL",
            "Keywords",
            "Comments",
            "Reminder",
            "Notes"
        ];

        const rows = records.map(record => [
            record.id,
            record.title,
            record.author,
            record.type,
            record.publicationType,
            record.status,
            record.journal,
            record.publisher,
            record.association,
            record.priority,
            record.action,
            record.date,
            record.proposalDeadline,
            record.fullPaperDeadline,
            record.deadline,
            record.callForPaperLink,
            record.url,
            Array.isArray(record.keywords)
                ? record.keywords.join("; ")
                : record.keywords,
            record.comments,
            record.reminder,
            record.notes
        ]);

        const csv = [
            headers.map(csvEscape).join(","),
            ...rows.map(
                row =>
                    row.map(csvEscape).join(",")
            )
        ].join("\r\n");

        const blob =
            new Blob(
                ["\ufeff" + csv],
                {
                    type: "text/csv;charset=utf-8"
                }
            );

        downloadBlob(
            blob,
            `research-tracker-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`
        );

        toast(
            "CSV exported.",
            "success"
        );
    };

    const downloadBlob = (
        blob,
        filename
    ) => {
        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);

        link.click();

        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    };

    /* ================================================================
       DEADLINE INTELLIGENCE
       ================================================================ */

    const getDeadlineRecords = () => {
        return getResearch()
            .map(record => {
                const deadline =
                    record.fullPaperDeadline ||
                    record.deadline ||
                    record.proposalDeadline;

                return {
                    record,
                    deadline,
                    days: daysUntil(deadline)
                };
            })
            .filter(item =>
                item.deadline &&
                item.days !== null
            );
    };

    const deadlineSummary = () => {
        const records =
            getDeadlineRecords();

        return {
            overdue:
                records.filter(
                    item => item.days < 0
                ).length,

            today:
                records.filter(
                    item => item.days === 0
                ).length,

            next7:
                records.filter(
                    item =>
                        item.days > 0 &&
                        item.days <= 7
                ).length,

            next30:
                records.filter(
                    item =>
                        item.days > 7 &&
                        item.days <= 30
                ).length
        };
    };

    const injectDeadlineHealth = () => {
        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (!dashboard) return;

        let banner =
            byId("rtDeadlineHealth");

        if (!banner) {
            banner =
                document.createElement("div");

            banner.id =
                "rtDeadlineHealth";

            banner.className =
                "rt-health-banner";

            dashboard.prepend(banner);
        }

        const summary =
            deadlineSummary();

        banner.innerHTML = `
            <div class="rt-health-item">
                <span
                    class="rt-health-number"
                    style="color:#ff3b4f;"
                >
                    ${summary.overdue}
                </span>

                <span class="rt-health-label">
                    Overdue
                </span>
            </div>

            <div class="rt-health-item">
                <span
                    class="rt-health-number"
                    style="color:#ffd400;"
                >
                    ${summary.today}
                </span>

                <span class="rt-health-label">
                    Due today
                </span>
            </div>

            <div class="rt-health-item">
                <span
                    class="rt-health-number"
                    style="color:#22e06f;"
                >
                    ${summary.next7}
                </span>

                <span class="rt-health-label">
                    Next 7 days
                </span>
            </div>

            <div class="rt-health-item">
                <span
                    class="rt-health-number"
                    style="color:#239cff;"
                >
                    ${summary.next30}
                </span>

                <span class="rt-health-label">
                    Next 30 days
                </span>
            </div>
        `;
    };

    /* ================================================================
       AUTOSAVE DRAFT
       ================================================================ */

    let draftTimer = null;

    const saveDraft = () => {
        const form = byId("researchForm");

        if (!form || !APP.state.editOpen) {
            return;
        }

        const draft = {};

        $$("input, select, textarea", form)
            .forEach(element => {
                if (!element.id) return;

                draft[element.id] =
                    element.value;
            });

        writeJSON(
            APP.keys.draft,
            {
                savedAt: nowISO(),
                values: draft
            }
        );
    };

    const clearDraft = () => {
        try {
            localStorage.removeItem(
                APP.keys.draft
            );
        } catch {}
    };

    const startDraftAutosave = () => {
        if (draftTimer) {
            clearInterval(draftTimer);
        }

        draftTimer =
            setInterval(
                saveDraft,
                5000
            );
    };

    /* ================================================================
       MOBILE MENU
       ================================================================ */

    const toggleMobileMenu = () => {
        APP.state.mobileMenuOpen =
            !APP.state.mobileMenuOpen;

        const sidebar =
            $(".sidebar");

        sidebar?.classList.toggle(
            "mobile-open",
            APP.state.mobileMenuOpen
        );

        sidebar?.classList.toggle(
            "open",
            APP.state.mobileMenuOpen
        );
    };

    const closeMobileMenu = () => {
        APP.state.mobileMenuOpen = false;

        $(".sidebar")?.classList.remove(
            "mobile-open",
            "open"
        );
    };

    /* ================================================================
       FLOATING TOOLS
       ================================================================ */

    const createFloatingTools = () => {
        if (byId("rtFloatingTools")) return;

        const tools =
            document.createElement("div");

        tools.id = "rtFloatingTools";
        tools.className = "rt-floating-tools";

        tools.innerHTML = `
            <button
                type="button"
                class="rt-floating-button"
                data-rt-tool="command"
                title="Command palette"
                aria-label="Command palette"
            >
                ⌘
            </button>

            <button
                type="button"
                class="rt-floating-button"
                data-rt-tool="add"
                title="Add research"
                aria-label="Add research"
            >
                +
            </button>

            <button
                type="button"
                class="rt-floating-button"
                data-rt-tool="top"
                title="Go to top"
                aria-label="Go to top"
            >
                ↑
            </button>
        `;

        document.body.appendChild(tools);

        $$("[data-rt-tool]", tools)
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        const action =
                            button.getAttribute(
                                "data-rt-tool"
                            );

                        if (action === "command") {
                            openCommandPalette();
                        }

                        if (action === "add") {
                            addResearch();
                        }

                        if (action === "top") {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                        }
                    }
                );
            });
    };

    /* ================================================================
       KEYBOARD SHORTCUTS
       ================================================================ */

    const handleKeyboard = event => {
        const target =
            event.target;

        const typing =
            target &&
            (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            );

        if (
            event.key === "Escape"
        ) {
            if (APP.state.commandPaletteOpen) {
                closeCommandPalette();
                return;
            }

            if (APP.state.detailOpen) {
                closeDetail(true);
                return;
            }

            if (APP.state.editOpen) {
                closeEditModal();
                return;
            }
        }

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {
            event.preventDefault();

            openCommandPalette();

            return;
        }

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "n"
        ) {
            event.preventDefault();

            addResearch();

            return;
        }

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "s"
        ) {
            if (APP.state.editOpen) {
                event.preventDefault();

                byId("researchForm")
                    ?.requestSubmit();
            }

            return;
        }

        if (
            event.key === "/" &&
            !typing
        ) {
            event.preventDefault();

            byId("globalSearch")
                ?.focus();

            return;
        }

        if (
            event.altKey &&
            event.key === "ArrowLeft"
        ) {
            event.preventDefault();

            navigateBack();
        }
    };

    /* ================================================================
       BACK NAVIGATION
       ================================================================ */

    const navigateBack = () => {
        if (APP.state.detailOpen) {
            closeDetail(true);
            return;
        }

        if (APP.state.editOpen) {
            closeEditModal();
            return;
        }

        try {
            history.back();
        } catch {
            showSection(
                APP.state.previousSection ||
                "dashboard",
                {
                    pushHistory: false
                }
            );
        }
    };

    /* ================================================================
       HISTORY / URL ROUTING
       ================================================================ */

    const handleLocation = () => {
        const hash =
            location.hash.replace(/^#/, "");

        APP.state.historyLock = true;

        try {
            if (
                hash.startsWith("research/")
            ) {
                const id =
                    decodeURIComponent(
                        hash.slice(
                            "research/".length
                        )
                    );

                const record =
                    getResearchById(id);

                if (record) {
                    showSection(
                        "research",
                        {
                            pushHistory: false,
                            closeDetail: false
                        }
                    );

                    openDetail(
                        id,
                        false
                    );

                    return;
                }
            }

            const section =
                normalizeSection(
                    hash.split("/")[0]
                );

            closeDetail(false);

            showSection(
                section,
                {
                    pushHistory: false
                }
            );
        } finally {
            APP.state.historyLock = false;
        }
    };

    /* ================================================================
       EVENT BINDING
       ================================================================ */

    const bindNavigation = () => {
        $$("[data-section]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    event => {
                        event.preventDefault();

                        const section =
                            button.getAttribute(
                                "data-section"
                            );

                        if (section) {
                            showSection(
                                section
                            );
                        }

                        closeMobileMenu();
                    }
                );
            });

        byId("mobileMenuButton")
            ?.addEventListener(
                "click",
                toggleMobileMenu
            );

        $("[data-add-research]")
            ?.addEventListener(
                "click",
                addResearch
            );

        $$("[data-action='refresh']")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    refreshApplication
                );
            });
    };

    const bindModal = () => {
        const form =
            byId("researchForm");

        form?.addEventListener(
            "submit",
            saveForm
        );

        $$("[data-close-modal]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    event => {
                        event.preventDefault();

                        closeEditModal();
                    }
                );
            });

        const modal =
            getModal();

        modal?.addEventListener(
            "click",
            event => {
                if (
                    event.target === modal
                ) {
                    closeEditModal();
                }
            }
        );

        if (form) {
            form.addEventListener(
                "input",
                () => {
                    saveDraft();
                }
            );
        }
    };

    const bindSearch = () => {
        const global =
            byId("globalSearch");

        global?.addEventListener(
            "input",
            event => {
                showGlobalSearchResults(
                    event.target.value
                );
            }
        );

        global?.addEventListener(
            "keydown",
            event => {
                if (
                    event.key === "Enter"
                ) {
                    const results =
                        globalSearch(
                            event.target.value
                        );

                    if (results[0]) {
                        byId(
                            "rtGlobalSearchResults"
                        )?.remove();

                        showSection(
                            "research"
                        );

                        setTimeout(() => {
                            openDetail(
                                results[0].id
                            );
                        }, 80);
                    }
                }
            }
        );

        const researchSearch =
            byId("researchSearch");

        researchSearch?.addEventListener(
            "input",
            refreshResearchPage
        );

        [
            "statusFilter",
            "typeFilter",
            "authorFilter",
            "journalFilter",
            "publisherFilter"
        ]
            .forEach(id => {
                byId(id)?.addEventListener(
                    "change",
                    refreshResearchPage
                );
            });

        byId("clearResearchFilters")
            ?.addEventListener(
                "click",
                () => {
                    setField(
                        "researchSearch",
                        ""
                    );

                    [
                        "statusFilter",
                        "typeFilter",
                        "authorFilter",
                        "journalFilter",
                        "publisherFilter"
                    ]
                        .forEach(id => {
                            setField(id, "");
                        });

                    refreshResearchPage();
                }
            );
    };

    const bindTheme = () => {
        $$("[data-theme-toggle]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        document.body.classList.toggle(
                            "light-theme"
                        );

                        const isLight =
                            document.body.classList.contains(
                                "light-theme"
                            );

                        try {
                            if (
                                window.ResearchStorage &&
                                typeof ResearchStorage.getSettings === "function"
                            ) {
                                const settings =
                                    ResearchStorage.getSettings();

                                settings.theme =
                                    isLight
                                        ? "light"
                                        : "dark";

                                ResearchStorage.saveSettings(
                                    settings
                                );
                            }
                        } catch {}

                        toast(
                            isLight
                                ? "Light theme enabled."
                                : "Dark theme enabled.",
                            "info"
                        );
                    }
                );
            });
    };

    const bindSettings = () => {
        $$("[data-action='export']")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    exportJSON
                );
            });

        byId("exportData")
            ?.addEventListener(
                "click",
                exportJSON
            );

        byId("clearData")
            ?.addEventListener(
                "click",
                () => {
                    const confirmed =
                        window.confirm(
                            "Clear ALL research data?\n\nThis cannot be undone."
                        );

                    if (!confirmed) return;

                    try {
                        if (
                            window.ResearchManager &&
                            typeof ResearchManager.clearAll === "function"
                        ) {
                            ResearchManager.clearAll();
                        } else {
                            saveRecords([]);
                        }
                    } catch {
                        saveRecords([]);
                    }

                    APP.state.favorites.clear();
                    APP.state.selectedResearch.clear();

                    savePreferences();

                    refreshApplication();

                    toast(
                        "All research data cleared.",
                        "success"
                    );
                }
            );
    };

    const bindCalendarAndAnalytics = () => {
        document.addEventListener(
            "click",
            event => {
                const actionElement =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!actionElement) return;

                const action =
                    actionElement.getAttribute(
                        "data-action"
                    );

                if (
                    action === "previous-month" ||
                    action === "calendar-prev"
                ) {
                    try {
                        CalendarManager.previousMonth?.();
                    } catch {}
                }

                if (
                    action === "next-month" ||
                    action === "calendar-next"
                ) {
                    try {
                        CalendarManager.nextMonth?.();
                    } catch {}
                }

                if (
                    action === "today"
                ) {
                    try {
                        CalendarManager.goToToday?.();
                    } catch {}
                }
            }
        );
    };

    const bindGlobalClose = () => {
        document.addEventListener(
            "click",
            event => {
                const panel =
                    byId(
                        "rtGlobalSearchResults"
                    );

                const search =
                    byId("globalSearch");

                if (
                    panel &&
                    !panel.contains(event.target) &&
                    event.target !== search
                ) {
                    panel.remove();
                }
            }
        );
    };

    /* ================================================================
       ADDITIONAL UI BUTTONS
       ================================================================ */

    const addResearchUtilities = () => {
        const researchSection =
            byId("research");

        if (!researchSection) return;

        if (
            byId("rtResearchUtilities")
        ) {
            return;
        }

        const toolbar =
            document.createElement("div");

        toolbar.id =
            "rtResearchUtilities";

        toolbar.style.cssText = `
            display:flex;
            flex-wrap:wrap;
            align-items:center;
            gap:8px;
            margin:10px 0 15px;
        `;

        toolbar.innerHTML = `
            <button
                type="button"
                class="rt-mini-button"
                data-rt-research-tool="saved"
            >
                Saved Searches
            </button>

            <button
                type="button"
                class="rt-mini-button"
                data-rt-research-tool="save"
            >
                Save Search
            </button>

            <button
                type="button"
                class="rt-mini-button"
                data-rt-research-tool="csv"
            >
                Export CSV
            </button>

            <button
                type="button"
                class="rt-mini-button"
                data-rt-research-tool="favorites"
            >
                Favorites
            </button>

            <span class="rt-search-hint">
                Ctrl+K commands • Ctrl+N new • / search
            </span>
        `;

        const search =
            byId("researchSearch");

        if (search?.parentElement) {
            search.parentElement
                .parentElement
                ?.insertAdjacentElement(
                    "afterend",
                    toolbar
                );
        } else {
            researchSection.prepend(
                toolbar
            );
        }

        $$(
            "[data-rt-research-tool]",
            toolbar
        ).forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const action =
                        button.getAttribute(
                            "data-rt-research-tool"
                        );

                    if (action === "save") {
                        saveCurrentSearch();
                    }

                    if (action === "csv") {
                        exportCSV();
                    }

                    if (action === "saved") {
                        showSavedSearches();
                    }

                    if (action === "favorites") {
                        showFavorites();
                    }
                }
            );
        });
    };

    const showSavedSearches = () => {
        if (
            !APP.state.savedSearches.length
        ) {
            toast(
                "No saved searches yet.",
                "info"
            );
            return;
        }

        const choices =
            APP.state.savedSearches
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.name} — ${item.query}`
                )
                .join("\n");

        const answer =
            window.prompt(
                `Saved searches:\n\n${choices}\n\nEnter the number to open:`
            );

        if (!answer) return;

        const index =
            Number(answer) - 1;

        const saved =
            APP.state.savedSearches[index];

        if (saved) {
            runSavedSearch(saved);
        }
    };

    const showFavorites = () => {
        showSection("research");

        setTimeout(() => {
            const search =
                byId("researchSearch");

            if (search) {
                search.value = "";
            }

            [
                "statusFilter",
                "typeFilter",
                "authorFilter",
                "journalFilter",
                "publisherFilter"
            ]
                .forEach(id => {
                    setField(id, "");
                });

            const records =
                getResearch()
                    .filter(record =>
                        APP.state.favorites.has(
                            safeString(record.id)
                        )
                    );

            renderResearchRecordsDirectly(
                records
            );

            toast(
                `${records.length} favorite research record${records.length === 1 ? "" : "s"} found.`,
                "info"
            );
        }, 80);
    };

    const renderResearchRecordsDirectly = records => {
        const tbody =
            byId("researchTableBody");

        if (!tbody) return;

        tbody.innerHTML =
            records.length
                ? records
                    .map(record =>
                        researchRowHTML(record)
                    )
                    .join("")
                : "";

        attachResearchRowHandlers();
        refreshFavoriteButtons();
        updateSelectionBar();
    };

    /* ================================================================
       REFRESH
       ================================================================ */

    const refreshApplication = () => {
        try {
            if (
                window.ResearchManager &&
                typeof ResearchManager.initialize === "function"
            ) {
                ResearchManager.initialize();
            }
        } catch {}

        try {
            if (
                window.ResearchManager &&
                typeof ResearchManager.ensureSampleData === "function"
            ) {
                /*
                 * Do NOT automatically create sample data here.
                 * Existing user data must be preserved.
                 */
            }
        } catch {}

        refreshResearchPage();

        runSectionRefresh(
            APP.state.section
        );

        injectDeadlineHealth();

        toast(
            "Research Tracker refreshed.",
            "success"
        );
    };

    /* ================================================================
       DATA HEALTH
       ================================================================ */

    const calculateHealth = () => {
        const records =
            getResearch();

        return {
            total: records.length,

            missingTitle:
                records.filter(
                    record =>
                        !safeString(
                            record.title
                        ).trim()
                ).length,

            missingAuthor:
                records.filter(
                    record =>
                        !safeString(
                            record.author
                        ).trim()
                ).length,

            missingStatus:
                records.filter(
                    record =>
                        !safeString(
                            record.status
                        ).trim()
                ).length,

            withDeadline:
                records.filter(
                    record =>
                        record.deadline ||
                        record.fullPaperDeadline ||
                        record.proposalDeadline
                ).length
        };
    };

    /* ================================================================
       CLICKABLE ENTITIES
       ================================================================ */

    const bindEntityCards = () => {
        const entitySelectors = [
            "#authorsGrid",
            "#journalsGrid",
            "#publishersGrid"
        ];

        entitySelectors.forEach(selector => {
            const container =
                $(selector);

            if (!container) return;

            container.addEventListener(
                "click",
                event => {
                    const clickable =
                        event.target.closest(
                            "[data-author], [data-journal], [data-publisher]"
                        );

                    if (!clickable) return;

                    const author =
                        clickable.getAttribute(
                            "data-author"
                        );

                    const journal =
                        clickable.getAttribute(
                            "data-journal"
                        );

                    const publisher =
                        clickable.getAttribute(
                            "data-publisher"
                        );

                    showSection(
                        "research"
                    );

                    setTimeout(() => {
                        if (author) {
                            setField(
                                "authorFilter",
                                author
                            );
                        }

                        if (journal) {
                            setField(
                                "journalFilter",
                                journal
                            );
                        }

                        if (publisher) {
                            setField(
                                "publisherFilter",
                                publisher
                            );
                        }

                        refreshResearchPage();
                    }, 80);
                }
            );
        });
    };

    /* ================================================================
       FORM SAFETY
       ================================================================ */

    const forceModalLayering = () => {
        const modal =
            getModal();

        if (!modal) return;

        modal.style.zIndex =
            "1000001";

        const closeButtons =
            $$("[data-close-modal]", modal);

        closeButtons.forEach(button => {
            button.style.position =
                "relative";

            button.style.zIndex =
                "1000003";
        });
    };

    /* ================================================================
       GLOBAL CLICK ROUTER
       ================================================================ */

    const bindGlobalActions = () => {
        document.addEventListener(
            "click",
            event => {
                const backButton =
                    event.target.closest(
                        "[data-action='back'], [data-back]"
                    );

                if (backButton) {
                    event.preventDefault();
                    navigateBack();
                    return;
                }

                const detailTrigger =
                    event.target.closest(
                        "[data-research-id], [data-research-details]"
                    );

                if (
                    detailTrigger &&
                    !event.target.closest(
                        "button[data-favorite-research]"
                    )
                ) {
                    const id =
                        detailTrigger.getAttribute(
                            "data-research-id"
                        ) ||
                        detailTrigger.getAttribute(
                            "data-research-details"
                        );

                    if (id) {
                        event.preventDefault();
                        openDetail(id, true);
                    }
                }
            }
        );
    };

    /* ================================================================
       SAFE REPLACEMENT FOR LEGACY DETAILS
       ================================================================ */

    const patchLegacyDetails = () => {
        /*
         * Other modules may attempt to open their own details page.
         * We do not destroy those modules. Instead we make our
         * controller the visible authority whenever this application
         * opens a record.
         */

        try {
            if (
                window.ResearchDetails &&
                typeof ResearchDetails.open === "function"
            ) {
                const originalOpen =
                    ResearchDetails.open;

                if (
                    !ResearchDetails.__rtPatched
                ) {
                    ResearchDetails.open =
                        function patchedDetailsOpen(id) {
                            try {
                                openDetail(
                                    id,
                                    true
                                );
                            } catch {
                                originalOpen.call(
                                    ResearchDetails,
                                    id
                                );
                            }
                        };

                    ResearchDetails.__rtPatched =
                        true;
                }
            }
        } catch {}
    };

    /* ================================================================
       INITIALIZATION
       ================================================================ */

    const initialize = () => {
        if (APP.initialized) {
            return;
        }

        APP.initialized = true;

        loadPreferences();

        injectVisualSystem();

        document.body.classList.toggle(
            "rt-compact-mode",
            APP.state.density === "compact"
        );

        document.body.classList.toggle(
            "rt-focus-mode",
            APP.state.focusMode
        );

        ensureToastContainer();

        ensureSelectionBar();

        createFloatingTools();

        startDraftAutosave();

        bindNavigation();
        bindModal();
        bindSearch();
        bindTheme();
        bindSettings();
        bindCalendarAndAnalytics();
        bindGlobalClose();
        bindGlobalActions();
        bindEntityCards();

        patchLegacyDetails();

        addResearchUtilities();

        forceModalLayering();

        window.addEventListener(
            "keydown",
            handleKeyboard
        );

        window.addEventListener(
            "popstate",
            handleLocation
        );

        window.addEventListener(
            "hashchange",
            handleLocation
        );

        /*
         * If the user presses browser Back while a details overlay
         * is open, this ensures the overlay is removed immediately.
         */
        window.addEventListener(
            "beforeunload",
            () => {
                clearDraft();
            }
        );

        /*
         * Start from existing URL if available.
         */
        if (location.hash) {
            handleLocation();
        } else {
            showSection(
                "dashboard",
                {
                    pushHistory: false
                }
            );
        }

        refreshResearchPage();

        injectDeadlineHealth();

        setTimeout(() => {
            refreshFavoriteButtons();
            updateSelectionBar();
            forceModalLayering();
        }, 250);

        /*
         * Periodically update deadline health.
         */
        setInterval(
            () => {
                injectDeadlineHealth();
            },
            60000
        );

        console.info(
            `Research Tracker ${APP.version} initialized`
        );
    };

    /* ================================================================
       PUBLIC APPLICATION API
       ================================================================ */

    window.ResearchApp = {
        version: APP.version,

        openDetail,
        closeDetail,

        editResearch,
        addResearch,
        deleteResearch,

        toggleFavorite,

        exportJSON,
        exportCSV,

        copyCitation,
        copyResearchURL,

        printResearch,

        openCommandPalette,
        closeCommandPalette,

        toggleDensity,
        toggleFocusMode,

        showSection,
        navigateBack,

        refresh: refreshApplication,

        getRecords: getResearch,

        getRecord: getResearchById,

        getDeadlineSummary:
            deadlineSummary,

        getHealth:
            calculateHealth
    };

    /*
     * ================================================================
     * START
     * ================================================================
     */

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );
    } else {
        initialize();
    }

})();