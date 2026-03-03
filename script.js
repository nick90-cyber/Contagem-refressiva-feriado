/**
 * HolidayApp - A simple countdown application for Brazilian holidays.
 * Follows a Class-based modular design pattern.
 */
class HolidayApp {
    constructor(data) {
        this.holidaysData = data;
        this.intervals = {};
        this.currentYear = new Date().getFullYear();
        if (!this.holidaysData[this.currentYear]) this.currentYear = 2024;

        this.container = document.getElementById('holiday-container');
        this.init();
    }

    /**
     * Initialize the application by rendering all holiday lists.
     */
    init() {
        Object.keys(this.holidaysData).forEach(year => {
            const list = document.createElement('div');
            list.id = `list-${year}`;
            list.className = 'holiday-list';

            this.holidaysData[year].forEach((holiday, idx) => {
                const item = document.createElement('div');
                item.className = 'holiday-item';
                item.innerHTML = `
                    <div class="holiday-info">
                        <span class="holiday-name">${holiday.name}</span>
                        <span class="holiday-date">${this.formatDate(holiday.date)}</span>
                    </div>
                    <div class="countdown">
                        <span class="label">Faltam</span>
                        <span class="timer" id="timer-${year}-${idx}">--d --h --m --s</span>
                    </div>
                `;
                list.appendChild(item);
            });

            this.container.appendChild(list);
        });

        // Start with the closest relevant year
        this.changeYear(this.currentYear);
    }

    /**
     * Format a date string into a localized long format.
     */
    formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    /**
     * Switch the visible year and start its countdowns.
     */
    changeYear(year) {
        this.currentYear = year;
        document.querySelectorAll('.holiday-list').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.year-nav button').forEach(b => b.classList.remove('active'));

        const activeList = document.getElementById(`list-${year}`);
        const activeBtn = document.getElementById(`btn-${year}`);

        if (activeList) activeList.classList.add('active');
        if (activeBtn) activeBtn.classList.add('active');

        this.startAll();
    }

    /**
     * Update a single timer element based on the remaining time.
     */
    updateTimer(year, idx) {
        const target = new Date(this.holidaysData[year][idx].date + 'T00:00:00');
        const now = new Date();
        const diff = target - now;
        const el = document.getElementById(`timer-${year}-${idx}`);

        if (!el) return;

        if (diff <= 0) {
            el.textContent = "Hoje é o dia!";
            el.style.color = "#4CAF50";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        el.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }

    /**
     * Start countdowns for all holidays in the current year.
     */
    startAll() {
        this.pauseAll();
        this.holidaysData[this.currentYear].forEach((_, idx) => {
            const key = `${this.currentYear}-${idx}`;
            this.updateTimer(this.currentYear, idx);
            this.intervals[key] = setInterval(() => this.updateTimer(this.currentYear, idx), 1000);
        });
    }

    /**
     * Clear all active intervals.
     */
    pauseAll() {
        Object.values(this.intervals).forEach(clearInterval);
        this.intervals = {};
    }

    /**
     * Reset all timers to their initial state.
     */
    resetAll() {
        this.pauseAll();
        document.querySelectorAll('.timer').forEach(el => el.textContent = '--d --h --m --s');
    }
}

// Holiday Data Definition
const HOLIDAYS_DATA = {
    2024: [
        { name: 'Ano Novo', date: '2024-01-01' },
        { name: 'Carnaval', date: '2024-02-13' },
        { name: 'Sexta-feira Santa', date: '2024-03-29' },
        { name: 'Tiradentes', date: '2024-04-21' },
        { name: 'Dia do Trabalho', date: '2024-05-01' },
        { name: 'Corpus Christi', date: '2024-05-30' },
        { name: 'Independência', date: '2024-09-07' },
        { name: 'Nossa Srª Aparecida', date: '2024-10-12' },
        { name: 'Finados', date: '2024-11-02' },
        { name: 'Proclamação da República', date: '2024-11-15' },
        { name: 'Consciência Negra', date: '2024-11-20' },
        { name: 'Natal', date: '2024-12-25' }
    ],
    2025: [
        { name: 'Ano Novo', date: '2025-01-01' },
        { name: 'Carnaval', date: '2025-03-04' },
        { name: 'Sexta-feira Santa', date: '2025-04-18' },
        { name: 'Tiradentes', date: '2025-04-21' },
        { name: 'Dia do Trabalho', date: '2025-05-01' },
        { name: 'Corpus Christi', date: '2025-06-19' },
        { name: 'Independência', date: '2025-09-07' },
        { name: 'Nossa Srª Aparecida', date: '2025-10-12' },
        { name: 'Finados', date: '2025-11-02' },
        { name: 'Proclamação da República', date: '2025-11-15' },
        { name: 'Consciência Negra', date: '2025-11-20' },
        { name: 'Natal', date: '2025-12-25' }
    ],
    2026: [
        { name: 'Ano Novo', date: '2026-01-01' },
        { name: 'Carnaval', date: '2026-02-17' },
        { name: 'Tiradentes', date: '2026-04-21' },
        { name: 'Dia do Trabalho', date: '2026-05-01' },
        { name: 'Independência', date: '2026-09-07' },
        { name: 'Nossa Srª Aparecida', date: '2026-10-12' },
        { name: 'Natal', date: '2026-12-25' }
    ],
    2027: [
        { name: 'Ano Novo', date: '2027-01-01' },
        { name: 'Carnaval', date: '2027-02-09' },
        { name: 'Tiradentes', date: '2027-04-21' },
        { name: 'Dia do Trabalho', date: '2027-05-01' },
        { name: 'Independência', date: '2027-09-07' },
        { name: 'Nossa Srª Aparecida', date: '2027-10-12' },
        { name: 'Natal', date: '2027-12-25' }
    ]
};

// Application Bootstrap
let app;
window.onload = () => {
    app = new HolidayApp(HOLIDAYS_DATA);
};

// Global helper functions to maintain compatibility with existing HTML onclicks
function changeYear(year) { app.changeYear(year); }
function startAll() { app.startAll(); }
function pauseAll() { app.pauseAll(); }
function resetAll() { app.resetAll(); }
