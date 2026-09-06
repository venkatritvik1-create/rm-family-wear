export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed."
        });

    }


    try {

        const keyId =
            process.env.RAZORPAY_KEY_ID;

        const keySecret =
            process.env.RAZORPAY_KEY_SECRET;


        if (!keyId || !keySecret) {

            return res.status(500).json({
                error:
                    "Razorpay environment variables are missing."
            });

        }


        const body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body;


        const items =
            Array.isArray(body?.items)
                ? body.items
                : [];


        if (items.length === 0) {

            return res.status(400).json({
                error: "Cart is empty."
            });

        }


        /*
         * Server-side product prices.
         *
         * These are taken from your current
         * R&M men's collection.
         */

        const productPrices = {

            "Classic Oxford Shirt": 1499,

            "Relaxed Linen Shirt": 1799,

            "Essential T-Shirt": 899,

            "Oversized Essential Tee": 999,

            "Signature Polo": 1299,

            "Classic Polo": 1199,

            "Tailored Trousers": 1699,

            "Classic Denim Jeans": 1999,

            "Relaxed Shorts": 899,

            "Minimal Overshirt": 2299,

            "Classic Casual Jacket": 2499,

            "Premium Crew Neck": 949

        };


        let totalRupees = 0;


        for (const item of items) {

            const name =
                String(item?.name || "").trim();


            if (!productPrices[name]) {

                return res.status(400).json({
                    error:
                        `Invalid product: ${name}`
                });

            }


            totalRupees +=
                productPrices[name];

        }


        if (totalRupees <= 0) {

            return res.status(400).json({
                error: "Invalid order amount."
            });

        }


        /*
         * Razorpay expects the amount
         * in the smallest currency unit.
         *
         * ₹1499 = 149900 paise.
         */

        const amountPaise =
            totalRupees * 100;


        const auth =
            Buffer
                .from(
                    `${keyId}:${keySecret}`
                )
                .toString("base64");


        const razorpayResponse =
            await fetch(
                "https://api.razorpay.com/v1/orders",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Basic ${auth}`

                    },

                    body: JSON.stringify({

                        amount:
                            amountPaise,

                        currency:
                            "INR",

                        receipt:
                            `RM-${Date.now()}`,

                        notes: {

                            source:
                                "R&M Family Wear",

                            item_count:
                                String(items.length)

                        }

                    })

                }
            );


        const order =
            await razorpayResponse.json();


        if (!razorpayResponse.ok) {

            console.error(
                "Razorpay order error:",
                order
            );

            return res.status(
                razorpayResponse.status
            ).json({

                error:
                    order?.error?.description ||
                    "Razorpay order creation failed."

            });

        }


        return res.status(200).json({

            keyId:
                keyId,

            orderId:
                order.id,

            amount:
                order.amount,

            currency:
                order.currency

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            error:
                "Unable to create payment order."

        });

    }

}