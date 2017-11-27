var path = require('path');
var fs = require('fs');

module.exports = {

	//去除扩展名称
	stripExtname: function(name) {
		var i = 0 - path.extname(name).length;
		if(i == 0) {
			i = name.length;
		}
		return name.slice(0, i);
	}

};