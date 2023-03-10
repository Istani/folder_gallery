process.chdir(__dirname);
var code_file = __filename.replace(__dirname+"/","");
const package_info = require("./package.json");
var software = package_info.name + " (V " + package_info.version + ") - " + code_file;
console.log(software);
console.log("=".repeat(software.length));
console.log();

const FOLDER_PATH="/media/usb/smartphones/Pictures/READSport";
const SERVER_PORT=4300;

const debug = require("../nodemodule_colorfullog");

const fs = require('fs');
const http = require('http');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
var hbs = exphbs.create({
  helpers: {},
  defaultLayout: 'default',
  extname: '.hbs',
  allowProtoPropertiesByDefault: true,
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(express.static(FOLDER_PATH));
app.use(express.static('public'));

app.use(async function (req, res, next) {
  if (typeof req.custom_data == 'undefined') {
    req.custom_data = {};
  }
  req.custom_data.url = req.url;
  debug.log(req.url, package_info.name + '-REQ');

  next();
});

app.get('/', async function (req, res, next) {
  req.custom_data.pics=[];

  fs.readdirSync(FOLDER_PATH).forEach(tmp_file => {
    if (!tmp_file.startsWith('.trashed')) {
      req.custom_data.pics[req.custom_data.pics.length]={name: tmp_file, file: tmp_file};
    }
  });
  req.custom_data.pics.reverse();

  // Get all Files! And Stuff

  res.render('main', req.custom_data);
});

const httpServer = http.createServer(app);
httpServer.listen(SERVER_PORT, () => {
  debug.log('HTTP Server running! Port: ' + SERVER_PORT, package_info.name + '-APP');
});