function Content(mimeType, content) {
	var obj = {};

	obj.type = mimeType;
	obj.value = content;
	obj.length = content.length;

	return obj;
}

module.exports = {
	text : function(content) {
		return Content('text/plain', content);
	},
	html : function(content) {
		return Content('text/html', content);
	},
	js : function(content) {
		return Content('application/javascript', content);
	},
	css : function(content) {
		return Content('text/css', content);
	},
	json : function(content) {
		return Content('application/json', content);
	},
	xml : function(content) {
		return Content('application/xml', content);
	},
	png : function(content) {
		return Content('image/png', content);
	},
	jpg : function(content) {
		return Content('image/jpeg', content);
	},
	jpeg : function(content) {
		return Content('image/jpeg', content);
	},
	ico : function(content) {
		return Content('image/x-icon', content);
	}
};
