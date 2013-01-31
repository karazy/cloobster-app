Ext.define('EatSense.util.Translations',{
	statics: {
		//list all translated languages
		available: ["EN", "DE"],
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
		"general.about" : {
			"DE" :  "Information",
			"EN" :  "About"
		},
		"general.companydetail" : {
			"DE" : "Impressum",
			"EN" : "Legal Notice"
		},
		"general.legalnotice" : {
			"DE" : "AGB",
			"EN" : "Terms and conditions"
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
		"retry" : {
			"DE" :  "Wiederholen",
			"EN" : "Retry"
		},
		"channelTokenError" : {
			"DE" :  "Updates im Hintergrund nicht funktionsfähig.",
			"EN" :  "Updates have not been successful."
		},
		"android.backbutton.exit" : {
			"DE" :  "Nochmal drücken, um zu beenden.",
			"EN" :  "Please confirm to close."
		},
		"terms" : {
			"DE" :  "AGB",
			"EN" : "Terms"
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
		"slidenav.list.title" : {
			"DE" :  "Menü",
			"EN" : "Menu"
		},
		"slidenav.button.home" : {
			"DE" :  "Home",
			"EN" : "Home"
		},
		//Dashboard
		"dashboard.button.checkin" : {
			"DE" :  "<h2>Check-in</h2><p>Wenn du an einer cloobster Location bist</p>",
			"EN" :  "<h2>Check-in</h2><p>Scan QR code</p>"
		},
		"dashboardLabel1" : {
			"DE" :  "<h2>You Are Guest</h2><p>"+
			"Check in and enjoy our service.</p>",
			"EN" : "<h2>You Are Guest</h2><p>"+
			"Check in and enjoy our service.</p>"
		},
		"dashboardLabel2" : {
			"DE" :  "1. Einchecken<br/>2. Bestellen<br/>3. Genießen",
			"EN" :  "1. Check in<br/>2. Order<br/>3. Enjoy"
		},
		"dashboard.button.settings" : {
			"DE" : "<h2>Account</h2><p>Dein Profil, Facebook, E-Mail</p>",
			"EN" : "<h2>Account</h2><p>Your Profile, Facebook, e-mail</p>"
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
			// "DE" :  "Bitte einen Spitznamen wählen.",
			"DE" : "Mit welchem Namen<br/>möchtest du einchecken?",
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
			"DE" :  "Namen merken?",
			"EN" :  "Remember name?"
		},
		"checkInCanceled" : {
			"DE" :  "Sitzung wurde durch Servicepersonal beendet.",
			"EN" :  "Session has been closed."
		},
		"checkin.confirm.title" : {
			"DE" :  "Willkommen",
			"EN" : "Welcome"
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
		"checkin.nickname.palceholder" : {
			"DE" :  "z. B. Max Mustermann",
			"EN" : "e.g. John Doe"
		},
		// Menu
		"menuTab" : {
			"DE" :  "Angebote",
			"EN" :  "Offers"
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
			"DE" :  "Warenkorb",
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
			"EN" :  "Loading product information"
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
			"EN" :  "No current order."
		},
		"productPutIntoCardMsg" : {
			"DE" :  "{0} in Warenkorb gelegt.",
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
			"DE" :  "Ich will",
			"EN" :  "I want"
		},
		"orderSubmit" : {
			"DE" :  "Bestellung abgeschickt ...",
			"EN" :  "Order sent ..."
		},
		"productCartBt" : {
			"DE" :  "Warenkorb",
			"EN" :  "Add to cart"
		},
		"orderCanceled" : {
			"DE" :  "{0} wurde storniert.",
			"EN" :  "{0} has been canceled."
		},
		"order.detail.title" : {
			"DE" :  "Editieren",
			"EN" : "Edit"
		},
		//Cart
		"cartviewTitle" : {
			"DE" :  "Bestellung",
			"EN" :  "Order"
		},
		"cartTabBt" : {
			"DE" :  "Warenkorb",
			"EN" :  "Cart"
		},
		"dumpCart" : {
			"DE" :  "Warenkorb leeren?",
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
			"DE" :  "<h2>{0},</h2><p>Herzlich Willkommen im</p><p>\"{1}\"</p>",
			"EN" :  "<h2>{0},</h2><p>welcome to</p><p>\"{1}\"</p>"
		},
		"clubdashboard.button.vip" : {
			"DE" :  "VIP Call",
			"EN" :  "VIP Call"
		},
		"clubdashboard.button.vip.text" : {
			"DE" :  "Fragen Sie uns",
			"EN" :  "Ask us"
		},
		"clubdashboard.button.feedback" : {
			"DE" :  "Feedback",
			"EN" :  "Feedback"
		},
		"clubdashboard.button.feedback.text" : {
			"DE" :  "Ihre Meinung",
			"EN" : "Tell us"
		},
		"clubdashboard.button.infopage" : {
			"DE" :  "A bis Z",
			"EN" : "A to Z"
		},
		"clubdashboard.button.infopage.text" : {
			"DE" :  "Alle Information",
			"EN" : "All information"
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
			"EN" :  "Around me"
		},
		"clubdashboard.button.exit" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave"
		},
		"clubdashboard.leave.message" : {
			"DE" :  "Wirklich verlassen?",
			"EN" :  "Do you want to quit?"
		},
		"clubdashboard.welcomespot.title" : {
			"DE" :  "Herzlich Willkommen",
			"EN" : "Welcome"
		},
		"clubdashboard.welcomespot.text" : {
			"DE" :  "Diese Funktion steht hier nicht zur Verfügung. Bitte checken Sie an einer geeigneten Stelle "+
			"in unserem Haus ein.",
			"EN" : "This function is not available here. Please checkin at another spot in our house."
		},
		"clubdashboard.menu.text" : {
			"DE" :  "Unsere Angebote",
			"EN" : "Our offers"
		},
		//Info Pages
		"infopage.overview.title" : {
			"DE" :  "Wissenswertes",
			"EN" : "Information"
		},
		"infopage.loadingmsg" : {
			"DE" :  "Lade Infoseiten...",
			"EN" : "Loading infopages..."
		},
		//MyOrders
		"myOrdersTitle" : {
			"DE" :  "Bestellung",
			"EN" :  "Order"
		},
		"myOrdersTabBt" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave"
		},
		"myOrdersTabLeaveBt" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave"
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
			"DE" :  "Hier werden Ihre abgeschickten Bestellungen angezeigt.<br/>Zur Zeit haben Sie nichts bestellt.",
			"EN" :  "Your ordered items are listed here.<br/>There are no recent orders."
		},
		//Payment Request
		"paymentPickerTitle" : {
			"DE" :  "Bezahlmethode",
			"EN" :  "Payment method"
		},
		"paymentRequestSend" : {
			"DE" :  "Bitte einen Moment warten,</br>die Rechnung wird vorbereitet ...",
			"EN" :  "One moment please,</br>bill is being prepared ..."
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
			"DE" :  "Der Spitzname ist der Anzeigename für das Servicepersonal. Änderungen wirken sich erst beim nächsten Check-In aus.",
			"EN" :  "Alias is used to identify your order. Change will take effect after you have checked in again."
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
			"EN" :  "Email already exists."
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
		"settings.account.label.edit" : {
			"DE" :  "Ändern Sie:",
			"EN" :  "Change:"
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
			"DE" :  "E-Mail",
			"EN" :  "Email"
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
			"DE" :  "Passwort",
			"EN" :  "Password"
		},
		// "settings.section.account" : {
		// 	"DE" :  "Account-Daten",
		// 	"EN" :  "Account data"
		// },
		"settings.account.email" : {
			"DE" :  "Ihr cloobster Konto:<br/>{email}",
			"EN" :  "Your cloobster account:<br/>{email}"
		},
		"settings.account.fbconnected" : {
			"DE" :  "Account mit Facebook verknüpft.",
			"EN" :  "Account linked with Facebook."
		},
		"settings.section.infos" : {
			"DE" :  "Weitere Infos",
			"EN" :  "Other data"
		},
		"emailsetting.title" : {
			"DE" :  "E-Mail ändern",
			"EN" :  "Change email address"
		},
		"emailsetting.description" : {
			"DE" :  "E-Mail für cloobster Account ändern",
			"EN" :  "Change email for your cloobster account."
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
			"EN" :  "Repeat email address"
		},
		"emailsetting.error.noemail" : {
			"DE" :  "Neue E-Mail darf nicht leer sein.",
			"EN" :  "Email address cannot be empty."
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
			"EN" :  "Change password"
		},
		"passwordsetting.description" : {
			"DE" :  "Passwort für cloobster Account ändern",
			"EN" :  "Change password for your cloobster account."
		},
		"passwordsetting.oldpassword.field" : {
			"DE" :  "Altes Passwort",
			"EN" :  "Old password"
		},
		"passwordsetting.newpassword.field" : {
			"DE" :  "Neues Passwort",
			"EN" :  "New password"
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
		"settings.button.connectfb" : {
			"DE" :  "Verbinden mit Facebook",
			"EN" :  "Connect with Facebook"
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
			"EN" :  "One moment please!<br>We'll be serving you soon."
		},
		"callWaiterButton" : {
			"DE" :  "VIP Call",
			"EN" :  "VIP Call"
		},
		"callWaiterRequestBadge" : {
			"DE" :  "Sie haben uns gerufen.",
			"EN" :  "We'll be at your service soon."
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
			"EN" :  "We have been notified!<br>We'll be serving you soon."
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
		"feedback.button.send" : {
			"DE" :  "Senden",
			"EN" : "Send"
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
			"DE" :  "Account",
			"EN" :  "Account"
		},
		"login.description" : {
			"DE" : "Erinnere dich, wo Du warst",
			"EN" : "Remember where you were"
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
			"DE" :  "Facebook",
			"EN" :  "Facebook"
		},
		"login.button.pwforgot" : {
			"DE" :  "Neues Passwort",
			"EN" : "New Password"
		},
		"login.label.pwforgot" : {
			"DE" :  "Passwort vergessen?",
			"EN" : "Password forgotten?"
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
			"DE" :  "Bei cloobster registrieren und unsere AGB akzeptieren?",
			"EN" :  "Register and accept our terms of use?"
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
			"DE" :  "Möchten Sie sich abmelden?<br/>Zukünftige Check-ins tauchen nicht unter \"MyPlaces auf\"!",
			"EN" :  "Do you want to log out? Future check-ins will not show under \"MyPlaces auf\"!"
		},
		"account.passwordrequest.message" : {
			"DE" :  "Bitte geben Sie Ihre<br/>cloobster Account E-Mail ein.",
			"EN" :  "Please enter your<br/>cloobster email address."
		},
		"account.passwordrequest.notexisting" : {
			"DE" :  "Zu dieser E-Mail existiert kein Account.",
			"EN" :  "No account exists for this email address."
		},
		"account.passwordrequest.success" : {
			"DE" :  "Link zum zurücksetzen des Passworts verschickt.",
			"EN" :  "Link for resetting password has been sent. "
		},
		"account.register.yes" : {
			"DE" :  "Login/Anmelden",
			"EN" : "Login/Signup"
		},
		"account.register.no" : {
			"DE" :  "Nein Danke",
			"EN" : "No thanks"
		},
		//history
		"history.title" : {
			"DE" :  "MyPlaces",
			"EN" :  "MyPlaces"
		},
		"dashboard.button.history" : {
			"DE" :  "<h2>MyPlaces</h2><p>Deine besuchten Hotels und Restaurants</p>",
			"EN" :  "<h2>MyPlaces</h2><p>Hotels and restaurants visited</p>"
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
			"DE" :  "Erinnere dich, wo Du warst! Dieses Feature benötigt einen cloobster Account.",
			"EN" :  "Remember where you were! This feature requires a cloobster account."
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
		//facebook
		"facebook.connect.notlogin" : {
			"DE" :  "Sie sind nicht eingeloggt.",
			"EN" :  "You are not logged in."
		},
		"facebook.connect.confirm" : {
			"DE" : "cloobster Account mit Facebook verbinden?",
			"EN" : "Connect cloobster account with Facebook?"
		},		
		"facebook.connect.success" : {
			"DE" : "cloobster Account erfolgreich verbunden.",
			"EN" : "cloobster account successfully linked."
		},
		"facebook.action.nologin" : {
			"DE" :  "Um bei Facebook zu posten brauchen Sie einen cloobster Account, der mit Facebook verknüpft ist.",
			"EN" :  "To post on your Facebook wall, you need a cloobster account linked with Facebook."
		},
		"facebook.connect.canceled" : {
			"DE" :  "Facebook login nicht erfolgreich.",
			"EN" :  "Facebook login failed."
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
			"DE" :  "Es kann momentan keine Verbindung hergestellt werden.<br/>Bitte probiere es noch einmal und prüfe deinen Netzwerkstatus.",
			"EN" :  "Connection temporarily not available.<br/ Please try again."
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
		"error.account.facebook.exists" : {
			"DE" :  "Dieser Facebook Account ist mit einem andere cloobster Account verknüpft.",
			"EN" : "This Facebook account is linked with another cloobster Account."
		},
		"error.version" : {
			"DE" :  "Ihre cloobster Version ist veraltet. Bitte aktualisieren Sie die Version.",
			"EN" : "Your cloobster version is outdated. Please update!"
		},
		//system
		"network.slow" : {
			"DE" :  "Die Verbindung ist langsam. Dies kann die Anwendung verlangsamen.",
			"EN" : "Your are on a slow connection. This may slow down the app."
		}
	}
	}
});