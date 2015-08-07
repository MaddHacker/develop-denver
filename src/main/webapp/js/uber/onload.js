/*******************************************************************************
 * @region onload
 * 
 * Onload fxns
 * 
 ******************************************************************************/

$(function() {

	/**
	 * Make sure all button hover states work
	 */
	$('button.ui-button').each(function(i, el) {
		$(el).bind("mouseover mouseout", function() {
			$(el).toggleClass('ui-state-hover');
		});
	});

	/**
	 * support <enter> keypress on add chat box
	 */
	$('#addchat-username').keyup(function(event) {
		if (event.keyCode == 13) {
			createChat();
		}
	});
});

/*******************************************************************************
 * @regionend onload
 ******************************************************************************/
