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

//创建空的博客项目
program
	.command('init [dir]')
	.description('博客脚手架')
	.action(require('../lib/cmd_init'));

//执行预览功能
program
	.command('preview [dir]')
	.description('实时预览')
	.action(require('../lib/cmd_preview'));

//生成html页面
program
	.command('build [dir]')
	.description('生成整站静态html')
	.option('-o, --output <dir>')
	.action(require('../lib/cmd_build'));

program.parse(process.argv);