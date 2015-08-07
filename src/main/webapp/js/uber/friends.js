/*******************************************************************************
 * @region friends
 * 
 * Friend fxns
 * 
 ******************************************************************************/

var friendMetadata = new diffusion.metadata.RecordContent();
var friendRecord = friendMetadata.addRecord('friend', friendMetadata.occurs(0,
		1000));
friendRecord.addField('username', friendMetadata.string());
friendRecord.addField('status', friendMetadata.string());

function testRecordMd(username, status) {
	if (mySession) {
		var builder = friendMetadata.builder();
		builder.add('friend', {
			'username' : username,
			'status' : status
		});
		mySession.topics.update('JB-Test/Records', builder.build()).on(
				{
					complete : function() {
						console.log('successfully updated');
					},
					error : function(err) {
						console.log('error trying to update testRecordMd: '
								+ err.message);
					}
				});
	}
}

/** @deprecated */
function chatWithFriend(name) {
	createChatWithUser(name);
}

/** @deprecated */
function addRecordTopic() {
	if (mySession) {
		mySession.topics.add('JB-Test/Records', friendMetadata).on(
				{
					complete : function() {
						console.log('created record topic');
					},
					error : function(err) {
						console.log('failed to create record topic because : '
								+ err.message);
					}
				});
	}
}

/** @deprecated */
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

/** @deprecated */
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

/** @deprecated */
function removeFriend(name) {
	if ($('#friend-list-friend-' + name).length > 0) {
		$('#friend-list-friend-' + name).remove();
	}
}

/** @deprecated */
function updateFriend(value, name) {
	if ($('#friend-list-friend-' + name).length > 0) {
		$('#friend-list-friend-' + name).val(
				'Chat with ' + name + ' [' + value + ']');
	}
}

/** @deprecated */
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

/*******************************************************************************
 * @regionend friends
 ******************************************************************************/
