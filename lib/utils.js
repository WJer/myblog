var path = require('path');
var fs = require('fs');
var swig = require('swig');
var rd = require('rd');
var MarkdownIt = require('markdown-it');

var md = new MarkdownIt({
	html: true,
	langPrefix: 'code-'
});
swig.setDefaults({cached: false});

//去除后缀名
function stripExtname(name) {
	var i = 0 - path.extname(name).length;
	if(i == 0) {
		i = name.length;
	}
	return name.slice(0, i);
}

//md转换html
function markdownToHtml(content) {
	content || (content = '');
	return md.render(content);
}

//解析md元数据
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

//遍历所有md文档
function eachSourceMdFile(dir, callback) {
	rd.eachFileFilterSync(sourceDir, /\.md$/, callback);
}

//渲染模板
function renderFile(file, data) {
	return swig.render(fs.readFileSync(file).toString(), {
		filename: file,
		autoescape: false,
		locals: data
	});
}

//渲染文章
function renderPost(dir, file) {
	var content = fs.readFileSync(file).toString();
	var post = parseSourceContent(content);
	post.content = markdownToHtml(post.source);
	post.layout = post.layout || 'post';
	var html = renderFile(path.resolve(dir, '_layout', post.layout + '.html'), {post: post});
	return html;
}

function renderIndex(dir) {
	var list= [];
	var sourceDir = path.resolve(dir, '_posts');
	rd.eachFileFilterSync(sourceDir, /\.md$/, function(f, s) {
		var source = fs.readFileSync(f).toString();
		var post = parseSourceContent(source);
		post.timestamp = new Date(post.date);
		post.url = '/posts/' + stripExtname(f.slice(sourceDir.length + 1)) + '.html';
		list.push(post);
	});

	list.sort(function(post1, post2) {
		return post2.timestamp - post1.timestamp;
	});
	var html = renderFile(path.resolve(dir, '_layout', 'index.html'), {
		posts: list
	});
	return html;
}

module.exports.renderIndex = renderIndex;
module.exports.renderPost = renderPost;
module.exports.eachSourceMdFile = eachSourceMdFile;
module.exports.stripExtname = stripExtname;

