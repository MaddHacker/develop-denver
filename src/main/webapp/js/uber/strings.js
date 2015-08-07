/*******************************************************************************
 * @region string-helpers
 * 
 * Prototypes for String so it's not as annoying...
 * 
 ******************************************************************************/

if (typeof String.prototype.replaceAll != 'function') {
	/**
	 * Replace all functionality
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

if (typeof String.prototype.sanitize != 'function') {
	/**
	 * clears out all the '&', '<' and '>' symbols
	 * 
	 * @returns new string that is santized
	 */
	String.prototype.sanitize = function() {
		return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
				'&gt;');
	};
}

if (typeof String.prototype.startsWith != 'function') {
	/**
	 * starts with functionality
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
	 * @usage 'bob'.endsWith('b'); => true
	 * @usage 'A long string'.endsWith('string') => true
	 * @usage 'A long string'.endsWith('a string') => false
	 */
	String.prototype.endsWith = function(str) {
		return this.slice(-str.length) == str;
	};
}

/*******************************************************************************
 * @regionend string-helpers
 ******************************************************************************/
