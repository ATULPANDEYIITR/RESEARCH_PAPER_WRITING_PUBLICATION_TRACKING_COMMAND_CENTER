"use strict";

(function () {
    var STORAGE_KEY = "research_tracker_records_v8";
    var THEME_KEY = "research_tracker_theme_v8";

    var records = [];
    var currentCalendarDate = new Date();

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function uid() {
        return "research-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
    }

    function seedRecords() {
        return [
            {
                id: "R001",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10061",
                start: "2026-07-09",
                deadline: "2026-09-10",
                title: "Algorithmic Cognition and the Emergence of Human Cognitive Dependency in AI-Mediated Decision Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R002",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10118",
                start: "2026-07-10",
                deadline: "2026-09-11",
                title: "Computational Consumer Cognition and Behavioral Economics in AI Driven Digital Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R003",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10079",
                start: "2026-07-10",
                deadline: "2026-09-13",
                title: "Zero Interface Computing and Ambient Intelligence in Anticipatory Human Machine Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R004",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10102",
                start: "2026-07-20",
                deadline: "2026-09-20",
                title: "Conversational Intelligence through Large Language Models in Human AI Interaction Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R005",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10098",
                start: "2026-07-19",
                deadline: "2026-09-20",
                title: "Computational Bio-innovation and Intelligent Healthcare Systems for Precision Clinical Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R006",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10028",
                start: "2026-07-12",
                deadline: "2026-10-04",
                title: "Adaptive Green Hospitality Intelligence Through AI Driven Sustainable Service Architectures",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R007",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10140",
                start: "2026-07-19",
                deadline: "2026-10-11",
                title: "AI-Enabled Cross-Border Services: Transformation, Market Access, and the Future of Global Work",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 11th August",
                reminder: "",
                comments: ""
            },
            {
                id: "R008",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10113",
                start: "2026-07-26",
                deadline: "2026-10-18",
                title: "Reinforcement Learning Benchmarking for Reproducible Dynamic Pricing in Autonomous Markets",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R009",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10074",
                start: "2026-07-26",
                deadline: "2026-10-18",
                title: "Intelligent Performance Analytics and AI Orchestrated Workforce Optimization Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 26th July",
                reminder: "",
                comments: ""
            },
            {
                id: "R010",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10135",
                start: "2026-08-16",
                deadline: "2026-10-18",
                title: "Decentralized Energy Intelligence Through Blockchain Enabled Autonomous Market Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R011",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10115",
                start: "2026-08-02",
                deadline: "2026-10-25",
                title: "Responsible AI Decision Intelligence for Ethical Leadership and Corporate Governance Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R012",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10060",
                start: "2026-07-12",
                deadline: "2026-10-25",
                title: "Generative Intelligence Architectures for Adaptive Teaching and Personalized Learning Environment",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R013",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10144",
                start: "2026-08-09",
                deadline: "2026-11-01",
                title: "Semantic Metadata Orchestration for FAIR Compliant Interoperable Scientific Data Infrastructures",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 01st November",
                reminder: "",
                comments: ""
            },
            {
                id: "R014",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10042",
                start: "2026-07-19",
                deadline: "2026-11-01",
                title: "Circular Design Intelligence for Lifecycle Accountability and Sustainable Pedagogical Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R015",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10150",
                start: "2026-08-30",
                deadline: "2026-11-01",
                title: "Measuring Digital Transformation Success Through Portfolio Governance and Value Creation",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 16th August",
                reminder: "",
                comments: ""
            },
            {
                id: "R016",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10133",
                start: "2026-07-26",
                deadline: "2026-11-08",
                title: "Adaptive Workforce Intelligence for Lifelong Learning and Autonomous Future Work Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 30th September",
                reminder: "",
                comments: ""
            },
            {
                id: "R017",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10090",
                start: "2026-07-26",
                deadline: "2026-08-15",
                title: "Autonomous Cyber Defence Intelligence through AI Augmented Security Orchestration Ecosystems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 15th August",
                reminder: "",
                comments: ""
            },
            {
                id: "R018",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10151",
                start: "2026-08-23",
                deadline: "2026-11-15",
                title: "Digital Twins and Cognitive AI for Secure Smart Healthcare Cyber Physical Systems",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R019",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10159",
                start: "2026-08-23",
                deadline: "2026-11-15",
                title: "AI Assisted STEM Education for Scientific Reasoning and Sustainable Innovation",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 23rd August",
                reminder: "",
                comments: ""
            },
            {
                id: "R020",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10141",
                start: "2026-08-02",
                deadline: "2026-11-15",
                title: "Parameter Efficient Adaptation Architectures for Robust Foundation Model Specialization Frameworks",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 30th July",
                reminder: "",
                comments: ""
            },
            {
                id: "R021",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10067",
                start: "2026-08-02",
                deadline: "2026-11-15",
                title: "AI Misuse, Surveillance, Academic Integrity, and the Risk of Learned Dependency: Preserving Intrinsic Motivation in AI-Mediated Learning",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R022",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10162",
                start: "2026-08-30",
                deadline: "2026-11-22",
                title: "AI-Enabled Diagnostics and Precision Medicine",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R023",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10127",
                start: "2026-08-12",
                deadline: "2026-11-25",
                title: "Retrieval Augmented Pedagogical Intelligence for Curriculum Aligned Adaptive Learning",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Submitted",
                reminder: "",
                comments: ""
            },
            {
                id: "R024",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10128",
                start: "2026-08-12",
                deadline: "2026-11-25",
                title: "Explainable Cognitive Intelligence Architectures for Trustworthy Human AI Decision Management",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 30th September",
                reminder: "",
                comments: ""
            },
            {
                id: "R025",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10136",
                start: "2026-08-16",
                deadline: "2026-11-29",
                title: "Semantic Search and Ontology-Driven Knowledge Discovery in Smart Libraries",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 15th August",
                reminder: "",
                comments: ""
            },
            {
                id: "R026",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10138",
                start: "2026-08-30",
                deadline: "2026-12-13",
                title: "Leading Higher Education Through AI and Global Transformation: A New Era of International Collaboration",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 13th December",
                reminder: "",
                comments: ""
            },
            {
                id: "R027",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10132",
                start: "2026-08-23",
                deadline: "2026-12-06",
                title: "Neuroadaptive Human AI Learning Architectures for Cognitive Symbiosis in Intelligent Education",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 06th December",
                reminder: "",
                comments: ""
            },
            {
                id: "R028",
                link: "https://www.igi-global.com/publish/call-for-papers/call-details/10119",
                start: "2026-07-26",
                deadline: "2026-12-27",
                title: "Autonomous Institutional Intelligence for AI Driven Governance and Workload Optimization in HEIs",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 03rd September",
                reminder: "",
                comments: ""
            },
            {
                id: "R029",
                link: "https://www.igi-global.com/submission/submit-chapter/?projectid=77217ab4-43a9-4ed5-b1c5-efbb8247ae6a",
                start: "",
                deadline: "2026-09-30",
                title: "AI-Assisted Code Generation for Intelligent Requirements Engineering and DevOps",
                association: "IGI Publications",
                publicationType: "Edited Book Chapter",
                priority: "High",
                status: "Working",
                action: "Proposal Accepted and submit full paper by 30th September",
                reminder: "",
                comments: ""
            }
        ];
    }

    function cloneSeeds() {
        return seedRecords().map(function (item) {
            return Object.assign({}, item);
        });
    }

    function saveRecords() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    function loadRecords() {
        var stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            records = cloneSeeds();
            saveRecords();
            return;
        }

        try {
            records = JSON.parse(stored);

            if (!Array.isArray(records)) {
                records = cloneSeeds();
                saveRecords();
            }
        } catch (error) {
            records = cloneSeeds();
            saveRecords();
        }
    }

    function restoreSeedData(showMessage) {
        records = cloneSeeds();
        saveRecords();
        renderAll();

        if (showMessage !== false) {
            showToast("All 29 research records have been restored.", "success");
        }
    }

    function formatDate(value) {
        if (!value) {
            return "Not set";
        }

        var date = new Date(value + "T00:00:00");

        if (isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function daysUntil(value) {
        if (!value) {
            return null;
        }

        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var target = new Date(value + "T00:00:00");

        if (isNaN(target.getTime())) {
            return null;
        }

        return Math.round((target.getTime() - today.getTime()) / 86400000);
    }

    function deadlineClass(value) {
        var days = daysUntil(value);

        if (days === null) {
            return "badge-blue";
        }

        if (days < 0) {
            return "badge-red";
        }

        if (days <= 14) {
            return "badge-yellow";
        }

        return "badge-green";
    }

    function deadlineText(value) {
        var days = daysUntil(value);

        if (days === null) {
            return "No deadline";
        }

        if (days < 0) {
            return Math.abs(days) + " days overdue";
        }

        if (days === 0) {
            return "Due today";
        }

        if (days === 1) {
            return "Due tomorrow";
        }

        return days + " days remaining";
    }

    function statusClass(status) {
        var value = String(status || "").toLowerCase();

        if (value.indexOf("accept") >= 0 || value.indexOf("complete") >= 0) {
            return "badge-green";
        }

        if (value.indexOf("reject") >= 0 || value.indexOf("overdue") >= 0) {
            return "badge-red";
        }

        if (value.indexOf("pending") >= 0 || value.indexOf("upcoming") >= 0) {
            return "badge-yellow";
        }

        return "badge-blue";
    }

    function priorityClass(priority) {
        var value = String(priority || "").toLowerCase();

        if (value === "high") {
            return "badge-red";
        }

        if (value === "medium") {
            return "badge-yellow";
        }

        if (value === "low") {
            return "badge-green";
        }

        return "badge-blue";
    }

    function showToast(message, type) {
        var container = $("#toastContainer");

        if (!container) {
            return;
        }

        var toast = document.createElement("div");
        toast.className = "toast " + (type || "");
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3500);
    }

    function getFilteredRecords() {
        var search = $("#librarySearch");
        var status = $("#statusFilter");
        var priority = $("#priorityFilter");
        var action = $("#actionFilter");

        var searchValue = search ? search.value.toLowerCase().trim() : "";
        var statusValue = status ? status.value : "";
        var priorityValue = priority ? priority.value : "";
        var actionValue = action ? action.value : "";

        return records.filter(function (record) {
            var text = [
                record.title,
                record.association,
                record.publicationType,
                record.status,
                record.priority,
                record.action
            ].join(" ").toLowerCase();

            if (searchValue && text.indexOf(searchValue) === -1) {
                return false;
            }

            if (statusValue && record.status !== statusValue) {
                return false;
            }

            if (priorityValue && record.priority !== priorityValue) {
                return false;
            }

            if (actionValue && record.action !== actionValue) {
                return false;
            }

            return true;
        });
    }

    function sortRecords(list) {
        var select = $("#sortLibrary");
        var value = select ? select.value : "deadline";

        return list.slice().sort(function (a, b) {
            if (value === "title") {
                return String(a.title).localeCompare(String(b.title));
            }

            if (value === "priority") {
                return String(a.priority).localeCompare(String(b.priority));
            }

            if (value === "status") {
                return String(a.status).localeCompare(String(b.status));
            }

            if (value === "newest") {
                return String(b.start || "").localeCompare(String(a.start || ""));
            }

            return String(a.deadline || "9999").localeCompare(
                String(b.deadline || "9999")
            );
        });
    }

    function renderStats() {
        var total = records.length;

        var working = records.filter(function (r) {
            return String(r.status).toLowerCase() === "working";
        }).length;

        var accepted = records.filter(function (r) {
            return String(r.action).toLowerCase().indexOf("accepted") >= 0;
        }).length;

        var upcoming = records.filter(function (r) {
            var days = daysUntil(r.deadline);
            return days !== null && days >= 0 && days <= 30;
        }).length;

        setText("#totalResearch", total);
        setText("#workingResearch", working);
        setText("#acceptedResearch", accepted);
        setText("#upcomingResearch", upcoming);

        var navBadge = $("#researchCountBadge");

        if (navBadge) {
            navBadge.textContent = total;
        }
    }

    function setText(selector, value) {
        var element = $(selector);

        if (element) {
            element.textContent = value;
        }
    }

    function renderPipeline() {
        var container = $("#dashboardPipeline");

        if (!container) {
            return;
        }

        var groups = [
            {
                label: "Proposal submitted",
                value: records.filter(function (r) {
                    return String(r.action).toLowerCase().indexOf("proposal submitted") >= 0;
                }).length
            },
            {
                label: "Proposal accepted",
                value: records.filter(function (r) {
                    return String(r.action).toLowerCase().indexOf("accepted") >= 0;
                }).length
            },
            {
                label: "Working",
                value: records.filter(function (r) {
                    return String(r.status).toLowerCase() === "working";
                }).length
            },
            {
                label: "High priority",
                value: records.filter(function (r) {
                    return String(r.priority).toLowerCase() === "high";
                }).length
            }
        ];

        var maximum = Math.max.apply(null, groups.map(function (g) {
            return g.value;
        }));

        if (maximum < 1) {
            maximum = 1;
        }

        container.innerHTML = groups.map(function (group) {
            var width = Math.round((group.value / maximum) * 100);

            return (
                '<div class="pipeline-row">' +
                '<div class="pipeline-label">' + escapeHtml(group.label) + "</div>" +
                '<div class="pipeline-track">' +
                '<div class="pipeline-fill" style="width:' + width + '%"></div>' +
                "</div>" +
                '<div class="pipeline-number">' + group.value + "</div>" +
                "</div>"
            );
        }).join("");
    }

    function renderDeadlines() {
        var container = $("#dashboardDeadlines");

        if (!container) {
            return;
        }

        var upcoming = records
            .filter(function (record) {
                return record.deadline;
            })
            .sort(function (a, b) {
                return String(a.deadline).localeCompare(String(b.deadline));
            })
            .slice(0, 7);

        if (!upcoming.length) {
            container.innerHTML =
                '<div class="empty-state"><strong>No deadlines</strong>No deadline information is available.</div>';
            return;
        }

        container.innerHTML = upcoming.map(function (record) {
            var days = daysUntil(record.deadline);
            var color = deadlineClass(record.deadline);

            return (
                '<div class="deadline-item">' +
                '<div class="deadline-date">' + formatDate(record.deadline) + "</div>" +
                '<div class="deadline-info">' +
                '<div class="deadline-title">' + escapeHtml(record.title) + "</div>" +
                '<div class="deadline-meta">' +
                '<span class="badge ' + color + '">' +
                escapeHtml(deadlineText(record.deadline)) +
                "</span>" +
                "</div>" +
                "</div>" +
                "</div>"
            );
        }).join("");
    }

    function renderChart(selector, values, labels) {
        var container = $(selector);

        if (!container) {
            return;
        }

        var maximum = Math.max.apply(null, values);

        if (maximum < 1) {
            maximum = 1;
        }

        container.innerHTML =
            '<div class="chart-bars">' +
            values.map(function (value, index) {
                var height = Math.max(8, Math.round((value / maximum) * 150));

                return (
                    '<div class="chart-bar-group">' +
                    '<div class="chart-bar-value">' + value + "</div>" +
                    '<div class="chart-bar" style="height:' + height + 'px"></div>' +
                    '<div class="chart-bar-label">' +
                    escapeHtml(labels[index]) +
                    "</div>" +
                    "</div>"
                );
            }).join("") +
            "</div>";
    }

    function renderCharts() {
        var statusValues = [
            records.filter(function (r) {
                return r.status === "Working";
            }).length,
            records.filter(function (r) {
                return String(r.action).toLowerCase().indexOf("accepted") >= 0;
            }).length
        ];

        renderChart(
            "#dashboardStatusChart",
            statusValues,
            ["Working", "Accepted"]
        );

        var priorityValues = [
            records.filter(function (r) {
                return r.priority === "High";
            }).length,
            records.filter(function (r) {
                return r.priority === "Medium";
            }).length,
            records.filter(function (r) {
                return r.priority === "Low";
            }).length
        ];

        renderChart(
            "#dashboardPriorityChart",
            priorityValues,
            ["High", "Medium", "Low"]
        );
    }

    function renderLibrary() {
        var body = $("#researchTableBody");

        if (!body) {
            return;
        }

        var list = sortRecords(getFilteredRecords());

        setText("#libraryCount", list.length + " of " + records.length + " records");

        if (!list.length) {
            body.innerHTML =
                '<tr><td colspan="9"><div class="empty-state"><strong>No research records found</strong>Try changing the search or filters.</div></td></tr>';
            return;
        }

        body.innerHTML = list.map(function (record) {
            return (
                "<tr>" +
                '<td><strong>' + escapeHtml(record.id) + "</strong></td>" +
                '<td><div class="research-title">' +
                escapeHtml(record.title) +
                "</div></td>" +
                "<td>" + escapeHtml(record.association) + "</td>" +
                "<td>" + escapeHtml(record.publicationType) + "</td>" +
                '<td><span class="badge ' +
                priorityClass(record.priority) +
                '">' +
                escapeHtml(record.priority) +
                "</span></td>" +
                '<td><span class="badge ' +
                statusClass(record.status) +
                '">' +
                escapeHtml(record.status) +
                "</span></td>" +
                '<td><span class="badge ' +
                deadlineClass(record.deadline) +
                '">' +
                escapeHtml(record.deadline ? formatDate(record.deadline) : "Not set") +
                "</span></td>" +
                "<td>" + escapeHtml(record.action) + "</td>" +
                '<td><div class="action-buttons">' +
                '<button class="btn btn-small btn-primary" data-action="view" data-id="' +
                escapeHtml(record.id) +
                '">View</button>' +
                '<button class="btn btn-small btn-warning" data-action="edit" data-id="' +
                escapeHtml(record.id) +
                '">Edit</button>' +
                '<button class="btn btn-small btn-danger" data-action="delete" data-id="' +
                escapeHtml(record.id) +
                '">Delete</button>' +
                "</div></td>" +
                "</tr>"
            );
        }).join("");
    }

    function renderAuthors() {
        var container = $("#authorsContent");

        if (!container) {
            return;
        }

        var authors = [
            {
                name: "Research Portfolio",
                value: records.length,
                description: "Total research opportunities currently tracked."
            },
            {
                name: "IGI Publications",
                value: records.filter(function (r) {
                    return r.association === "IGI Publications";
                }).length,
                description: "Records associated with IGI Publications."
            },
            {
                name: "Accepted Proposals",
                value: records.filter(function (r) {
                    return String(r.action).toLowerCase().indexOf("accepted") >= 0;
                }).length,
                description: "Records where the proposal has been accepted."
            }
        ];

        container.innerHTML = '<div class="cards-grid">' +
            authors.map(function (item) {
                return (
                    '<div class="info-card">' +
                    "<h3>" + escapeHtml(item.name) + "</h3>" +
                    '<div class="big-number">' + item.value + "</div>" +
                    "<p>" + escapeHtml(item.description) + "</p>" +
                    "</div>"
                );
            }).join("") +
            "</div>";
    }

    function renderJournals() {
        var container = $("#journalsContent");

        if (!container) {
            return;
        }

        var types = {};

        records.forEach(function (record) {
            var type = record.publicationType || "Unknown";
            types[type] = (types[type] || 0) + 1;
        });

        var keys = Object.keys(types);

        container.innerHTML = '<div class="cards-grid">' +
            keys.map(function (key) {
                return (
                    '<div class="info-card">' +
                    "<h3>" + escapeHtml(key) + "</h3>" +
                    '<div class="big-number">' + types[key] + "</div>" +
                    "<p>Research opportunities of this publication type.</p>" +
                    "</div>"
                );
            }).join("") +
            "</div>";
    }

    function renderPublishers() {
        var container = $("#publishersContent");

        if (!container) {
            return;
        }

        var publishers = {};

        records.forEach(function (record) {
            var publisher = record.association || "Unknown";
            publishers[publisher] = (publishers[publisher] || 0) + 1;
        });

        var keys = Object.keys(publishers);

        container.innerHTML = '<div class="cards-grid">' +
            keys.map(function (key) {
                return (
                    '<div class="info-card">' +
                    "<h3>" + escapeHtml(key) + "</h3>" +
                    '<div class="big-number">' + publishers[key] + "</div>" +
                    "<p>Research records in this publisher or association.</p>" +
                    "</div>"
                );
            }).join("") +
            "</div>";
    }

    function renderCalendar() {
        var container = $("#calendarContent");

        if (!container) {
            return;
        }

        var year = currentCalendarDate.getFullYear();
        var month = currentCalendarDate.getMonth();

        var first = new Date(year, month, 1);
        var last = new Date(year, month + 1, 0);

        var startDay = first.getDay();
        var totalDays = last.getDate();

        var html = '<div class="calendar-wrapper"><div class="calendar-grid">';

        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(function (day) {
            html += '<div class="calendar-weekday">' + day + "</div>";
        });

        for (var blank = 0; blank < startDay; blank++) {
            html += '<div class="calendar-day muted"></div>';
        }

        for (var dayNumber = 1; dayNumber <= totalDays; dayNumber++) {
            var dateString =
                year +
                "-" +
                String(month + 1).padStart(2, "0") +
                "-" +
                String(dayNumber).padStart(2, "0");

            var today = new Date();
            var isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === dayNumber;

            var events = records.filter(function (record) {
                return record.deadline === dateString;
            });

            html += '<div class="calendar-day' +
                (isToday ? " today" : "") +
                '">' +
                '<div class="calendar-day-number">' +
                dayNumber +
                "</div>";

            events.forEach(function (record) {
                var eventClass = "calendar-event";

                var days = daysUntil(record.deadline);

                if (days !== null && days < 0) {
                    eventClass += " urgent";
                } else if (days !== null && days <= 14) {
                    eventClass += " warning";
                } else {
                    eventClass += " success";
                }

                html +=
                    '<div class="' + eventClass + '" title="' +
                    escapeHtml(record.title) +
                    '">' +
                    escapeHtml(record.id) +
                    " - " +
                    escapeHtml(record.title.substring(0, 28)) +
                    "</div>";
            });

            html += "</div>";
        }

        html += "</div></div>";

        container.innerHTML = html;

        setText(
            "#calendarMonthTitle",
            currentCalendarDate.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric"
            })
        );
    }

    function renderAnalytics() {
        var container = $("#analyticsContent");

        if (!container) {
            return;
        }

        var total = records.length;

        var accepted = records.filter(function (r) {
            return String(r.action).toLowerCase().indexOf("accepted") >= 0;
        }).length;

        var submitted = records.filter(function (r) {
            return String(r.action).toLowerCase().indexOf("submitted") >= 0;
        }).length;

        var high = records.filter(function (r) {
            return String(r.priority).toLowerCase() === "high";
        }).length;

        var overdue = records.filter(function (r) {
            var days = daysUntil(r.deadline);
            return days !== null && days < 0;
        }).length;

        var metrics = [
            ["Total research records", total],
            ["Proposal accepted", accepted],
            ["Proposal submitted", submitted],
            ["High priority", high],
            ["Overdue deadlines", overdue]
        ];

        container.innerHTML =
            '<div class="analytics-grid">' +
            '<div class="panel">' +
            '<div class="panel-header">' +
            '<div><h3 class="panel-title">Research metrics</h3>' +
            '<p class="panel-subtitle">Current portfolio overview</p></div>' +
            "</div>" +
            '<div class="metric-list">' +
            metrics.map(function (item) {
                var percentage = total ? Math.round((item[1] / total) * 100) : 0;

                return (
                    '<div class="metric-row">' +
                    '<div class="metric-name">' + escapeHtml(item[0]) + "</div>" +
                    '<div class="metric-track">' +
                    '<div class="metric-fill" style="width:' + percentage + '%"></div>' +
                    "</div>" +
                    '<div class="metric-value">' + item[1] + "</div>" +
                    "</div>"
                );
            }).join("") +
            "</div></div>" +
            '<div class="panel">' +
            '<div class="panel-header">' +
            '<div><h3 class="panel-title">Deadline distribution</h3>' +
            '<p class="panel-subtitle">Records by deadline proximity</p></div>' +
            "</div>" +
            '<div class="metric-list">' +
            renderDeadlineMetric("Overdue", overdue, total, "red") +
            renderDeadlineMetric("Due within 14 days", records.filter(function (r) {
                var d = daysUntil(r.deadline);
                return d !== null && d >= 0 && d <= 14;
            }).length, total, "yellow") +
            renderDeadlineMetric("Due after 14 days", records.filter(function (r) {
                var d = daysUntil(r.deadline);
                return d !== null && d > 14;
            }).length, total, "green") +
            "</div></div>" +
            "</div>";
    }

    function renderDeadlineMetric(label, value, total, color) {
        var percentage = total ? Math.round((value / total) * 100) : 0;

        return (
            '<div class="metric-row">' +
            '<div class="metric-name">' +
            '<span class="color-dot ' + color + '"></span> ' +
            escapeHtml(label) +
            "</div>" +
            '<div class="metric-track">' +
            '<div class="metric-fill" style="width:' + percentage + '%"></div>' +
            "</div>" +
            '<div class="metric-value">' + value + "</div>" +
            "</div>"
        );
    }

    function setupFilterOptions() {
        var statuses = {};
        var priorities = {};
        var actions = {};

        records.forEach(function (record) {
            statuses[record.status] = true;
            priorities[record.priority] = true;
            actions[record.action] = true;
        });

        fillSelect("#statusFilter", Object.keys(statuses));
        fillSelect("#priorityFilter", Object.keys(priorities));
        fillSelect("#actionFilter", Object.keys(actions));
    }

    function fillSelect(selector, values) {
        var select = $(selector);

        if (!select) {
            return;
        }

        var current = select.value;

        var html = '<option value="">All</option>';

        values.sort().forEach(function (value) {
            html += '<option value="' +
                escapeHtml(value) +
                '">' +
                escapeHtml(value) +
                "</option>";
        });

        select.innerHTML = html;

        if (values.indexOf(current) >= 0) {
            select.value = current;
        }
    }

    function navigate(section) {
        var panels = $$("[data-section-panel]");
        var buttons = $$("[data-section]");

        panels.forEach(function (panel) {
            panel.classList.toggle(
                "active",
                panel.getAttribute("data-section-panel") === section
            );
        });

        buttons.forEach(function (button) {
            button.classList.toggle(
                "active",
                button.getAttribute("data-section") === section
            );
        });

        var title = {
            dashboard: "Research Dashboard",
            library: "Research Library",
            authors: "Authors",
            journals: "Journals",
            publishers: "Publishers",
            calendar: "Research Calendar",
            analytics: "Analytics",
            settings: "Settings"
        };

        setText("#pageTitle", title[section] || "Research Tracker");

        var subtitle = {
            dashboard: "Monitor your complete research portfolio",
            library: "Search, filter and manage every research opportunity",
            authors: "Research author and portfolio overview",
            journals: "Publication type overview",
            publishers: "Publisher and association overview",
            calendar: "Track important research deadlines",
            analytics: "Understand your research portfolio",
            settings: "Manage data, backup and appearance"
        };

        setText(
            "#pageSubtitle",
            subtitle[section] || "Research Tracker"
        );

        window.location.hash = section;

        if (window.innerWidth <= 800) {
            var sidebar = $(".sidebar");

            if (sidebar) {
                sidebar.classList.remove("open");
            }
        }
    }

    function openModal(selector) {
        var modal = $(selector);

        if (modal) {
            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");
        }
    }

    function closeModal(selector) {
        var modal = $(selector);

        if (modal) {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
        }
    }

    function openResearchForm(record) {
        var form = $("#researchForm");

        if (!form) {
            return;
        }

        form.reset();

        if (record) {
            setValue("#researchId", record.id);
            setValue("#researchTitle", record.title);
            setValue("#researchAssociation", record.association);
            setValue("#researchPublicationType", record.publicationType);
            setValue("#researchPriority", record.priority);
            setValue("#researchAction", record.action);
            setValue("#researchStatus", record.status);
            setValue("#researchReminder", record.reminder);
            setValue("#researchProposalDeadline", record.start);
            setValue("#researchFullPaperDeadline", record.deadline);
            setValue("#researchCallForPaperLink", record.link);
            setValue("#researchComments", record.comments);
            setText("#researchModalTitle", "Edit Research Record");
        } else {
            setValue("#researchId", "");
            setText("#researchModalTitle", "Add Research Record");
        }

        openModal("#researchModal");
    }

    function setValue(selector, value) {
        var element = $(selector);

        if (element) {
            element.value = value == null ? "" : value;
        }
    }

    function getValue(selector) {
        var element = $(selector);
        return element ? element.value.trim() : "";
    }

    function saveResearchForm(event) {
        event.preventDefault();

        var id = getValue("#researchId");

        var item = {
            id: id || uid(),
            title: getValue("#researchTitle"),
            association: getValue("#researchAssociation"),
            publicationType: getValue("#researchPublicationType"),
            priority: getValue("#researchPriority") || "Medium",
            action: getValue("#researchAction") || "Proposal Submitted",
            status: getValue("#researchStatus") || "Working",
            reminder: getValue("#researchReminder"),
            start: getValue("#researchProposalDeadline"),
            deadline: getValue("#researchFullPaperDeadline"),
            link: getValue("#researchCallForPaperLink"),
            comments: getValue("#researchComments")
        };

        if (!item.title) {
            showToast("Please enter a research title.", "error");
            return;
        }

        var existingIndex = records.findIndex(function (record) {
            return record.id === id;
        });

        if (existingIndex >= 0) {
            records[existingIndex] = item;
            showToast("Research record updated.", "success");
        } else {
            records.push(item);
            showToast("Research record added.", "success");
        }

        saveRecords();
        setupFilterOptions();
        renderAll();
        closeModal("#researchModal");
    }

    function showResearchDetail(id) {
        var record = records.find(function (item) {
            return item.id === id;
        });

        if (!record) {
            showToast("Research record not found.", "error");
            return;
        }

        setText("#detailModalTitle", record.title);

        var content = $("#detailModalContent");

        if (!content) {
            return;
        }

        content.innerHTML =
            '<div class="detail-grid">' +
            detailRow("Record ID", record.id) +
            detailRow("Title", record.title) +
            detailRow("Association", record.association) +
            detailRow("Publication Type", record.publicationType) +
            detailRow("Priority", record.priority) +
            detailRow("Status", record.status) +
            detailRow("Action", record.action) +
            detailRow("Proposal Date", formatDate(record.start)) +
            detailRow("Full Paper Deadline", formatDate(record.deadline)) +
            detailRow("Deadline Status", deadlineText(record.deadline)) +
            detailRow("Comments", record.comments || "No comments") +
            detailRow(
                "Call for Papers",
                record.link
                    ? '<a class="research-link" href="' +
                    escapeHtml(record.link) +
                    '" target="_blank" rel="noopener noreferrer">Open source page</a>'
                    : "No link"
            ) +
            "</div>";

        openModal("#detailModal");
    }

    function detailRow(label, value) {
        return (
            '<div class="detail-label">' +
            escapeHtml(label) +
            "</div>" +
            '<div class="detail-value">' +
            (String(value).indexOf("<a ") === 0
                ? value
                : escapeHtml(value)) +
            "</div>"
        );
    }

    function deleteResearch(id) {
        var record = records.find(function (item) {
            return item.id === id;
        });

        if (!record) {
            return;
        }

        var confirmed = window.confirm(
            'Delete "' + record.title + '"?\n\nThis will remove only this research record.'
        );

        if (!confirmed) {
            return;
        }

        records = records.filter(function (item) {
            return item.id !== id;
        });

        saveRecords();
        renderAll();

        showToast("Research record deleted.", "success");
    }

    function confirmDeleteAll() {
        if (!records.length) {
            showToast("There are no research records to delete.", "warning");
            return;
        }

        var firstConfirmation = window.confirm(
            "DELETE ALL RESEARCH DATA?\n\nThis will remove all " +
            records.length +
            " records from the dashboard.\n\nClick OK only if you are sure."
        );

        if (!firstConfirmation) {
            return;
        }

        var secondConfirmation = window.confirm(
            "FINAL CONFIRMATION\n\nAre you absolutely sure you want to delete all research data?"
        );

        if (!secondConfirmation) {
            return;
        }

        records = [];
        saveRecords();
        renderAll();

        showToast(
            "All research data was deleted. Use Restore Seed Data to recover the original 29 records.",
            "error"
        );
    }

    function exportJSON() {
        var blob = new Blob(
            [JSON.stringify(records, null, 2)],
            { type: "application/json" }
        );

        downloadBlob(blob, "research-tracker-backup.json");
        showToast("JSON backup exported.", "success");
    }

    function exportCSV() {
        var headers = [
            "ID",
            "Title",
            "Association",
            "Publication Type",
            "Priority",
            "Status",
            "Action",
            "Proposal Date",
            "Full Paper Deadline",
            "Link",
            "Comments"
        ];

        var rows = records.map(function (r) {
            return [
                r.id,
                r.title,
                r.association,
                r.publicationType,
                r.priority,
                r.status,
                r.action,
                r.start,
                r.deadline,
                r.link,
                r.comments
            ];
        });

        var csv = [headers].concat(rows).map(function (row) {
            return row.map(csvEscape).join(",");
        }).join("\n");

        var blob = new Blob(
            [csv],
            { type: "text/csv;charset=utf-8" }
        );

        downloadBlob(blob, "research-tracker-data.csv");
        showToast("CSV file exported.", "success");
    }

    function csvEscape(value) {
        var text = String(value == null ? "" : value);
        return '"' + text.replace(/"/g, '""') + '"';
    }

    function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);
        var anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 500);
    }

    function importJSONFile(file) {
        if (!file) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function (event) {
            try {
                var imported = JSON.parse(event.target.result);

                if (!Array.isArray(imported)) {
                    throw new Error("Invalid data");
                }

                records = imported;
                saveRecords();
                setupFilterOptions();
                renderAll();

                showToast(
                    "Imported " + records.length + " research records.",
                    "success"
                );
            } catch (error) {
                showToast("The selected JSON file is not valid.", "error");
            }
        };

        reader.readAsText(file);
    }

    function setupNavigation() {
        document.addEventListener("click", function (event) {
            var sectionButton = event.target.closest("[data-section]");

            if (sectionButton) {
                event.preventDefault();

                var section = sectionButton.getAttribute("data-section");

                if (section) {
                    navigate(section);
                }

                return;
            }

            var actionButton = event.target.closest("[data-action]");

            if (!actionButton) {
                return;
            }

            var action = actionButton.getAttribute("data-action");
            var id = actionButton.getAttribute("data-id");

            if (action === "view") {
                showResearchDetail(id);
            }

            if (action === "edit") {
                var record = records.find(function (item) {
                    return item.id === id;
                });

                if (record) {
                    openResearchForm(record);
                }
            }

            if (action === "delete") {
                deleteResearch(id);
            }
        });
    }

    function setupButtons() {
        var addButtons = [
            "#addResearchDashboard",
            "#addResearchLibrary"
        ];

        addButtons.forEach(function (selector) {
            var button = $(selector);

            if (button) {
                button.addEventListener("click", function () {
                    openResearchForm(null);
                });
            }
        });

        var clearFilters = $("#clearFilters");

        if (clearFilters) {
            clearFilters.addEventListener("click", function () {
                setValue("#librarySearch", "");
                setValue("#statusFilter", "");
                setValue("#priorityFilter", "");
                setValue("#actionFilter", "");
                renderLibrary();
            });
        }

        [
            "#librarySearch",
            "#statusFilter",
            "#priorityFilter",
            "#actionFilter",
            "#sortLibrary"
        ].forEach(function (selector) {
            var element = $(selector);

            if (element) {
                element.addEventListener(
                    element.tagName === "INPUT" ? "input" : "change",
                    renderLibrary
                );
            }
        });

        var previous = $("#calendarPrevious");
        var next = $("#calendarNext");
        var today = $("#calendarToday");

        if (previous) {
            previous.addEventListener("click", function () {
                currentCalendarDate.setMonth(
                    currentCalendarDate.getMonth() - 1
                );
                renderCalendar();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                currentCalendarDate.setMonth(
                    currentCalendarDate.getMonth() + 1
                );
                renderCalendar();
            });
        }

        if (today) {
            today.addEventListener("click", function () {
                currentCalendarDate = new Date();
                renderCalendar();
            });
        }

        var exportJSONButton = $("#exportJSON");

        if (exportJSONButton) {
            exportJSONButton.addEventListener("click", exportJSON);
        }

        var exportCSVButton = $("#exportCSV");

        if (exportCSVButton) {
            exportCSVButton.addEventListener("click", exportCSV);
        }

        var importJSONButton = $("#importJSON");
        var importFile = $("#importFile");

        if (importJSONButton && importFile) {
            importJSONButton.addEventListener("click", function () {
                importFile.click();
            });

            importFile.addEventListener("change", function () {
                importJSONFile(importFile.files[0]);
                importFile.value = "";
            });
        }

        var restoreButton = $("#restoreSeed");

        if (restoreButton) {
            restoreButton.addEventListener("click", function () {
                var confirmed = window.confirm(
                    "Restore the original 29 research records?\n\nYour current records will be replaced."
                );

                if (confirmed) {
                    restoreSeedData(true);
                }
            });
        }

        var deleteAllButton = $("#deleteAllData");

        if (deleteAllButton) {
            deleteAllButton.addEventListener("click", confirmDeleteAll);
        }

        $$("[data-theme-choice]").forEach(function (button) {
            button.addEventListener("click", function () {
                var theme = button.getAttribute("data-theme-choice");
                applyTheme(theme);
            });
        });

        var form = $("#researchForm");

        if (form) {
            form.addEventListener("submit", saveResearchForm);
        }
    }

    function setupModalBehaviour() {
        $$(".modal").forEach(function (modal) {
            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    modal.classList.remove("open");
                    modal.setAttribute("aria-hidden", "true");
                }
            });
        });

        $$(".modal-close").forEach(function (button) {
            button.addEventListener("click", function () {
                var modal = button.closest(".modal");

                if (modal) {
                    modal.classList.remove("open");
                    modal.setAttribute("aria-hidden", "true");
                }
            });
        });
    }

    function setupGlobalSearch() {
        var search = $("#globalSearch");

        if (!search) {
            return;
        }

        search.addEventListener("keydown", function (event) {
            if (event.key !== "Enter") {
                return;
            }

            var value = search.value.trim();

            if (!value) {
                navigate("library");
                return;
            }

            navigate("library");
            setValue("#librarySearch", value);
            renderLibrary();
        });
    }

    function setupKeyboardShortcuts() {
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeModal("#researchModal");
                closeModal("#detailModal");
            }

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();

                var search = $("#globalSearch");

                if (search) {
                    search.focus();
                }
            }

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "n"
            ) {
                event.preventDefault();
                openResearchForm(null);
            }
        });
    }

    function setupMobileMenu() {
        var button = $("#mobileMenu");
        var sidebar = $(".sidebar");

        if (!button || !sidebar) {
            return;
        }

        button.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });
    }

    function applyTheme(theme) {
        var selected = theme === "light" ? "light" : "dark";

        document.body.setAttribute("data-theme", selected);
        localStorage.setItem(THEME_KEY, selected);

        $$("[data-theme-choice]").forEach(function (button) {
            button.classList.toggle(
                "active",
                button.getAttribute("data-theme-choice") === selected
            );
        });
    }

    function loadTheme() {
        var saved = localStorage.getItem(THEME_KEY);

        applyTheme(saved === "light" ? "light" : "dark");
    }

    function renderAll() {
        renderStats();
        renderPipeline();
        renderDeadlines();
        renderCharts();
        renderLibrary();
        renderAuthors();
        renderJournals();
        renderPublishers();
        renderCalendar();
        renderAnalytics();
    }

    function initialize() {
        loadRecords();
        loadTheme();
        setupFilterOptions();
        setupNavigation();
        setupButtons();
        setupModalBehaviour();
        setupGlobalSearch();
        setupKeyboardShortcuts();
        setupMobileMenu();
        renderAll();

        var hash = window.location.hash.replace("#", "").trim();

        if (
            hash &&
            $("[data-section-panel='" + hash + "']")
        ) {
            navigate(hash);
        } else {
            navigate("dashboard");
        }

        console.info(
            "Research Tracker initialized with " +
            records.length +
            " research records."
        );
    }

    window.ResearchApp = {
        getRecords: function () {
            return records.slice();
        },

        restoreSeedData: function () {
            restoreSeedData(true);
        },

        render: function () {
            renderAll();
        }
    };

    document.addEventListener("DOMContentLoaded", initialize);
})();