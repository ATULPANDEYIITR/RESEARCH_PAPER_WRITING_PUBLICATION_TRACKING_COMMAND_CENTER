(function () {
    "use strict";

    const U = window.ResearchUtils;

    let currentDate = new Date();

    function getResearch() {
        return window.ResearchManager
            ? window.ResearchManager.getAll()
            : [];
    }

    function getYear() {
        return currentDate.getFullYear();
    }

    function getMonth() {
        return currentDate.getMonth();
    }

    function getMonthName(date = currentDate) {
        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
    }

    function getMonthStart(year, month) {
        return new Date(year, month, 1);
    }

    function getMonthEnd(year, month) {
        return new Date(year, month + 1, 0);
    }

    function getEventsForDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        return getResearch().filter(item => {
            const dates = [];

            if (item.date) {
                dates.push({
                    value: item.date,
                    type: "research"
                });
            }

            if (item.deadline) {
                dates.push({
                    value: item.deadline,
                    type: "deadline"
                });
            }

            return dates.some(entry => {
                const eventDate = new Date(entry.value);

                return (
                    !Number.isNaN(
                        eventDate.getTime()
                    ) &&
                    eventDate.getFullYear() === year &&
                    eventDate.getMonth() === month &&
                    eventDate.getDate() === day
                );
            });
        });
    }

    function getEventsDetailedForDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const events = [];

        getResearch().forEach(item => {
            if (item.date) {
                const researchDate =
                    new Date(item.date);

                if (
                    !Number.isNaN(
                        researchDate.getTime()
                    ) &&
                    researchDate.getFullYear() === year &&
                    researchDate.getMonth() === month &&
                    researchDate.getDate() === day
                ) {
                    events.push({
                        id: item.id,
                        title:
                            item.title ||
                            "Untitled Research",
                        type: "research",
                        date: item.date,
                        status: item.status,
                        item
                    });
                }
            }

            if (item.deadline) {
                const deadlineDate =
                    new Date(item.deadline);

                if (
                    !Number.isNaN(
                        deadlineDate.getTime()
                    ) &&
                    deadlineDate.getFullYear() === year &&
                    deadlineDate.getMonth() === month &&
                    deadlineDate.getDate() === day
                ) {
                    events.push({
                        id: item.id,
                        title:
                            item.title ||
                            "Untitled Research",
                        type: "deadline",
                        date: item.deadline,
                        status: item.status,
                        item
                    });
                }
            }
        });

        return events;
    }

    function isToday(date) {
        const today = new Date();

        return (
            date.getFullYear() ===
                today.getFullYear() &&
            date.getMonth() ===
                today.getMonth() &&
            date.getDate() ===
                today.getDate()
        );
    }

    function createDayElement(
        date,
        isCurrentMonth
    ) {
        const dayElement =
            document.createElement("div");

        dayElement.className =
            "calendar-day";

        if (!isCurrentMonth) {
            dayElement.classList.add(
                "other-month"
            );
        }

        if (isToday(date)) {
            dayElement.classList.add(
                "today"
            );
        }

        const numberElement =
            document.createElement("div");

        numberElement.className =
            "calendar-day-number";

        numberElement.textContent =
            date.getDate();

        dayElement.appendChild(
            numberElement
        );

        const events =
            getEventsDetailedForDate(
                date
            );

        if (events.length > 0) {
            const eventsContainer =
                document.createElement("div");

            eventsContainer.className =
                "calendar-events";

            events
                .slice(0, 3)
                .forEach(event => {
                    const eventElement =
                        document.createElement(
                            "div"
                        );

                    eventElement.className =
                        "calendar-event";

                    if (
                        event.type ===
                        "deadline"
                    ) {
                        eventElement.classList.add(
                            "deadline"
                        );
                    }

                    eventElement.title =
                        `${event.type === "deadline" ? "Deadline" : "Research"}: ${event.title}`;

                    eventElement.textContent =
                        event.title;

                    eventElement.addEventListener(
                        "click",
                        eventObject => {
                            eventObject.stopPropagation();

                            if (
                                window.ResearchApp &&
                                typeof window.ResearchApp
                                    .openResearchModal ===
                                    "function"
                            ) {
                                window.ResearchApp.openResearchModal(
                                    event.id
                                );
                            }
                        }
                    );

                    eventsContainer.appendChild(
                        eventElement
                    );
                });

            if (events.length > 3) {
                const moreElement =
                    document.createElement(
                        "div"
                    );

                moreElement.className =
                    "calendar-more";

                moreElement.textContent =
                    `+${events.length - 3} more`;

                eventsContainer.appendChild(
                    moreElement
                );
            }

            dayElement.appendChild(
                eventsContainer
            );
        }

        dayElement.addEventListener(
            "click",
            () => {
                showDayEvents(date);
            }
        );

        return dayElement;
    }

    function render() {
        const monthLabel =
            document.getElementById(
                "calendarMonth"
            );

        const calendarGrid =
            document.getElementById(
                "calendarGrid"
            );

        if (!calendarGrid) {
            return;
        }

        if (monthLabel) {
            monthLabel.textContent =
                getMonthName();
        }

        calendarGrid.innerHTML = "";

        const year = getYear();
        const month = getMonth();

        const firstDay =
            getMonthStart(
                year,
                month
            );

        const lastDay =
            getMonthEnd(
                year,
                month
            );

        const startOffset =
            firstDay.getDay();

        const totalDays =
            lastDay.getDate();

        const previousMonthLastDay =
            new Date(
                year,
                month,
                0
            ).getDate();

        for (
            let i = startOffset - 1;
            i >= 0;
            i--
        ) {
            const date =
                new Date(
                    year,
                    month - 1,
                    previousMonthLastDay - i
                );

            calendarGrid.appendChild(
                createDayElement(
                    date,
                    false
                )
            );
        }

        for (
            let day = 1;
            day <= totalDays;
            day++
        ) {
            const date =
                new Date(
                    year,
                    month,
                    day
                );

            calendarGrid.appendChild(
                createDayElement(
                    date,
                    true
                )
            );
        }

        const remaining =
            42 -
            calendarGrid.children.length;

        for (
            let day = 1;
            day <= remaining;
            day++
        ) {
            const date =
                new Date(
                    year,
                    month + 1,
                    day
                );

            calendarGrid.appendChild(
                createDayElement(
                    date,
                    false
                )
            );
        }

        renderUpcomingEvents();
    }

    function renderUpcomingEvents() {
        const container =
            document.getElementById(
                "calendarEvents"
            );

        if (!container) {
            return;
        }

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const events = [];

        getResearch().forEach(item => {
            if (item.deadline) {
                const deadline =
                    new Date(
                        item.deadline
                    );

                if (
                    !Number.isNaN(
                        deadline.getTime()
                    )
                ) {
                    deadline.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    events.push({
                        id: item.id,
                        title:
                            item.title ||
                            "Untitled Research",
                        date: deadline,
                        type: "deadline",
                        status: item.status
                    });
                }
            }

            if (item.date) {
                const researchDate =
                    new Date(
                        item.date
                    );

                if (
                    !Number.isNaN(
                        researchDate.getTime()
                    )
                ) {
                    researchDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    if (
                        researchDate >= today
                    ) {
                        events.push({
                            id: item.id,
                            title:
                                item.title ||
                                "Untitled Research",
                            date: researchDate,
                            type: "research",
                            status: item.status
                        });
                    }
                }
            }
        });

        events.sort(
            (a, b) =>
                a.date - b.date
        );

        const upcoming =
            events
                .filter(
                    event =>
                        event.date >=
                        today
                )
                .slice(0, 8);

        if (upcoming.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-title">
                        No upcoming events
                    </div>
                    <div class="empty-state-text">
                        Research dates and deadlines will appear here.
                    </div>
                </div>
            `;

            return;
        }

        container.innerHTML =
            upcoming
                .map(event => {
                    const days =
                        U.daysUntil(
                            event.date
                        );

                    const relative =
                        days === 0
                            ? "Today"
                            : days === 1
                              ? "Tomorrow"
                              : `${days} days`;

                    return `
                        <div class="calendar-event-item"
                             data-calendar-research="${U.escapeHtml(
                                 event.id
                             )}">
                            <div class="calendar-event-info">
                                <div class="calendar-event-title">
                                    ${U.escapeHtml(
                                        event.title
                                    )}
                                </div>
                                <div class="calendar-event-meta">
                                    ${event.type === "deadline" ? "Deadline" : "Research date"}
                                    ·
                                    ${U.escapeHtml(
                                        U.formatDate(
                                            event.date
                                        )
                                    )}
                                </div>
                            </div>
                            <div class="calendar-event-relative">
                                ${U.escapeHtml(
                                    relative
                                )}
                            </div>
                        </div>
                    `;
                })
                .join("");

        container
            .querySelectorAll(
                "[data-calendar-research]"
            )
            .forEach(element => {
                element.addEventListener(
                    "click",
                    () => {
                        const id =
                            element.getAttribute(
                                "data-calendar-research"
                            );

                        if (
                            window.ResearchApp &&
                            typeof window.ResearchApp
                                .openResearchModal ===
                                "function"
                        ) {
                            window.ResearchApp.openResearchModal(
                                id
                            );
                        }
                    }
                );
            });
    }

    function showDayEvents(date) {
        const events =
            getEventsDetailedForDate(
                date
            );

        if (
            events.length === 0
        ) {
            return;
        }

        const title =
            U.formatDate(date);

        if (
            window.ResearchApp &&
            typeof window.ResearchApp
                .showToast ===
                "function"
        ) {
            window.ResearchApp.showToast(
                `${events.length} event${events.length === 1 ? "" : "s"} on ${title}.`,
                "info"
            );
        }
    }

    function previousMonth() {
        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        render();
    }

    function nextMonth() {
        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        render();
    }

    function goToToday() {
        currentDate =
            new Date();

        render();
    }

    function setMonth(
        year,
        month
    ) {
        currentDate =
            new Date(
                year,
                month,
                1
            );

        render();
    }

    function getCurrentDate() {
        return new Date(
            currentDate
        );
    }

    function initialize() {
        const previous =
            document.getElementById(
                "previousMonth"
            );

        const next =
            document.getElementById(
                "nextMonth"
            );

        if (previous) {
            previous.addEventListener(
                "click",
                previousMonth
            );
        }

        if (next) {
            next.addEventListener(
                "click",
                nextMonth
            );
        }

        render();
    }

    window.CalendarManager = {
        initialize,
        render,
        previousMonth,
        nextMonth,
        goToToday,
        setMonth,
        getCurrentDate,
        getEventsForDate,
        getEventsDetailedForDate,
        renderUpcomingEvents
    };
})();