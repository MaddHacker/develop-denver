/*******************************************************************************
 * @region connect
 * 
 * Connection management
 * 
 ******************************************************************************/

/**
 * Update status message for connection
 * 
 * @param msg =>
 *            html
 */
function status(msg) {
	$('#connection-status').html(msg);
}

/**
 * Create the connection dialog (and open it)
 */
function connectDialog() {
	$('#connection-dialog').dialog({
		modal : true,
		draggable : false,
		minWidth : 400,
		minHeight : 250
	});
}

/**
 * Called when Connect button is pressed. Pulls most of the connection info from
 * the node server, the rest from the connection form.
 */
function connect() {
	$('#connection-dialog').dialog('close');
	status('Trying to connect...');
	$('#connect-button').hide();
	$('#disconnect-button').show();
	$.getJSON('/Diffusion/connectionInfo', function(data) {
		Reappt.connect(data.host, data.port, data.ssl === 'true', {
			principal : $('#login-username').val(),
			password : $('#login-password').val()
		}, {
			connect : onConnected,
			error : function(error) {
				onDisconnected('ERROR: ' + err.message);
			},
			disconnect : function() {
				onDisconnected('Disconnected.');
			},
			close : function(reason) {
				onDisconnected(reason.message || 'Unknown closure reason');
			}
		});
	});
}

/**
 * Called when a session is established, called in the callbacks within the
 * session creation
 * 
 * @param session =>
 *            new session
 */
function onConnected(session) {
	status('Connected as <b>' + Reappt.principal() + '</b>');
	$('#chat-with-user').show();
	groupAllSubscribe();
	userChatSubscriptions();
}

/**
 * Called when a disconnect (for one of many reasons) happens. Called from the
 * callbacks within the session creation
 * 
 * @param msg =>
 *            html to update <b>status()</b> with
 * 
 */
function onDisconnected(msg) {
	status(msg || 'Disconnected.');
	$('#disconnect-button').hide();
	$('#newuser-show-form-button').show();
	$('#connect-button').show();
	$('#chat-with-user').hide();
	// $('#add-friend').hide();
}

/**
 * Called when the Disconnect button is pressed.
 */
function disconnect() {
	Reappt.disconnect({
		before : function() {
			status('Disconnecting...');
		},
		after : function() {
			$('#disconnect-button').hide();
		}
	});
}

/*******************************************************************************
 * @regionend connect
 ******************************************************************************/
