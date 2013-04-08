Ext.define('EatSense.util.Translations',{
	statics: {
		//list all translated languages
		available: ["EN", "DE"],
		data: {
	
		// General translations
		"ok" : {
			"DE" :  "OK",
			"EN" :  "OK",
			"ES" : "",
			"IT" : ""
		},
		"cancel" : {
			"DE" :  "Abbrechen",
			"EN" :  "Cancel",
			"ES" : "",
			"IT" : ""
		},
		"back" : {
			"DE" :  "Zurück",
			"EN" :  "Back",
			"ES" : "",
			"IT" : ""
		},
		"change" : {
			"DE" :  "Ändern",
			"EN" :  "Change",
			"ES" : "",
			"IT" : ""
		},
		"barcode" : {
			"DE" :  "Barcode",
			"EN" :  "Bar code",
			"ES" : "",
			"IT" : ""
		},
		"close" : {
			"DE" :  "Schliessen",
			"EN" :  "Close",
			"ES" : "",
			"IT" : ""
		},
		"loadingMsg" : {
			"DE" :  "Laden",
			"EN" :  "Loading",
			"ES" : "",
			"IT" : ""
		},
		"general.processing" : {
			"DE" :  "In Bearbeitung",
			"EN" :  "Processing",
			"ES" : "",
			"IT" : ""
		},
		"general.credentials.invalid" : {
			"DE" :  "Passwort und/oder Benutzername falsch!",
			"EN" :  "Password and/or user name incorrect!",
			"ES" : "",
			"IT" : ""
		},
		"general.comingsoon" : {
			"DE" :  "Demnächst",
			"EN" :  "Coming soon",
			"ES" : "",
			"IT" : ""
		},
		"general.about" : {
			"DE" :  "Information",
			"EN" :  "About",
			"ES" : "",
			"IT" : ""
		},
		"general.companydetail" : {
			"DE" : "Impressum",
			"EN" : "Legal Notice",
			"ES" : "",
			"IT" : ""
		},
		"general.legalnotice" : {
			"DE" : "AGB",
			"EN" : "Terms and conditions",
			"ES" : "",
			"IT" : ""
		},
		"general.help.dashboard.msg" : {
			"DE" :  "<b>Willkommen</b><br/>Um auf das Menü zuzugreifen,<br/>tippen Sie auf die Lasche links unten<br/> oder wischen Sie vom linken<br/> zum rechten Rand.",
			"EN" : "<b>Welcome</b><br/>You can access the menu<br/> by tapping the button at the lower left<br/> or by swiping from the left<br/> to the right edge."
		},
		"general.help.dashboard.gotit" : {
			"DE" :  "Alles klar!",
			"EN" : "Lets go!"
		},
		"save" : {
			"DE" :  "Speichern",
			"EN" :  "Save",
			"ES" : "",
			"IT" : ""
		},
		"hint" : {
			"DE" :  "Hinweis",
			"EN" :  "Message",
			"ES" : "",
			"IT" : ""
		},
		"success" : {
			"DE" :  "Erfolg",
			"EN" :  "Success",
			"ES" : "",
			"IT" : ""
		},
		"yes" : {
			"DE" :  "Ja",
			"EN" :  "Yes",
			"ES" : "",
			"IT" : ""
		},
		"no" : {
			"DE" :  "Nein",
			"EN" :  "No",
			"ES" : "",
			"IT" : ""
		},
		"or" : {
			"DE" : "oder",
			"EN" : "or",
			"ES" : "",
			"IT" : ""
		},
		"continue" : {
			"DE" :  "Weiter",
			"EN" :  "Next",
			"ES" : "",
			"IT" : ""
		},
		"leave" : {
			"DE" :  "Verlassen",
			"EN" :  "Quit",
			"ES" : "",
			"IT" : ""
		},
		"retry" : {
			"DE" :  "Wiederholen",
			"EN" : "Retry",
			"ES" : "",
			"IT" : ""
		},
		"channelTokenError" : {
			"DE" :  "Updates im Hintergrund nicht funktionsfähig.",
			"EN" :  "Updates have not been successful.",
			"ES" : "",
			"IT" : ""
		},
		"android.backbutton.exit" : {
			"DE" :  "Nochmal drücken, um zu beenden.",
			"EN" :  "Please confirm to close.",
			"ES" : "",
			"IT" : ""
		},
		"terms" : {
			"DE" :  "AGB",
			"EN" : "Terms",
			"ES" : "",
			"IT" : ""
		},
		// main menu
		"checkInButton" : {
			"DE" :  "Check-in",
			"EN" :  "Check-in",
			"ES" : "",
			"IT" : ""
		},
		"currentDealsButton" : {
			"DE" :  "Deals",
			"EN" :  "Deals",
			"ES" : "",
			"IT" : ""
		},
		"newRestaurantsButton" : {
			"DE" :  "Neue Restaurants",
			"EN" :  "New Locations",
			"ES" : "",
			"IT" : ""
		},
		"settingsButton" : {
			"DE" :  "Profil",
			"EN" :  "Profile",
			"ES" : "",
			"IT" : ""
		},
		"slidenav.list.title" : {
			"DE" :  "Menü",
			"EN" : "Menu",
			"ES" : "",
			"IT" : ""
		},
		"slidenav.button.home" : {
			"DE" :  "Startseite",
			"EN" : "Home",
			"ES" : "",
			"IT" : ""
		},
		"slidenav.header.areas" : {
			"DE" :  "Sie sind eingecheckt",
			"EN" : "You checked in",
			"ES" : "",
			"IT" : ""
		},
		//Dashboard
		"dashboard.button.checkin" : {
			"DE" :  "Check-in",
			"EN" :  "Check-in",
			"ES" : "",
			"IT" : ""
		},
		"dashboard.button.demo" : {
			"DE" :  "Demo",
			"EN" : "Demo"
		},
		"dashboardLabel1" : {
			"DE" :  "<h2>You Are Guest</h2><p>"+
			"Check in and enjoy our service.</p>",
			"EN" : "<h2>You Are Guest</h2><p>"+
				"Check in and enjoy our service.</p>",
			"ES" : "",
			"IT" : ""
		},
		"dashboardLabel2" : {
			"DE" :  "1. Einchecken<br/>2. Bestellen<br/>3. Genießen",
			"EN" :  "1. Check in<br/>2. Order<br/>3. Enjoy",
			"ES" : "",
			"IT" : ""
		},
		"dashboard.button.settings" : {
			"DE" : "<h2>Account</h2><p>Dein Profil, Facebook, E-Mail</p>",
			"EN" : "<h2>Account</h2><p>Your Profile, Facebook, e-mail</p>",
			"ES" : "",
			"IT" : ""
		},
		// Checkin
		"checkInTitle" : {
			"DE" :  "Check-in",
			"EN" :  "Check-in",
			"ES" : "",
			"IT" : ""
		},
		"barcodePromptTitle" : {
			"DE" :  "Barcode-Abfrage",
			"EN" :  "Read bar code",
			"ES" : "",
			"IT" : ""
		},
		"barcodePromptText" : {
			"DE" :  "Bitte Barcode eingeben.",
			"EN" :  "Please enter bar code.",
			"ES" : "",
			"IT" : ""
		},
		"checkInStep1Label1" : {
			"DE" : "Mit welchem Namen<br/>möchtest du einchecken?",
			"EN" :  "Please choose an alias.",
			"ES" : "",
			"IT" : ""
		},
		"refreshNicknameBt" : {
			"DE" :  "Neu",
			"EN" :  "New",
			"ES" : "",
			"IT" : ""
		},
		"checkInStep1Button" : {
			"DE" :  "Los geht's",
			"EN" :  "Continue",
			"ES" : "",
			"IT" : ""
		},
		"nicknameToggleHint" : {
			"DE" :  "Nein/Ja",
			"EN" :  "No/Yes",
			"ES" : "",
			"IT" : ""
		},
		"checkInStep2Label1" : {
			"DE" :  "Andere haben hier bereits eingecheckt.",
			"EN" :  "Someone else has checked in at this location.",
			"ES" : "",
			"IT" : ""
		},
		"checkInStep2Label2" : {
			"DE" :  "Mit einer anderen Person einchecken?",
			"EN" :  "Share check-in location with someone else?",
			"ES" : "",
			"IT" : ""
		},
		"checkInStep2OnMyOwnButton" : {
			"DE" :  "Ich bin alleine hier.",
			"EN" :  "I am on my own.",
			"ES" : "",
			"IT" : ""
		},
		"checkInErrorBarcode" : {
			"DE" :  "Der Barcode ist nicht valide oder inaktiv!",
			"EN" :  "Bar code is not valid or inactive.",
			"ES" : "",
			"IT" : ""
		},
		"checkInErrorNickname" : {
			"DE" :  "Der Name muss zwischen {0} und {1} Zeichen lang sein.",
			"EN" :  "Name must be between {0} and {1} characters.",
			"ES" : "",
			"IT" : ""
		},
		"checkInErrorNicknameExists" : {
			"DE" :  "Der Name wird an diesem Ort bereits benutzt.",
			"EN" :  "Name already in use at this location.",
			"ES" : "",
			"IT" : ""
		},
		"saveNicknameToggle" : {
			"DE" :  "Namen merken?",
			"EN" :  "Remember name?",
			"ES" : "",
			"IT" : ""
		},
		"checkInCanceled" : {
			"DE" :  "Sitzung wurde durch Servicepersonal beendet.",
			"EN" :  "Session has been closed.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.confirm.title" : {
			"DE" :  "Willkommen",
			"EN" : "Welcome",
			"ES" : "",
			"IT" : ""
		},
		"nickname" : {
			"DE" :  "Name",
			"EN" :  "Name",
			"ES" : "",
			"IT" : ""
		},
		"checkin.init.loading" : {
			"DE" :  "CheckIn bei {0} ...",
			"EN" : "Check-in at {0} ...",
			"ES" : "",
			"IT" : ""
		},
		"restoreStateLoading" : {
			"DE" :  "Check-in wiederherstellen ...",
			"EN" :  "Restore check-in...",
			"ES" : "",
			"IT" : ""
		},
		"restoreStateFailed" : {
			"DE" :  "Check-in nicht mehr gültig.<br/>Bitte neu einchecken.",
			"EN" :  "Check-in invalid.<br/>Please try again.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.nickname.palceholder" : {
			"DE" :  "z. B. Max Mustermann",
			"EN" : "e.g. John Doe",
			"ES" : "",
			"IT" : ""
		},
		"checkin.demo.msg" : {
			"DE" :  "Im Demo Hotel einchecken?",
			"EN" : "Check-In at demo hotel?",
			"ES" : "",
			"IT" : ""
		},
		// Menu
		"menuTab" : {
			"DE" :  "Angebote",
			"EN" :  "Offers",
			"ES" : "",
			"IT" : ""
		},
		"menuTitle" : {
			"DE" :  "Unser Angebot",
			"EN" :  "Our Offer",
			"ES" : "",
			"IT" : ""
		},
		"choicesPanelTitle" : {
			"DE" :  "Bitte wählen Sie",
			"EN" :  "Please choose",
			"ES" : "",
			"IT" : ""
		},
		"putIntoCartButton" : {
			"DE" :  "Warenkorb",
			"EN" :  "Add to cart",
			"ES" : "",
			"IT" : ""
		},
		"choiceValErrMandatory" : {
			"DE" :  "Bitte eine Auswahl treffen für {0}.",
			"EN" :  "Please make a choice for {0}.",
			"ES" : "",
			"IT" : ""
		},
		"choiceValErrMin" : {
			"DE" :  "Bitte min. {0} Option(en) in {1} auswählen.",
			"EN" :  "Please select at least {0} option(s) in {1}.",
			"ES" : "",
			"IT" : ""
		},
		"choiceValErrMax" : {
			"DE" :  "Bitte max. {0} Optionen in {1} auswählen.",
			"EN" :  "Please do not exceed {0} option(s) in {1}.",
			"ES" : "",
			"IT" : ""
		},
		"menu.product.detail.loading" : {
			"DE" :  "Lade Produktdaten...",
			"EN" :  "Loading product information",
			"ES" : "",
			"IT" : ""
		},
		//Order
		"orderInvalid" : {
			"DE" :  "Bitte Auswahl überprüfen.",
			"EN" :  "Please confirm your choice.",
			"ES" : "",
			"IT" : ""
		},
		"orderPlaced" : {
			"DE" :  "Bestellung im Warenkorb.",
			"EN" :  "Add to cart.",
			"ES" : "",
			"IT" : ""
		},
		"cartEmpty" : {
			"DE" :  "Noch keine Bestellung getätigt.",
			"EN" :  "No current order.",
			"ES" : "",
			"IT" : ""
		},
		"productPutIntoCardMsg" : {
			"DE" :  "{0} in Warenkorb gelegt.",
			"EN" :  "{0} added to cart.",
			"ES" : "",
			"IT" : ""
		},
		"orderRemoved" : {
			"DE" :  "Bestellung entfernt.",
			"EN" :  "Order deleted.",
			"ES" : "",
			"IT" : ""
		},
		"orderComment" : {
			"DE" :  "Besondere Wünsche",
			"EN" :  "Add your comments here",
			"ES" : "",
			"IT" : ""
		},
		"amount" : {
			"DE" :  "Menge",
			"EN" :  "Amount",
			"ES" : "",
			"IT" : ""
		},
		"amountspinnerLabel" : {
			"DE" :  "Ich will",
			"EN" :  "I want",
			"ES" : "",
			"IT" : ""
		},
		"orderSubmit" : {
			"DE" :  "Bestellung abgeschickt ...",
			"EN" :  "Order sent ...",
			"ES" : "",
			"IT" : ""
		},
		"productCartBt" : {
			"DE" :  "Warenkorb",
			"EN" :  "Add to cart",
			"ES" : "",
			"IT" : ""
		},
		"orderCanceled" : {
			"DE" :  "{0} wurde storniert.",
			"EN" :  "{0} has been canceled.",
			"ES" : "",
			"IT" : ""
		},
		"order.detail.title" : {
			"DE" :  "Editieren",
			"EN" : "Edit",
			"ES" : "",
			"IT" : ""
		},
		//Cart
		"cartviewTitle" : {
			"DE" :  "Bestellung",
			"EN" :  "Order",
			"ES" : "",
			"IT" : ""
		},
		"cartTabBt" : {
			"DE" :  "Warenkorb",
			"EN" :  "Cart",
			"ES" : "",
			"IT" : ""
		},
		"dumpCart" : {
			"DE" :  "Warenkorb leeren?",
			"EN" :  "Empty cart?",
			"ES" : "",
			"IT" : ""
		},
		"dumpItem" : {
			"DE" :  "{0} entfernen?",
			"EN" :  "Cancel {0}?",
			"ES" : "",
			"IT" : ""
		},
		"submitButton" : {
			"DE" :  "Senden",
			"EN" :  "Send",
			"ES" : "",
			"IT" : ""
		},
		"submitOrderProcess" : {
			"DE" :  "Schicke Bestellung",
			"EN" :  "Sending order",
			"ES" : "",
			"IT" : ""
		},
		"submitOrdersQuestion" : {
			"DE" :  "Bestellung verbindlich abschicken?",
			"EN" :  "Confirm & send order?",
			"ES" : "",
			"IT" : ""
		},
		"cart.button.deleteall" : {
			"DE" :  "Löschen",
			"EN" :  "Delete",
			"ES" : "",
			"IT" : ""
		},
		//Lounge Dashboard
		"clubdashboard.tab.title" : {
			"DE" :  "Home",
			"EN" :  "Home",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.label.description" : {
			"DE" :  "<h2>{0},</h2><p>Herzlich Willkommen im</p><p>\"{1}\"</p>",
			"EN" :  "<h2>{0},</h2><p>welcome to</p><p>\"{1}\"</p>",			
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.vip" : {
			"DE" :  "Service Call",
			"EN" :  "Service Call",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.vip.text" : {
			"DE" :  "Fragen Sie uns",
			"EN" :  "Ask us",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.feedback" : {
			"DE" :  "Feedback",
			"EN" :  "Feedback",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.feedback.text" : {
			"DE" :  "Ihre Meinung",
			"EN" : "Tell us",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.infopage" : {
			"DE" :  "A bis Z",
			"EN" : "A to Z",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.infopage.text" : {
			"DE" :  "Alle Information",
			"EN" : "All information",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.info" : {
			"DE" :  "Info",
			"EN" :  "Info",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.events" : {
			"DE" :  "Events",
			"EN" :  "Events",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.aroundme" : {
			"DE" :  "Around me",
			"EN" :  "Around me",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.button.exit" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.leave.message" : {
			"DE" :  "Wirklich verlassen?",
			"EN" :  "Do you want to quit?",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.welcomespot.title" : {
			"DE" :  "Herzlich Willkommen",
			"EN" : "Welcome",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.welcomespot.text" : {
			"DE" :  "Diese Funktion steht hier nicht zur Verfügung. Bitte checken Sie an einer geeigneten Stelle "+
			"in unserem Haus ein.",
			"EN" : "This function is not available here. Please checkin at another spot in our house.",
			"ES" : "",
			"IT" : ""
		},
		"clubdashboard.menu.text" : {
			"DE" :  "Unsere Angebote",
			"EN" : "Our offers",
			"ES" : "",
			"IT" : ""
		},
		//Info Pages
		"infopage.overview.title" : {
			"DE" :  "Information",
			"EN" : "Information",
			"ES" : "",
			"IT" : ""
		},
		"infopage.link.button" : {
			"DE" :  "Link öffnen",
			"EN" : "Open link",
			"ES" : "",
			"IT" : ""
		},
		//MyOrders
		"myOrdersTitle" : {
			"DE" :  "Bestellung",
			"EN" :  "Order",
			"ES" : "",
			"IT" : ""
		},
		"myOrdersTabBt" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave",
			"ES" : "",
			"IT" : ""
		},
		"myOrdersTabLeaveBt" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave",
			"ES" : "",
			"IT" : ""
		},
		"payRequestButton" : {
			"DE" :  "Bezahlen",
			"EN" :  "Bill",
			"ES" : "",
			"IT" : ""
		},
		"leaveButton" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave",
			"ES" : "",
			"IT" : ""
		},
		"orderTime" : {
			"DE" :  "Bestellzeit",
			"EN" :  "Order lead-time",
			"ES" : "",
			"IT" : ""
		},
		"myorderComment" : {
			"DE" :  "Meine Wünsche",
			"EN" :  "My order",
			"ES" : "",
			"IT" : ""
		},
		"myorders.description" : {
			"DE" :  "Hier werden Ihre abgeschickten Bestellungen angezeigt.<br/>Zur Zeit haben Sie nichts bestellt.",
			"EN" :  "Your ordered items are listed here.<br/>There are no recent orders.",
			"ES" : "",
			"IT" : ""
		},
		//Payment Request
		"paymentPickerTitle" : {
			"DE" :  "Bezahlmethode",
			"EN" :  "Payment method",
			"ES" : "",
			"IT" : ""
		},
		"paymentRequestSend" : {
			"DE" :  "Ihr Bezahlwunsch wurde übermittelt.",
			"EN" :  "Your payment request has been send.",
			"ES" : "",
			"IT" : ""
		},
		"myorders.messages.billnew.message" : {
		 	"DE" :  "Ihre Rechnung ({0}) wurde erstellt.",
		 	"EN" : "Your bill ({0}) has been issued.",
		 	"ES" : "",
			"IT" : ""
		}, 
		//Settings
		"settingsTitle" : {
			"DE" :  "Profil",
			"EN" :  "Profile",
			"ES" : "",
			"IT" : ""
		},
		"nicknameDesc" : {
			"DE" :  "Der Name ist der Anzeigename für das Servicepersonal. Änderungen wirken sich erst beim nächsten Check-In aus.",
			"EN" :  "Name is used to identify your orders. Change will take effect after you have checked in again.",
			"ES" : "",
			"IT" : ""
		},
		"newsletterRegisterBt" : {
			"DE" :  "Registrieren",
			"EN" :  "Register",
			"ES" : "",
			"IT" : ""
		},
		"newsletterEmail" : {
			"DE" :  "E-Mail",
			"EN" :  "Email",
			"ES" : "",
			"IT" : ""
		},
		"newsletterRegisterSuccess" : {
			"DE" :  "Danke! Eine Bestätigungsmail wird an {0} geschickt.",
			"EN" :  "Thank you! Confirmation email will be sent to {0} shortly.",
			"ES" : "",
			"IT" : ""
		},
		"newsletterInvalidEmail" : {
			"DE" :  "Bitte eine gültige E-Mail Adresse eingeben.",
			"EN" :  "Please enter a valid email address.",
			"ES" : "",
			"IT" : ""
		},
		"newsletterDuplicateEmail" : {
			"DE" :  "Diese E-Mail Adresse ist bereits registriert.",
			"EN" :  "Email already exists.",
			"ES" : "",
			"IT" : ""
		},
		"newsletterPopupTitle" : {
			"DE" :  "Newsletter abonnieren?",
			"EN" :  "Subscribe to newsletter?",
			"ES" : "",
			"IT" : ""
		}, 
		"newsletterDontAskButton" : {
			"DE" :  "Nicht mehr nachfragen!",
			"EN" :  "Please don't ask again!",
			"ES" : "",
			"IT" : ""
		},
		"newsletterLabel" : {
			"DE" :  "Nicht den Cloobster Big-Bang verpassen und für den Newsletter anmelden!",
			"EN" :  "Subscribe to newsletter!",
			"ES" : "",
			"IT" : ""
		},
		"settings.button.logout" : {
			"DE" : "Logout",
			"EN" : "Logout",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.label.edit" : {
			"DE" :  "Ändern Sie:",
			"EN" :  "Change:",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.label.email" : {
			"DE" :  "Account E-Mail",
			"EN" :  "Account email address",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.field.email" : {
			"DE" :  "E-Mail",
			"EN" :  "Email address",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.button.email" : {
			"DE" :  "E-Mail",
			"EN" :  "Email",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.label.password" : {
			"DE" :  "Account Passwort",
			"EN" :  "Account password",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.field.password" : {
			"DE" :  "Passwort",
			"EN" :  "Password",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.button.password" : {
			"DE" :  "Passwort",
			"EN" :  "Password",
			"ES" : "",
			"IT" : ""
		},
		"settings.button.login" : {
			"DE" :  "Login/Anmelden",
			"EN" : "Login/Register",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.email" : {
			"DE" :  "Ihr cloobster Konto:<br/>{email}",
			"EN" :  "Your cloobster account:<br/>{email}",
			"ES" : "",
			"IT" : ""
		},
		"settings.account.fbconnected" : {
			"DE" :  "Account mit Facebook verknüpft.",
			"EN" :  "Account linked with Facebook.",
			"ES" : "",
			"IT" : ""
		},
		"settings.section.infos" : {
			"DE" :  "Weitere Infos",
			"EN" :  "Other data",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.title" : {
			"DE" :  "E-Mail ändern",
			"EN" :  "Change email address",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.description" : {
			"DE" :  "E-Mail für cloobster Account ändern",
			"EN" :  "Change email for your cloobster account.",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.password.field" : {
			"DE" :  "Passwort",
			"EN" :  "Password",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.email.field" : {
			"DE" :  "Neue E-Mail",
			"EN" :  "New email address",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.repeat.field" : {
			"DE" :  "E-Mail wiederholen",
			"EN" :  "Repeat email address",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.error.noemail" : {
			"DE" :  "Neue E-Mail darf nicht leer sein.",
			"EN" :  "Email address cannot be empty.",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.error.invalidmail" : {
			"DE" :  "Ungültige E-Mail.",
			"EN" :  "Invalid email address.",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.error.nopassword" : {
			"DE" :  "Passwort darf nicht leer sein.",
			"EN" :  "Password cannot be empty.",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.error.emailmatch" : {
			"DE" :  "E-Mails stimmen nicht überein",
			"EN" :  "Email address does not match.",
			"ES" : "",
			"IT" : ""
		},
		"emailsetting.success" : {
			"DE" :  "E-Mail erfolgreich geändert. Eine Bestätigung wurde an neue Adresse geschickt.",
			"EN" :  "Email address has been changed. A confirmation email has been sent to new address.",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.title" : {
			"DE" :  "Passwort ändern",
			"EN" :  "Change password",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.description" : {
			"DE" :  "Passwort für cloobster Account ändern",
			"EN" :  "Change password for your cloobster account.",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.oldpassword.field" : {
			"DE" :  "Altes Passwort",
			"EN" :  "Old password",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.newpassword.field" : {
			"DE" :  "Neues Passwort",
			"EN" :  "New password",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.repeatpassword.field" : {
			"DE" :  "Passwort wiederholen",
			"EN" :  "Repeast password",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.error.newpassword" : {
			"DE" :  "Neues Passwort darf nicht leer sein.",
			"EN" :  "New password cannot be empty.",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.error.passwordmatch" : {
			"DE" :  "Passwörter stimmen nicht überein",
			"EN" :  "Password does not match.",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.error.nopassword" : {
			"DE" :  "Altes Passwort darf nicht leer sein.",
			"EN" :  "Old password cannot be empty.",
			"ES" : "",
			"IT" : ""
		},
		"passwordsetting.success" : {
			"DE" :  "Passwort erfolgreich geändert.",
			"EN" :  "Password has been changed.",
			"ES" : "",
			"IT" : ""
		},
		"settings.button.connectfb" : {
			"DE" :  "Verbinden mit Facebook",
			"EN" :  "Connect with Facebook",
			"ES" : "",
			"IT" : ""
		},
		//Request
		"errorRequest" : {
			"DE" :  "Anfrage konnte leider nicht bearbeitet werden.",
			"EN" :  "Request could not processed.",
			"ES" : "",
			"IT" : ""
		},
		"requestsButton" : {
			"DE" :  "VIP",
			"EN" :  "VIP",
			"ES" : "",
			"IT" : ""
		},
		"requestsTitle" : {
			"DE" :  "Service Call",
			"EN" :  "Service Call",
			"ES" : "",
			"IT" : ""
		},
		"requestCallWaiterSendMsd" : {
			"DE" :  "Bitte einen Moment Geduld!<br>Es wird gleich jemand kommen.",
			"EN" :  "One moment please!<br>We'll be serving you soon.",
			"ES" : "",
			"IT" : ""
		},
		"callWaiterButton" : {
			"DE" :  "Service Call",
			"EN" :  "Service Call",
			"ES" : "",
			"IT" : ""
		},
		"callWaiterRequestBadge" : {
			"DE" :  "Sie haben uns gerufen.",
			"EN" :  "We'll be at your service soon.",
			"ES" : "",
			"IT" : ""
		},
		"cancelCallWaiterRequest" : {
			"DE" :  "Danke, hat sich erledigt",
			"EN" :  "Cancel request",
			"ES" : "",
			"IT" : ""
		},
		"callWaiterCallHint" : {
			"DE" :  "Können wir für Sie da sein?",
			"EN" :  "What can we do for you?",
			"ES" : "",
			"IT" : ""
		},
		"callWaiterCancelHint" : {
			"DE" :  "Wir wurden gerufen und <br/>melden uns so schnell wie möglich!",
			"EN" :  "We have been notified!<br>We'll be serving you soon.",
			"ES" : "",
			"IT" : ""
		},
		"vipGreetingMessage" : {
			"DE" :  "Willkommen <span style='font-weight:bold;'>{0}</span><br/>in Ihrem persönlichen VIP-Bereich!",
			"EN" :  "Welcome, <span style='font-weight:bold;'>{0}</span>,<br/> to your personal VIP area!",
			"ES" : "",
			"IT" : ""
		},
		//Feedback
		"feedback" : {
			"DE" :  "Feedback",
			"EN" :  "Feedback",
			"ES" : "",
			"IT" : ""
		},
		"feedback.button.send" : {
			"DE" :  "Senden",
			"EN" : "Send",
			"ES" : "",
			"IT" : ""
		},
		"feedbackLabel" : {
			"DE" :  "Sagen Sie uns Ihre Meinung.",
			"EN" :  "We value your feedback.",
			"ES" : "",
			"IT" : ""
		},
		"feedbackQuestion" : {
			"DE" :  "Wie hat es Ihnen gefallen?",
			"EN" :  "Did you enjoy your stay?",
			"ES" : "",
			"IT" : ""
		},
		"feedbackComment" : {
			"DE" :  "Kommentar (optional)",
			"EN" :  "Comment (optional)",
			"ES" : "",
			"IT" : ""
		},
		"feedbackEmail" : {
			"DE" :  "E-Mail (optional)",
			"EN" :  "Email (optional)",
			"ES" : "",
			"IT" : ""
		},
		"feedbackCompleteTitle" : {
			"DE" :  "Feedback abgeschickt",
			"EN" :  "Feedback has been sent",
			"ES" : "",
			"IT" : ""
		},
		"feedbackCompleteMessage" : {
			"DE" :  "Vielen Dank für Ihre Meinung!",
			"EN" :  "Thank you for your feedback!",
			"ES" : "",
			"IT" : ""
		},
		//Login
		"login.title" : {
			"DE" :  "Account",
			"EN" :  "Account",
			"ES" : "",
			"IT" : ""
		},
		"login.description" : {
			"DE" : "Erinnere dich, wo Du warst",
			"EN" : "Remember where you were",
			"ES" : "",
			"IT" : ""
		},
		"login.field.email.placeholder" : {
			"DE" :  "E-Mail",
			"EN" :  "Email",
			"ES" : "",
			"IT" : ""
		},
		"login.field.password.placeholder" : {
			"DE" :  "Passwort",
			"EN" :  "Password",
			"ES" : "",
			"IT" : ""
		},
		"login.button.login" : {
			"DE" :  "Login",
			"EN" :  "Login",
			"ES" : "",
			"IT" : ""
		},
		"login.button.signup" : {
			"DE" :  "Signup",
			"EN" :  "Sign-up",
			"ES" : "",
			"IT" : ""
		},
		"login.button.signupfb" : {
			"DE" :  "Facebook",
			"EN" :  "Facebook",
			"ES" : "",
			"IT" : ""
		},
		"login.button.pwforgot" : {
			"DE" :  "Neues Passwort",
			"EN" : "New Password",
			"ES" : "",
			"IT" : ""
		},
		"login.label.pwforgot" : {
			"DE" :  "Passwort vergessen?",
			"EN" : "Password forgotten?",
			"ES" : "",
			"IT" : ""
		},
		"login.label.notamember" : {
			"DE" :  "Kein Mitglied?",
			"EN" :  "Not a member?",
			"ES" : "",
			"IT" : ""
		},
		"account.signup.confirm.title" : {
			"DE" :  "Werde Mitglied ...",
			"EN" :  "Register ...",
			"ES" : "",
			"IT" : ""
		},
		"account.signup.confirm.message" : {
			"DE" :  "Bei cloobster registrieren und unsere AGB akzeptieren?",
			"EN" :  "Register and accept our terms of use?",
			"ES" : "",
			"IT" : ""
		},
		"account.signupfb.confirm.message" : {
			"DE" :  "Cloobster Account mit Facebook Daten anlegen?",
			"EN" :  "Register?",
			"ES" : "",
			"IT" : ""
		},
		"account.signup.success.title" : {
			"DE" :  "Willkommen bei Cloobster",
			"EN" :  "Welcome to cloobster",
			"ES" : "",
			"IT" : ""
		},
		"account.signup.success.message" : {
			"DE" :  "Danke, dass Sie sich registriert haben!<br/>",
			"EN" :  "Thank you for your registration!<br/>",
			"ES" : "",
			"IT" : ""
		},
		"account.logout.confirm.title" : {
			"DE" :  "Abmelden",
			"EN" :  "Log-out",
			"ES" : "",
			"IT" : ""
		},
		"account.logout.confirm.message" : {
			"DE" :  "Möchten Sie sich abmelden?",
			"EN" :  "Do you want to log out?",
			"ES" : "",
			"IT" : ""
		},
		"account.passwordrequest.message" : {
			"DE" :  "Bitte geben Sie Ihre<br/>cloobster Account E-Mail ein.",
			"EN" :  "Please enter your<br/>cloobster email address.",
			"ES" : "",
			"IT" : ""
		},
		"account.passwordrequest.notexisting" : {
			"DE" :  "Zu dieser E-Mail existiert kein Account.",
			"EN" :  "No account exists for this email address.",
			"ES" : "",
			"IT" : ""
		},
		"account.passwordrequest.success" : {
			"DE" :  "Link zum zurücksetzen des Passworts verschickt.",
			"EN" :  "Link for resetting password has been sent. ",
			"ES" : "",
			"IT" : ""
		},
		"account.register.yes" : {
			"DE" :  "Login/Anmelden",
			"EN" : "Login/Signup",
			"ES" : "",
			"IT" : ""
		},
		"account.register.no" : {
			"DE" :  "Nein Danke",
			"EN" : "No thanks",
			"ES" : "",
			"IT" : ""
		},
		//history
		"history.title" : {
			"DE" :  "MyPlaces",
			"EN" :  "MyPlaces",
			"ES" : "",
			"IT" : ""
		},
		"dashboard.button.history" : {
			"DE" :  "Places",
			"EN" :  "Places",
			"ES" : "",
			"IT" : ""
		},
		"history.detail.title" : {
			"DE" :  "Rechnung",
			"EN" :  "Bill",
			"ES" : "",
			"IT" : ""
		},
		"history.detail.list.paging" : {
			"DE" :  "Mehr laden ...",
			"EN" :  "Show more ...",
			"ES" : "",
			"IT" : ""
		},
		"history.noaccount" : {
			"DE" :  "Erinnere dich, wo Du warst! Dieses Feature benötigt einen cloobster Account.",
			"EN" :  "Remember where you were! This feature requires a cloobster account.",
			"ES" : "",
			"IT" : ""
		},
		"history.list.description" : {
			"DE" :  "Hier werden Ihre besuchten Orte aufgelistet. Sie haben noch keine Orte besucht.",
			"EN" :  "Places you have visited. No hits.",
			"ES" : "",
			"IT" : ""
		},
		//social
		"social.checkin" : {
			"DE" :  "Hat gerade eingecheckt bei {0}.",
			"EN" : "Has just checked in at {0}.",
			"ES" : "",
			"IT" : ""
		},
		//facebook
		"facebook.connect.notlogin" : {
			"DE" :  "Sie sind nicht eingeloggt.",
			"EN" :  "You are not logged in.",
			"ES" : "",
			"IT" : ""
		},
		"facebook.connect.confirm" : {
			"DE" : "cloobster Account mit Facebook verbinden?",
			"EN" : "Connect cloobster account with Facebook?",
			"ES" : "",
			"IT" : ""
		},		
		"facebook.connect.success" : {
			"DE" : "cloobster Account erfolgreich verbunden.",
			"EN" : "cloobster account successfully linked.",
			"ES" : "",
			"IT" : ""
		},
		"facebook.action.nologin" : {
			"DE" :  "Um bei Facebook zu posten brauchen Sie einen cloobster Account, der mit Facebook verknüpft ist.",
			"EN" :  "To post on your Facebook wall, you need a cloobster account linked with Facebook.",
			"ES" : "",
			"IT" : ""
		},
		"facebook.connect.canceled" : {
			"DE" :  "Facebook login nicht erfolgreich.",
			"EN" :  "Facebook login failed.",
			"ES" : "",
			"IT" : ""
		},
		//spot selection
		"spotselection.title" : {
			"DE" :  "Spot Auswahl",
			"EN" : "Spot Selection",
			"ES" : "",
			"IT" : ""
		},
		"spotselection.description" : {
			"DE" :  "Bitte wählen Sie Ihren aktuellen Spot aus.",
			"EN" : "Please select your current spot.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchspot.msgtitle" : {
			"DE" :  "Spotwechsel",
			"EN" : "Switch spot",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchspot.switch" : {
			"DE" :  "Wechseln",
			"EN" : "Switch",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchspot.stay" : {
			"DE" :  "Bleiben",
			"EN" : "Stay",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchmasterspot.barcode" : {			
			"DE" :  "Um	dieses	Produkt	zu bestellen, scannen Sie bitte den Barcode ihres Spots (Standort).",
			"EN" : "To order this product, please scan the barcode of your current spot.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchmasterspot.list" : {
			"DE" : "Um	dieses	Produkt	zu	bestellen, wählen Sie bitte Ihren Spot (Standort) aus der Liste.",
			"EN" : "To order this product, please select your spot from the list.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchspot.barcode" : {			
			"DE" :  "Um	dieses	Produkt	zu bestellen müssen Sie von \"{0}\" nach \"{1}\" wechseln. "+
					"Scannen Sie hierfür den Barcode des neuen Spots. Warenkorb wird geleert.",
			"EN" : "To order this product you have to switch from \"{0}\" to \"{1}\". "+
					"Please scan the barcode of your new spot. Cart will be cleared.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchspot.list" : {
			"DE" : "Um	dieses	Produkt	zu	bestellen müssen Sie von \"{0}\" nach \"{1}\" wechseln. "+
					"Wählen Sie hierfür den neuen Spot (Standort) aus der Liste. Warenkorb wird geleert.",
			"EN" : "To order this product you have to switch from \"{0}\" to \"{1}\". "+
					"Please select your new spot from the list. Cart will be cleared.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchspot.orders.barcode" : {
			"DE" :  "Um	dieses	Produkt	zu bestellen, schliessen Sie bitte zuerst ihre aktuellen Bestellungen in Höhe von {0} ab. "+
					"Dann wechseln Sie von \"{1}\" nach \"{2}\" durch scannen des neuen Spots. Warenkorb wird geleert.",
			"EN" : "To order this product you have to complete your current order balance of {0}. " + 
					"Afterwards please scan your new spot to switch from \"{1}\" to \"{2}\". Cart will be cleared.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchspot.orders.list" : {
			"DE" :  "Um	dieses	Produkt	zu bestellen, schliessen Sie bitte zuerst ihre aktuellen Bestellungen in Höhe von {0} ab. "+
					"Dann wechseln Sie von \"{1}\" nach \"{2}\" durch Auswahl des neuen Spots. Warenkorb wird geleert.",
			"EN" : "To order this product you have to complete your current order balance of {0}. " +
					"Afterwards please select your new spot from the list to switch from \"{1}\" to \"{2}\". Cart will be cleared.",
			"ES" : "",
			"IT" : ""
		},
		"checkin.switchspot.confirmselected" : {
			"DE" :  "An Spot {0} einchecken?",
			"EN" : "CheckIn at spot {0}?",
			"ES" : "",
			"IT" : ""
		},
		//errors
		"error" : {
			"DE" :  "Fehler",
			"EN" :  "Error",
			"ES" : "",
			"IT" : ""
		},
		"errorTitle" : {
			"DE" :  "Fehler",
			"EN" :  "Error",
			"ES" : "",
			"IT" : ""
		},		
		"errorMsg" : {
			"DE" :  "Entschuldigung! Ein Fehler ist aufgetreten.<br/>Wir kümmern uns darum!",
			"EN" :  "We apologies! An error has occurred.<br/>We'll fix it as soon as possible.",
			"ES" : "",
			"IT" : ""
		},
		"errorResource" : {
			"DE" :  "Daten konnten nicht vom Server geladen werden.",
			"EN" :  "Data error... Connection to server has failed.",
			"ES" : "",
			"IT" : ""
		},
		"errorPermission" : {
			"DE" :  "Sitzung ist ungültig.",
			"EN" :  "Session is invalid.",
			"ES" : "",
			"IT" : ""
		},
		"errorCommunication" : {
			"DE" :  "Es kann momentan keine Verbindung hergestellt werden.<br/>Bitte probiere es noch einmal und prüfe deinen Netzwerkstatus.",
			"EN" :  "Connection temporarily not available.<br/ Please try again.",
			"ES" : "",
			"IT" : ""
		},
		"error.menu.needsrefresh" : {
			"DE" :  "Auswahl nicht mehr aktuell. Bitte führen Sie die Bestellung nochmals durch.",
			"EN" :  "Your order has been changed. Please order again.",
			"ES" : "",
			"IT" : ""
		},
		"error.account.email.exists" : {
			"DE" :  "Diese E-Mail wird bereits verwendet.",
			"EN" :  "Email address exists.",
			"ES" : "",
			"IT" : ""
		},
		"error.account.email" : {
			"DE" :  "Bitte geben Sie eine gültige E-Mail ein.",
			"EN" :  "Please enter a valid email address.",
			"ES" : "",
			"IT" : ""
		},
		"error.account.password" : {
			"DE" :  "Passwort muss min. 6 Zeichen besitzen. Darunter 1 Zahl oder 1 Sonderzeichen.",
			"EN" :  "Password must have 6 characters including 1 number or special character.",
			"ES" : "",
			"IT" : ""
		},
		"error.account.nocredentials" : {
			"DE" :  "Bitte geben Sie Ihre Zugangsdaten ein, um sich einzuloggen.",
			"EN" :  "Please enter user name and password to proceed.",
			"ES" : "",
			"IT" : ""
		},
		"error.account.required" : {
			"DE" :  "Ein Account wird für diese Funktion benötigt.",
			"EN" : "Please login/register to use this function.",
			"ES" : "",
			"IT" : ""
		},
		"error.account.credentials.invalid" : {
			"DE" :  "Gespeicherte Zugangsdaten ungültig. Bitte neu einloggen.",
			"EN" :  "Login data invalid. Please log in again.",
			"ES" : "",
			"IT" : ""
		},
		"error.account.facebook.exists" : {
			"DE" :  "Dieser Facebook Account ist mit einem andere cloobster Account verknüpft.",
			"EN" : "This Facebook account is linked with another cloobster Account.",
			"ES" : "",
			"IT" : ""
		},
		"error.account.inactive" : {
			"DE" :  "Ihr Account ist inaktiv. Kontaktieren Sie bitte support@cloobster.com",
			"EN" : "Your account is inactive. Please contact support@cloobster.com",
			"ES" : "",
			"IT" : ""
		},
		"error.version" : {
			"DE" :  "Ihre cloobster Version ist veraltet. Bitte aktualisieren Sie die Version.",
			"EN" : "Your cloobster version is outdated. Please update!",
			"ES" : "",
			"IT" : ""
		},
		"error.checkin.switchspot.businesses.mismatch" : {
			"DE" :  "Dieser Spot ist ungültig.",
			"EN" : "This spot is invalid.",
			"ES" : "",
			"IT" : ""
		},
		"error.checkin.switchspot.area.mismatch" : {
			"DE" :  "Dieser Spot gehört nicht zum ausgewählten Servicebereich.",
			"EN" : "This spot does not belong to your selected service area.",
			"ES" : "",
			"IT" : ""
		},
		"error.checkin.switchspot.welcome" : {
			"DE" :  "Dieser Spot repräsentiert keinen Standort. Bitte checken Sie an anderer Stelle ein.",
			"EN" : "This spot doesn't represent a real spot. Please check in at another place.",
			"ES" : "",
			"IT" : ""
		},
		"error.appengine" : {
			"DE" :  "Es liegt eine Serverstörung vor. Wir arbeiten an einer Lösung.",
			"EN" : "Currently server errors exist. We are working on a solution.",
			"ES" : "",
			"IT" : ""
		},
		//system
		"network.slow" : {
			"DE" :  "Die Verbindung ist langsam. Dies kann die Anwendung verlangsamen.",
			"EN" : "Your are on a slow connection. This may slow down the app.",
			"ES" : "",
			"IT" : ""
		}
	}
	}
});