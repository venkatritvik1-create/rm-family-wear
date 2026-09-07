/*
 * Public product catalogue endpoint.
 *
 * The browser calls this route instead of talking to Supabase directly.
 * The Supabase service key remains private in Vercel environment variables.
 */

export default async function handler(req, res) {

    if (req.method !== "GET") {

        return res.status(405).json({
            error: "Method not allowed."
        });

    }


    const supabaseUrl =
        process.env.SUPABASE_URL;

    const serviceRoleKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY;


    if (!supabaseUrl || !serviceRoleKey) {

        return res.status(500).json({
            error: "Product catalogue is not configured."
        });

    }


    try {

        const response =
            await fetch(
                `${supabaseUrl}/rest/v1/products?select=id,name,slug,category,price,sale_price,description,image_urls,sizes,stock_by_size&is_active=eq.true&order=created_at.asc`,
                {
                    headers: {
                        apikey: serviceRoleKey,
                        Authorization:
                            `Bearer ${serviceRoleKey}`
                    }
                }
            );


        const products =
            await response.json();


        if (!response.ok) {

            console.error(
                "Supabase product query failed:",
                products
            );

            return res.status(502).json({
                error: "Unable to load products."
            });

        }


        return res.status(200).json({
            products: products
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Unable to load products."
        });

    }

}
