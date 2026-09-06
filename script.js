/* =====================================================
   R&M FAMILY WEAR
   MAIN WEBSITE JAVASCRIPT
===================================================== */


/* =====================================================
   PAGE LOADER
===================================================== */

const loader = document.getElementById("loader");

if (loader) {

    window.addEventListener("load", () => {

        setTimeout(() => {
            loader.classList.add("hide");
        }, 1400);

    });

}


/* =====================================================
   NAVBAR
===================================================== */

const navbar = document.querySelector(".navbar");

if (navbar) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    });

}


/* =====================================================
   MOBILE MENU
===================================================== */

const menuButton =
    document.getElementById("menuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const mobileClose =
    document.getElementById("mobileClose");


if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        mobileMenu.classList.add("open");
        document.body.classList.add("no-scroll");

    });

}


if (mobileClose && mobileMenu) {

    mobileClose.addEventListener("click", () => {

        mobileMenu.classList.remove("open");
        document.body.classList.remove("no-scroll");

    });

}


if (mobileMenu) {

    const mobileLinks =
        mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("open");
            document.body.classList.remove("no-scroll");

        });

    });

}


/* =====================================================
   SEARCH
===================================================== */

const searchButton =
    document.getElementById("searchButton");

const searchOverlay =
    document.getElementById("searchOverlay");

const searchClose =
    document.getElementById("searchClose");

const searchInput =
    document.getElementById("searchInput");


if (searchButton && searchOverlay) {

    searchButton.addEventListener("click", () => {

        searchOverlay.classList.add("open");

        document.body.classList.add("no-scroll");

        if (searchInput) {

            setTimeout(() => {
                searchInput.focus();
            }, 400);

        }

    });

}


if (searchClose && searchOverlay) {

    searchClose.addEventListener("click", () => {

        searchOverlay.classList.remove("open");

        document.body.classList.remove("no-scroll");

    });

}


/* =====================================================
   SEARCH SUGGESTIONS
===================================================== */

const searchSuggestions =
    document.querySelectorAll(
        ".search-suggestions button"
    );


searchSuggestions.forEach(button => {

    button.addEventListener("click", () => {

        if (searchInput) {

            searchInput.value =
                button.textContent.trim();

            searchInput.focus();

        }

    });

});


/* =====================================================
   CART
===================================================== */

const cartButton =
    document.querySelector(".cart-button");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartClose =
    document.getElementById("cartClose");

const cartCount =
    document.querySelector(".cart-count");

const cartEmpty =
    document.querySelector(".cart-empty");

const cartItemsContainer =
    document.querySelector(".cart-items");

const cartSubtotal =
    document.querySelector(".cart-footer strong");

const checkoutButton =
    document.querySelector(".checkout-button");


/* =====================================================
   LOAD CART FROM STORAGE
===================================================== */

let cartItems = [];


try {

    const savedCart =
        localStorage.getItem("rmCartItems");

    if (savedCart) {

        const parsedCart =
            JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {

            cartItems = parsedCart;

        }

    }

} catch (error) {

    console.warn(
        "R&M cart could not be loaded."
    );

    cartItems = [];

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    try {

        localStorage.setItem(
            "rmCartItems",
            JSON.stringify(cartItems)
        );

    } catch (error) {

        console.warn(
            "R&M cart could not be saved."
        );

    }

}


/* =====================================================
   PRICE HELPER
===================================================== */

function getPriceNumber(price) {

    if (!price) return 0;

    return Number(
        String(price).replace(/[^\d]/g, "")
    ) || 0;

}


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(amount) {

    return `₹${amount.toLocaleString("en-IN")}`;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   GET CART SUBTOTAL
===================================================== */

function getCartSubtotal() {

    return cartItems.reduce(
        (total, item) => {

            return total +
                getPriceNumber(item.price);

        },
        0
    );

}


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {


    /* CART COUNT */

    if (cartCount) {

        cartCount.textContent =
            cartItems.length;

    }


    /* CART ITEMS */

    if (cartItemsContainer) {

        if (cartItems.length === 0) {

            cartItemsContainer.innerHTML = "";

        } else {

            cartItemsContainer.innerHTML =
                cartItems.map((item, index) => {

                    return `
                        <div class="cart-item">

                            <div class="cart-item-details">

                                <h4>
                                    ${escapeHtml(item.name)}
                                </h4>

                                <p>
                                    ${escapeHtml(item.price)}
                                </p>

                            </div>

                            <button
                                class="remove-cart-item"
                                data-index="${index}"
                                aria-label="Remove ${escapeHtml(item.name)}"
                            >
                                ×
                            </button>

                        </div>
                    `;

                }).join("");

        }

    }


    /* EMPTY / ITEM MESSAGE */

    if (cartEmpty) {

        if (cartItems.length === 0) {

            cartEmpty.innerHTML = `

                <span>R&M</span>

                <p>
                    Your bag is currently empty.
                </p>

                <a
                    href="men.html"
                    id="continueShopping"
                >
                    CONTINUE SHOPPING →
                </a>

            `;

        } else {

            cartEmpty.innerHTML = `

                <span>R&M</span>

                <p>
                    ${cartItems.length}
                    item${cartItems.length > 1 ? "s" : ""}
                    in your bag.
                </p>

            `;

        }

    }


    /* SUBTOTAL */

    if (cartSubtotal) {

        const subtotal =
            getCartSubtotal();

        cartSubtotal.textContent =
            formatPrice(subtotal);

    }


    /* SAVE CART */

    saveCart();

}


/* =====================================================
   REMOVE ITEM FROM CART
===================================================== */

if (cartItemsContainer) {

    cartItemsContainer.addEventListener(
        "click",
        event => {

            const removeButton =
                event.target.closest(
                    ".remove-cart-item"
                );

            if (!removeButton) return;


            const index =
                Number(removeButton.dataset.index);


            if (
                Number.isInteger(index) &&
                index >= 0 &&
                index < cartItems.length
            ) {

                cartItems.splice(index, 1);

                updateCart();

            }

        }
    );

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    if (cartDrawer) {

        cartDrawer.classList.add("open");

    }

    if (cartOverlay) {

        cartOverlay.classList.add("open");

    }

    document.body.classList.add("no-scroll");

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    if (cartDrawer) {

        cartDrawer.classList.remove("open");

    }

    if (cartOverlay) {

        cartOverlay.classList.remove("open");

    }

    document.body.classList.remove("no-scroll");

}


/* =====================================================
   CART BUTTONS
===================================================== */

if (cartButton) {

    cartButton.addEventListener(
        "click",
        openCart
    );

}


if (cartClose) {

    cartClose.addEventListener(
        "click",
        closeCart
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


/* =====================================================
   ADD TO CART
===================================================== */

const quickAddButtons =
    document.querySelectorAll(".quick-add");


quickAddButtons.forEach(button => {

    button.addEventListener("click", () => {

        const productCard =
            button.closest(".product-card");


        if (!productCard) return;


        /* PRODUCT NAME */

        const productName =
            productCard
                .querySelector(".product-name")
                ?.textContent
                .trim() ||

            productCard
                .querySelector("h3")
                ?.textContent
                .trim() ||

            "Product";


        /* PRODUCT PRICE */

        const productPrice =
            productCard
                .querySelector(".product-price")
                ?.textContent
                .trim() ||

            productCard
                .querySelector("strong")
                ?.textContent
                .trim() ||

            "₹0";


        /* ADD PRODUCT */

        cartItems.push({

            name: productName,

            price: productPrice

        });


        /* UPDATE */

        updateCart();

        openCart();

    });

});


/* =====================================================
   CHECKOUT BUTTON
===================================================== */

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        () => {

            if (cartItems.length === 0) {

                alert(
                    "Your bag is empty. Please add a product first."
                );

                return;

            }


            window.location.href =
                "checkout.html";

        }
    );

}


/* =====================================================
   PRODUCT FILTERS
===================================================== */

const filterButtons =
    document.querySelectorAll(".filter-button");

const productCards =
    document.querySelectorAll(".product-card");


function applyFilter(filter) {

    filterButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );

    });


    productCards.forEach(card => {

        const category =
            card.dataset.category;


        if (
            filter === "all" ||
            category === filter
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const filter =
                button.dataset.filter;

            applyFilter(filter);

        }
    );

});


/* =====================================================
   CATEGORY URL FILTER
===================================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const requestedCategory =
    urlParams.get("category");


if (
    requestedCategory &&
    productCards.length > 0
) {

    const matchingButton =
        document.querySelector(
            `.filter-button[data-filter="${requestedCategory}"]`
        );


    if (matchingButton) {

        applyFilter(
            requestedCategory
        );

    }

}


/* =====================================================
   CHECKOUT PAGE
===================================================== */

const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const placeOrderButton =
    document.getElementById("placeOrderButton");

const checkoutLayout =
    document.getElementById("checkoutLayout");

const orderSuccess =
    document.getElementById("orderSuccess");

const orderNumber =
    document.getElementById("orderNumber");


/* =====================================================
   RENDER CHECKOUT
===================================================== */

function renderCheckout() {

    if (!checkoutItems) return;


    /* EMPTY CART */

    if (cartItems.length === 0) {

        checkoutItems.innerHTML = `

            <div class="checkout-empty">

                Your bag is empty.

                <br><br>

                Add products from the
                men's collection before checkout.

            </div>

        `;


        if (checkoutSubtotal) {

            checkoutSubtotal.textContent =
                "₹0";

        }


        if (placeOrderButton) {

            placeOrderButton.disabled =
                true;

        }

        return;

    }


    /* CART ITEMS */

    checkoutItems.innerHTML =
        cartItems.map(item => {

            return `

                <div class="checkout-item">

                    <div class="checkout-item-name">

                        ${escapeHtml(item.name)}

                    </div>

                    <div class="checkout-item-price">

                        ${escapeHtml(item.price)}

                    </div>

                </div>

            `;

        }).join("");


    /* TOTAL */

    const subtotal =
        getCartSubtotal();


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            formatPrice(subtotal);

    }


    if (placeOrderButton) {

        placeOrderButton.disabled =
            false;

    }

}


/* =====================================================
   CHECKOUT FORM SUBMIT
===================================================== */

if (checkoutForm) {

    renderCheckout();


    checkoutForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /* DON'T SUBMIT EMPTY CART */

            if (cartItems.length === 0) {

                alert(
                    "Your bag is empty."
                );

                return;

            }


            /* FORM VALIDATION */

            if (!checkoutForm.checkValidity()) {

                checkoutForm.reportValidity();

                return;

            }


            /* GENERATE ORDER NUMBER */

            const randomNumber =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );


            const generatedOrderNumber =
                `RM${randomNumber}`;


            if (orderNumber) {

                orderNumber.textContent =
                    generatedOrderNumber;

            }


            /* HIDE CHECKOUT */

            if (checkoutLayout) {

                checkoutLayout.style.display =
                    "none";

            }


            /* SHOW SUCCESS */

            if (orderSuccess) {

                orderSuccess.classList.add(
                    "show"
                );

            }


            /* CLEAR CART */

            cartItems = [];

            saveCart();

            updateCart();


            /* SCROLL TO TOP */

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            if (searchOverlay) {

                searchOverlay.classList.remove(
                    "open"
                );

            }


            if (mobileMenu) {

                mobileMenu.classList.remove(
                    "open"
                );

            }


            closeCart();


            document.body.classList.remove(
                "no-scroll"
            );

        }

    }
);


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );


                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    revealElements.forEach(element => {

        revealObserver.observe(
            element
        );

    });

} else {

    revealElements.forEach(element => {

        element.classList.add(
            "visible"
        );

    });

}


/* =====================================================
   CATEGORY IMAGE PARALLAX
===================================================== */

const categoryCards =
    document.querySelectorAll(".category-card");


categoryCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            const image =
                card.querySelector("img");


            if (!image) return;


            const rect =
                card.getBoundingClientRect();


            const x =
                (event.clientX - rect.left)
                / rect.width - 0.5;


            const y =
                (event.clientY - rect.top)
                / rect.height - 0.5;


            image.style.transform =
                `scale(1.06) translate(${x * 8}px, ${y * 8}px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            const image =
                card.querySelector("img");


            if (!image) return;


            image.style.transform =
                "scale(1) translate(0, 0)";

        }
    );

});


/* =====================================================
   SEARCH INPUT
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const value =
                searchInput.value
                    .toLowerCase()
                    .trim();


            if (value.length > 0) {

                console.log(
                    "Searching for:",
                    value
                );

            }

        }
    );

}


/* =====================================================
   SMOOTH ANCHOR SCROLL
===================================================== */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            function(event) {

                const targetId =
                    this.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth"

                });

            }
        );

    });


/* =====================================================
   INITIAL CART
===================================================== */

updateCart();


/* =====================================================
   INITIAL CHECKOUT
===================================================== */

if (checkoutForm) {

    renderCheckout();

}


/* =====================================================
   R&M READY
===================================================== */

console.log(
    "R&M FAMILY WEAR — Website loaded successfully."
);