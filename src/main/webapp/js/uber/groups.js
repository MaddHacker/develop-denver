/*******************************************************************************
 * @region groups
 * 
 * Group fxns
 * 
 ******************************************************************************/

/**
 * Basic subscription to all groups, so we can dynamically add/remove buttons.
 */
function groupAllSubscribe() {
	Reappt.subscribe('?' + Topics.roomBase() + '/', {
		subscribed : function(details, topic) {
			var roomName = Topics.roomNameFromTopic(topic);
			O.d('Subscribed to room: ' + roomName);
			addGroup(roomName);
		},
		unsubscribed : function(reason, topic) {
			var roomName = Topics.roomNameFromTopic(topic);
			O.d('Unubscribed to room: ' + roomName);
			O.d('          reason : ' + reason);
			removeGroup(roomName);
		}
	});
}

/**
 * Add a group button so we can participate in group chats
 * 
 * @param groupName
 */
function addGroup(groupName) {
	if (groupName && $('#group-list-group-' + groupName).length == 0) {
		O.d('adding group button for ' + groupName);
		$('#group-list')
				.append(
						'<button id="group-list-group-'
								+ groupName
								+ '" class="ui-button ui-state-default ui-corner-all ui-button-text-only" onclick="javascript:joinGroup(\''
								+ groupName
								+ '\');"><span class="ui-button-text">Join '
								+ groupName.replaceAll('_', ' ')
								+ '</span></button>');
		var el = $('#group-list-group-' + groupName);
		$(el).bind("mouseover mouseout", function() {
			$(el).toggleClass('ui-state-hover');
		});
	}
}

/**
 * Clean out a group that we're no longer interested in.
 * 
 * @param groupName
 */
function removeGroup(groupName) {
	if ($('#group-list-group-' + groupName).length > 0) {
		$('#group-list-group-' + groupName).remove();
	}
}

/**
 * Allows us to join a group and listen to the messages back and forth
 * 
 * @param name =>
 *            {string} group name
 */
function joinGroup(name) {
	if (isChatOpen(name)) {
		selectTabByName(name);
	} else {
		addChatTab(name, true);

		Reappt.subscribe('>' + Topics.roomChatMessages(name), {
			update : function(value, topic) {
				messageFromSystem(name, value);
			}
		});
		Reappt.subscribe('?' + Topics.roomChatMessages(name) + '/', {
			update : function(value, topic) {
				var user = Topics.roomUserNameFromTopic(topic);
				O.d('Update for group ' + name + ' by user: ' + user
						+ ' on topic: ' + topic);
				O.t('               msg: ' + value);
				if (user === Reappt.principal()) {
					messageFromSelf(name, value);
				} else {
					messageFromOther(name, '<i>[' + user + ']</i> ' + value);
				}
			}
		});

		Reappt.addTopic(Topics.roomChatUser(name, Reappt.principal()),
				diffusion.metadata.Stateless(), {
					complete : function() {
						Reappt.updateTopic(Topics.roomChatMessages(name),
								Reappt.principal() + ' Connected');
					}
				});
	}
}

/*******************************************************************************
 * @regionend groups
 ******************************************************************************/
