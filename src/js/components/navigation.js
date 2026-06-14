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
                    alert('Please add items to your collection first.');
                    return;
                }
                // Simulate successful order
                showOrderConfirmation();
            });
        }
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
