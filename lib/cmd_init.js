var path = require('path');
var fse = require('fs-extra');
var moment = require('moment');
var utils = require('./utils');

module.exports = function(dir) {
	dir = dir || '.';

	//创建空目录
	var menuNames = ['_posts', '_layout', 'assets', 'posts'];
	menuNames.forEach(function(menuName) {
		fse.mkdirsSync(path.resolve(dir, menuName));
	});

	//复制模板文件
	var tplDir = path.resolve(__dirname, '../tpl');
	fse.copySync(tplDir, path.resolve(dir, '_layout'));

	//生成一篇空博客
	newPost(dir, 'hello world', '这是我的第一篇博客');

	//生成config.js
	newConfig(dir);
	
	console.log('创建成功');
}

function newPost(dir, title, content) {
	var content = [
		'---',
		'title: ' + title,
		'date: ' + moment().format('YYYY-MM-DD'),
		'---',
		content
	].join('\n');

	var name = moment().format('YYYY-MM') + '/hello-world.md';
	var file = path.resolve(dir, '_posts', name);
	fse.outputFileSync(file, content);
}

function newConfig(dir) {
	var file = path.resolve(dir, 'config.json');
	fse.outputFileSync(file, '{\n\n\n}');
}