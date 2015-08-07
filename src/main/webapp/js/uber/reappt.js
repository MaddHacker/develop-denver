/*******************************************************************************
 * @region reappt
 * 
 * Reappt control
 * 
 ******************************************************************************/

function Diffusion() {
}

/**
 * Global control for Reappt functionality
 */
Reappt = Diffusion.prototype = {
	/**
	 * Internal reference to the principal for the connected session, will be
	 * <b>null</b> when no session exists
	 */
	_principal : null,

	/**
	 * Internal reference to the session, check <b>isConnected()</b> to
	 * determine connection status
	 */
	_session : null,

	/**
	 * Getter/setter for principal
	 * 
	 * @param principal =>
	 *            new principal to set
	 * @return _principal => principal for session, <b>null</b> if no session
	 */
	principal : function(principal) {
		if (principal) {
			this._principal = principal;
		}
		return this._principal;
	},

	/**
	 * Getter/setter for session
	 * 
	 * @param session =>
	 *            new session to set
	 * @return _session => session that has been setup, check <b>isConnected()</b>
	 *         to determine connection status
	 */
	session : function(session) {
		if (session) {
			this._session = session;
		}
		return this._session;
	},

	/**
	 * Default callbacks provided for <b>connect()</b> method.
	 * 
	 * @see connect(host,port,ssl,credentials,callbacks)
	 * @callback before() => called as soon as <b>connect()</b> is called
	 * @callback after(session) => called just after <b>connect()</b> exits
	 * @callback connected(session) => diffusion callback
	 * @callback error(error) => diffusion callback
	 * @callback disconnected() => diffusion callback
	 * @callback reconnected() => diffusion callback
	 * @callback closed(reason) => diffusion callback
	 */
	_defaultConnectCallbacks : {
		before : function() {
			O.t('[defaultConnect#before START]');
			O.t('[defaultConnect#before END]');
		},
		after : function(session) {
			O.t('[defaultConnect#after START]');
			O.d('[defaultConnect#after] session created with sessionID: '
					+ ((session) ? session.sessionID : '<null>'));
			O.t('[defaultConnect#after END]');
		},
		connect : function(session) {
			O.t('[defaultConnect#connect START]');
			Reappt.session(session);
			O.i('[defaultConnect#connect] Connected session with sessionID: '
					+ session.sessionID);
			O.t('[defaultConnect#connect END]');
		},
		error : function(error) {
			O.t('[defaultConnect#error START]');
			O.e('[defaultConnect#error] ' + err.message);
			O.t('[defaultConnect#error END]');
		},
		disconnect : function() {
			O.t('[defaultConnect#disconnect START]');
			O.i('[defaultConnect#disconnect] Disconnected...');
			O.t('[defaultConnect#disconnect END]');
		},
		reconnect : function() {
			O.t('[defaultConnect#reconnect START]');
			O.i('[defaultConnect#reconnect] Reconnecting...');
			O.t('[defaultConnect#reconnect END]');
		},
		close : function(reason) {
			O.t('[defaultConnect#close START]');
			O.i('[defaultConnect#close] ' + reason.message);
			O.t('[defaultConnect#close END]');
		}
	},

	/**
	 * Default callbacks provided for <b>disconnect()</b> method.
	 * 
	 * @see disconnect(callbacks)
	 * @callback before() => called as soon as <b>disconnect()</b> is called
	 * @callback disconnecting() => called if <b>_session</b> is set and
	 *           .close() is actually called on it
	 * @callback after() => called just after <b>disconnect()</b> exits
	 */
	_defaultDisconnectCallbacks : {
		before : function() {
			O.t('[defaultDisconnect#before START]');
			O.t('[defaultDisconnect#before END]');
		},
		disconnecting : function(session) {
			O.t('[defaultDisconnect#disconnecting START]');
			O
					.d('[defaultDisconnect#disconnecting] closing session with sessionID: '
							+ ((session) ? session.sessionID : '<null>'));
			O.t('[defaultDisconnect#disconnecting END]');
		},
		after : function() {
			O.t('[defaultDisconnect#after START]');
			O.t('[defaultDisconnect#after END]');
		}
	},

	/**
	 * Default callbacks for the <b>subscribe</b> method
	 * 
	 * @see subscribe(selector,callbacks)
	 * @callback update(value,topic) => diffusion callback
	 * @callback subscribed(details,topic) => diffusion callback
	 * @callback unsubscribed(reason,topic) => diffusion callback
	 */
	_defaultSubscribeCallbacks : {
		update : function(value, topic) {
			O.d('Update for topic: ' + topic);
			O.t('      value : ' + value);
		},
		subscribed : function(details, topic) {
			O.d('Subscribed to topic: ' + topic);
		},
		unsubscribed : function(reason, topic) {
			O.d('Unsubscribed to topic: ' + topic);
		}
	},

	/**
	 * Default callbacks for the <b>addTopic</b> method
	 * 
	 * @see addTopic(topic,value,callbacks)
	 * @callback complete() => diffusion callback
	 * @callback error(err) => diffusion callback
	 */
	_defaultAddTopicCallbacks : {
		complete : function() {
			O.t('Creation of topic complete');
		},
		error : function(err) {
			O.e('Error adding topic: ' + err.reason);
		}
	},

	/**
	 * Default callbacks for the <b>updateTopic</b> method
	 * 
	 * @see updateTopic(topic,value,callbacks)
	 * @callback complete() => diffusion callback
	 * @callback error(err) => diffusion callback
	 */
	_defaultUpdateTopicCallbacks : {
		complete : function() {
			O.t('Update of topic complete');
		},
		error : function(err) {
			O.e('Error updating topic: ' + err.reason);
		}
	},

	/**
	 * Internal fxn to get the sum of the given <b><i>baseCallbacks</i></b>
	 * and <b><i>newCallbacks</i></b>
	 * 
	 * @param baseCallbacks =>
	 *            base (defined here) set of callbacks
	 * @param newCallbacks =>
	 *            some or all of the baseCallbacks to be overridden
	 * @return callbacks => a copy of baseCallbacks with each callback that is
	 *         provided in newCallbacks overridden
	 */
	_getCallbacks : function(baseCallbacks, newCallbacks) {
		var tmp = {};
		baseCallbacks = baseCallbacks || {};
		newCallbacks = newCallbacks || {};

		for ( var attrname in baseCallbacks) {
			tmp[attrname] = baseCallbacks[attrname];
		}
		for ( var attrname in newCallbacks) {
			tmp[attrname] = newCallbacks[attrname];
		}
		return tmp;
	},

	/**
	 * connect to Diffusion
	 * 
	 * @param host =>
	 *            host to connect to
	 * @param port =>
	 *            port to connect to
	 * @param ssl =>
	 *            boolean (true = yes, false = no)
	 * @param credentials =>
	 *            object that contains <b>principal</b> and <b>password</b>
	 * @param callbacks =>
	 *            how we want to interact
	 * 
	 * @see _defaultConnectCallbacks
	 */
	connect : function(host, port, ssl, credentials, callbacks) {
		callbacks = this
				._getCallbacks(this._defaultConnectCallbacks, callbacks);
		callbacks.before();

		// ||| jbariel TODO => i believe this is a hack, should be able to pull
		// this from
		// session.options.credentials.principal (which is currently null)
		// 21 April 2015
		this.principal(credentials.principal);

		var tmpSession = diffusion.connect({
			host : host,
			port : port,
			ssl : ssl,
			credentials : credentials
		}).on({
			connect : callbacks.connect,
			error : callbacks.error,
			disconnect : callbacks.disconnect,
			reconnect : callbacks.reconnect,
			close : callbacks.close
		});
		this.session(tmpSession);
		callbacks.after();
	},

	/**
	 * Check to see if the session is connected
	 * 
	 * @return <b>true</b> if session object is set and connected, <b>false</b>
	 *         otherwise
	 */
	isConnected : function() {
		return this._session && this._session.isConnected();
	},

	/**
	 * disconnect Diffusion, can be called multiple times without issue.
	 * 
	 * @param callbacks =>
	 *            how we want to interact
	 * 
	 * @see _defaultDisconnectCallbacks
	 */
	disconnect : function(callbacks) {
		callbacks = this._getCallbacks(this._defaultDisconnectCallbacks,
				callbacks);
		callbacks.before();
		if (this._session) {
			callbacks.disconnecting(this._session);
			this._session.close();
		}
		callbacks.after();
	},

	/**
	 * subscribe to topics using selector
	 * 
	 * @param selector =>
	 *            topicSelector string
	 * @param callbacks =>
	 *            how we want to interact
	 * 
	 * @see _defaultSubscribeCallbacks
	 */
	subscribe : function(selector, callbacks) {
		callbacks = this._getCallbacks(this._defaultSubscribeCallbacks,
				callbacks);
		if (this.isConnected()) {
			this._session.subscribe(selector).on(callbacks);
		}
	},

	/**
	 * add topic with given default value
	 * 
	 * @param topic =>
	 *            {string} topic path
	 * @param value =>
	 *            default value
	 * @param callbacks =>
	 *            how we want to interact
	 * 
	 * @see _defaultAddTopicCallbacks
	 */
	addTopic : function(topic, value, callbacks) {
		callbacks = this._getCallbacks(this._defaultAddTopicCallbacks,
				callbacks);
		if (this.isConnected()) {
			this._session.topics.add(topic, value).on(callbacks);
		}
	},

	/**
	 * update topic with given value
	 * 
	 * @param topic =>
	 *            {string} topic path
	 * @param value =>
	 *            new value
	 * @param callbacks =>
	 *            how we want to interact
	 * 
	 * @see _defaultUpdateTopicCallbacks
	 */
	updateTopic : function(topic, value, callbacks) {
		callbacks = this._getCallbacks(this._defaultUpdateTopicCallbacks,
				callbacks);
		if (this.isConnected()) {
			this._session.topics.update(topic, value).on(callbacks);
		}
	}

};

/*******************************************************************************
 * @regionend reappt
 ******************************************************************************/
