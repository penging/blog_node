
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();

var partials=require('./modules/express-partials');
var MemcacheStore = require('connect-memcache')(express);
var flash = require('./modules/connect-flash');

app.set('port', process.env.PORT );
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());//启用页面模板

app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.bodyParser());//用于解析客户端请求，通常是通过post发送的内容
app.use(express.methodOverride());//用于支持定制的http方法

app.use(express.cookieParser());//Cookie 解析的中间件
app.use(express.session({ secret: 'janeze',  store: new MemcacheStore }));
app.use(flash());

//动态视图助手
app.use(function(req, res, next){
    var error = req.flash('error');
    var success = req.flash('success');
    res.locals.user = req.session.user;
    res.locals.error = error.length ? error : null;
    res.locals.success = success ? success : null;
    next();
});

//项目的路由支持
app.use(app.router);
routes(app);//将所有的路由规则分离出去

app.use(express.static(__dirname+'/static'));//静态文件支持
//错误控制器
if ('development' == app.get('env')) {  app.use(express.errorHandler()); }

http.createServer(app)
    .listen(app.get('port'));
	
	
