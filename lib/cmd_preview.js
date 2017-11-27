var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var fs = require('fs');
var MarkdownIt = require('markdown-it');
var util = require('./util');
var swig = require('swig');

swig.setDefaults({cached: false});

var md = new MarkdownIt({
	html: true,
	langPrefix: 'code-'
});


module.exports = function(dir) {

	console.log('实施预览启动成功！');

	dir = dir || '.';

	//所谓“中间件（middleware），
	//就是处理HTTP请求的函数，
	//用来完成各种特定的任务，
	//比如检查用户是否登录、分析数据、以及其他在需要最终将数据发送给用户之前完成的任务。
	var app = express();
	var router = express.Router();

	app.use('/assets', serveStatic(path.resolve(dir, 'assets')));
	app.use(router);

	//渲染文章
	router.get('/posts/*', function(req, res, next) {
		var name = util.stripExtname(req.params[0]);
		var file = path.resolve(dir, '_posts', name + '.md');
		fs.readFile(file, function(err, content) {
			if(err) {
				return next(err)
			}
			var post = parseSourceContent(content.toString());
			post.content = markdownToHtml(post.source);
			post.layout = post.layout || 'post';
			var html = renderFile(path.resolve(dir, '_layout', post.layout + '.html'), {
				post: post
			});
			res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
			res.end(html);
		});
	});

	//渲染列表
	router.get('/', function(req, res, next) {
		res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
		res.end('文章列表');
	});

	app.listen(3000);

};

//md转html
function markdownToHtml(content) {
	content || (content = '');
	return md.render(content);
}

//解析元数据
function parseSourceContent(data) {
	var info = {};
	var split = '---\n';
	var i = data.indexOf(split);
	if(i !== -1) {
		var j = data.indexOf(split, i + split.length);
		if(j !== -1) {
			var str = data.slice(i + split.length, j).trim();
			data = data.slice(j + split.length);
			str.split('\n').forEach(function(line) {
				var i = line.indexOf(':');
				if(i !== -1) {
					var key = line.slice(0, i).trim();
					var val = line.slice(i + 1).trim();
					info[key] = val;
				}
			});
		}
	}
	info.source = data;
	return info;
}

function renderFile(file, data) {
	return swig.render(fs.readFileSync(file).toString(), {
		filename: file,
		autoescape: false,
		locals: data
	});
}