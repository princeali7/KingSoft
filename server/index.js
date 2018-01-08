require('isomorphic-fetch');
require('dotenv').config();

const fs = require('fs');
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');
const logger = require('morgan');
var cookieParser = require('cookie-parser')
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config.js');
var bodyParser = require('body-parser')


const ShopifyAPIClient = require('shopify-api-node');
const ShopifyExpress = require('@shopify/shopify-express');
const {SQLStrategy} = require('@shopify/shopify-express/strategies');

const {
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
  SHOPIFY_APP_SECRET,
  NODE_ENV,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_DB,
  SHOPIFY_HASH
} = process.env;
const knexConfig = {
    client: 'mysql',
    connection: {
        host : DATABASE_HOST,
        user : DATABASE_USER,
        password : DATABASE_PASSWORD,
        database : DATABASE_DB,

    },
    pool: { min: 0, max: 5 }
};
const shopifyConfig = {
  host: SHOPIFY_APP_HOST,
  apiKey: SHOPIFY_APP_KEY,
  secret: SHOPIFY_APP_SECRET,
  scope: ['write_orders, write_products','read_themes','write_themes'],
  shopStore: new SQLStrategy(),
  afterAuth(request, response) {
    const { session: { accessToken, shop } } = request;
    console.log('authenticated');
    registerWebhook(shop, accessToken, {
      topic: 'app/uninstalled',
      address: SHOPIFY_APP_HOST+'/webhooks/uninstall',
      format: 'json'
    });

    return response.redirect('/');
  },
};

const registerWebhook = function(shopDomain, accessToken, webhook) {
  const shopName = shopDomain.replace('.myshopify.com', '');
  const shopify = new ShopifyAPIClient({ shopName: shopName, accessToken: accessToken });
  shopify.webhook.create(webhook).then(
    response => console.log(`webhook '${webhook.topic}' created`),
    err => console.log(`Error creating webhook '${webhook.topic}'. ${JSON.stringify(err.response.body)}`)
  );
}

const app = express();
const isDevelopment = NODE_ENV !== 'production';

app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(
  session({
    store: isDevelopment ? undefined: new RedisStore(),
    secret: SHOPIFY_APP_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Run webpack hot reloading in dev
if (isDevelopment) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    hot: true,
    inline: true,
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  const staticPath = path.resolve(__dirname, '../assets');
  app.use('/assets', express.static(staticPath));
}

// Install
app.get('/install', (req, res) => res.render('install'));

// Create shopify middlewares and router
const shopify = ShopifyExpress(shopifyConfig);

// Mount Shopify Routes
const {routes, middleware} = shopify;
const {withShop, withWebhook} = middleware;
app.use(function (req, res, next) {
        if(!req.path.startsWith('/api/') && !req.path.startsWith('/dashboard')){
            next(); return;
        }
    let DB= new SQLStrategy();


    if(!req.query.shop){

        res.status(403).send('no shop domain');
        return;
    }

   res.cookie('shop-s-t-n',SHOPIFY_HASH, { maxAge: 9000000});

    //console.log(req.cookies);
if(req.cookies['shop-s-t-n']==SHOPIFY_HASH ||req.query.shopify_auth_code==SHOPIFY_HASH || (req.body && req.body['code_shopify']==SHOPIFY_HASH)) {
    DB.getShop({shop: req.query.shop}, (r, d) => {
        if (d.length > 0) {
            if (d[0]) {

                if(!req.session) {
                    req.session = {
                        shop: d[0].shopify_domain,
                        accessToken: d[0].access_token
                    };
                }
                else{
                    req.session.shop=d[0].shopify_domain;
                    req.session.accessToken=d[0].access_token;

                }
                // console.log('Time:', Date.now())
                next();

            }
        }
        else {
            res.status(403).send('not authorized');
        }
    })
}
else{
    res.status(403).send('not authorized user');

}




})
app.use('/', routes);

// Client
app.get('/dashboard', withShop, function(request, response) {
  const { session: { shop, accessToken } } = request;
  response.render('app', {
    title: 'Conversion King',
    apiKey: shopifyConfig.apiKey,
    shop: shop,
  });
});

// Webhooks
app.get('/order-create', withWebhook, (request, response) => {
  console.log('We got a webhook!');
  console.log('Details: ', request.webhook);
  console.log('Body:', request.body);
});

// Error Handlers
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(error, request, response, next) {
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  response.status(error.status || 500);
  response.render('error');
});

module.exports = app;
