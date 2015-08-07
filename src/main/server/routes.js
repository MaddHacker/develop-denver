var url = require("url");

var __faviconUrl = '/favicon.ico';

exports.doRoute = function(request) {
	var urlObj = url.parse(request.url, true);
	var path = urlObj.pathname || '/';
	if (path.length > 1 && path != __faviconUrl) {
		var mthd = path.substr(1, path.length);
		console.log("Executing '" + mthd + "'");
		return execute(mthd, urlObj.query);
	}
	// default behaviour!
	console.log("Executing default behaviour...");

	if (urlObj.pathname != __faviconUrl) {
		console.log("Requested url: '" + urlObj.pathname + "'");
		console.log(" length: '" + urlObj.pathname.length + "'");
		console.log('Request for routing recieved...');
		console.log(" Obj: '" + urlObj + "'");
		console.log(" Protocol: '" + urlObj.protocol + "'");
		console.log(" Hostname: '" + urlObj.hostname + "'");
		console.log(" Port: '" + urlObj.port + "'");
		console.log(" Pathname: '" + urlObj.pathname + "'");
		console.log(" Search: '" + urlObj.search + "'");
		console.log('Request:');
		console.log(request);
		console.log('UrlObj:');
		console.log(urlObj);
		console.log('Headers:');
		console.log(request.headers);
		console.log('');
	}
};

var fxns = {
	'print' : function(args) {
		var str = 'Hello, ';
		if (args && args.hello) {
			str += "'" + args.hello + "'";
			// console.log("Hello, '" + args.hello + "'");
		} else {
			str += '<null>';
		}
		console.log(str);
		console.log('Arguments: ');
		console.log(args || {});
		return str;
	}
};

function execute(someMethod, args) {
	try {
		return fxns[someMethod](args);
		// someMethod(args);
	} catch (err) {
		console.log("Error found when trying to call '" + someMethod + "'");
		console.log('=========== ARGS ==============');
		console.log(args);
		console.log('===============================');
		console.log('=========== ERR ==============');
		console.log(err);
		console.log('==============================');
	}
}
