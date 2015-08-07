/*******************************************************************************
 * @region chat
 * 
 * Chat fxns
 * 
 ******************************************************************************/

/**
 * Subscriptions to send/recieve chat messages
 */
function userChatSubscriptions() {
	/**
	 * Subscribe to the chats that I send
	 */
	Reappt.subscribe('?' + Topics.userChatTo(Reappt.principal(), '.*'), {
		update : function(value, topic) {
			var user = Topics.userNameFromChatToTopic(topic);
			O.d('Updated message to user ' + user + ' on topic ' + topic);
			O.t('               msg: ' + value);
			messageFromSelf(user, value);
		},
		subscribed : function(details, topic) {
			var user = Topics.userNameFromChatToTopic(topic);
			O.d('Subscribed to chat with user: ' + user);
			addChatTab(user, false);
			Reappt.addTopic(Topics.userChatFrom(Reappt.principal(), user), '');
		}
	});
	/**
	 * Subscribe to the chats that I recieve
	 */
	Reappt.subscribe('?' + Topics.userChatFrom(Reappt.principal(), '.*'), {
		update : function(value, topic) {
			var user = Topics.userNameFromChatFromTopic(topic);
			O.d('Updated message from user ' + user + ' on topic ' + topic);
			O.t('               msg: ' + value);
			messageFromOther(user, value);
		},
		subscribed : function(details, topic) {
			var user = Topics.userNameFromChatFromTopic(topic);
			O.d('Subscribed to chat with user: ' + user);
			addChatTab(user, false);
			Reappt.addTopic(Topics.userChatTo(Reappt.principal(), user), '');
		}
	});
}

/**
 * Represents a system message => uses class 'system'
 * 
 * @param user =>
 *            user where chat message should go
 * @param msg =>
 *            content to send
 * 
 * @see messageFrom(user,msg,clazz)
 */
function messageFromSystem(user, msg) {
	messageFrom(user, msg, 'system');
}

/**
 * Represents a self message => uses class 'self'
 * 
 * @param user =>
 *            user where chat message should go
 * @param msg =>
 *            content to send
 * 
 * @see messageFrom(user,msg,clazz)
 */
function messageFromSelf(user, msg) {
	messageFrom(user, msg, 'self');
}

/**
 * Represents an incoming (non-system) message => uses class 'other'
 * 
 * @param user =>
 *            user where chat message should go
 * @param msg =>
 *            content to send
 * 
 * @see messageFrom(user,msg,clazz)
 */
function messageFromOther(user, msg) {
	messageFrom(user, msg, 'other');
}

/**
 * Send a message (of some sort) to a chat group/user adds css classes to
 * message and sanitizes the content
 * 
 * @param user =>
 *            user where chat message should go
 * @param msg =>
 *            string message to user <b>will be html sanitized</b>
 * @param clazz =>
 *            string of css classes to add (space delimited)
 * 
 * @see updateChatMessage(user,msg)
 */
function messageFrom(user, msg, clazz) {
	updateChatMessage(user, '<div class="message ' + clazz + '-message">'
	// ||| jbariel TODO => need to sanitize these, but also need to make sure
	// groups still work.
	// + String(msg).sanitize()
	+ msg + '</div>');
}

/**
 * Drops a message in a chat
 * 
 * @param user =>
 *            user where the chat message should go
 * @param msg =>
 *            content
 */
function updateChatMessage(user, msg) {
	var divId = '#chat-with-' + user + ' span.history';
	$(divId).append(msg);
	$(divId).scrollTop($(divId)[0].scrollHeight);
}

/**
 * Creates a chat with a given user, called when the button is clicked. if the
 * chat exists, we set focus on that window
 * 
 * @see createChatWithUser(user)
 */
function createChat() {
	if ($('#addchat-username').val()) {
		var user = $('#addchat-username').val();
		if (isChatOpen(user)) {
			selectTabByName(user);
		} else {
			addChatTab(user, false);
			Reappt.addTopic(Topics.userChatTo(Reappt.principal(), user), user
					+ ' Connected');
		}
		$('#addchat-username').val('');
	}
}

/**
 * Hokey but works for now, sends chat message (off of send button click or
 * <enter> press) and determines how to send based on attributes
 * (username/group)
 * 
 * @param obj =>
 *            calling object, parent has the info about the type
 */
function sendChatMessage(obj) {
	var el = $(obj).parent();
	var name, topicPath;
	if ($(el).attr('username')) {
		name = $(el).attr('username');
		topicPath = Topics.userChatTo(Reappt.principal(), name);
	} else if ($(el).attr('groupname')) {
		name = $(el).attr('groupname');
		topicPath = Topics.roomChatUser(name, Reappt.principal());
	}

	if (name && topicPath) {
		var msg = $('#chat-with-' + name + ' input').val();
		O.d('Attempting to update topic ' + topicPath);
		O.t('          msg: ' + msg);
		Reappt.updateTopic(topicPath, msg, {
			complete : function() {
				O.d('Updated topic ' + topicPath);
				O.t('       msg: ' + msg);
				$('#chat-with-' + name + ' input').val('');
			}
		});
	}
}

/*******************************************************************************
 * @regionend chat
 ******************************************************************************/
