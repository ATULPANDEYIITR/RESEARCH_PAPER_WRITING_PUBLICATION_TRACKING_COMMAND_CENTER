(function () {
    "use strict";

    function generateId(prefix = "id") {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(dateValue, options = {}) {
        if (!dateValue) {
            return "Not set";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Invalid date";
        }

        const config = {
            year: "numeric",
            month: "short",
            day: "numeric",
            ...options
        };

        return new Intl.DateTimeFormat("en-IN", config).format(date);
    }

    function formatDateInput(dateValue) {
        if (!dateValue) {
            return "";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function todayString() {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function normalizeText(value) {
        return String(value || "")
            .trim()
            .replace(/\s+/g, " ");
    }

    function slugify(value) {
        return normalizeText(value)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function truncateText(value, length = 120) {
        const text = normalizeText(value);

        if (text.length <= length) {
            return text;
        }

        return `${text.slice(0, Math.max(0, length - 3))}...`;
    }

    function capitalize(value) {
        const text = normalizeText(value);

        if (!text) {
            return "";
        }

        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function titleCase(value) {
        return normalizeText(value)
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    function formatStatus(status) {
        const value = normalizeText(status);

        if (!value) {
            return "Unknown";
        }

        return value
            .replace(/[-_]/g, " ")
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    }

    function getStatusClass(status) {
        const value = normalizeText(status).toLowerCase();

        const classes = {
            published: "published",
            "in progress": "in-progress",
            "in-progress": "in-progress",
            draft: "draft",
            submitted: "submitted",
            accepted: "accepted",
            rejected: "rejected",
            review: "review",
            "under review": "review",
            planned: "planned"
        };

        return classes[value] || "draft";
    }

    function getTypeLabel(type) {
        const value = normalizeText(type);

        if (!value) {
            return "Other";
        }

        return value
            .replace(/[-_]/g, " ")
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    }

    function parseKeywords(value) {
        if (Array.isArray(value)) {
            return value
                .map(item => normalizeText(item))
                .filter(Boolean);
        }

        return String(value || "")
            .split(",")
            .map(item => normalizeText(item))
            .filter(Boolean);
    }

    function keywordsToString(value) {
        return parseKeywords(value).join(", ");
    }

    function daysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return null;
        }

        const startDay = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate()
        );

        const endDay = new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate()
        );

        const difference = endDay.getTime() - startDay.getTime();

        return Math.round(difference / 86400000);
    }

    function daysUntil(dateValue) {
        if (!dateValue) {
            return null;
        }

        return daysBetween(new Date(), dateValue);
    }

    function isOverdue(dateValue) {
        const days = daysUntil(dateValue);

        return days !== null && days < 0;
    }

    function isDueSoon(dateValue, days = 7) {
        const remaining = daysUntil(dateValue);

        return (
            remaining !== null &&
            remaining >= 0 &&
            remaining <= days
        );
    }

    function formatRelativeDeadline(dateValue) {
        const remaining = daysUntil(dateValue);

        if (remaining === null) {
            return "No deadline";
        }

        if (remaining < 0) {
            const days = Math.abs(remaining);
            return `${days} day${days === 1 ? "" : "s"} overdue`;
        }

        if (remaining === 0) {
            return "Due today";
        }

        if (remaining === 1) {
            return "Due tomorrow";
        }

        return `Due in ${remaining} days`;
    }

    function sortByDate(items, field, descending = false) {
        return [...(Array.isArray(items) ? items : [])].sort((a, b) => {
            const dateA = new Date(a?.[field] || 0).getTime();
            const dateB = new Date(b?.[field] || 0).getTime();

            const safeA = Number.isNaN(dateA) ? 0 : dateA;
            const safeB = Number.isNaN(dateB) ? 0 : dateB;

            return descending ? safeB - safeA : safeA - safeB;
        });
    }

    function sortByText(items, field, descending = false) {
        return [...(Array.isArray(items) ? items : [])].sort((a, b) => {
            const valueA = normalizeText(a?.[field]).toLowerCase();
            const valueB = normalizeText(b?.[field]).toLowerCase();

            const result = valueA.localeCompare(valueB);

            return descending ? -result : result;
        });
    }

    function uniqueValues(items, field) {
        const values = new Set();

        (Array.isArray(items) ? items : []).forEach(item => {
            const value = normalizeText(item?.[field]);

            if (value) {
                values.add(value);
            }
        });

        return Array.from(values).sort((a, b) =>
            a.localeCompare(b)
        );
    }

    function debounce(callback, delay = 250) {
        let timer = null;

        return function (...args) {
            clearTimeout(timer);

            timer = setTimeout(() => {
                callback.apply(this, args);
            }, delay);
        };
    }

    function downloadFile(filename, content, type = "text/plain") {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    function downloadJson(filename, data) {
        const content = JSON.stringify(data, null, 2);

        downloadFile(
            filename,
            content,
            "application/json;charset=utf-8"
        );
    }

    function getInitials(value, fallback = "?") {
        const text = normalizeText(value);

        if (!text) {
            return fallback;
        }

        const words = text.split(" ").filter(Boolean);

        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    }

    function countBy(items, field) {
        const counts = {};

        (Array.isArray(items) ? items : []).forEach(item => {
            const value = normalizeText(item?.[field]) || "Unknown";
            counts[value] = (counts[value] || 0) + 1;
        });

        return counts;
    }

    function percentage(value, total) {
        const numericValue = Number(value) || 0;
        const numericTotal = Number(total) || 0;

        if (numericTotal <= 0) {
            return 0;
        }

        return Math.round((numericValue / numericTotal) * 100);
    }

    function safeNumber(value, fallback = 0) {
        const number = Number(value);

        return Number.isFinite(number) ? number : fallback;
    }

    function isValidUrl(value) {
        if (!value) {
            return false;
        }

        try {
            const url = new URL(value);
            return ["http:", "https:"].includes(url.protocol);
        } catch {
            return false;
        }
    }

    window.ResearchUtils = {
        generateId,
        escapeHtml,
        formatDate,
        formatDateInput,
        todayString,
        normalizeText,
        slugify,
        truncateText,
        capitalize,
        titleCase,
        formatStatus,
        getStatusClass,
        getTypeLabel,
        parseKeywords,
        keywordsToString,
        daysBetween,
        daysUntil,
        isOverdue,
        isDueSoon,
        formatRelativeDeadline,
        sortByDate,
        sortByText,
        uniqueValues,
        debounce,
        downloadFile,
        downloadJson,
        getInitials,
        countBy,
        percentage,
        safeNumber,
        isValidUrl
    };
})();