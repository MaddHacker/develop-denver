var MyTopics = {
	ROOT : {
		value : 'ReapptChat'
	},
	USERS : {
		value : 'Users'
	},
	CHATS : {
		value : 'Chats'
	},
	FRIENDS : {
		value : 'Friends'
	},
	STATUS : {
		value : 'Status'
	}
};

var friendMetadata = new diffusion.metadata.RecordContent();
var friendRecord = friendMetadata.addRecord('friend', friendMetadata.occurs(0,
		1000), {
	'username' : friendMetadata.string(),
	'status' : friendMetadata.string()
});

function status(msg) {
	$('#connection-status').html(msg);
}

function connect() {
	$('#connect-button').hide();
	$('#disconnect-button').show();
	connectDiffusion();
}

var myPrincipal;
var mySession;

function connectDiffusion() {
	$('#newuser-show-form-button').hide();
	$('#newuser-form').hide();
	myPrincipal = $('#login-username').val();
	mySession = diffusion.connect({
		host : $('#login-host').val(),
		// port : 8081,
		// port : 80,
		port : $('#login-port').val(),
		ssl : false,
		credentials : {
			principal : myPrincipal,
			password : $('#login-password').val()
		}
	}).on({
		connect : onSessionConnect,
		error : function(err) {

		},
		disconnect : function() {
			onDisconnect();
		},
		reconnect : function() {
		},
		close : function(reason) {
			onDisconnect();
		}
	});
}

function onSessionConnect(session) {
	status('Connected with id ' + session.sessionID);
	$('#chat-with-user').show();
	$('#add-friend').show();
	var myTopic = userTopic(myPrincipal);
	// session.topics.add(myTopic + '/Friends', friendMetadata).on({
	session.topics
			.add(myTopic + '/Friends', new diffusion.metadata.Stateless()).on(
					{
						complete : function() {
							console.log('Created friends topic for user: '
									+ myPrincipal);
						},
						error : function(err) {
							console.log('Error on creating friends topic: '
									+ err);
						}
					});
	session.topics.add(myTopic + '/Status', 'Online');

	session.subscribe('?' + MyTopics.ROOT.value + '/Rooms/.*/Users').on({
		update : function(value, topic) {
			addOrUpdateGroup(value, topic);
		},
		subscribed : function(details, topic) {
			console.log('subscribed to ' + topic);
			if (topic.split('/')[2]) {
				addGroup(topic.split('/')[2]);
			}
		},
		unsubscribed : function(reason, topic) {
			if (topic.split('/')[2]) {
				removeGroup(topic.split('/')[2]);
			}
		}
	});
	session.subscribe('?' + myTopic + '/Friends/').on({
		update : function(value, topic) {
			addOrUpdateFriend(value, topic);
		},
		subscribed : function(details, topic) {
			console.log('subscribed to ' + topic);
			var topics = topic.split('/');
			addFriend(topics[topics.length - 1]);
		},
		unsubscribed : function(reason, topic) {
			var topics = topic.split('/');
			removeFriend(topics[topics.length - 1]);
		}
	});
}

function addOrUpdateFriend(value, topic) {
	// var content = friendMetadata.parse(value);
	// if (content.getRecord('friend') && content.getRecord('friend').length >
	// 0) {
	// content.getRecord('friend').forEach(function(rec) {
	// addFriend(rec.getField('username'));
	// updateFriend(rec.getField('status'), rec.getField('username'));
	// });
	// }
	var topics = topic.split('/');
	addFriend(topics[topics.length - 1]);
	updateFriend(value, topics[topics.length - 1]);
}

function addFriend(name) {
	if ($('#friend-list-friend-' + name).length == 0) {
		console.log('adding friend ' + name);
		$('#friend-list')
				.append(
						'<input id="friend-list-friend-'
								+ name
								+ '" type="button" onclick="javascript:chatWithFriend(\''
								+ name + '\');" value="Chat with ' + name
								+ '" />');
	}
}

function removeFriend(name) {
	if ($('#friend-list-friend-' + name).length > 0) {
		$('#friend-list-friend-' + name).remove();
	}
}

function updateFriend(value, name) {
	if ($('#friend-list-friend-' + name).length > 0) {
		$('#friend-list-friend-' + name).val(
				'Chat with ' + name + ' [' + value + ']');
	}
}

function addOrUpdateGroup(value, topic) {
	var groupName = topic.split('/')[2];
	addGroup(groupName);
	updateGroup(value, groupName);
}

function addGroup(groupName) {
	if ($('#group-list-group-' + groupName).length == 0) {
		console.log('adding group ' + groupName);
		$('#group-list')
				.append(
						'<input id="group-list-group-'
								+ groupName
								+ '" type="button" onclick="javascript:joinGroup(\''
								+ groupName + '\');" value="Join ' + groupName
								+ '" />');
	}
}

function removeGroup(groupName) {
	if ($('#group-list-group-' + groupName).length > 0) {
		$('#group-list-group-' + groupName).remove();
	}
}

function updateGroup(value, groupName) {
	if ($('#group-list-group-' + groupName).length > 0) {
		$('#group-list-group-' + groupName).val('Join ' + groupName + ' (' /*
																			 * +
																			 * value.split[','].length
																			 */
				+ ') [' + value + ']');
	}
}

function userTopic(username) {
	return MyTopics.ROOT.value + '/' + MyTopics.USERS.value + '/' + username;
}

function userSendChatTopic(chatUser) {
	return userTopic(myPrincipal) + '/Chats/' + chatUser;
}

function userRecieveChatTopic(chatUser) {
	return userTopic(chatUser) + '/Chats/' + myPrincipal;
}

function disconnect() {
	$('#disconnect-button').hide();
	status('Disconnecting...');
	mySession.close();
}

function onDisconnect() {
	status('Disconnected.');
	$('#newuser-show-form-button').show();
	$('#connect-button').show();
	$('#chat-with-user').hide();
	$('#add-friend').hide();
}

function joinGroup(name) {
	if (mySession) {
		generateChatWithGroup(name);
		mySession.subscribe(
				'?' + MyTopics.ROOT.value + '/Rooms/' + name + '/Messages//')
				.on(
						{
							update : function(value, topic) {
								console.log('updating message for group '
										+ name);
								console.log('     topic: ' + topic);
								console.log('     msg: ' + value);
								var tPath = topic.split('/');
								var user = tPath[tPath.length - 1];
								switch (user) {
								case 'Messages':
									messageFromSystem(name, value);
									break;
								case myPrincipal:
									messageFromSelf(name, value);
									break;
								default:
									messageFromOther(name, '<i>[' + user
											+ ']</i> ' + value);
									break;
								}
							},
							subscribed : function(details, topic) {
								console.log(name, 'Joined group ' + name);
							},
							unsubscribed : function(reason, topic) {
								messageFromSystem(name,
										'Group chat closed with ' + name
												+ ' because: ' + reason);
							}
						});
		mySession.topics.add(
				MyTopics.ROOT.value + '/Rooms/' + name + '/Messages/'
						+ myPrincipal, diffusion.metadata.Stateless()).on(
				{
					complete : function() {
						mySession.topics.update(MyTopics.ROOT.value + '/Rooms/'
								+ name + '/Messages', myPrincipal
								+ ' Connected');
						console
								.log('Created topic: ' + MyTopics.ROOT.value
										+ '/Rooms/' + name + '/Messages/'
										+ myPrincipal);
					},
					error : function(err) {
						console.log('Error on creating send chat topic:: '
								+ err);
					}
				});
	}
}

function createFriend() {
	if (mySession) {
		var user = $('#addfriend-username').val();
		/*
		 * Record
		 */
		// mySession.topics.update(userTopic(myPrincipal) + '/Friends',
		// friendMetadata.builder().add('friend', {
		// username : user,
		// status : 'unknown'
		// }).build()).on({
		// complete : function() {
		// $('addfriend-username').val('');
		// },
		// error : function(err) {
		// console.log('Error on adding friend: ' + err);
		// }
		// });
		/*
		 * SingleValue
		 */
		mySession.topics.add(userTopic(myPrincipal) + '/Friends/' + user,
				'status').on({
			complete : function() {
				console.log('Added friend : ' + user);
				$('#addfriend-username').val('');
			},
			error : function(err) {
				console.log('Error adding friend : ' + user);
			}
		});
	}
}

function createAccount() {
	var principal = $('#newuser-principal').val();
	var password = $('#newuser-password').val();
	var passwordConfirm = $('#newuser-password-confirm').val();
	if (password == passwordConfirm) {
		console.log('should call: \'Diffusion/newUser?principal=' + principal
				+ '&password=' + password + '\'');
	} else {
		$('#newuser-error').val('Password must match confirmation');
	}
}

function showCreateAccount() {
	$('#newuser-show-form-button').hide();
	$('#newuser-form').show();
}

function createChat() {
	createChatWithUser($('#addchat-username').val());
	$('#addchat-username').val('');
}

function chatWithFriend(name) {
	createChatWithUser(name);
}

function createChatWithUser(user) {
	if (mySession) {
		generateChatWithUser(user);
		mySession.subscribe(userRecieveChatTopic(user)).on(
				{
					update : function(value, topic) {
						console.log('updating message from ' + user);
						console.log('     msg: ' + value);
						messageFromOther(user, value);
					},
					subscribed : function(details, topic) {
						messageFromSystem(user, 'Chat initiated with ' + user);
					},
					unsubscribed : function(reason, topic) {
						messageFromSystem(user, 'Chat closed with ' + user
								+ ' because: ' + reason);
					}
				});
		mySession.topics.add(userSendChatTopic(user), user + ' Connected').on({
			complete : function() {
				console.log('Created topic: ' + userSendChatTopic(user));
			},
			error : function(err) {
				console.log('Error on creating send chat topic:: ' + err);
			}
		});
	}
}

function sendChatMessage(obj) {
	if ($(obj).attr('username')) {
		sendChatMessageToUser($(obj).attr('username'));
	} else if ($(obj).attr('groupname')) {
		sendChatMessageToGroup($(obj).attr('groupname'));
	}
}

function sendChatMessageToGroup(groupname) {
	var msg = $('#chat-with-' + groupname + ' textarea').val();
	if (mySession) {
		mySession.topics.update(
				MyTopics.ROOT.value + '/Rooms/' + groupname + '/Messages/'
						+ myPrincipal, msg).on(
				{
					complete : function() {
						console.log('updated topic: ' + MyTopics.ROOT.value
								+ '/Rooms/' + groupname + '/Messages/'
								+ myPrincipal);
						console.log('    value: ' + msg);
						// messageFromSelf(username, msg);
						$('#chat-with-' + groupname + ' textarea').val('');
					},
					error : function(err) {
						console.log('Error on creating send chat topic:: '
								+ err);
					}
				});

	}
}

function sendChatMessageToUser(username) {
	var msg = $('#chat-with-' + username + ' textarea').val();
	if (mySession) {
		mySession.topics.update(userSendChatTopic(username), msg).on({
			complete : function() {
				console.log('updated topic: ' + userSendChatTopic(username));
				console.log('    value: ' + msg);
				messageFromSelf(username, msg);
				$('#chat-with-' + username + ' textarea').val('');
			},
			error : function(err) {
				console.log('Error on creating send chat topic:: ' + err);
			}
		});

	}
}

function messageFromSystem(user, msg) {
	messageFrom(user, msg, 'system');
}

function messageFromSelf(user, msg) {
	messageFrom(user, msg, 'self');
}

function messageFromOther(user, msg) {
	messageFrom(user, msg, 'other');
}

function messageFrom(user, msg, clazz) {
	updateChatMessage(user, '<div class="message ' + clazz + '-message">' + msg
			+ '</div>');
}

function updateChatMessage(user, msg) {
	var divId = '#chat-with-' + user + ' span.history';
	$(divId).append(msg);
	$(divId).scrollTop($(divId)[0].scrollHeight);
}

function generateChatWithGroup(name) {
	generateChat(name, 'Chatting as part of group ' + name, true);
}

function generateChatWithUser(name) {
	generateChat(name, 'Chatting with ' + name, false);
}

function generateChat(name, title, isGroup) {
	$('#chat-windows').append(
			'<div id="chat-with-' + name
					+ '" class="chat-area"><p class="title">' + title + '</p>'
					+ $('#chat-window-template').html() + '</div>');
	$('#chat-with-' + name + ' input').attr(
			((isGroup) ? 'groupname' : 'username'), name);
}
