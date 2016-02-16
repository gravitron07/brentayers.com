/**
 * Module dependencies.
 */

var express = require('express'),
	app = express(),
	fs = require("fs"),
    json;

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.engine('html', require('uinexpress').__express)
	app.set('view engine', 'html')
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file){

    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}

function getClients(data,randomizeList,maxLength){
	var tempData = data.slice();

	if(randomizeList){
		for(var i=0, len=tempData.length; i < len; i++){
			tempData[i].image = tempData[i].images[0];
		}
		for(var j, x, i = tempData.length; i; j = parseInt(Math.random() * i), x = tempData[--i], tempData[i] = tempData[j], tempData[j] = x);
	}

	if(typeof maxLength !== "undefined"){
		return tempData.slice(0,5);
	}else{
		return tempData;
	}
}

//routes

app.get('/', function(req, res){
	//app.get('/', routes.index);
	var parms = {
		title : "Brent Ayers"
	}
	res.render('index.html', parms);
});

app.get('/about', function(req, res){
	//app.get('/', routes.index);
	var parms = {
		title : "about"
	}
	res.render('about.html', parms);
});

app.get('/work', function(req, res){
	//app.get('/', routes.index);
	var parms = {
		title : "work"
	}
	res.render('work.html', parms);
});

app.get('/contact', function(req, res){
	//app.get('/', routes.index);
	var parms = {
		title : "contact"
	}
	res.render('contact.html', parms);
});

app.get('/api/featuredwork', function(req, res){
	json = getConfig('clients-config.js');
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(getClients(json,true,5)));
});

app.get('/api/work', function(req, res){
	json = getConfig('clients-config.js');
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(getClients(json,true)));
});

var server = app.listen(80);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);

