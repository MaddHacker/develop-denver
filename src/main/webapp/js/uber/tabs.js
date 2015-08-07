/*******************************************************************************
 * @region tabs
 * 
 * Setup and control chat tabs
 * 
 ******************************************************************************/

/**
 * Handle for all the tabs, since jQuery tabs really suck when it comes to
 * dynamic addition/removal
 */
var chatTabs;

/**
 * Method to force tabs to re-render once they've been updated
 */
function addOrRefreshTabs() {
	if (!chatTabs) {
		chatTabs = $('#chat-tabs').tabs();
	} else {
		chatTabs.tabs('refresh');
	}
	chatTabs.addClass("ui-tabs-vertical ui-helper-clearfix");
	$("#chat-tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
}

/**
 * Render all the tabs;
 */
addOrRefreshTabs();

/**
 * Adds a tab to the chat, will call <b>addOrRefreshTabs()</b> once complete
 * 
 * @param name =>
 *            string that represents the user or group name, depending on the
 *            isGroup flag
 * @param isGroup =>
 *            boolean to designate a tab as group or one-to-one chat
 */
function addChatTab(name, isGroup) {
	if (!isChatOpen(name)) {
		var tabId = 'chat-with-' + name.replaceAll(' ', '-');

		var tabHref = '#' + tabId;

		chatTabs.find('.ui-tabs-nav')
				.append(
						'<li><a href="'
								+ tabHref
								+ '"><span class="'
								+ ((isGroup) ? 'group-chat-label'
										: 'user-chat-label') + '">'
								+ name.replaceAll('_', ' ')
								+ '</span></a></li>');

		chatTabs.append('<div id="' + tabId + '">'
				+ $('#chat-window-template').html() + '</div>');
		$('#' + tabId).attr(((isGroup) ? 'groupname' : 'username'),
				name.replaceAll(' ', '-'));
		addOrRefreshTabs();
		chatTabs.tabs({
			active : chatTabs.children('div').length - 1
		});

		$('#' + tabId + ' button').bind("mouseover mouseout", function() {
			$('#' + tabId + ' button').toggleClass('ui-state-hover');
		});

		$('#' + tabId + ' input').keyup(function() {
			if (event.keyCode == 13) {
				sendChatMessage($('#' + tabId + ' input'));
			}
		});
	}
}

/**
 * Just a check to see if a tab is open
 * 
 * @param name =>
 *            name of the tab
 * @returns {Boolean} => <b>true</b> if we have a tab, <b>false</b> otherwise
 */
function isChatOpen(name) {
	return !($('#chat-with-' + name.replaceAll(' ', '-')).length === 0);
}

/**
 * Brute force to make the UI pretty...
 * 
 * @param name =>
 *            name of tab (short name anyway)
 */
function selectTabByName(name) {
	var tmp = chatTabs.children('div');
	for (var i = 0; i < tmp.length; i++) {
		if ($(tmp[i]).attr('id') === 'chat-with-' + name.replaceAll(' ', '-')) {
			chatTabs.tabs({
				active : i
			});
			break;
		}
	}
}

/*******************************************************************************
 * @regionend tabs
 ******************************************************************************/
