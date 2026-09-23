(function () {
    "use strict";

    const Dashboard = {
        initialized: false,

        initialize() {
            this.initialized = true;
            this.render();
        },

        render() {
            this.renderDashboard();
        },

        refresh() {
            this.renderDashboard();
        },

        renderDashboard() {
            this.updateStats();
            this.renderRecentResearch();
            this.renderStatusChart();
            this.renderUpcomingDeadlines();
        },

        getResearch() {
            if (
                window.ResearchManager &&
                typeof ResearchManager.getAll === "function"
            ) {
                return ResearchManager.getAll();
            }

            if (
                window.ResearchStorage &&
                typeof ResearchStorage.getResearch === "function"
            ) {
                return ResearchStorage.getResearch();
            }

            return [];
        },

        updateStats() {
            const research = this.getResearch();

            const total = research.length;

            const published = research.filter(item =>
                String(item.status || "")
                    .toLowerCase()
                    .includes("published")
            ).length;

            const inProgress = research.filter(item => {
                const status = String(item.status || "").toLowerCase();

                return (
                    status.includes("submitted") ||
                    status.includes("accepted") ||
                    status.includes("progress") ||
                    status.includes("working") ||
                    status.includes("review")
                );
            }).length;

            const authors = new Set(
                research
                    .map(item => String(item.author || "").trim())
                    .filter(Boolean)
            ).size;

            const totalElement = document.getElementById("totalResearch");
            const publishedElement = document.getElementById("publishedResearch");
            const progressElement = document.getElementById("inProgressResearch");
            const authorsElement = document.getElementById("totalAuthors");

            if (totalElement) {
                totalElement.textContent = total;
            }

            if (publishedElement) {
                publishedElement.textContent = published;
            }

            if (progressElement) {
                progressElement.textContent = inProgress;
            }

            if (authorsElement) {
                authorsElement.textContent = authors;
            }
        },

        renderRecentResearch() {
            const container = document.getElementById("recentResearch");

            if (!container) {
                return;
            }

            const research = this.getResearch();

            if (!research.length) {
                container.innerHTML = `
                    <div class="empty-state">
                        <strong>No research records</strong>
                        <span>Add your first research record to see it here.</span>
                    </div>
                `;
                return;
            }

            const sorted = [...research].sort((a, b) => {
                const dateA = new Date(
                    a.fullPaperDeadline ||
                    a.deadline ||
                    a.proposalDeadline ||
                    a.date ||
                    0
                ).getTime();

                const dateB = new Date(
                    b.fullPaperDeadline ||
                    b.deadline ||
                    b.proposalDeadline ||
                    b.date ||
                    0
                ).getTime();

                return dateA - dateB;
            });

            const records = sorted.slice(0, 8);

            container.innerHTML = records
                .map(record => this.createResearchCard(record))
                .join("");
        },

        createResearchCard(record) {
            const id = this.escapeAttribute(record.id || "");
            const title = this.escapeHtml(
                record.title || "Untitled Research"
            );

            const author = this.escapeHtml(
                record.author || "Unknown author"
            );

            const association = this.escapeHtml(
                record.association || ""
            );

            const publicationType = this.escapeHtml(
                record.publicationType ||
                record.type ||
                "Research"
            );

            const status = this.escapeHtml(
                record.status || "Not specified"
            );

            const priority = this.escapeHtml(
                record.priority || "Normal"
            );

            const deadline =
                record.fullPaperDeadline ||
                record.deadline ||
                record.proposalDeadline ||
                "";

            const formattedDeadline = this.formatDate(deadline);

            const statusClass = this.getStatusClass(record.status);

            return `
                <article
                    class="research-row dashboard-research-card"
                    data-research-id="${id}"
                    tabindex="0"
                    role="button"
                    aria-label="Open research details for ${this.escapeAttribute(record.title || "Research")}"
                    style="cursor:pointer;"
                >
                    <div class="research-row-main">
                        <div class="research-title">
                            ${title}
                        </div>

                        <div class="research-meta">
                            <span>${author}</span>
                            ${association ? `<span>• ${association}</span>` : ""}
                            <span>• ${publicationType}</span>
                        </div>

                        ${
                            formattedDeadline
                                ? `
                                    <div class="research-meta">
                                        <span>Deadline: ${this.escapeHtml(formattedDeadline)}</span>
                                    </div>
                                `
                                : ""
                        }
                    </div>

                    <div class="research-row-side">
                        <span class="status-badge ${statusClass}">
                            ${status}
                        </span>

                        <span class="priority-label">
                            ${priority}
                        </span>
                    </div>
                </article>
            `;
        },

        renderStatusChart() {
            const container = document.getElementById("statusChart");

            if (!container) {
                return;
            }

            const research = this.getResearch();

            if (!research.length) {
                container.innerHTML = `
                    <div class="empty-state">
                        <span>No status data available.</span>
                    </div>
                `;
                return;
            }

            const counts = {};

            research.forEach(record => {
                const status =
                    String(record.status || "Not specified").trim() ||
                    "Not specified";

                counts[status] = (counts[status] || 0) + 1;
            });

            const entries = Object.entries(counts).sort(
                (a, b) => b[1] - a[1]
            );

            const maximum = Math.max(
                ...entries.map(entry => entry[1]),
                1
            );

            container.innerHTML = `
                <div class="bar-chart">
                    ${entries
                        .map(([status, count]) => {
                            const width = Math.max(
                                8,
                                Math.round((count / maximum) * 100)
                            );

                            const matchingRecords = research.filter(record =>
                                String(record.status || "Not specified").trim() ===
                                status
                            );

                            return `
                                <div class="bar-row">
                                    <div class="bar-label">
                                        ${this.escapeHtml(status)}
                                    </div>

                                    <div
                                        class="bar-track"
                                        style="flex:1; cursor:pointer;"
                                        title="Click to view research with this status"
                                        data-status-group="${this.escapeAttribute(status)}"
                                    >
                                        <div
                                            class="bar-fill"
                                            style="width:${width}%"
                                        ></div>
                                    </div>

                                    <div class="bar-value">
                                        ${count}
                                    </div>
                                </div>

                                <div
                                    class="dashboard-status-records"
                                    style="display:none;"
                                >
                                    ${matchingRecords
                                        .map(record => {
                                            return `
                                                <div
                                                    data-research-id="${this.escapeAttribute(record.id || "")}"
                                                    tabindex="0"
                                                    role="button"
                                                    style="cursor:pointer;"
                                                >
                                                    ${this.escapeHtml(record.title || "Untitled Research")}
                                                </div>
                                            `;
                                        })
                                        .join("")}
                                </div>
                            `;
                        })
                        .join("")}
                </div>
            `;

            container
                .querySelectorAll("[data-status-group]")
                .forEach(track => {
                    track.addEventListener("click", event => {
                        event.stopPropagation();

                        const records =
                            track.parentElement.nextElementSibling;

                        if (!records) {
                            return;
                        }

                        records.style.display =
                            records.style.display === "none"
                                ? "block"
                                : "none";
                    });
                });
        },

        renderUpcomingDeadlines() {
            const container =
                document.getElementById("upcomingDeadlines");

            if (!container) {
                return;
            }

            const research = this.getResearch();

            const records = [...research]
                .filter(record => {
                    return (
                        record.fullPaperDeadline ||
                        record.deadline ||
                        record.proposalDeadline
                    );
                })
                .sort((a, b) => {
                    const dateA = new Date(
                        a.fullPaperDeadline ||
                        a.deadline ||
                        a.proposalDeadline
                    ).getTime();

                    const dateB = new Date(
                        b.fullPaperDeadline ||
                        b.deadline ||
                        b.proposalDeadline
                    ).getTime();

                    return dateA - dateB;
                })
                .slice(0, 8);

            if (!records.length) {
                container.innerHTML = `
                    <div class="empty-state">
                        <span>No upcoming deadlines.</span>
                    </div>
                `;
                return;
            }

            container.innerHTML = records
                .map(record => {
                    const deadline =
                        record.fullPaperDeadline ||
                        record.deadline ||
                        record.proposalDeadline;

                    const formatted = this.formatDate(deadline);

                    return `
                        <div
                            class="deadline-item"
                            data-research-id="${this.escapeAttribute(record.id || "")}"
                            tabindex="0"
                            role="button"
                            style="cursor:pointer;"
                        >
                            <div class="deadline-main">
                                <div class="deadline-title">
                                    ${this.escapeHtml(
                                        record.title ||
                                        "Untitled Research"
                                    )}
                                </div>

                                <div class="deadline-meta">
                                    ${this.escapeHtml(
                                        record.status ||
                                        "Not specified"
                                    )}
                                </div>
                            </div>

                            <div class="deadline-date">
                                ${this.escapeHtml(formatted)}
                            </div>
                        </div>
                    `;
                })
                .join("");
        },

        formatDate(value) {
            if (!value) {
                return "";
            }

            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {
                return String(value);
            }

            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        },

        getStatusClass(status) {
            const value = String(status || "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");

            if (value.includes("published")) {
                return "status-published";
            }

            if (
                value.includes("accepted") ||
                value.includes("approved")
            ) {
                return "status-accepted";
            }

            if (
                value.includes("submitted") ||
                value.includes("progress") ||
                value.includes("working")
            ) {
                return "status-progress";
            }

            if (
                value.includes("rejected") ||
                value.includes("declined")
            ) {
                return "status-rejected";
            }

            if (
                value.includes("review") ||
                value.includes("pending")
            ) {
                return "status-review";
            }

            return "";
        },

        escapeHtml(value) {
            if (
                window.ResearchUtils &&
                typeof ResearchUtils.escapeHtml === "function"
            ) {
                return ResearchUtils.escapeHtml(String(value ?? ""));
            }

            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },

        escapeAttribute(value) {
            return this.escapeHtml(value);
        }
    };

    window.ResearchDashboard = Dashboard;

    document.addEventListener("DOMContentLoaded", function () {
        Dashboard.initialize();
    });
})();