/* ═══════════════════════════════════════════════
   CURRENCY - Multi-currency support with auto-switching
   ═══════════════════════════════════════════════ */

const CurrencyManager = (() => {
    const rates = {
        INR: 1,
        USD: 0.012,
        AED: 0.044,
        GBP: 0.0095,
        CAD: 0.016
    };

    const symbols = {
        INR: '₹',
        USD: '$',
        AED: 'د.إ',
        GBP: '£',
        CAD: 'CA$'
    };

    const formatters = {
        INR: { locale: 'en-IN', minimumFractionDigits: 0, maximumFractionDigits: 0 },
        USD: { locale: 'en-US', minimumFractionDigits: 2, maximumFractionDigits: 2 },
        AED: { locale: 'en-AE', minimumFractionDigits: 0, maximumFractionDigits: 0 },
        GBP: { locale: 'en-GB', minimumFractionDigits: 2, maximumFractionDigits: 2 },
        CAD: { locale: 'en-CA', minimumFractionDigits: 2, maximumFractionDigits: 2 }
    };

    let currentCurrency = 'INR';
    let listeners = [];

    function detectCurrency() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz && tz.startsWith('Asia/Kolkata')) return 'INR';
            if (tz && tz.startsWith('Asia/Dubai')) return 'AED';
            if (tz && tz.startsWith('America/')) return 'USD';
            if (tz && tz.startsWith('Europe/London')) return 'GBP';
            if (tz && tz.includes('Toronto') || tz && tz.includes('Vancouver')) return 'CAD';
        } catch(e) {}
        return 'INR';
    }

    function convert(amountINR, toCurrency) {
        toCurrency = toCurrency || currentCurrency;
        return amountINR * rates[toCurrency];
    }

    function format(amountINR, currency) {
        currency = currency || currentCurrency;
        const converted = convert(amountINR, currency);
        const fmt = formatters[currency];
        
        try {
            return new Intl.NumberFormat(fmt.locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: fmt.minimumFractionDigits,
                maximumFractionDigits: fmt.maximumFractionDigits
            }).format(converted);
        } catch(e) {
            return `${symbols[currency]}${converted.toFixed(fmt.maximumFractionDigits)}`;
        }
    }

    function setCurrency(currency) {
        if (rates[currency]) {
            currentCurrency = currency;
            localStorage.setItem('sovera_currency', currency);
            updateAllPrices();
            listeners.forEach(fn => fn(currency));
        }
    }

    function getCurrency() {
        return currentCurrency;
    }

    function getSymbol(currency) {
        return symbols[currency || currentCurrency];
    }

    function updateAllPrices() {
        document.querySelectorAll('[data-base-price]').forEach(el => {
            const basePrice = parseFloat(el.dataset.basePrice);
            el.textContent = format(basePrice);
        });
    }

    function onChange(fn) {
        listeners.push(fn);
    }

    function init() {
        const saved = localStorage.getItem('sovera_currency');
        if (saved && rates[saved]) {
            currentCurrency = saved;
        } else {
            currentCurrency = detectCurrency();
        }

        const select = document.getElementById('currency-select');
        if (select) {
            select.value = currentCurrency;
            select.addEventListener('change', (e) => {
                setCurrency(e.target.value);
            });
        }

        updateAllPrices();
    }

    return { init, convert, format, setCurrency, getCurrency, getSymbol, updateAllPrices, onChange };
})();

window.CurrencyManager = CurrencyManager;
