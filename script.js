/**
 * HolidayService - Handles API communication with BrasilAPI.
 * Follows the Repository design pattern.
 */
class HolidayService {
    constructor() {
        this.baseUrl = 'https://brasilapi.com.br/api/feriados/v1';
    }

    /**
     * Fetch holidays for a specific year.
     * @param {number} year 
     * @returns {Promise<Array>}
     */
    async fetchHolidays(year) {
        try {
            const response = await fetch(`${this.baseUrl}/${year}`);
            if (!response.ok) throw new Error('Falha ao buscar feriados');
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar feriados de ${year}:`, error);
            return null;
        }
    }
}

/**
 * HolidayApp - A countdown application for Brazilian holidays.
 * Refactored to use HolidayService and handle asynchronous data.
 */
class HolidayApp {
    constructor() {
        this.service = new HolidayService();
        this.holidaysCache = {};
        this.intervals = {};
        this.currentYear = new Date().getFullYear();

        this.container = document.getElementById('holiday-container');
        this.searchInput = document.getElementById('search-input');
        this.searchContainer = document.getElementById('search-container');
        this.init();
    }

    /**
     * Initialize the application.
     */
    async init() {
        this.showLoading();
        await this.loadYear(this.currentYear);
        this.renderYearButtons();
    }

    /**
     * Render the year navigation buttons.
     */
    renderYearButtons() {
        const nav = document.querySelector('.year-nav');
        nav.innerHTML = '';
        const years = [2024, 2025, 2026, 2027];

        years.forEach(year => {
            const btn = document.createElement('button');
            btn.id = `btn-${year}`;
            btn.textContent = year;
            btn.onclick = () => this.changeYear(year);
            if (year === this.currentYear) btn.classList.add('active');
            nav.appendChild(btn);
        });
    }

    /**
     * Load and render holidays for a specific year.
     */
    async loadYear(year) {
        if (!this.holidaysCache[year]) {
            this.showLoading();
            const data = await this.service.fetchHolidays(year);
            if (data) {
                this.holidaysCache[year] = data;
            } else {
                this.showError(`Não foi possível carregar os feriados de ${year}.`);
                return;
            }
        }

        this.renderHolidays(year);
        this.currentYear = year;
        this.updateActiveButton(year);
        this.startAll();
    }

    /**
     * Render the holiday items for the given year.
     */
    renderHolidays(year) {
        this.container.innerHTML = '';
        const list = document.createElement('div');
        list.className = 'holiday-list active';

        this.holidaysCache[year].forEach((holiday, idx) => {
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
    }

    /**
     * Format a date string into a localized format.
     */
    formatDate(dateStr) {
        // Handle YYYY-MM-DD
        const [year, month, day] = dateStr.split('-');
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    /**
     * Switch the visible year.
     */
    /**
     * Switch the visible year.
     */
    async changeYear(year) {
        if (this.currentYear === year && this.holidaysCache[year]) return;
        this.clearSearch();
        await this.loadYear(year);
    }

    /**
     * Toggle search bar visibility.
     */
    toggleSearch() {
        this.searchContainer.classList.toggle('active');
        if (this.searchContainer.classList.contains('active')) {
            this.searchInput.focus();
        } else {
            this.clearSearch();
        }
    }

    /**
     * Clear search input and filter.
     */
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.filterHolidays('');
        }
    }

    /**
     * Filter holidays based on search query.
     */
    filterHolidays(query) {
        const queryNorm = query.toLowerCase().trim();
        const items = document.querySelectorAll('.holiday-item');

        items.forEach((item, idx) => {
            const holidayName = this.holidaysCache[this.currentYear][idx].name.toLowerCase();
            if (holidayName.includes(queryNorm)) {
                item.style.display = 'flex';
                item.style.animation = 'fadeIn 0.3s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });

        // Show message if no results found
        let noResults = document.querySelector('.no-results-msg');
        const visibleItems = Array.from(items).filter(i => i.style.display !== 'none');

        if (visibleItems.length === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'status-msg no-results-msg';
                noResults.textContent = `Nenhum feriado encontrado para "${query}"`;
                this.container.appendChild(noResults);
            } else {
                noResults.textContent = `Nenhum feriado encontrado para "${query}"`;
            }
        } else if (noResults) {
            noResults.remove();
        }
    }

    /**
     * Update navigation button styles.
     */
    updateActiveButton(year) {
        document.querySelectorAll('.year-nav button').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`btn-${year}`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    /**
     * Update a single timer element.
     */
    updateTimer(year, idx) {
        const holiday = this.holidaysCache[year][idx];
        const [y, m, d] = holiday.date.split('-');
        const target = new Date(y, m - 1, d);
        const now = new Date();

        // Reset time for date comparison
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const holidayDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());

        const diff = target - now;
        const el = document.getElementById(`timer-${year}-${idx}`);

        if (!el) return;

        if (holidayDate.getTime() === today.getTime()) {
            el.textContent = "É hoje! 🎉";
            el.style.color = "#4CAF50";
            return;
        }

        if (diff < 0) {
            el.textContent = "Já passou";
            el.style.color = "rgba(255, 255, 255, 0.4)";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        el.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
        el.style.color = "var(--accent)";
    }


    /**
     * Start countdowns for the current year.
     */
    startAll() {
        this.pauseAll();
        if (!this.holidaysCache[this.currentYear]) return;

        this.holidaysCache[this.currentYear].forEach((_, idx) => {
            const key = `${this.currentYear}-${idx}`;
            this.updateTimer(this.currentYear, idx);
            this.intervals[key] = setInterval(() => this.updateTimer(this.currentYear, idx), 1000);
        });
    }

    /**
     * Clear all intervals.
     */
    pauseAll() {
        Object.values(this.intervals).forEach(clearInterval);
        this.intervals = {};
    }

    /**
     * Reset timers UI.
     */
    resetAll() {
        this.pauseAll();
        document.querySelectorAll('.timer').forEach(el => el.textContent = '--d --h --m --s');
    }

    showLoading() {
        this.container.innerHTML = '<div class="status-msg">Carregando feriados...</div>';
    }

    showError(msg) {
        this.container.innerHTML = `<div class="status-msg error">${msg}</div>`;
    }

    showStatus(msg) {
        this.container.innerHTML = `<div class="status-msg">${msg}</div>`;
    }
}

// Application Bootstrap
let app;
window.onload = () => {
    app = new HolidayApp();
};

// Global helper functions
function changeYear(year) { app.changeYear(year); }
function startAll() { app.startAll(); }
function pauseAll() { app.pauseAll(); }
function resetAll() { app.resetAll(); }

