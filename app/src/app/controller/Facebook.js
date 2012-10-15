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
		var me = this,
			accountCtr = this.getApplication().getController('Account'),
			authResponse;

		console.log('Facebook.signupFbButtonHandler');
		FB.login(function(response) {
            if (response.authResponse) {
                // Fb login success.
                // Now get user data.
                authResponse = response.authResponse;

                FB.api('/me', function(response) {
                	console.log('Facebook.signupFbButtonHandler > retrieved fb user with id='+response.id);

                	//add access token from authResponse
                	response.accessToken = authResponse.accessToken;

                	accountCtr.login(response, callback);

                	function callback() {
                		//user does not exist, ask user to create account
	                	if(!accountCtr.getAccount()) {
	                		accountCtr.showSignupConfimDialog(response);	
	                	}
                	}
                	
                });
            } else {
            	//no further interaction needed since the sdk does all the stuff
                console.log('Facebook.signupFbButtonHandler > user canceled or did not finish.')
            }
            },
                { scope: "email" }
            );
	},
	/**
	* Does a simple facebook wall post for the logged in user.
	*/
	postOnWall: function(text) {
  		 // calling the API ...
        var obj = {
          method: 'feed',
          link: 'http://www.cloobster.com',
          // picture: 'http://fbrell.com/f8.jpg',
          name: 'cloobster CheckIn',
          caption: 'Service at its peak.',
          description: text
        };

        function callback(response) {
          // document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
        }

        FB.ui(obj, callback);
	},
	/**
	*
	*/
	fbLogout: function() {
		console.log('Facebook.fbLogout');
		FB.logout();
	}
});