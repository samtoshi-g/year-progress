// Year Progress - Real-time time visualization
(function() {
    'use strict';

    // Elements
    const yearValue = document.getElementById('year-value');
    const yearFill = document.getElementById('year-fill');
    const yearDetail = document.getElementById('year-detail');

    const monthValue = document.getElementById('month-value');
    const monthFill = document.getElementById('month-fill');
    const monthDetail = document.getElementById('month-detail');

    const weekValue = document.getElementById('week-value');
    const weekFill = document.getElementById('week-fill');
    const weekDetail = document.getElementById('week-detail');

    const dayValue = document.getElementById('day-value');
    const dayFill = document.getElementById('day-fill');
    const dayDetail = document.getElementById('day-detail');

    const lifeCard = document.getElementById('life-card');
    const lifeValue = document.getElementById('life-value');
    const lifeFill = document.getElementById('life-fill');
    const lifeDetail = document.getElementById('life-detail');

    const birthYearInput = document.getElementById('birth-year');
    const calculateBtn = document.getElementById('calculate-life');
    const currentTimeEl = document.getElementById('current-time');

    // Helpers
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getDaysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function formatPercent(value) {
        return value.toFixed(2) + '%';
    }

    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    function getWeekOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = date - start;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.ceil(diff / oneWeek);
    }

    function formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Calculate all progress values
    function calculateProgress() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const date = now.getDate();
        const day = now.getDay();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Year progress
        const dayOfYear = getDayOfYear(now);
        const daysInYear = getDaysInYear(year);
        const yearProgress = (dayOfYear / daysInYear) * 100;
        const daysLeftYear = daysInYear - dayOfYear;

        yearValue.textContent = formatPercent(yearProgress);
        yearFill.style.width = yearProgress + '%';
        yearDetail.textContent = `Day ${dayOfYear} of ${daysInYear} • ${daysLeftYear} days remaining`;

        // Month progress
        const daysInMonth = getDaysInMonth(year, month);
        const monthProgress = ((date - 1 + (hours + minutes / 60) / 24) / daysInMonth) * 100;
        const daysLeftMonth = daysInMonth - date;
        const monthName = now.toLocaleDateString('en-US', { month: 'long' });

        monthValue.textContent = formatPercent(monthProgress);
        monthFill.style.width = monthProgress + '%';
        monthDetail.textContent = `${monthName} ${date} of ${daysInMonth} • ${daysLeftMonth} days remaining`;

        // Week progress (Monday = start)
        const adjustedDay = day === 0 ? 6 : day - 1; // Monday = 0
        const weekProgress = ((adjustedDay + (hours + minutes / 60) / 24) / 7) * 100;
        const daysLeftWeek = 7 - adjustedDay - 1;
        const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

        weekValue.textContent = formatPercent(weekProgress);
        weekFill.style.width = weekProgress + '%';
        weekDetail.textContent = `${dayName} • Week ${getWeekOfYear(now)} of ${year}`;

        // Day progress
        const totalMinutes = hours * 60 + minutes + seconds / 60;
        const dayProgress = (totalMinutes / (24 * 60)) * 100;
        const hoursLeft = Math.floor((24 * 60 - totalMinutes) / 60);
        const minutesLeft = Math.floor((24 * 60 - totalMinutes) % 60);

        dayValue.textContent = formatPercent(dayProgress);
        dayFill.style.width = dayProgress + '%';
        dayDetail.textContent = `${hoursLeft}h ${minutesLeft}m remaining today`;

        // Current time
        currentTimeEl.textContent = formatTime(now);

        return now;
    }

    // Calculate life progress
    function calculateLife(birthYear) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const age = currentYear - birthYear;
        const lifeExpectancy = 80;
        
        // More precise calculation
        const birthDate = new Date(birthYear, 0, 1);
        const endDate = new Date(birthYear + lifeExpectancy, 0, 1);
        const totalLife = endDate - birthDate;
        const livedLife = now - birthDate;
        
        const lifeProgress = Math.min((livedLife / totalLife) * 100, 100);
        const yearsLeft = Math.max(lifeExpectancy - age, 0);
        const weeksLeft = Math.floor(yearsLeft * 52);

        lifeValue.textContent = formatPercent(lifeProgress);
        lifeFill.style.width = lifeProgress + '%';
        lifeDetail.textContent = `Age ${age} • ~${yearsLeft} years remaining (${weeksLeft.toLocaleString()} weeks)`;

        lifeCard.style.display = 'block';
        lifeCard.style.animation = 'fadeInUp 0.5s ease-out';

        // Save to localStorage
        localStorage.setItem('birthYear', birthYear);
    }

    // Event listeners
    calculateBtn.addEventListener('click', () => {
        const birthYear = parseInt(birthYearInput.value);
        if (birthYear && birthYear >= 1900 && birthYear <= new Date().getFullYear()) {
            calculateLife(birthYear);
        }
    });

    birthYearInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });

    // Load saved birth year
    const savedBirthYear = localStorage.getItem('birthYear');
    if (savedBirthYear) {
        birthYearInput.value = savedBirthYear;
        calculateLife(parseInt(savedBirthYear));
    }

    // Initial calculation
    calculateProgress();

    // Update every second
    setInterval(calculateProgress, 1000);

    // Console easter egg
    console.log('%c⏳ Year Progress', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cTime is your most valuable asset. Spend it wisely.', 'font-size: 14px; color: #8b8b9e;');
})();
