Ext.define('EatSense.util.Translations',{
	statics: {
		data: {
	
		// General translations
		"ok" : {
			"DE" :  "OK",
			"EN" :  "OK"
		},
		"cancel" : {
			"DE" :  "Abbrechen",
			"EN" :  "Cancel"
		},
		"back" : {
			"DE" :  "Zurück",
			"EN" :  "Back"
		},
		"change" : {
			"DE" :  "Ändern",
			"EN" :  "Change"
		},
		"barcode" : {
			"DE" :  "Barcode",
			"EN" :  "Bar code"
		},
		"close" : {
			"DE" :  "Schliessen",
			"EN" :  "Close"
		},
		"loadingMsg" : {
			"DE" :  "Laden ...",
			"EN" :  "Loading ..."
		},
		"general.processing" : {
			"DE" :  "In Bearbeitung ...",
			"EN" :  "Processing ..."
		},
		"general.credentials.invalid" : {
			"DE" :  "Passwort und/oder Benutzername falsch!",
			"EN" :  "Password and/or user name incorrect!"
		},
		"general.comingsoon" : {
			"DE" :  "Demnächst",
			"EN" :  "Coming soon"
		},
		"general.legalnotice" : {
			"DE" : "Impressum",
			"EN" : "Legal Notice"
		},
		"save" : {
			"DE" :  "Speichern",
			"EN" :  "Save"
		},
		"hint" : {
			"DE" :  "Hinweis",
			"EN" :  "Message"
		},
		"success" : {
			"DE" :  "Erfolg",
			"EN" :  "Success"
		},
		"yes" : {
			"DE" :  "Ja",
			"EN" :  "Yes"
		},
		"no" : {
			"DE" :  "Nein",
			"EN" :  "No"
		},
		"or" : {
			"DE" : "oder",
			"EN" : "or"
		},
		"continue" : {
			"DE" :  "Weiter",
			"EN" :  "Next"
		},
		"leave" : {
			"DE" :  "Verlassen",
			"EN" :  "Quit"
		},
		"channelTokenError" : {
			"DE" :  "Updates im Hintergrund nicht funktionsfähig.",
			"EN" :  "Updates have been successful."
		},
		"android.backbutton.exit" : {
			"DE" :  "Nochmal drücken, um zu beenden.",
			"EN" :  "Please confirm to close."
		},
		// main menu
		"checkInButton" : {
			"DE" :  "Check-in",
			"EN" :  "Check-in"
		},
		"currentDealsButton" : {
			"DE" :  "Deals",
			"EN" :  "Deals"
		},
		"newRestaurantsButton" : {
			"DE" :  "Neue Restaurants",
			"EN" :  "New Locations"
		},
		"settingsButton" : {
			"DE" :  "Profil",
			"EN" :  "Profile"
		},
		//Dashboard
		"dashboard.button.checkin" : {
			"DE" :  "Check-in",
			"EN" :  "Check-in"
		},
		"dashboardLabel1" : {
			"DE" :  "<h2>Service At Its Peak</h2><p>cloobster, your personal concierge.<br/>"+
			"Check in and enjoy our service.</p>",
			"EN" : "<h2>Service At Its Peak</h2><p>cloobster, your personal concierge.<br/>"+
			"Check in and enjoy our service.</p>",
		},
		"dashboardLabel2" : {
			"DE" :  "1. Einchecken<br/>2. Bestellen<br/>3. Genießen",
			"EN" :  "1. Check in<br/>2. Order<br/>3. Enjoy"
		},
		"dashboard.button.settings" : {
			"DE" : "Profil",
			"EN" : "Profile"
		},
		// Checkin
		"checkInTitle" : {
			"DE" :  "Check-in",
			"EN" :  "Check-in"
		},
		"barcodePromptTitle" : {
			"DE" :  "Barcode-Abfrage",
			"EN" :  "Read bar code"
		},
		"barcodePromptText" : {
			"DE" :  "Bitte Barcode eingeben.",
			"EN" :  "Please enter bar code."
		},
		"checkInStep1Label1" : {
			"DE" :  "Bitte einen Spitznamen wählen.",
			"EN" :  "Please choose an alias."
		},
		"refreshNicknameBt" : {
			"DE" :  "Neu",
			"EN" :  "New"
		},
		"checkInStep1Button" : {
			"DE" :  "Los geht's",
			"EN" :  "Continue"
		},
		"nicknameToggleHint" : {
			"DE" :  "Nein/Ja",
			"EN" :  "No/Yes"
		},
		"checkInStep2Label1" : {
			"DE" :  "Andere haben hier bereits eingecheckt.",
			"EN" :  "Someone else has checked in at this location."
		},
		"checkInStep2Label2" : {
			"DE" :  "Mit einer anderen Person einchecken?",
			"EN" :  "Share check-in location with someone else?"
		},
		"checkInStep2OnMyOwnButton" : {
			"DE" :  "Ich bin alleine hier.",
			"EN" :  "I am on my own."
		},
		"checkInErrorBarcode" : {
			"DE" :  "Der Barcode ist nicht valide oder inaktiv!",
			"EN" :  "Bar code is not valid or inactive."
		},
		"checkInErrorNickname" : {
			"DE" :  "Der Spitzname muss zwischen {0} und {1} Zeichen lang sein.",
			"EN" :  "Alias must be between {0} and {1} characters."
		},
		"checkInErrorNicknameExists" : {
			"DE" :  "Der Spitzname wird an diesem Ort bereits benutzt.",
			"EN" :  "Alias already in use at this location."
		},
		"saveNicknameToggle" : {
			"DE" :  "Spitzname speichern?",
			"EN" :  "Save alias?"
		},
		"checkInCanceled" : {
			"DE" :  "Sitzung wurde durch Servicepersonal beendet.",
			"EN" :  "Session has been closed."
		},
		"nickname" : {
			"DE" :  "Spitzname",
			"EN" :  "Alias"
		},
		"restoreStateLoading" : {
			"DE" :  "Aktiver Check-in wird geladen ...",
			"EN" :  "Check-in in progress ..."
		},
		"restoreStateFailed" : {
			"DE" :  "Check-in nicht mehr gültig.<br/>Bitte neu einchecken.",
			"EN" :  "Check-in invalid.<br/>Please try again."
		},
		// Menu
		"menuTab" : {
			"DE" :  "Bestellen",
			"EN" :  "Order"
		},
		"menuTitle" : {
			"DE" :  "Unser Angebot",
			"EN" :  "Our Offer"
		},
		"choicesPanelTitle" : {
			"DE" :  "Bitte wählen Sie",
			"EN" :  "Please choose"
		},
		"putIntoCartButton" : {
			"DE" :  "Bestellzettel",
			"EN" :  "Add to cart"
		},
		"choiceValErrMandatory" : {
			"DE" :  "Bitte eine Auswahl treffen für {0}.",
			"EN" :  "Please make a choice for {0}."
		},
		"choiceValErrMin" : {
			"DE" :  "Bitte min. {0} Option(en) in {1} auswählen.",
			"EN" :  "Please select at least {0} option(s) in {1}."
		},
		"choiceValErrMax" : {
			"DE" :  "Bitte max. {0} Optionen in {1} auswählen.",
			"EN" :  "Please do not exceed {0} option(s) in {1}."
		},
		"menu.product.detail.loading" : {
			"DE" :  "Lade Produktdaten...",
			"EN" :  "Loading products"
		},
		//Order
		"orderInvalid" : {
			"DE" :  "Bitte Auswahl überprüfen.",
			"EN" :  "Please confirm your choice."
		},
		"orderPlaced" : {
			"DE" :  "Bestellung im Warenkorb.",
			"EN" :  "Add to cart."
		},
		"cartEmpty" : {
			"DE" :  "Noch keine Bestellung getätigt.",
			"EN" :  "No existing order."
		},
		"productPutIntoCardMsg" : {
			"DE" :  "{0} auf Bestellzettel geparkt.",
			"EN" :  "{0} added to cart."
		},
		"orderRemoved" : {
			"DE" :  "Bestellung entfernt.",
			"EN" :  "Order deleted."
		},
		"orderComment" : {
			"DE" :  "Besondere Wünsche?",
			"EN" :  "Add your comments here:"
		},
		"amount" : {
			"DE" :  "Menge",
			"EN" :  "Amount"
		},
		"amountspinnerLabel" : {
			"DE" :  "Ich will ...",
			"EN" :  "I like ..."
		},
		"orderSubmit" : {
			"DE" :  "Bestellung abgeschickt ...<br/>Guten Appetit!",
			"EN" :  "Order sent ...<br/>Enjoy your meal!"
		},
		"productCartBt" : {
			"DE" :  "Bestellzettel",
			"EN" :  "Add to cart"
		},
		"orderCanceled" : {
			"DE" :  "{0} wurde storniert.",
			"EN" :  "{0} has been canceled."
		},
		//Cart
		"cartviewTitle" : {
			"DE" :  "Bestellung",
			"EN" :  "Order"
		},
		"cartTabBt" : {
			"DE" :  "Bestellzettel",
			"EN" :  "Cart"
		},
		"dumpCart" : {
			"DE" :  "Bestellzettel leeren?",
			"EN" :  "Empty cart?"
		},
		"dumpItem" : {
			"DE" :  "{0} entfernen?",
			"EN" :  "Cancel {0}?"
		},
		"submitButton" : {
			"DE" :  "Senden",
			"EN" :  "Send"
		},
		"submitOrderProcess" : {
			"DE" :  "Schicke Bestellung ...",
			"EN" :  "Sending order ..."
		},
		"submitOrdersQuestion" : {
			"DE" :  "Bestellung verbindlich abschicken?",
			"EN" :  "Confirm & send order?"
		},
		"cart.button.deleteall" : {
			"DE" :  "Löschen",
			"EN" :  "Delete"
		},
		//Lounge Dashboard
		"clubdashboard.tab.title" : {
			"DE" :  "Home",
			"EN" :  "Home"
		},
		"clubdashboard.label.description" : {
			"DE" :  "<h2>Guten Tag {0}</h2><p>Herzlich Willkommen im</p><p>\"{1}\"</p>",
			"EN" :  "<h2>Welcome {0}</h2><p>You have checked into</p><p>\"{1}\"</p>"
		},
		"clubdashboard.button.vip" : {
			"DE" :  "VIP Call",
			"EN" :  "VIP Call"
		},
		"clubdashboard.button.feedback" : {
			"DE" :  "Feedback",
			"EN" :  "Feedback"
		},
		"clubdashboard.button.info" : {
			"DE" :  "Info",
			"EN" :  "Info"
		},
		"clubdashboard.button.events" : {
			"DE" :  "Events",
			"EN" :  "Events"
		},
		"clubdashboard.button.aroundme" : {
			"DE" :  "Around me",
			"EN" : "Around me"
		},
		"clubdashboard.button.exit" : {
			"DE" :  "Check-out",
			"EN" :  "Check-out"
		},
		"clubdashboard.leave.message" : {
			"DE" :  "Wirklich verlassen?",
			"EN" :  "Do you want to quit?"
		},
		//MyOrders
		"myOrdersTitle" : {
			"DE" :  "Bestellung",
			"EN" :  "Order"
		},
		"myOrdersTabBt" : {
			"DE" :  "Check-out",
			"EN" :  "Check-out"
		},
		"myOrdersTabLeaveBt" : {
			"DE" :  "Check-out",
			"EN" :  "Check-out"
		},
		"payRequestButton" : {
			"DE" :  "Bezahlen",
			"EN" :  "Bill"
		},
		"leaveButton" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave"
		},
		"orderTime" : {
			"DE" :  "Bestellzeit",
			"EN" :  "Order lead-time"
		},
		"myorderComment" : {
			"DE" :  "Meine Wünsche",
			"EN" :  "My order"
		},
		"myorders.description" : {
			"DE" :  "Hier werden Ihre abgeschickten Bestellungen angezeigt. Zur Zeit haben Sie nichts bestellt.",
			"EN" :  "Your ordered items are listed here. There are no recent orders."
		},
		//Payment Request
		"paymentPickerTitle" : {
			"DE" :  "Bezahlmethode",
			"EN" :  "Payment method"
		},
		"paymentRequestSend" : {
			"DE" :  "Bitte einen Moment warten,</br>die Rechnung wird vorbereitet ...",
			"EN" :  "One moment please,</br>bill is on the way ..."
		},
		"myorders.messages.billnew.message" : {
		 	"DE" :  "Ihre Rechnung ({0}) wurde erstellt.",
		 	"EN" : "Your bill ({0}) has been issued."
		 }, 
		//Settings
		"settingsTitle" : {
			"DE" :  "Profil",
			"EN" :  "Profile"
		},
		"nicknameDesc" : {
			"DE" :  "Der Spitzname ist der Anzeigename für das Servicepersonal.</br>Änderungen wirken sich erst beim nächsten Check-In aus.",
			"EN" :  "Alias is used to identify your order.</br>Change will take effect after you have checked in again."
		},
		"newsletterRegisterBt" : {
			"DE" :  "Registrieren",
			"EN" :  "Register"
		},
		"newsletterEmail" : {
			"DE" :  "E-Mail",
			"EN" :  "Email"
		},
		"newsletterRegisterSuccess" : {
			"DE" :  "Danke! Eine Bestätigungsmail wird an {0} geschickt.",
			"EN" :  "Thank you! Confirmation email will be sent to {0} shortly."
		},
		"newsletterInvalidEmail" : {
			"DE" :  "Bitte eine gültige E-Mail Adresse eingeben.",
			"EN" :  "Please enter a valid email address."
		},
		"newsletterDuplicateEmail" : {
			"DE" :  "Diese E-Mail Adresse ist bereits registriert.",
			"EN" :  "This email already exists."
		},
		"newsletterPopupTitle" : {
			"DE" :  "Newsletter abonnieren?",
			"EN" :  "Subscribe to newsletter?"
		}, 
		"newsletterDontAskButton" : {
			"DE" :  "Nicht mehr nachfragen!",
			"EN" :  "Please don't ask again!"
		},
		"newsletterLabel" : {
			"DE" :  "Nicht den Cloobster Big-Bang verpassen und für den Newsletter anmelden!",
			"EN" :  "Subscribe to newsletter!"
		},
		"settings.button.logout" : {
			"DE" : "Logout",
			"EN" : "Logout"
		},
		"settings.account.label.email" : {
			"DE" :  "Account E-Mail",
			"EN" :  "Account email address"
		},
		"settings.account.field.email" : {
			"DE" :  "E-Mail",
			"EN" :  "Email address"
		},
		"settings.account.button.email" : {
			"DE" :  "E-Mail ändern",
			"EN" :  "Change email address"
		},
		"settings.account.label.password" : {
			"DE" :  "Account Passwort",
			"EN" :  "Account password"
		},
		"settings.account.field.password" : {
			"DE" :  "Passwort",
			"EN" :  "Password"
		},
		"settings.account.button.password" : {
			"DE" :  "Passwort ändern",
			"EN" :  "Change password"
		},
		"settings.section.account" : {
			"DE" :  "Account-Daten",
			"EN" :  "Account data"
		},
		"settings.account.email" : {
			"DE" :  "E-Mail: {email}",
			"EN" :  "Email: {email}"
		},
		"settings.section.infos" : {
			"DE" :  "Weitere Infos",
			"EN" :  "Other data"
		},
		"emailsetting.title" : {
			"DE" :  "E-Mail ändern",
			"EN" :  "Change email address"
		},
		"emailsetting.password.field" : {
			"DE" :  "Passwort",
			"EN" :  "Password"
		},
		"emailsetting.email.field" : {
			"DE" :  "Neue E-Mail",
			"EN" :  "New email address"
		},
		"emailsetting.repeat.field" : {
			"DE" :  "E-Mail wiederholen",
			"EN" :  "Repeast email address"
		},
		"emailsetting.error.noemail" : {
			"DE" :  "Neue E-Mail darf nicht leer sein.",
			"EN" :  "New email address cannot be empty."
		},
		"emailsetting.error.invalidmail" : {
			"DE" :  "Ungültige E-Mail.",
			"EN" :  "Invalid email address."
		},
		"emailsetting.error.nopassword" : {
			"DE" :  "Passwort darf nicht leer sein.",
			"EN" :  "Password cannot be empty."
		},
		"emailsetting.error.emailmatch" : {
			"DE" :  "E-Mails stimmen nicht überein",
			"EN" :  "Email address does not match."
		},
		"emailsetting.success" : {
			"DE" :  "E-Mail erfolgreich geändert. Eine Bestätigung wurde an neue Adresse geschickt.",
			"EN" :  "Email address has been changed. A confirmation email has been sent to new address."
		},
		"passwordsetting.title" : {
			"DE" :  "Passwort ändern",
			"EN" :  "Change Pasword"
		},
		"passwordsetting.oldpassword.field" : {
			"DE" :  "Altes Passwort",
			"EN" :  "Old Password"
		},
		"passwordsetting.newpassword.field" : {
			"DE" :  "Neues Passwort",
			"EN" :  "New Password"
		},
		"passwordsetting.repeatpassword.field" : {
			"DE" :  "Passwort wiederholen",
			"EN" :  "Repeast password"
		},
		"passwordsetting.error.newpassword" : {
			"DE" :  "Neues Passwort darf nicht leer sein.",
			"EN" :  "New password cannot be empty."
		},
		"passwordsetting.error.passwordmatch" : {
			"DE" :  "Passwörter stimmen nicht überein",
			"EN" :  "Password does not match."
		},
		"passwordsetting.error.nopassword" : {
			"DE" :  "Altes Passwort darf nicht leer sein.",
			"EN" :  "Old password cannot be empty."
		},
		"passwordsetting.success" : {
			"DE" :  "Passwort erfolgreich geändert.",
			"EN" :  "Password has been changed."
		},
		//Request
		"errorRequest" : {
			"DE" :  "Anfrage konnte leider nicht bearbeitet werden.",
			"EN" :  "Request could not processed."
		},
		"requestsButton" : {
			"DE" :  "VIP",
			"EN" :  "VIP"
		},
		"requestsTitle" : {
			"DE" :  "VIP",
			"EN" :  "VIP"
		},
		"requestCallWaiterSendMsd" : {
			"DE" :  "Bitte einen Moment Geduld!<br>Es wird gleich jemand kommen.",
			"EN" :  "One moment please!<br>We'll be serving you any minute."
		},
		"callWaiterButton" : {
			"DE" :  "VIP Call",
			"EN" :  "VIP Call"
		},
		"callWaiterRequestBadge" : {
			"DE" :  "Sie haben uns gerufen.",
			"EN" :  "We'll be service you any minute."
		},
		"cancelCallWaiterRequest" : {
			"DE" :  "Danke, hat sich erledigt",
			"EN" :  "Cancel request"
		},
		"callWaiterCallHint" : {
			"DE" :  "Können wir für Sie da sein?",
			"EN" :  "What can we do for you?"
		},
		"callWaiterCancelHint" : {
			"DE" :  "Wir wurden gerufen und <br/>kommen so schnell wie möglich!",
			"EN" :  "We have been notified!<br>We'll be serving you any minute."
		},
		"vipGreetingMessage" : {
			"DE" :  "Willkommen <span style='font-weight:bold;'>{0}</span><br/>in Ihrem persönlichen VIP-Bereich!",
			"EN" :  "Welcome, <span style='font-weight:bold;'>{0}</span>,<br/> to your personal VIP area!"
		},
		//Feedback
		"feedback" : {
			"DE" :  "Feedback",
			"EN" :  "Feedback"
		},
		"feedbackLabel" : {
			"DE" :  "Sagen Sie uns Ihre Meinung.",
			"EN" :  "We value your feedback."
		},
		"feedbackQuestion" : {
			"DE" :  "Wie hat es Ihnen gefallen?",
			"EN" :  "Did you enjoy your stay?"
		},
		"feedbackComment" : {
			"DE" :  "Kommentar (optional)",
			"EN" :  "Comment (optional)"
		},
		"feedbackEmail" : {
			"DE" :  "E-Mail (optional)",
			"EN" :  "Email (optional)"
		},
		"feedbackCompleteTitle" : {
			"DE" :  "Feedback abgeschickt",
			"EN" :  "Feedback has been sent"
		},
		"feedbackCompleteMessage" : {
			"DE" :  "Vielen Dank für Ihre Meinung!",
			"EN" :  "Thank you for your feedback!"
		},
		//Login
		"login.title" : {
			"DE" :  "User Login",
			"EN" :  "User login"
		},
		"login.field.email.placeholder" : {
			"DE" :  "E-Mail",
			"EN" :  "Email"
		},
		"login.field.password.placeholder" : {
			"DE" :  "Passwort",
			"EN" :  "Password"
		},
		"login.button.login" : {
			"DE" :  "Login",
			"EN" :  "Login"
		},
		"login.button.signup" : {
			"DE" :  "Signup",
			"EN" :  "Sign-up"
		},
		"login.button.signupfb" : {
			"DE" :  "Login mit Facebook",
			"EN" :  "Login using Facebook"
		},
		"login.label.notamember" : {
			"DE" :  "Kein Mitglied?",
			"EN" :  "Not a member?"
		},
		"account.signup.confirm.title" : {
			"DE" :  "Werde Mitglied ...",
			"EN" :  "Register ..."
		},
		"account.signup.confirm.message" : {
			"DE" :  "Bei Cloobster registrieren?",
			"EN" :  "Register?"
		},
		"account.signupfb.confirm.message" : {
			"DE" :  "Cloobster Account mit Facebook Daten anlegen?",
			"EN" :  "Register?"
		},
		"account.signup.success.title" : {
			"DE" :  "Willkommen bei Cloobster",
			"EN" :  "Welcome to cloobster"
		},
		"account.signup.success.message" : {
			"DE" :  "Danke, dass Sie sich registriert haben!<br/>",
			"EN" :  "Thank you for your registration!<br/>"
		},
		"account.logout.confirm.title" : {
			"DE" :  "Abmelden",
			"EN" :  "Log-out"
		},
		"account.logout.confirm.message" : {
			"DE" :  "Möchten Sie sich abmelden?<br/>Zukünftige Check-ins tauchen nicht unter \"My Places auf\"!",
			"EN" :  "Do you want to log out? Future Check-ins won't show up under \"My Places auf\"!"
		},
		//history
		"history.title" : {
			"DE" :  "My Places",
			"EN" :  "My places"
		},
		"dashboard.button.history" : {
			"DE" :  "My Places",
			"EN" :  "My places"
		},
		"history.detail.title" : {
			"DE" :  "Rechnung",
			"EN" :  "Bill"
		},
		"history.detail.list.paging" : {
			"DE" :  "Mehr laden ...",
			"EN" :  "Show more ..."
		},
		"history.noaccount" : {
			"DE" :  "Bitte loggen Sie sich ein oder registrieren Sie sich, um diese Funktion zu nutzen.",
			"EN" :  "You need to register/login to use this function."
		},
		"history.list.description" : {
			"DE" :  "Hier werden Ihre besuchten Orte aufgelistet. Sie haben noch keine Orte besucht.",
			"EN" :  "Places you have visited. No hits."
		},
		//social
		"social.checkin" : {
			"DE" :  "Hat gerade eingecheckt bei {0}.",
			"EN" : "Has just checked in at {0}."
		},
		//errors
		"error" : {
			"DE" :  "Fehler",
			"EN" :  "Error"
		},
		"errorTitle" : {
			"DE" :  "Fehler",
			"EN" :  "Error"
		},		
		"errorMsg" : {
			"DE" :  "Entschuldigung! Ein Fehler ist aufgetreten.<br/>Wir kümmern uns darum!",
			"EN" :  "We apologies! An error has occurred.<br/>We'll fix it as soon as possible."
		},
		"errorResource" : {
			"DE" :  "Daten konnten nicht vom Server geladen werden.",
			"EN" :  "Data error... Connection to server has failed."
		},
		"errorPermission" : {
			"DE" :  "Sitzung ist ungültig.",
			"EN" :  "Session is invalid."
		},
		"errorCommunication" : {
			"DE" :  "Es kann keine Verbindung zum Server hergestellt werden.<br/>Bitte probiere es noch einmal.",
			"EN" :  "Connection to server failed.<br/ Please try again."
		},
		"error.menu.needsrefresh" : {
			"DE" :  "Auswahl nicht mehr aktuell. Bitte führen Sie die Bestellung nochmals durch.",
			"EN" :  "Your order has been changed. Please order again."
		},
		"error.account.email.exists" : {
			"DE" :  "Diese E-Mail wird bereits verwendet.",
			"EN" :  "Email address exists."
		},
		"error.account.email" : {
			"DE" :  "Bitte geben Sie eine gültige E-Mail ein.",
			"EN" :  "Please enter a valid email address."
		},
		"error.account.password" : {
			"DE" :  "Passwort muss min. 6 Zeichen besitzen. Darunter 1 Zahl oder 1 Sonderzeichen.",
			"EN" :  "Password must have 6 characters including 1 number or special character."
		},
		"error.account.nocredentials" : {
			"DE" :  "Bitte geben Sie Ihre Zugangsdaten ein, um sich einzuloggen.",
			"EN" :  "Please enter user name and password to proceed."
		},
		"error.account.credentials.invalid" : {
			"DE" :  "Gespeicherte Zugangsdaten ungültig. Bitte neu einloggen.",
			"EN" :  "Login data invalid. Please log in again."
		},
		
	}
	}
});