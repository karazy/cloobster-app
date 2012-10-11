/**
* Controller acts as a wrapper for Facebook SDK.
*/
Ext.define('EatSense.controller.Facebook', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.Login', 'EatSense.model.Account'],
	config: {
		refs: {
			signupFbButton : 'login button[action=signup-fb]',
		},
		control: {
			signupFbButton: {
				tap: 'signupFbButtonHandler'
			}
		}
	},

	/**
	* Tap event handler for signupFb button.
	* Calls the fb login method.
	*/
	signupFbButtonHandler: function() {
		console.log('Facebook.signupFbButtonHandler');
		FB.login(function(response) {
            if (response.authResponse) {
                // Fb login success.
                // Now get user data.
                FB.api('/me', function(response) {
                	Ext.Msg.alert('Facebook', 'Hello ' + response.name);
                });
            } else {
                console.log('Facebook.signupFbButtonHandler > Fb login failed.')
                // handle failed fb login here.
            }
            },
                { scope: "email" }
            );
	}
});