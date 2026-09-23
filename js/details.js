(function () {
    "use strict";

    /*
     * Research Tracker
     * Research Details Module
     *
     * Provides a reusable, full-screen research detail view.
     * Any part of the application can open a research record by ID.
     */

    const DETAILS_ID = "researchDetailsOverlay";

    function getResearchManager() {
        return window.ResearchManager || null;
    }

    function getUtils() {
        return window.ResearchUtils || {};
    }

    function getRecord(id) {
        const manager = getResearchManager();

        if (!manager || typeof manager.getById !== "function") {
            return null;
        }

        return manager.getById(id);
    }

    function escapeHtml(value) {
        if (getUtils().escapeHtml) {
            return getUtils().escapeHtml(value == null ? "" : String(value));
        }

        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(value) {
        if (!value) {
            return "Not specified";
        }

        if (getUtils().formatDate) {
            try {
                return getUtils().formatDate(value);
            } catch (error) {
                // Fall through to local formatting.
            }
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return escapeHtml(value);
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function getStatusClass(status) {
        const value = String(status || "").toLowerCase();

        if (value.includes("published")) {
            return "status-published";
        }

        if (value.includes("accepted")) {
            return "status-accepted";
        }

        if (value.includes("submitted")) {
            return "status-submitted";
        }

        if (value.includes("draft")) {
            return "status-draft";
        }

        if (value.includes("progress") || value.includes("working")) {
            return "status-progress";
        }

        if (value.includes("rejected")) {
            return "status-rejected";
        }

        return "status-default";
    }

    function getPriorityClass(priority) {
        const value = String(priority || "").toLowerCase();

        if (value === "high") {
            return "priority-high";
        }

        if (value === "medium") {
            return "priority-medium";
        }

        if (value === "low") {
            return "priority-low";
        }

        return "priority-default";
    }

    function getActionClass(action) {
        const value = String(action || "").toLowerCase();

        if (value.includes("complete")) {
            return "action-completed";
        }

        if (value.includes("working")) {
            return "action-working";
        }

        if (value.includes("review")) {
            return "action-review";
        }

        return "action-default";
    }

    function safeUrl(value) {
        if (!value) {
            return "";
        }

        const url = String(value).trim();

        if (
            url.startsWith("https://") ||
            url.startsWith("http://")
        ) {
            return url;
        }

        return "";
    }

    function createOverlay() {
        let overlay = document.getElementById(DETAILS_ID);

        if (overlay) {
            return overlay;
        }

        overlay = document.createElement("div");
        overlay.id = DETAILS_ID;
        overlay.className = "research-details-overlay";
        overlay.setAttribute("aria-hidden", "true");

        overlay.innerHTML = `
            <div class="research-details-backdrop" data-close-research-details></div>

            <div class="research-details-panel" role="dialog" aria-modal="true" aria-labelledby="researchDetailsTitle">

                <div class="research-details-header">

                    <div class="research-details-header-content">
                        <div class="research-details-eyebrow">
                            RESEARCH RECORD
                        </div>

                        <h2 id="researchDetailsTitle">
                            Research Details
                        </h2>

                        <div id="researchDetailsHeaderMeta"
                             class="research-details-header-meta">
                        </div>
                    </div>

                    <div class="research-details-header-actions">
                        <button
                            type="button"
                            class="research-details-header-button"
                            data-research-details-edit
                            title="Edit research">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="research-details-close"
                            data-close-research-details
                            title="Close">
                            ×
                        </button>
                    </div>

                </div>

                <div class="research-details-body">

                    <section class="research-details-hero">

                        <div class="research-details-status-row">

                            <span
                                id="researchDetailsStatus"
                                class="research-detail-badge status-default">
                            </span>

                            <span
                                id="researchDetailsPriority"
                                class="research-detail-badge priority-default">
                            </span>

                            <span
                                id="researchDetailsAction"
                                class="research-detail-badge action-default">
                            </span>

                        </div>

                        <h1 id="researchDetailsHeroTitle">
                            Research Title
                        </h1>

                        <p id="researchDetailsHeroDescription">
                        </p>

                    </section>

                    <section class="research-details-section">

                        <div class="research-details-section-title">
                            Submission overview
                        </div>

                        <div class="research-details-grid">

                            <div class="research-detail-card">
                                <span class="research-detail-label">
                                    Association
                                </span>
                                <strong id="researchDetailsAssociation">
                                    Not specified
                                </strong>
                            </div>

                            <div class="research-detail-card">
                                <span class="research-detail-label">
                                    Publication type
                                </span>
                                <strong id="researchDetailsPublicationType">
                                    Not specified
                                </strong>
                            </div>

                            <div class="research-detail-card">
                                <span class="research-detail-label">
                                    Author
                                </span>
                                <strong id="researchDetailsAuthor">
                                    Not specified
                                </strong>
                            </div>

                            <div class="research-detail-card">
                                <span class="research-detail-label">
                                    Journal
                                </span>
                                <strong id="researchDetailsJournal">
                                    Not specified
                                </strong>
                            </div>

                            <div class="research-detail-card">
                                <span class="research-detail-label">
                                    Publisher
                                </span>
                                <strong id="researchDetailsPublisher">
                                    Not specified
                                </strong>
                            </div>

                            <div class="research-detail-card">
                                <span class="research-detail-label">
                                    Research date
                                </span>
                                <strong id="researchDetailsDate">
                                    Not specified
                                </strong>
                            </div>

                        </div>

                    </section>

                    <section class="research-details-section">

                        <div class="research-details-section-title">
                            Deadlines
                        </div>

                        <div class="research-deadline-grid">

                            <div class="research-deadline-card proposal">
                                <div class="research-deadline-icon">
                                    P
                                </div>

                                <div>
                                    <span class="research-detail-label">
                                        Proposal deadline
                                    </span>

                                    <strong id="researchDetailsProposalDeadline">
                                        Not specified
                                    </strong>
                                </div>
                            </div>

                            <div class="research-deadline-card full-paper">
                                <div class="research-deadline-icon">
                                    F
                                </div>

                                <div>
                                    <span class="research-detail-label">
                                        Full paper deadline
                                    </span>

                                    <strong id="researchDetailsFullPaperDeadline">
                                        Not specified
                                    </strong>
                                </div>
                            </div>

                            <div class="research-deadline-card reminder">
                                <div class="research-deadline-icon">
                                    R
                                </div>

                                <div>
                                    <span class="research-detail-label">
                                        Reminder
                                    </span>

                                    <strong id="researchDetailsReminder">
                                        Not specified
                                    </strong>
                                </div>
                            </div>

                        </div>

                    </section>

                    <section class="research-details-section">

                        <div class="research-details-section-title">
                            Submission status
                        </div>

                        <div class="research-details-status-box">

                            <div>
                                <span class="research-detail-label">
                                    Current status
                                </span>

                                <div id="researchDetailsStatusText">
                                    Not specified
                                </div>
                            </div>

                            <div>
                                <span class="research-detail-label">
                                    Current action
                                </span>

                                <div id="researchDetailsActionText">
                                    Not specified
                                </div>
                            </div>

                        </div>

                    </section>

                    <section class="research-details-section">

                        <div class="research-details-section-title">
                            Call for Paper
                        </div>

                        <div
                            id="researchDetailsCallLink"
                            class="research-details-link-box">
                        </div>

                    </section>

                    <section class="research-details-section">

                        <div class="research-details-section-title">
                            Keywords
                        </div>

                        <div
                            id="researchDetailsKeywords"
                            class="research-details-keywords">
                        </div>

                    </section>

                    <section class="research-details-section">

                        <div class="research-details-section-title">
                            Comments
                        </div>

                        <div
                            id="researchDetailsComments"
                            class="research-details-text-box">
                            No comments added.
                        </div>

                    </section>

                    <section class="research-details-section">

                        <div class="research-details-section-title">
                            Notes
                        </div>

                        <div
                            id="researchDetailsNotes"
                            class="research-details-text-box">
                            No notes added.
                        </div>

                    </section>

                </div>

                <div class="research-details-footer">

                    <div class="research-details-footer-left">
                        <span id="researchDetailsRecordId">
                        </span>
                    </div>

                    <div class="research-details-footer-actions">

                        <button
                            type="button"
                            class="details-secondary-button"
                            data-close-research-details>
                            Close
                        </button>

                        <button
                            type="button"
                            class="details-danger-button"
                            data-research-details-delete>
                            Delete
                        </button>

                        <button
                            type="button"
                            class="details-primary-button"
                            data-research-details-edit>
                            Edit research
                        </button>

                    </div>

                </div>

            </div>
        `;

        document.body.appendChild(overlay);

        bindOverlayEvents();

        injectStyles();

        return overlay;
    }

    function setText(id, value, fallback) {
        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        const text = value == null || String(value).trim() === ""
            ? (fallback || "Not specified")
            : String(value);

        element.textContent = text;
    }

    function setBadge(id, value, className, fallback) {
        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        element.className =
            "research-detail-badge " +
            (className || "status-default");

        element.textContent =
            value == null || String(value).trim() === ""
                ? (fallback || "Not specified")
                : String(value);
    }

    function renderKeywords(record) {
        const container = document.getElementById(
            "researchDetailsKeywords"
        );

        if (!container) {
            return;
        }

        const keywords = Array.isArray(record.keywords)
            ? record.keywords
            : String(record.keywords || "")
                .split(",")
                .map(function (item) {
                    return item.trim();
                })
                .filter(Boolean);

        if (keywords.length === 0) {
            container.innerHTML =
                '<span class="research-details-empty">No keywords added.</span>';
            return;
        }

        container.innerHTML = keywords
            .map(function (keyword) {
                return `
                    <span class="research-detail-keyword">
                        ${escapeHtml(keyword)}
                    </span>
                `;
            })
            .join("");
    }

    function renderCallForPaper(record) {
        const container = document.getElementById(
            "researchDetailsCallLink"
        );

        if (!container) {
            return;
        }

        const url =
            safeUrl(record.callForPaperLink) ||
            safeUrl(record.url);

        if (!url) {
            container.innerHTML =
                '<span class="research-details-empty">No Call for Paper link added.</span>';
            return;
        }

        container.innerHTML = `
            <a
                href="${escapeHtml(url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="research-details-external-link">
                Open Call for Paper
                <span>↗</span>
            </a>

            <div class="research-details-url">
                ${escapeHtml(url)}
            </div>
        `;
    }

    function renderRecord(record) {
        if (!record) {
            return;
        }

        setText(
            "researchDetailsTitle",
            record.title,
            "Research Details"
        );

        setText(
            "researchDetailsHeroTitle",
            record.title,
            "Untitled Research"
        );

        const heroDescription = document.getElementById(
            "researchDetailsHeroDescription"
        );

        if (heroDescription) {
            heroDescription.textContent =
                record.association ||
                record.publicationType ||
                "Research submission record";
        }

        const headerMeta = document.getElementById(
            "researchDetailsHeaderMeta"
        );

        if (headerMeta) {
            headerMeta.textContent =
                [
                    record.author,
                    record.association,
                    record.publicationType
                ]
                    .filter(Boolean)
                    .join(" • ");
        }

        setBadge(
            "researchDetailsStatus",
            record.status,
            getStatusClass(record.status),
            "No status"
        );

        setBadge(
            "researchDetailsPriority",
            record.priority,
            getPriorityClass(record.priority),
            "No priority"
        );

        setBadge(
            "researchDetailsAction",
            record.action,
            getActionClass(record.action),
            "No action"
        );

        setText(
            "researchDetailsAssociation",
            record.association
        );

        setText(
            "researchDetailsPublicationType",
            record.publicationType || record.type
        );

        setText(
            "researchDetailsAuthor",
            record.author
        );

        setText(
            "researchDetailsJournal",
            record.journal
        );

        setText(
            "researchDetailsPublisher",
            record.publisher
        );

        setText(
            "researchDetailsDate",
            formatDate(record.date)
        );

        setText(
            "researchDetailsProposalDeadline",
            formatDate(record.proposalDeadline)
        );

        setText(
            "researchDetailsFullPaperDeadline",
            formatDate(
                record.fullPaperDeadline ||
                record.deadline
            )
        );

        setText(
            "researchDetailsReminder",
            record.reminder,
            "No reminder set"
        );

        setText(
            "researchDetailsStatusText",
            record.status
        );

        setText(
            "researchDetailsActionText",
            record.action
        );

        const comments = document.getElementById(
            "researchDetailsComments"
        );

        if (comments) {
            comments.textContent =
                record.comments ||
                record.notes ||
                "No comments added.";
        }

        const notes = document.getElementById(
            "researchDetailsNotes"
        );

        if (notes) {
            notes.textContent =
                record.notes ||
                "No notes added.";
        }

        setText(
            "researchDetailsRecordId",
            "Record ID: " + (record.id || "unknown")
        );

        renderKeywords(record);
        renderCallForPaper(record);

        const overlay = document.getElementById(DETAILS_ID);

        if (overlay) {
            overlay.dataset.researchId = record.id || "";
        }
    }

    function open(id) {
        const record = getRecord(id);

        if (!record) {
            showToast(
                "Research record could not be found.",
                "error"
            );
            return false;
        }

        const overlay = createOverlay();

        renderRecord(record);

        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");

        document.body.classList.add(
            "research-details-open"
        );

        return true;
    }

    function close() {
        const overlay = document.getElementById(
            DETAILS_ID
        );

        if (!overlay) {
            return;
        }

        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");

        document.body.classList.remove(
            "research-details-open"
        );
    }

    function editCurrent() {
        const overlay = document.getElementById(
            DETAILS_ID
        );

        if (!overlay) {
            return;
        }

        const id = overlay.dataset.researchId;

        if (!id) {
            return;
        }

        close();

        if (
            window.ResearchApp &&
            typeof window.ResearchApp.openResearchModal === "function"
        ) {
            window.ResearchApp.openResearchModal(id);
            return;
        }

        if (
            window.openResearchModal &&
            typeof window.openResearchModal === "function"
        ) {
            window.openResearchModal(id);
            return;
        }

        showToast(
            "The research editor is not available yet.",
            "warning"
        );
    }

    function deleteCurrent() {
        const overlay = document.getElementById(
            DETAILS_ID
        );

        if (!overlay) {
            return;
        }

        const id = overlay.dataset.researchId;

        if (!id) {
            return;
        }

        const record = getRecord(id);

        if (!record) {
            close();
            return;
        }

        const confirmed = window.confirm(
            "Delete this research record?\n\n" +
            record.title +
            "\n\nThis action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        const manager = getResearchManager();

        if (
            manager &&
            typeof manager.remove === "function"
        ) {
            manager.remove(id);
        }

        close();

        if (
            window.ResearchApp &&
            typeof window.ResearchApp.refreshAll === "function"
        ) {
            window.ResearchApp.refreshAll();
        }

        showToast(
            "Research record deleted.",
            "success"
        );
    }

    function bindOverlayEvents() {
        const overlay = document.getElementById(
            DETAILS_ID
        );

        if (!overlay) {
            return;
        }

        overlay.addEventListener("click", function (event) {
            const closeButton =
                event.target.closest(
                    "[data-close-research-details]"
                );

            if (closeButton) {
                close();
                return;
            }

            const editButton =
                event.target.closest(
                    "[data-research-details-edit]"
                );

            if (editButton) {
                editCurrent();
                return;
            }

            const deleteButton =
                event.target.closest(
                    "[data-research-details-delete]"
                );

            if (deleteButton) {
                deleteCurrent();
            }
        });

        document.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Escape") {
                    const currentOverlay =
                        document.getElementById(
                            DETAILS_ID
                        );

                    if (
                        currentOverlay &&
                        currentOverlay.classList.contains("open")
                    ) {
                        close();
                    }
                }
            }
        );
    }

    function showToast(message, type) {
        if (
            window.ResearchApp &&
            typeof window.ResearchApp.showToast === "function"
        ) {
            window.ResearchApp.showToast(
                message,
                type || "info"
            );
            return;
        }

        if (
            window.showToast &&
            typeof window.showToast === "function"
        ) {
            window.showToast(
                message,
                type || "info"
            );
            return;
        }

        window.alert(message);
    }

    function makeClickableResearchElement(element, id) {
        if (!element || !id) {
            return;
        }

        element.dataset.researchId = id;
        element.classList.add(
            "research-clickable"
        );

        if (!element.hasAttribute("tabindex")) {
            element.setAttribute("tabindex", "0");
        }

        if (!element.hasAttribute("role")) {
            element.setAttribute("role", "button");
        }
    }

    function setupGlobalClickableResearch() {
        document.addEventListener(
            "click",
            function (event) {
                const target =
                    event.target.closest(
                        "[data-research-id]"
                    );

                if (!target) {
                    return;
                }

                if (
                    target.closest(
                        "button, a, input, select, textarea"
                    )
                ) {
                    return;
                }

                const id =
                    target.dataset.researchId;

                if (id) {
                    open(id);
                }
            }
        );

        document.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }

                const target =
                    event.target.closest(
                        "[data-research-id]"
                    );

                if (!target) {
                    return;
                }

                if (
                    target.closest(
                        "button, a, input, select, textarea"
                    )
                ) {
                    return;
                }

                event.preventDefault();

                const id =
                    target.dataset.researchId;

                if (id) {
                    open(id);
                }
            }
        );
    }

    function refreshOpenDetails() {
        const overlay = document.getElementById(
            DETAILS_ID
        );

        if (
            !overlay ||
            !overlay.classList.contains("open")
        ) {
            return;
        }

        const id = overlay.dataset.researchId;

        if (!id) {
            return;
        }

        const record = getRecord(id);

        if (record) {
            renderRecord(record);
        }
    }

    function injectStyles() {
        if (document.getElementById(
            "researchDetailsStyles"
        )) {
            return;
        }

        const style = document.createElement("style");

        style.id = "researchDetailsStyles";

        style.textContent = `
            body.research-details-open {
                overflow: hidden;
            }

            .research-details-overlay {
                position: fixed;
                inset: 0;
                z-index: 10000;
                display: flex;
                align-items: stretch;
                justify-content: flex-end;
                visibility: hidden;
                opacity: 0;
                pointer-events: none;
                transition:
                    opacity 180ms ease,
                    visibility 180ms ease;
            }

            .research-details-overlay.open {
                visibility: visible;
                opacity: 1;
                pointer-events: auto;
            }

            .research-details-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.72);
                backdrop-filter: blur(7px);
            }

            .research-details-panel {
                position: relative;
                z-index: 2;
                width: min(920px, 96vw);
                height: 100vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                background:
                    linear-gradient(
                        180deg,
                        rgba(19, 23, 31, 0.99),
                        rgba(10, 13, 18, 0.99)
                    );
                border-left: 1px solid var(--border, #2a303a);
                box-shadow:
                    -24px 0 70px rgba(0, 0, 0, 0.42);
                transform: translateX(30px);
                transition: transform 220ms ease;
            }

            .research-details-overlay.open
            .research-details-panel {
                transform: translateX(0);
            }

            .research-details-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 24px;
                padding: 26px 30px;
                border-bottom: 1px solid var(--border, #2a303a);
                background: rgba(255, 255, 255, 0.018);
            }

            .research-details-eyebrow {
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.16em;
                color: var(--accent, #6ea8fe);
                margin-bottom: 7px;
            }

            .research-details-header h2 {
                margin: 0;
                color: var(--text, #f5f7fa);
                font-size: 22px;
                line-height: 1.25;
            }

            .research-details-header-meta {
                margin-top: 8px;
                color: var(--muted, #9ba3af);
                font-size: 13px;
                line-height: 1.5;
            }

            .research-details-header-actions {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-shrink: 0;
            }

            .research-details-header-button {
                border: 1px solid var(--border, #2a303a);
                background: var(--panel, #171b22);
                color: var(--text, #f5f7fa);
                border-radius: 9px;
                padding: 9px 14px;
                cursor: pointer;
                font-weight: 700;
            }

            .research-details-header-button:hover {
                border-color: var(--accent, #6ea8fe);
            }

            .research-details-close {
                width: 38px;
                height: 38px;
                border: 1px solid var(--border, #2a303a);
                background: transparent;
                color: var(--muted, #9ba3af);
                border-radius: 9px;
                font-size: 25px;
                line-height: 1;
                cursor: pointer;
            }

            .research-details-close:hover {
                color: var(--text, #f5f7fa);
                border-color: var(--accent, #6ea8fe);
            }

            .research-details-body {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
            }

            .research-details-hero {
                padding-bottom: 30px;
                border-bottom: 1px solid var(--border, #2a303a);
            }

            .research-details-status-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 18px;
            }

            .research-detail-badge {
                display: inline-flex;
                align-items: center;
                min-height: 28px;
                padding: 5px 10px;
                border-radius: 999px;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.02em;
                border: 1px solid transparent;
            }

            .status-published {
                color: #78e08f;
                background: rgba(120, 224, 143, 0.10);
                border-color: rgba(120, 224, 143, 0.22);
            }

            .status-accepted {
                color: #74b9ff;
                background: rgba(116, 185, 255, 0.10);
                border-color: rgba(116, 185, 255, 0.22);
            }

            .status-submitted {
                color: #a29bfe;
                background: rgba(162, 155, 254, 0.10);
                border-color: rgba(162, 155, 254, 0.22);
            }

            .status-draft {
                color: #f6b93b;
                background: rgba(246, 185, 59, 0.10);
                border-color: rgba(246, 185, 59, 0.22);
            }

            .status-progress {
                color: #63cdda;
                background: rgba(99, 205, 218, 0.10);
                border-color: rgba(99, 205, 218, 0.22);
            }

            .status-rejected {
                color: #ff7979;
                background: rgba(255, 121, 121, 0.10);
                border-color: rgba(255, 121, 121, 0.22);
            }

            .status-default,
            .priority-default,
            .action-default {
                color: var(--muted, #9ba3af);
                background: rgba(255, 255, 255, 0.05);
                border-color: var(--border, #2a303a);
            }

            .priority-high {
                color: #ff7979;
                background: rgba(255, 121, 121, 0.10);
                border-color: rgba(255, 121, 121, 0.22);
            }

            .priority-medium {
                color: #f6b93b;
                background: rgba(246, 185, 59, 0.10);
                border-color: rgba(246, 185, 59, 0.22);
            }

            .priority-low {
                color: #78e08f;
                background: rgba(120, 224, 143, 0.10);
                border-color: rgba(120, 224, 143, 0.22);
            }

            .action-working {
                color: #63cdda;
                background: rgba(99, 205, 218, 0.10);
                border-color: rgba(99, 205, 218, 0.22);
            }

            .action-completed {
                color: #78e08f;
                background: rgba(120, 224, 143, 0.10);
                border-color: rgba(120, 224, 143, 0.22);
            }

            .action-review {
                color: #a29bfe;
                background: rgba(162, 155, 254, 0.10);
                border-color: rgba(162, 155, 254, 0.22);
            }

            .research-details-hero h1 {
                margin: 0;
                max-width: 850px;
                color: var(--text, #f5f7fa);
                font-size: clamp(25px, 3vw, 38px);
                line-height: 1.2;
                letter-spacing: -0.025em;
            }

            .research-details-hero p {
                margin: 14px 0 0;
                color: var(--muted, #9ba3af);
                font-size: 14px;
            }

            .research-details-section {
                padding: 28px 0;
                border-bottom: 1px solid var(--border, #2a303a);
            }

            .research-details-section-title {
                margin-bottom: 17px;
                color: var(--text, #f5f7fa);
                font-size: 14px;
                font-weight: 800;
                letter-spacing: 0.02em;
            }

            .research-details-grid {
                display: grid;
                grid-template-columns:
                    repeat(3, minmax(0, 1fr));
                gap: 12px;
            }

            .research-detail-card {
                min-width: 0;
                padding: 17px;
                background: rgba(255, 255, 255, 0.025);
                border: 1px solid var(--border, #2a303a);
                border-radius: 12px;
            }

            .research-detail-label {
                display: block;
                margin-bottom: 7px;
                color: var(--muted, #9ba3af);
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .research-detail-card strong {
                display: block;
                color: var(--text, #f5f7fa);
                font-size: 14px;
                line-height: 1.45;
                overflow-wrap: anywhere;
            }

            .research-deadline-grid {
                display: grid;
                grid-template-columns:
                    repeat(3, minmax(0, 1fr));
                gap: 12px;
            }

            .research-deadline-card {
                display: flex;
                align-items: center;
                gap: 13px;
                min-width: 0;
                padding: 17px;
                border: 1px solid var(--border, #2a303a);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.025);
            }

            .research-deadline-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 38px;
                height: 38px;
                flex-shrink: 0;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.06);
                color: var(--accent, #6ea8fe);
                font-weight: 900;
            }

            .research-deadline-card strong {
                color: var(--text, #f5f7fa);
                font-size: 14px;
                line-height: 1.4;
            }

            .research-details-status-box {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                gap: 12px;
            }

            .research-details-status-box > div {
                padding: 18px;
                background: rgba(255, 255, 255, 0.025);
                border: 1px solid var(--border, #2a303a);
                border-radius: 12px;
            }

            .research-details-status-box > div > div {
                color: var(--text, #f5f7fa);
                font-size: 14px;
                line-height: 1.55;
            }

            .research-details-link-box {
                padding: 18px;
                border: 1px solid var(--border, #2a303a);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.025);
            }

            .research-details-external-link {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--accent, #6ea8fe);
                font-weight: 800;
                text-decoration: none;
            }

            .research-details-external-link:hover {
                text-decoration: underline;
            }

            .research-details-url {
                margin-top: 10px;
                color: var(--muted, #9ba3af);
                font-size: 12px;
                line-height: 1.5;
                word-break: break-all;
            }

            .research-details-keywords {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .research-detail-keyword {
                padding: 7px 10px;
                border: 1px solid var(--border, #2a303a);
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.025);
                color: var(--text, #f5f7fa);
                font-size: 12px;
            }

            .research-details-text-box {
                min-height: 80px;
                padding: 17px;
                border: 1px solid var(--border, #2a303a);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.025);
                color: var(--text, #f5f7fa);
                white-space: pre-wrap;
                overflow-wrap: anywhere;
                line-height: 1.6;
                font-size: 14px;
            }

            .research-details-empty {
                color: var(--muted, #9ba3af);
                font-size: 13px;
            }

            .research-details-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 18px;
                padding: 18px 30px;
                border-top: 1px solid var(--border, #2a303a);
                background: rgba(255, 255, 255, 0.018);
            }

            .research-details-footer-left {
                color: var(--muted, #9ba3af);
                font-size: 11px;
                word-break: break-all;
            }

            .research-details-footer-actions {
                display: flex;
                align-items: center;
                gap: 9px;
            }

            .details-secondary-button,
            .details-danger-button,
            .details-primary-button {
                border-radius: 9px;
                padding: 9px 14px;
                cursor: pointer;
                font-weight: 750;
            }

            .details-secondary-button {
                color: var(--text, #f5f7fa);
                background: transparent;
                border: 1px solid var(--border, #2a303a);
            }

            .details-danger-button {
                color: #ff7979;
                background: rgba(255, 121, 121, 0.08);
                border: 1px solid rgba(255, 121, 121, 0.25);
            }

            .details-primary-button {
                color: #fff;
                background: var(--accent, #6ea8fe);
                border: 1px solid var(--accent, #6ea8fe);
            }

            .research-clickable {
                cursor: pointer;
            }

            .research-clickable:hover {
                border-color: var(--accent, #6ea8fe) !important;
            }

            @media (max-width: 800px) {
                .research-details-panel {
                    width: 100vw;
                }

                .research-details-grid,
                .research-deadline-grid,
                .research-details-status-box {
                    grid-template-columns: 1fr;
                }

                .research-details-header,
                .research-details-footer {
                    padding-left: 20px;
                    padding-right: 20px;
                }

                .research-details-body {
                    padding: 20px;
                }
            }

            @media (max-width: 520px) {
                .research-details-header-button {
                    display: none;
                }

                .research-details-header {
                    gap: 12px;
                }

                .research-details-footer {
                    align-items: stretch;
                    flex-direction: column;
                }

                .research-details-footer-actions {
                    width: 100%;
                    flex-wrap: wrap;
                }

                .research-details-footer-actions button {
                    flex: 1;
                }

                .research-details-hero h1 {
                    font-size: 25px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function initialize() {
        injectStyles();
        createOverlay();
        setupGlobalClickableResearch();

        window.ResearchDetailsReady = true;
    }

    window.ResearchDetails = {
        initialize: initialize,
        open: open,
        close: close,
        editCurrent: editCurrent,
        deleteCurrent: deleteCurrent,
        renderRecord: renderRecord,
        refresh: refreshOpenDetails,
        makeClickable: makeClickableResearchElement,
        getRecord: getRecord
    };

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );
    } else {
        initialize();
    }
})();