import crypto from "crypto";


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


        const paymentId =
            body?.razorpay_payment_id;

        const razorpayOrderId =
            body?.razorpay_order_id;

        const razorpaySignature =
            body?.razorpay_signature;


        if (
            !paymentId ||
            !razorpayOrderId ||
            !razorpaySignature
        ) {

            return res.status(400).json({

                error:
                    "Missing payment verification details."

            });

        }


        /*
         * Retrieve the order from Razorpay.
         *
         * This means the order used for
         * verification comes from the
         * Razorpay server rather than being
         * blindly trusted from the browser.
         */

        const auth =
            Buffer
                .from(
                    `${keyId}:${keySecret}`
                )
                .toString("base64");


        const orderResponse =
            await fetch(
                `https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpayOrderId)}`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Basic ${auth}`

                    }

                }
            );


        const order =
            await orderResponse.json();


        if (!orderResponse.ok) {

            return res.status(400).json({

                error:
                    "Could not retrieve Razorpay order."

            });

        }


        /*
         * Razorpay requires:
         *
         * HMAC_SHA256(
         *     order_id + "|" + payment_id,
         *     key_secret
         * )
         */

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    keySecret
                )
                .update(
                    `${order.id}|${paymentId}`
                )
                .digest("hex");


        /*
         * timingSafeEqual prevents simple
         * timing-based comparison attacks.
         */

        const expected =
            Buffer.from(
                generatedSignature,
                "utf8"
            );

        const received =
            Buffer.from(
                razorpaySignature,
                "utf8"
            );


        const signatureMatches =
            expected.length === received.length &&
            crypto.timingSafeEqual(
                expected,
                received
            );


        if (!signatureMatches) {

            return res.status(400).json({

                verified:
                    false,

                error:
                    "Payment signature verification failed."

            });

        }


        return res.status(200).json({

            verified:
                true,

            orderId:
                order.id,

            paymentId:
                paymentId

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            verified:
                false,

            error:
                "Payment verification failed."

        });

    }

}
