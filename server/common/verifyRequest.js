module.exports = function (request, response, next) {
        const { query: { shop }, session } = request;

        if (session && session.accessToken) {
            return next();
        }


    if(request.query.shop)
    {

        knex('shop').where({
            store_name :  req.query.shop
        }).first('*')
            .then(function (row) {
                    if(row)
                    {
                        currentShop=req.query.shop;
                        shopify = new Shopify({
                            shopName: req.query.shop.replace('.myshopify.com',''),
                            apiKey: config.oauth.api_key,
                            password: row.access_token
                        });
                        next();
                    }

                }

            );









    }
    else
        return res.json(400);




        if (shop && redirect) {
            return response.redirect(`/auth/shopify?shop=${shop}`);
        }

        if (redirect) {
            return response.redirect('/install');
        }

        return response.status(401).json('Unauthorized');
    };

