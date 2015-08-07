/*******************************************************************************
 * @region newuser
 * 
 * Create account dialogs and actions
 * 
 ******************************************************************************/

/**
 * Sets up the createAccount dialog and displays it.
 */
function createAccountDialog() {
	$('#newuser-form').dialog({
		modal : true,
		draggable : false,
		minWidth : 400,
		minHeight : 300,
		close : function(event, ui) {
			$('#newuser-error').hide();
			$('#newuser-form input').each(function(i, el) {
				$(el).val('');
			});
		}
	});
}

/**
 * feedback on create (negative)
 * 
 * @param msg =>
 *            html message to render
 */
function showNewUserError(msg) {
	$('#newuser-error-message').html(msg);
	$('#newuser-error').show();
}

/**
 * feedback on create (affirmative)
 * 
 * @param msg =>
 *            html message to render
 */
function showNewUserCreated(msg) {
	$('#newuser-form').dialog('close');
	$('#newuser-created-message').html(msg);
	$('#newuser-created').show({
		effect : 'fade',
		duration : 1000
	}).delay(5000).hide({
		effect : 'fade',
		duration : 1000
	});

}

/**
 * Creates new account, feeds back one of the above methods
 * 
 * @see showNewUserError(msg)
 * @see showNewUserCreated(msg)
 */
function createAccount() {
	var principal = $('#newuser-principal').val();
	var password = $('#newuser-password').val();
	var passwordConfirm = $('#newuser-password-confirm').val();
	if (!principal || !password || !passwordConfirm) {
		showNewUserError('All fields are required!<br /><ul>'
				+ ((!principal) ? '<li>Username is required.</li>' : '')
				+ ((!password) ? '<li>Password is required.</li>' : '')
				+ ((!passwordConfirm) ? '<li>Password confirmation is required.</li>'
						: '') + '</ul>');
	} else if (password != passwordConfirm) {
		showNewUserError('Password must match confirmation');
	} else {
		$.ajax('/Diffusion/addUser', {
			data : 'principal=' + principal + '&password=' + password,
			method : 'GET',
			complete : function(jqXHR, textStatus) {
				if (jqXHR.status === 500) {
					showNewUserError(jqXHR.responseText);
				} else {
					showNewUserCreated(jqXHR.responseText);
				}
			}
		});
	}
}

/*******************************************************************************
 * @regionend newuser
 ******************************************************************************/
