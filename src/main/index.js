/**
 * Core file. Should be able to just call this file to start with: node index.js
 * And the server should start up.
 * 
 */

/**
 * Global output manager
 */
O = require('./server/out');
diffusion = require('diffusion');
var server = require('./server/server');

__IS_TRACE = false;
__IS_DEBUG = false;

if (__IS_DEBUG || __IS_TRACE) {
	O.level(((__IS_TRACE) ? O.LogLevel.TRACE : O.LogLevel.DEBUG));
}

O.level(O.LogLevel.TRACE);
/*
 * DEBUG for ENV values
 */
O.t('Found reappt info from env: ' + process.env.REAPPT_URL + ':'
		+ process.env.REAPPT_PORT + ' usingSSL: ' + process.env.REAPPT_SSL
		+ ' principal: ' + process.env.REAPPT_PRINCIPAL + ' and password: '
		+ process.env.REAPPT_PASSWORD);

/*
 * SERVER INFORMATION
 */
__serverPort = 8888;
__webappRoot = 'src/main/webapp';

/*
 * REAPPT/DIFFUSION INFORMATION
 */
__diffHost = process.env.REAPPT_HOST
		|| ((__IS_DEBUG) ? 'localhost' : 'burningnastyGargantua.us.reappt.io');
__diffPort = process.env.REAPPT_PORT || ((__IS_DEBUG) ? 8081 : 80);
__diffSSL = (process.env.REAPPT_SSL) ? (process.env.REAPPT_SSL === 'true') : (!__IS_DEBUG);
__diffPrincipal = process.env.REAPPT_PRINCIPAL || 'admin';
__diffPassword = process.env.REAPPT_PASSWORD || 'password';

/*
 * MAKE STRINGS USEFUL Prototypes for String so it's not as annoying...
 */
if (typeof String.prototype.startsWith != 'function') {
	/**
	 * starts with functionality
	 * 
	 * @param {string}
	 *            string to match against
	 * @returns {boolean} <b>true</b> if this ends with string, <b>false</b>
	 *          otherwise
	 * 
	 * @usage 'bob'.startsWith('b'); => true
	 * @usage 'A long string'.startsWith('A lon') => true
	 * @usage 'A long string'.startsWith('A lone') => false
	 */
	String.prototype.startsWith = function(str) {
		return this.slice(0, str.length) == str;
	};
}

if (typeof String.prototype.endsWith != 'function') {
	/**
	 * starts with functionality
	 * 
	 * @param {string}
	 *            string to match against
	 * @returns {boolean} <b>true</b> if this starts with string, <b>false</b>
	 *          otherwise
	 * 
	 * @usage 'bob'.endsWith('b'); => true
	 * @usage 'A long string'.endsWith('string') => true
	 * @usage 'A long string'.endsWith('a string') => false
	 */
	String.prototype.endsWith = function(str) {
		return this.slice(-str.length) == str;
	};
}

if (typeof String.prototype.containsIgnoreCase != 'function') {
	/**
	 * Simple true/false to tell if the given string matches (ignoring case)
	 * some subset of <b>this</b> string
	 * 
	 * @param {string}
	 *            to match against (ignoring case)
	 * @returns {boolean} <b>true</b> if the string is contained (without
	 *          matching case), <b>false</b> otherwise
	 * 
	 * @usage 'my string'.containsIgnoreCase('str') => true
	 * @usage 'my long string'.containsIgnoreCase('long') => true
	 * @usage 'my long string'.containsIgnoreCase('LONG') => true
	 * @usage 'my super long string'.containsIgnoreCase('rings') => false
	 */
	String.prototype.containsIgnoreCase = function(str) {
		return this.search(new RegExp(str, 'i')) > -1;
	};
}

if (typeof String.prototype.replaceAll != 'function') {
	/**
	 * Replace all functionality
	 * 
	 * @param {string}
	 *            string to replace
	 * @param {string}
	 *            string to replace with
	 * @returns {string} with values replaced
	 * 
	 * @usage 'bob'.replaceAll('b','m'); => 'mom'
	 * @usage 'My very long string'.replaceAll(' ','_'); =>
	 *        'My_very_long_string'
	 */
	String.prototype.replaceAll = function(oldStr, newStr) {
		var tmpStr = this;
		while (tmpStr.indexOf(oldStr) > 0) {
			tmpStr = tmpStr.replace(oldStr, newStr);
		}
		return tmpStr;
	};
}

/*
 * START THE SERVER
 */
server.start();

