// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express'), // call express
  app = express(), // define our app using express
  // ipfilter = require('./security/ipfilter.js'),
  sassMiddleware = require('node-sass-middleware'),
  shisha = require('shisha'),
  expnjk = require('express-nunjucks'),
  // exphbs = require('express-handlebars'),
  // bodyParser = require('body-parser'),
  helmet = require('helmet'),
  path = require("path"),
  baseUrl = process.env.IIGB_BASE_URL,
  ipFilterOn = process.env.IIGB_IP_FILTER,
  isDev = app.get('env') === 'development';
port = process.env.PORT || 5000; // set our port

//security headers
app.use(helmet());

// SETUP IP FILTERING
// =============================================================================
if (ipFilterOn == 'true') {
  app.use(ipfilter.filter);
}
// USE BODY PARSER
// =============================================================================
// app.use(bodyParser.urlencoded({
// 	extended: true
// }));
// app.use(bodyParser.json());


// SETTING THE RENDERING ENGINE
// =============================================================================
app.set('views', __dirname + '/templates');

const njk = expnjk(app, {
  watch: isDev,
  noCache: isDev
});


// ROUTES FOR OUR API
// =============================================================================
// adding the sass middleware
app.use(
  sassMiddleware({
    src: __dirname + '/public/assets/scss',
    dest: __dirname + '/public/assets/css',
    outputStyle: 'compressed',
    prefix: '/css',
    force: true,
  })
);

// serving the static assets
app.use('/assets', express.static(__dirname + '/public/assets'));

// test endpoint which responds with "hello world" when a GET request is made to the homepage
app.get('/hello', function (req, res) {
  res.send('hello world');
});

// SMOKE TEST FUNCTIONALITY
// =============================================================================
const resources = [
  {
    url: 'http://uktibeta.s3-website-eu-west-1.amazonaws.com/us/',
    status: 200
  },{
    url: 'http://uktibeta.s3-website-eu-west-1.amazonaws.com/de/',
    status: 200
  },{
    url: 'http://uktibeta.s3-website-eu-west-1.amazonaws.com/cn/',
    status: 200
  },{
    url: 'http://uktibeta.s3-website-eu-west-1.amazonaws.com/in/',
    status: 200
  },{
    url: 'http://uktibeta.s3-website-eu-west-1.amazonaws.com/int/',
    status: 200
  },
  {
    url: 'https://iigb-search.herokuapp.com/en/results/?q=status',
    status: 200
  }
];

const result = function (output) {
  app.get('/', function (req, res) {
    res.render('index', {title: "Invest service status", results: output});
  });
};

shisha.smoke(resources, {protocol: 'https', domain: 'namshi.com'}, result);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on ' + port);
