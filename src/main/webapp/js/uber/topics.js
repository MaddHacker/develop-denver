/*******************************************************************************
 * @region topics
 * 
 * TopicTree definitions
 * 
 ******************************************************************************/

function TopicTreeDefinition() {
}

var Topics = TopicTreeDefinition.prototype = {
	/**
	 * Static strings as constants, so we can easily change them to avoid name
	 * conflicts
	 */

	_root : 'ReapptChat',
	_rooms : 'Rooms',
	_roomMessages : 'Messages',
	_users : 'Users',
	_chats : 'Chats',
	_friends : 'Friends',
	_status : 'Status',

	/**
	 * Represents the base user topic (holds all users under it)
	 * 
	 * @return {String} path
	 */
	_baseUsers : function() {
		return this._root + '/' + this._users;
	},

	/**
	 * Base topic for a user
	 * 
	 * @param user =>
	 *            string user name (principal)
	 * @return {String} path
	 */
	userBase : function(user) {
		return this._baseUsers() + '/' + user;
	},

	/**
	 * Base chat topic for a user
	 * 
	 * @param user =>
	 *            string user name (principal)
	 * @return {String} path
	 */
	userChats : function(user) {
		return this.userBase(user) + '/' + this._chats;
	},

	/**
	 * Chat topic for a user with a chatTo user
	 * 
	 * @param user =>
	 *            string user name (principal) who is the sender
	 * @param chatTo =>
	 *            string user name (principal) who is the reciever
	 * @return {String} path
	 */
	userChatTo : function(user, chatTo) {
		return this.userChats(user) + '/' + chatTo;
	},

	/**
	 * Gets the user name from the topic path string, provided the topic path
	 * string is a chatTo string
	 * 
	 * @topic => string that represents topic path
	 * @return {String} user name
	 * 
	 * @see userChatTo(user,chatTo)
	 */
	userNameFromChatToTopic : function(topic) {
		return (topic && topic.startsWith(this._baseUsers())) ? topic
				.split('/')[4] : '';
	},

	/**
	 * Chat topic to a user from a chatFrom user
	 * 
	 * @param user =>
	 *            string user name (principal) who is the reciever
	 * @param chatFrom =>
	 *            string user name (principal) who is the sender
	 * @return {String} path
	 */
	userChatFrom : function(user, chatFrom) {
		return this.userChats(chatFrom) + '/' + user;
	},

	/**
	 * Gets the user name from the topic path string, provided the topic path
	 * string is a chatFrom string
	 * 
	 * @topic => string that represents topic path
	 * @return {String} user name
	 * 
	 * @see userChatFrom(user,chatFrom)
	 */
	userNameFromChatFromTopic : function(topic) {
		return (topic && topic.startsWith(this._baseUsers())) ? topic
				.split('/')[2] : '';
	},

	/**
	 * Represents the base room topic (holds all rooms under it)
	 * 
	 * @return {String} path
	 */
	roomBase : function() {
		return this._root + '/' + this._rooms;
	},

	/**
	 * Chat topic for a given room, holds all users
	 * 
	 * @param room =>
	 *            string room name
	 * @return {String} path
	 */
	roomChat : function(room) {
		return this.roomBase() + '/' + room.replaceAll(' ', '_');
	},

	/**
	 * Segment messages in a room to allow for other information to be provided
	 * about the room
	 * 
	 * @param room =>
	 *            string room name
	 * @return {String} path
	 */
	roomChatMessages : function(room) {
		return this.roomChat(room) + '/' + this._roomMessages;
	},

	/**
	 * Chat topic for a given room, and the given user's send topic
	 * 
	 * @param room =>
	 *            string room name
	 * @param user =>
	 *            string user name (principal)
	 * @return {String} path
	 */
	roomChatUser : function(room, user) {
		return this.roomChatMessages(room) + '/' + user;
	},

	/**
	 * Gets the room name from the topic path string
	 * 
	 * @topic => string that represents topic path
	 * @return {String} room name
	 */
	roomNameFromTopic : function(topic) {
		return (topic && topic.startsWith(this.roomBase())) ? topic.split('/')[2]
				: '';
	},

	/**
	 * Gets the publishing user name from the topic path string
	 * 
	 * @topic => string that represents full topic path
	 * @return {String} user name
	 */
	roomUserNameFromTopic : function(topic) {
		return (topic && topic.startsWith(this.roomBase())) ? topic.split('/')[4]
				: '';
	}
};

/*******************************************************************************
 * @regionend topics
 ******************************************************************************/
