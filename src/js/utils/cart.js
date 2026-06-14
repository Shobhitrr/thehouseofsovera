/* ═══════════════════════════════════════════════
   CART - Shopping cart management
   ═══════════════════════════════════════════════ */

const CartManager = (() => {
    let items = [];
    let listeners = [];

    function load() {
        try {
            const saved = localStorage.getItem('sovera_cart');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate loaded data structure
                if (Array.isArray(parsed)) {
                    items = parsed.filter(item => 
                        item && typeof item.name === 'string' && 
                        typeof item.price === 'number' && item.price >= 0 &&
                        typeof item.quantity === 'number' && item.quantity > 0 &&
                        typeof item.id === 'number'
                    ).map(item => ({
                        name: String(item.name).substring(0, 100),
                        price: Math.abs(item.price),
                        quantity: Math.min(99, Math.max(1, item.quantity)),
                        id: item.id
                    }));
                }
            }
        } catch(e) {
            items = [];
            localStorage.removeItem('sovera_cart');
        }
    }

    function save() {
        localStorage.setItem('sovera_cart', JSON.stringify(items));
    }

    function addItem(name, price, quantity = 1) {
        // Sanitize input to prevent XSS
        const safeName = String(name).replace(/[<>"'&]/g, (c) => ({
            '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;'
        }[c]));
        const safePrice = Math.abs(parseFloat(price)) || 0;
        const safeQty = Math.max(1, Math.min(99, parseInt(quantity) || 1));

        const existing = items.find(item => item.name === safeName);
        if (existing) {
            existing.quantity = Math.min(99, existing.quantity + safeQty);
        } else {
            items.push({ name: safeName, price: safePrice, quantity: safeQty, id: Date.now() });
        }
        save();
        notify();
        showNotification(`${safeName} added to your collection`);
    }

    function removeItem(id) {
        items = items.filter(item => item.id !== id);
        save();
        notify();
    }

    function getItems() {
        return [...items];
    }

    function getCount() {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }

    function getTotal() {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function clear() {
        items = [];
        save();
        notify();
    }

    function notify() {
        updateCartUI();
        listeners.forEach(fn => fn(items));
    }

    function onChange(fn) {
        listeners.push(fn);
    }

    function updateCartUI() {
        const countEl = document.getElementById('cart-count');
        const count = getCount();
        
        if (countEl) {
            countEl.textContent = count;
            countEl.classList.toggle('visible', count > 0);
        }

        const cartItemsEl = document.getElementById('cart-items');
        const cartFooterEl = document.getElementById('cart-footer');
        const cartTotalEl = document.getElementById('cart-total-amount');

        if (cartItemsEl) {
            if (items.length === 0) {
                cartItemsEl.innerHTML = `
                    <div class="cart-empty">
                        <p>Your collection awaits</p>
                        <a href="#collections" class="btn btn-primary" onclick="document.getElementById('cart-drawer').classList.remove('open'); document.body.classList.remove('no-scroll');">Explore Collections</a>
                    </div>
                `;
                if (cartFooterEl) cartFooterEl.style.display = 'none';
            } else {
                cartItemsEl.innerHTML = items.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-visual">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/></svg>
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${CurrencyManager.format(item.price)} × ${item.quantity}</div>
                            <span class="cart-item-remove" onclick="CartManager.removeItem(${item.id})">Remove</span>
                        </div>
                    </div>
                `).join('');
                if (cartFooterEl) cartFooterEl.style.display = 'block';
            }
        }

        if (cartTotalEl) {
            cartTotalEl.textContent = CurrencyManager.format(getTotal());
        }

        // Update checkout summary
        updateCheckoutSummary();
    }

    function updateCheckoutSummary() {
        const checkoutItemsEl = document.getElementById('checkout-items');
        const checkoutSubtotal = document.getElementById('checkout-subtotal');
        const checkoutTotal = document.getElementById('checkout-total');

        if (checkoutItemsEl) {
            checkoutItemsEl.innerHTML = items.map(item => `
                <div class="checkout-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${CurrencyManager.format(item.price * item.quantity)}</span>
                </div>
            `).join('');
        }

        if (checkoutSubtotal) {
            checkoutSubtotal.textContent = CurrencyManager.format(getTotal());
        }

        if (checkoutTotal) {
            checkoutTotal.textContent = CurrencyManager.format(getTotal());
        }
    }

    function showNotification(message) {
        // Create floating notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #2C2825;
            color: #FDFBF7;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 0.85rem;
            z-index: 10000;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 8px 30px rgba(44, 40, 37, 0.2);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(10px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function init() {
        load();
        updateCartUI();
        
        // Listen for currency changes
        CurrencyManager.onChange(() => {
            updateCartUI();
        });
    }

    return { init, addItem, removeItem, getItems, getCount, getTotal, clear, onChange, updateCartUI };
})();

window.CartManager = CartManager;
