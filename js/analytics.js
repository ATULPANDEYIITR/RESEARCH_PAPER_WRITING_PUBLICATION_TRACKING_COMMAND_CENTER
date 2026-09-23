(function () {
    "use strict";

    const U = window.ResearchUtils;

    function getResearch() {
        return window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];
    }

    function getStatistics() {
        const research = getResearch();

        const total = research.length;

        const published = research.filter(
            item =>
                U.normalizeText(
                    item.status
                ).toLowerCase() === "published"
        ).length;

        const inProgress = research.filter(
            item =>
                U.normalizeText(
                    item.status
                ).toLowerCase() ===
                "in progress"
        ).length;

        const draft = research.filter(
            item =>
                U.normalizeText(
                    item.status
                ).toLowerCase() === "draft"
        ).length;

        const review = research.filter(
            item =>
                U.normalizeText(
                    item.status
                ).toLowerCase() === "under review"
        ).length;

        const uniqueJournals =
            new Set(
                research
                    .map(item =>
                        U.normalizeText(
                            item.journal
                        )
                    )
                    .filter(Boolean)
            ).size;

        const uniquePublishers =
            new Set(
                research
                    .map(item =>
                        U.normalizeText(
                            item.publisher
                        )
                    )
                    .filter(Boolean)
            ).size;

        const uniqueAuthors =
            new Set(
                research
                    .map(item =>
                        U.normalizeText(
                            item.author
                        )
                    )
                    .filter(Boolean)
            ).size;

        const statusCounts =
            U.countBy(
                research,
                item =>
                    U.normalizeText(
                        item.status
                    ) || "Unknown"
            );

        const typeCounts =
            U.countBy(
                research,
                item =>
                    U.normalizeText(
                        item.type
                    ) || "Unknown"
            );

        return {
            total,
            published,
            inProgress,
            draft,
            review,
            uniqueJournals,
            uniquePublishers,
            uniqueAuthors,
            statusCounts,
            typeCounts
        };
    }

    function getStatusCounts() {
        return getStatistics()
            .statusCounts;
    }

    function getTypeCounts() {
        return getStatistics()
            .typeCounts;
    }

    function getAuthorCounts() {
        return U.countBy(
            getResearch(),
            item =>
                U.normalizeText(
                    item.author
                ) || "Unknown"
        );
    }

    function getJournalCounts() {
        return U.countBy(
            getResearch(),
            item =>
                U.normalizeText(
                    item.journal
                ) || "Unknown"
        );
    }

    function getPublisherCounts() {
        return U.countBy(
            getResearch(),
            item =>
                U.normalizeText(
                    item.publisher
                ) || "Unknown"
        );
    }

    function getMonthlyCounts() {
        const counts = {};

        getResearch().forEach(item => {
            if (!item.date) {
                return;
            }

            const date =
                new Date(item.date);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return;
            }

            const key =
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;

            counts[key] =
                (counts[key] || 0) + 1;
        });

        return counts;
    }

    function getDeadlineStatistics() {
        const research =
            getResearch();

        let withDeadline = 0;
        let overdue = 0;
        let upcoming = 0;
        let completed = 0;

        research.forEach(item => {
            if (!item.deadline) {
                return;
            }

            withDeadline++;

            if (
                U.isOverdue(
                    item.deadline
                )
            ) {
                overdue++;
            } else {
                upcoming++;
            }

            if (
                U.normalizeText(
                    item.status
                ).toLowerCase() ===
                "published"
            ) {
                completed++;
            }
        });

        return {
            withDeadline,
            overdue,
            upcoming,
            completed
        };
    }

    function createBarChart(
        container,
        counts,
        formatter
    ) {
        if (!container) {
            return;
        }

        const entries =
            Object.entries(
                counts || {}
            ).sort(
                (a, b) =>
                    b[1] - a[1]
            );

        if (
            entries.length === 0
        ) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-title">
                        No data available
                    </div>
                    <div class="empty-state-text">
                        Add research records to generate analytics.
                    </div>
                </div>
            `;

            return;
        }

        const maxValue =
            Math.max(
                ...entries.map(
                    entry =>
                        Number(
                            entry[1]
                        )
                ),
                1
            );

        container.innerHTML =
            entries
                .map(
                    ([label, value]) => {
                        const numericValue =
                            Number(value);

                        const width =
                            Math.max(
                                4,
                                (
                                    numericValue /
                                    maxValue
                                ) *
                                    100
                            );

                        return `
                            <div class="bar-row">
                                <div class="bar-label">
                                    ${U.escapeHtml(
                                        formatter
                                            ? formatter(
                                                  label
                                              )
                                            : label
                                    )}
                                </div>

                                <div class="bar-track">
                                    <div
                                        class="bar-fill"
                                        style="width: ${width}%"
                                    ></div>
                                </div>

                                <div class="bar-value">
                                    ${numericValue}
                                </div>
                            </div>
                        `;
                    }
                )
                .join("");
    }

    function renderStatusChart() {
        const container =
            document.getElementById(
                "analyticsStatusChart"
            );

        if (!container) {
            return;
        }

        createBarChart(
            container,
            getStatusCounts(),
            U.formatStatus
        );
    }

    function renderTypeChart() {
        const container =
            document.getElementById(
                "analyticsTypeChart"
            );

        if (!container) {
            return;
        }

        createBarChart(
            container,
            getTypeCounts(),
            U.getTypeLabel
        );
    }

    function renderTopList(
        container,
        counts,
        label
    ) {
        if (!container) {
            return;
        }

        const entries =
            Object.entries(
                counts || {}
            )
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                )
                .slice(0, 5);

        if (
            entries.length === 0
        ) {
            container.innerHTML = `
                <div class="empty-state">
                    No ${U.escapeHtml(
                        label.toLowerCase()
                    )} data available.
                </div>
            `;

            return;
        }

        container.innerHTML =
            entries
                .map(
                    ([name, count], index) => `
                        <div class="analytics-item">
                            <div class="analytics-item-rank">
                                ${index + 1}
                            </div>

                            <div class="analytics-item-info">
                                <div class="analytics-item-name">
                                    ${U.escapeHtml(
                                        name
                                    )}
                                </div>

                                <div class="analytics-item-label">
                                    ${U.escapeHtml(
                                        label
                                    )}
                                </div>
                            </div>

                            <div class="analytics-item-value">
                                ${count}
                            </div>
                        </div>
                    `
                )
                .join("");
    }

    function renderAnalytics() {
        const stats =
            getStatistics();

        const total =
            document.getElementById(
                "analyticsTotal"
            );

        const published =
            document.getElementById(
                "analyticsPublished"
            );

        const journals =
            document.getElementById(
                "analyticsJournals"
            );

        const publishers =
            document.getElementById(
                "analyticsPublishers"
            );

        if (total) {
            total.textContent =
                stats.total;
        }

        if (published) {
            published.textContent =
                stats.published;
        }

        if (journals) {
            journals.textContent =
                stats.uniqueJournals;
        }

        if (publishers) {
            publishers.textContent =
                stats.uniquePublishers;
        }

        renderStatusChart();
        renderTypeChart();

        renderAdditionalAnalytics();
    }

    function renderAdditionalAnalytics() {
        const authorContainer =
            document.getElementById(
                "analyticsAuthorsList"
            );

        const journalContainer =
            document.getElementById(
                "analyticsJournalsList"
            );

        const publisherContainer =
            document.getElementById(
                "analyticsPublishersList"
            );

        if (authorContainer) {
            renderTopList(
                authorContainer,
                getAuthorCounts(),
                "Research"
            );
        }

        if (journalContainer) {
            renderTopList(
                journalContainer,
                getJournalCounts(),
                "Research"
            );
        }

        if (publisherContainer) {
            renderTopList(
                publisherContainer,
                getPublisherCounts(),
                "Research"
            );
        }
    }

    function getPublicationRate() {
        const research =
            getResearch();

        if (
            research.length === 0
        ) {
            return 0;
        }

        const published =
            research.filter(
                item =>
                    U.normalizeText(
                        item.status
                    ).toLowerCase() ===
                    "published"
            ).length;

        return (
            published /
            research.length
        ) * 100;
    }

    function getStatusPercentage(
        status
    ) {
        const research =
            getResearch();

        if (
            research.length === 0
        ) {
            return 0;
        }

        const count =
            research.filter(
                item =>
                    U.normalizeText(
                        item.status
                    ).toLowerCase() ===
                    U.normalizeText(
                        status
                    ).toLowerCase()
            ).length;

        return (
            count /
            research.length
        ) * 100;
    }

    function getAverageResearchPerMonth() {
        const monthly =
            getMonthlyCounts();

        const values =
            Object.values(
                monthly
            );

        if (
            values.length === 0
        ) {
            return 0;
        }

        const total =
            values.reduce(
                (sum, value) =>
                    sum +
                    Number(value),
                0
            );

        return (
            total /
            values.length
        );
    }

    function getSummary() {
        const stats =
            getStatistics();

        const deadlines =
            getDeadlineStatistics();

        return {
            totalResearch:
                stats.total,
            publishedResearch:
                stats.published,
            inProgressResearch:
                stats.inProgress,
            draftResearch:
                stats.draft,
            reviewResearch:
                stats.review,
            authors:
                stats.uniqueAuthors,
            journals:
                stats.uniqueJournals,
            publishers:
                stats.uniquePublishers,
            publicationRate:
                getPublicationRate(),
            overdueDeadlines:
                deadlines.overdue,
            upcomingDeadlines:
                deadlines.upcoming,
            averageResearchPerMonth:
                getAverageResearchPerMonth()
        };
    }

    function initialize() {
        renderAnalytics();
    }

    window.AnalyticsManager = {
        initialize,
        render: renderAnalytics,
        renderAnalytics,
        getStatistics,
        getStatusCounts,
        getTypeCounts,
        getAuthorCounts,
        getJournalCounts,
        getPublisherCounts,
        getMonthlyCounts,
        getDeadlineStatistics,
        getPublicationRate,
        getStatusPercentage,
        getAverageResearchPerMonth,
        getSummary
    };
})();