var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var utils = require('./utils');

module.exports = function(dir, opts) {
	console.log('开始构建');
	dir = dir || '.';
	var outputDir = path.resolve(opts.output || dir);
	//写入文件
	function outputFile(file, content) {
		console.log('生成页面：%s', file.slice(outputDir.length + 1));
		fse.outputFileSync(file, content);
	}

	//生成首页
	var htmlIndex = utils.renderIndex(dir);
	var fileIndex = path.resolve(outputDir, 'index.html');
	outputFile(fileIndex, htmlIndex);

	//生成文章
	var mdDir = path.resolve(dir, '_posts');
	utils.eachSourceMdFile(mdDir, function(fl, st) {
		var htmlPost = utils.renderPost(dir, fl);
		var relativeFile = utils.stripExtname(fl.slice(mdDir.length + 1));
		var filePost = path.resolve(outputDir, 'posts', relativeFile);
		outputFile(filePost, htmlPost);
	});
}

