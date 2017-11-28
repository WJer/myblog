var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var express = require('express');
var serveStatic = require('serve-static');



module.exports = function(dir) {

	console.log('启动成功！');

	dir = dir || '.';

	//所谓“中间件（middleware），
	//就是处理HTTP请求的函数，
	//用来完成各种特定的任务，
	//比如检查用户是否登录、分析数据、以及其他在需要最终将数据发送给用户之前完成的任务。
	
	var app = express();
	//路由中间件
	var router = express.Router();

	app.use('/assets', serveStatic(path.resolve(dir, 'assets')));
	app.use(router);

	//渲染文章
	router.get('/posts/*', function(req, res, next) {
		var name = utils.stripExtname(req.params[0]);
		var file = path.resolve(dir, '_posts', name + '.md');
		res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
		res.end(utils.renderPost(dir, file));
	});

	//渲染列表
	router.get('/', function(req, res, next) {
		res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
		res.end(utils.renderIndex(dir));
	});

	app.listen(3000);

};