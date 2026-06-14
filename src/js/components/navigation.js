/* ═══════════════════════════════════════════════
   NAVIGATION - Menu, search, cart drawer controls
   ═══════════════════════════════════════════════ */

const Navigation = (() => {
    function init() {
        initMobileMenu();
        initSearch();
        initCartDrawer();
        initCheckout();
    }

    function initMobileMenu() {
        const toggle = document.getElementById('menu-toggle');
        const menu = document.getElementById('mobile-menu');
        const close = document.getElementById('menu-close');
        const links = menu ? menu.querySelectorAll('.mobile-menu-link') : [];

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.add('open');
                document.body.classList.add('no-scroll');
            });
        }

        if (close && menu) {
            close.addEventListener('click', () => {
                menu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        }

        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    function initSearch() {
        const toggle = document.getElementById('search-toggle');
        const overlay = document.getElementById('search-overlay');
        const close = document.getElementById('search-close');
        const input = document.getElementById('search-input');

        if (toggle && overlay) {
            toggle.addEventListener('click', () => {
                overlay.classList.add('open');
                document.body.classList.add('no-scroll');
                setTimeout(() => input && input.focus(), 400);
            });
        }

        if (close && overlay) {
            close.addEventListener('click', () => {
                overlay.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (overlay && overlay.classList.contains('open')) {
                    overlay.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    }

    function initCartDrawer() {
        const toggle = document.getElementById('cart-toggle');
        const drawer = document.getElementById('cart-drawer');
        const close = document.getElementById('cart-close');

        if (toggle && drawer) {
            toggle.addEventListener('click', () => {
                drawer.classList.add('open');
                document.body.classList.add('no-scroll');
            });
        }

        if (close && drawer) {
            close.addEventListener('click', () => {
                drawer.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        }

        // Close cart on backdrop click
        drawer && drawer.addEventListener('click', (e) => {
            if (e.target === drawer) {
                drawer.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    function initCheckout() {
        const checkoutOverlay = document.getElementById('checkout-overlay');
        const cartDrawer = document.getElementById('cart-drawer');
        const checkoutBack = document.getElementById('checkout-back');

        // Checkout link in cart
        const checkoutLink = document.querySelector('a[href="#checkout"]');
        if (checkoutLink) {
            checkoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (cartDrawer) {
                    cartDrawer.classList.remove('open');
                }
                if (checkoutOverlay) {
                    checkoutOverlay.classList.add('open');
                }
                CartManager.updateCartUI();
            });
        }

        if (checkoutBack && checkoutOverlay) {
            checkoutBack.addEventListener('click', () => {
                checkoutOverlay.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        }

        // Checkout submit
        const submitBtn = document.querySelector('.checkout-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (CartManager.getCount() === 0) {
                    showValidationError('Please add items to your collection first.');
                    return;
                }
                
                // Validate required fields
                const errors = validateCheckoutForm();
                if (errors.length > 0) {
                    showValidationError(errors[0]);
                    return;
                }
                
                // Simulate successful order
                showOrderConfirmation();
            });
        }
    }

    function validateCheckoutForm() {
        const errors = [];
        const overlay = document.getElementById('checkout-overlay');
        if (!overlay) return errors;

        const email = overlay.querySelector('input[type="email"]');
        const phone = overlay.querySelector('input[type="tel"]');
        const textInputs = overlay.querySelectorAll('.checkout-section:nth-child(2) .checkout-input');
        
        // Email validation
        if (!email || !email.value.trim()) {
            errors.push('Please enter your email address.');
            email && email.focus();
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            errors.push('Please enter a valid email address.');
            email.focus();
        }

        // Phone validation
        if (!phone || !phone.value.trim()) {
            errors.push('Please enter your phone number.');
        } else if (!/^[\d\s\-+()]{8,15}$/.test(phone.value.trim())) {
            errors.push('Please enter a valid phone number.');
        }

        // Address fields (first name, last name, address, city, state, pin)
        if (textInputs.length > 0) {
            const fieldNames = ['First name', 'Last name', 'Address', 'City', 'State', 'PIN Code'];
            textInputs.forEach((input, i) => {
                if (input.tagName === 'INPUT' && !input.value.trim()) {
                    errors.push(`Please enter your ${fieldNames[i] || 'shipping details'}.`);
                }
            });
        }

        return errors;
    }

    function showValidationError(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 24px; right: 24px;
            background: #C45B5B; color: #fff;
            padding: 16px 24px; border-radius: 8px;
            font-size: 0.85rem; z-index: 10000;
            opacity: 0; transform: translateY(-10px);
            transition: all 0.3s ease;
            box-shadow: 0 8px 30px rgba(196, 91, 91, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 320px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    function showOrderConfirmation() {
        const overlay = document.getElementById('checkout-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div class="checkout-inner" style="text-align:center; padding-top: 15vh;">
                    <div style="margin-bottom: 2rem;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#5A8A6A" stroke-width="1.5" style="margin:0 auto;">
                            <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
                        </svg>
                    </div>
                    <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2.5rem; margin-bottom: 1rem;">Thank You</h2>
                    <p style="color: #6B6560; font-size: 1.1rem; margin-bottom: 0.5rem;">Your order has been placed successfully.</p>
                    <p style="color: #9B9590; font-size: 0.9rem; margin-bottom: 2rem;">A confirmation email will arrive shortly.</p>
                    <p style="font-style: italic; color: #C9A96E; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.2rem; margin-bottom: 2rem;">"Some moments deserve more than a photograph."</p>
                    <button class="btn btn-primary" onclick="location.reload()">Continue Exploring</button>
                </div>
            `;
            CartManager.clear();
        }
    }

    return { init };
})();

window.Navigation = Navigation;
