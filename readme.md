# 静态博客命令工具

## 功能包括：

1. 创建空博客
2. 使用md文档格式
3. 本地实时预览
4. 生成整站静态html

## 使用

	//创建空博客
	myblog create [dir]

	//预览博客
	myblog preview [dir]

	//生成整站静态博客
	myblog build [dir] [--output target]


## 命令格式
```
command [options] [arguments]
```

command: 命令名称
options: 选项，eg：-h或--help
arguments: 参数

## 符号

1. []: 表示可选的
2. <>: 表示必须多选一
3. a|b|c: 单选
4. -abc: 多选

## 自定义命令步骤

1. 在package.json中添加bin参数，如同：

```
{
	'bin': './bin/mybin'
}
```

2. 关联命令

```
sudo npm link
```

可以直接使用`mybin`来执行程序了

