#!/usr/bin/env node
//第一行用来指定哪个解释器编译执行程序

var program = require('commander');

program.version('0.0.1');

program
	.command('help')
	.description('显示使用帮助')
	.action(function() {
		program.outputHelp();
	});

program
	.command('create [dir]')
	.description('创建一个空的博客')
	.action(function(dir) {
		console.log('create %s', dir);
	});

program
	.command('preview [dir]')
	.description('实时预览')
	.action(require('../lib/cmd_preview'));

program
	.command('build [dir]')
	.description('生成整站静态html')
	.option('-o, --output <dir>')
	.action(function(dir, options) {
		console.log('create %s, output %s', dir, options.output);
	});

program.parse(process.argv);