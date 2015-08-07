/*******************************************************************************
 * @region output
 * 
 * Output manager
 * 
 ******************************************************************************/

function Out() {
}

/**
 * Global logger to help manage many browsers, levels of output, etc.
 */
O = Out.prototype = {

	/**
	 * Level object
	 */
	LogLevel : {
		TRACE : {
			value : 0,
			fxn : 't',
			name : 'TRACE'
		},
		DEBUG : {
			value : 10,
			fxn : 'd',
			name : 'DEBUG'
		},
		INFO : {
			value : 20,
			fxn : 'i',
			name : 'INFO '
		},
		WARN : {
			value : 30,
			fxn : 'w',
			name : 'WARN '
		},
		ERROR : {
			value : 40,
			fxn : 'e',
			name : 'ERROR'
		},
		FATAL : {
			value : 50,
			fxn : 'f',
			name : 'FATAL'
		}
	},

	/**
	 * Get/Set the _logLevel
	 */
	level : function(level) {
		if (level) {
			this._logLevel = level;
		}
		return this._logLevel;
	},

	/**
	 * Log the output with formatting...
	 * 
	 * @param msg =>
	 *            message to log (sans formatting)
	 * @param level =>
	 *            O.LogLevel level to use to determine if we should/shouldn't
	 *            log the msg
	 * @see log(msg)
	 */
	doLog : function(msg, level) {
		if (this._logLevel.value <= level.value) {
			this.log((new Date()).toISOString() + ' [' + level.name + '] '
					+ msg);
		}
	},

	/**
	 * Simple log method to allow output without formatting to the console (or
	 * target)
	 * 
	 * @param msg =>
	 *            message to log
	 */
	log : function(msg) {
		try {
			console.log(msg);
		} catch (exception) {
			// just in case the console isn't available...
		}
	},

	/**
	 * Trace logging
	 * 
	 * @param msg =>
	 *            message to log
	 * @see O.doLog(msg,level)
	 */
	t : function(msg) {
		this.doLog(msg, this.LogLevel.TRACE);
	},

	/**
	 * Debug logging
	 * 
	 * @param msg =>
	 *            message to log
	 * @see O.doLog(msg,level)
	 */
	d : function(msg) {
		this.doLog(msg, this.LogLevel.DEBUG);
	},

	/**
	 * Info logging
	 * 
	 * @param msg =>
	 *            message to log
	 * @see O.doLog(msg,level)
	 */
	i : function(msg) {
		this.doLog(msg, this.LogLevel.INFO);
	},

	/**
	 * Warn logging
	 * 
	 * @param msg =>
	 *            message to log
	 * @see O.doLog(msg,level)
	 */
	w : function(msg) {
		this.doLog(msg, this.LogLevel.WARN);
	},

	/**
	 * Error logging
	 * 
	 * @param msg =>
	 *            message to log
	 * @see O.doLog(msg,level)
	 */
	e : function(msg) {
		this.doLog(msg, this.LogLevel.ERROR);
	},

	/**
	 * Fatal logging
	 * 
	 * @param msg =>
	 *            message to log
	 * @see O.doLog(msg,level)
	 */
	f : function(msg) {
		this.doLog(msg, this.LogLevel.FATAL);
	},

	/**
	 * Internal value that represents the current log level.
	 * 
	 * @private
	 */
	_logLevel : null
};

/**
 * Set initial level
 */
O.level(O.LogLevel.INFO);

/**
 * Testing => iterates through each O.LogLevel value and tries to print at all
 * levels.
 */
function testAll() {
	for ( var level in O.LogLevel) {
		O.level(O.LogLevel[level]);
		O.log('========================================================');
		O.log('Checking level ' + O.level().name);
		O.t('Testing TRACE');
		O.d('Testing DEBUG');
		O.i('Testing INFO');
		O.w('Testing WARN');
		O.e('Testing ERROR');
		O.f('Testing FATAL');
		O.log(' ');
	}
}

/*******************************************************************************
 * @regionend output
 ******************************************************************************/
