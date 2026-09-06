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
    mobileMenu.querySelectorAll("a").forEach(link => {
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

document
    .querySelectorAll(".search-suggestions button")
    .forEach(button => {

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


let cartItems = [];


/* =====================================================
   LOAD CART
===================================================== */

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
   PRICE HELPERS
===================================================== */

function getPriceNumber(price) {

    if (!price) return 0;

    return Number(
        String(price).replace(/[^\d]/g, "")
    ) || 0;

}


function formatPrice(amount) {

    return `₹${Number(amount).toLocaleString("en-IN")}`;

}


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
   UPDATE CART
===================================================== */

function updateCart() {

    if (cartCount) {
        cartCount.textContent =
            cartItems.length;
    }


    if (cartItemsContainer) {

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


    if (cartSubtotal) {

        cartSubtotal.textContent =
            formatPrice(getCartSubtotal());

    }


    saveCart();

}


/* =====================================================
   REMOVE CART ITEM
===================================================== */

if (cartItemsContainer) {

    cartItemsContainer.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".remove-cart-item"
                );

            if (!button) return;

            const index =
                Number(button.dataset.index);

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
   OPEN / CLOSE CART
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


function closeCart() {

    if (cartDrawer) {
        cartDrawer.classList.remove("open");
    }

    if (cartOverlay) {
        cartOverlay.classList.remove("open");
    }

    document.body.classList.remove("no-scroll");

}


if (cartButton) {

    cartButton.addEventListener(
        "click",
        () => {

            /*
             * checkout.html does not contain
             * the cart drawer, so let the user
             * return to the products page.
             */

            if (!cartDrawer) {
                window.location.href =
                    "men.html";
                return;
            }

            openCart();

        }
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

document
    .querySelectorAll(".quick-add")
    .forEach(button => {

        button.addEventListener("click", () => {

            const productCard =
                button.closest(".product-card");

            if (!productCard) return;


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


            cartItems.push({
                name: productName,
                price: productPrice
            });


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

            applyFilter(
                button.dataset.filter
            );

        }
    );

});


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
        applyFilter(requestedCategory);
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

const checkoutEmpty =
    document.getElementById("checkoutEmpty");

const placeOrderButton =
    document.getElementById("placeOrderButton");

const checkoutLayout =
    document.querySelector(".checkout-layout");

const orderSuccess =
    document.getElementById("orderSuccess");

const orderNumber =
    document.getElementById("orderNumber");

const paymentSelect =
    document.getElementById("payment");


/* =====================================================
   RENDER CHECKOUT
===================================================== */

function renderCheckout() {

    if (!checkoutItems) return;


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
            checkoutSubtotal.textContent = "₹0";
        }


        if (checkoutEmpty) {
            checkoutEmpty.style.display = "block";
        }


        if (placeOrderButton) {
            placeOrderButton.disabled = true;
        }

        return;

    }


    if (checkoutEmpty) {
        checkoutEmpty.style.display = "none";
    }


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


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            formatPrice(getCartSubtotal());

    }


    if (placeOrderButton) {
        placeOrderButton.disabled = false;
    }

}


/* =====================================================
   SHOW ORDER SUCCESS
===================================================== */

function showOrderSuccess() {

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


    if (checkoutLayout) {
        checkoutLayout.style.display =
            "none";
    }


    if (orderSuccess) {
        orderSuccess.classList.add("show");
    }


    cartItems = [];

    saveCart();

    updateCart();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   RAZORPAY SCRIPT LOADER
===================================================== */

function loadRazorpay() {

    return new Promise((resolve, reject) => {

        if (window.Razorpay) {
            resolve();
            return;
        }


        const script =
            document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => resolve();

        script.onerror = () => {
            reject(
                new Error(
                    "Razorpay could not be loaded."
                )
            );
        };

        document.head.appendChild(script);

    });

}


/* =====================================================
   ONLINE PAYMENT
===================================================== */

async function startRazorpayPayment() {

    if (cartItems.length === 0) {

        alert("Your bag is empty.");

        return;

    }


    const customer = {

        name:
            document.getElementById("fullName")
                ?.value
                .trim(),

        phone:
            document.getElementById("phone")
                ?.value
                .trim(),

        email:
            document.getElementById("email")
                ?.value
                .trim(),

        address:
            document.getElementById("address")
                ?.value
                .trim(),

        city:
            document.getElementById("city")
                ?.value
                .trim(),

        state:
            document.getElementById("state")
                ?.value
                .trim(),

        pincode:
            document.getElementById("pincode")
                ?.value
                .trim()

    };


    try {

        if (placeOrderButton) {
            placeOrderButton.disabled = true;
            placeOrderButton.textContent =
                "OPENING PAYMENT...";
        }


        /*
         * The server receives product names,
         * validates their prices against its
         * own product list and creates the
         * Razorpay order.
         */

        const response =
            await fetch(
                "/api/create-order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        items: cartItems,
                        customer: customer
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Could not create Razorpay order."
            );

        }


        await loadRazorpay();


        const options = {

            key: data.keyId,

            amount: data.amount,

            currency: data.currency,

            name: "R&M Family Wear",

            description:
                "R&M Family Wear Order",

            order_id:
                data.orderId,

            prefill: {

                name: customer.name,

                email: customer.email,

                contact: customer.phone

            },

            notes: {

                city: customer.city,

                state: customer.state,

                pincode: customer.pincode

            },

            theme: {

                color: "#3f3028"

            },


            handler:
                async function (paymentResponse) {

                    try {

                        if (placeOrderButton) {
                            placeOrderButton.textContent =
                                "VERIFYING PAYMENT...";
                        }


                        const verifyResponse =
                            await fetch(
                                "/api/verify-payment",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body: JSON.stringify({

                                        razorpay_payment_id:
                                            paymentResponse.razorpay_payment_id,

                                        razorpay_order_id:
                                            paymentResponse.razorpay_order_id,

                                        razorpay_signature:
                                            paymentResponse.razorpay_signature

                                    })

                                }
                            );


                        const verifyData =
                            await verifyResponse.json();


                        if (
                            !verifyResponse.ok ||
                            !verifyData.verified
                        ) {

                            throw new Error(
                                "Payment verification failed."
                            );

                        }


                        showOrderSuccess();

                    } catch (error) {

                        console.error(error);

                        alert(
                            "Payment was received, but we could not verify it. Please contact R&M before placing another order."
                        );

                    } finally {

                        if (placeOrderButton) {

                            placeOrderButton.disabled =
                                false;

                            placeOrderButton.textContent =
                                "PLACE ORDER";

                        }

                    }

                },


            modal: {

                ondismiss: function () {

                    if (placeOrderButton) {

                        placeOrderButton.disabled =
                            false;

                        placeOrderButton.textContent =
                            "PLACE ORDER";

                    }

                }

            }

        };


        const razorpay =
            new Razorpay(options);


        razorpay.on(
            "payment.failed",
            function () {

                alert(
                    "Payment was not completed. Please try again."
                );

                if (placeOrderButton) {

                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.textContent =
                        "PLACE ORDER";

                }

            }
        );


        razorpay.open();


    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Something went wrong while starting payment."
        );


        if (placeOrderButton) {

            placeOrderButton.disabled =
                false;

            placeOrderButton.textContent =
                "PLACE ORDER";

        }

    }

}


/* =====================================================
   CHECKOUT FORM SUBMIT
===================================================== */

if (checkoutForm) {

    renderCheckout();


    checkoutForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (cartItems.length === 0) {

                alert(
                    "Your bag is empty."
                );

                return;

            }


            if (!checkoutForm.checkValidity()) {

                checkoutForm.reportValidity();

                return;

            }


            const paymentMethod =
                paymentSelect?.value;


            if (paymentMethod === "online") {

                await startRazorpayPayment();

                return;

            }


            /*
             * COD and Pay at Store are not
             * online payments.
             */

            showOrderSuccess();

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
                searchOverlay.classList.remove("open");
            }

            if (mobileMenu) {
                mobileMenu.classList.remove("open");
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
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

}


/* =====================================================
   CATEGORY IMAGE PARALLAX
===================================================== */

document
    .querySelectorAll(".category-card")
    .forEach(card => {

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
                    this.getAttribute("href");

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
