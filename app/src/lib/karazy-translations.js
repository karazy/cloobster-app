/*Karazy namespace. Create if not exists.*/
var Karazy = (Karazy) ? Karazy : {};

/**
 * 
 */
Karazy.translations = (function() {

	return {
		"DE" : {

		// General translations
		"ok" : "OK",
		"cancel" : "Abbrechen",
		"back" : "Zurück",
		"change" : "Ändern",
		"barcode" : "Barcode",
		"close" : "Schliessen",
		"loadingMsg" : "Laden ...",
		"hint" : "Hinweis",
		"success" : "Erfolg",
		"yes" : "Ja",
		"no" : "Nein",
		"continue" : "Weiter",
		"leave" : "Verlassen",
		"channelTokenError" : "Updates im Hintergrund nicht funktionsfähig.",
		// main menu
		"checkInButton" : "Check-In",
		"currentDealsButton" : "Deals",
		"newRestaurantsButton" : "Neue Restaurants",
		"settingsButton" : "Einstellungen",
		//Dashboard
		"dashboardLabel1" : "<span style='font-weight: bold;'>präsentiert</span><br/>\"nie mehr Schlange stehen...\"",
		"dashboardLabel2" : "1. Einchecken<br/>2. Bestellen<br/>3. Genießen",
		// Checkin
		"checkInTitle" : "Check-In",
		"barcodePromptTitle" : "Barcode Abfrage",
		"barcodePromptText" : "Bitte Tischcode eingeben.",
		"checkInStep1Label1" : "Wähle deinen Spitznamen",
		"refreshNicknameBt" : "Neu",
		"checkInStep1Button" : "Los geht's!",
		"nicknameToggleHint" : "Nein/Ja",
		"checkInStep2Label1" : "Andere haben hier bereits eingecheckt.",
		"checkInStep2Label2" : "Mit jemand anderem einchecken?",
		"checkInStep2OnMyOwnButton" : "Ich bin alleine hier",
		"checkInErrorBarcode" : "Der Barcode ist nicht valide oder inaktiv!",
		"checkInErrorNickname" : "Der Spitzname muss zwischen {0} und {1} Zeichen lang sein.",
		"checkInErrorNicknameExists" : "Der Spitzname wird an diesem Tisch bereits benutzt.",
		"saveNicknameToggle" : "Spitzname speichern?",
		"checkInCanceled" : "Sitzung wurde durch Servicepersonal beendet.",
		"nickname" : "Spitzname",
		"restoreStateLoading" : "Aktiver CheckIn wird geladen ...",
		"restoreStateFailed" : "CheckIn nicht mehr gültig.<br/>Bitte neu einchecken.",
		// Menu
		"menuTab" : "Auswählen",
		"menuTitle" : "Deine Karte",
		"choicesPanelTitle" : "Du hast die Wahl ...",
		"putIntoCartButton" : "Auf den Bestellzettel",
		"choiceValErrMandatory" : "Bitte triff eine Wahl für {0}",
		"choiceValErrMin" : "Bitte min {0} Optionen in {1} auswählen.",
		"choiceValErrMax" : "Bitte max  {0} Optionen in {1} auswählen.",
		//Order
		"orderInvalid" : "Bitte Auswahl überprüfen.",
		"orderPlaced" : "Bestellung im Warenkorb.",
		"cartEmpty" : "Noch keine Bestellung getätigt.",
		"productPutIntoCardMsg" : "{0} auf Bestellzettel geparkt",
		"orderRemoved" : "Bestellung entfernt",
		"orderComment" : "Deine Wünsche",
		"amount" : "Menge",
		"amountspinnerLabel" : "Ich will ...",
		"orderSubmit" : "Bestellung abgeschickt ...<br/>Guten Appetit!",
		"productCartBt" : "Auf den Bestellzettel",
		"orderCanceled" : "{0} wurde storniert.",
		//Cart
		"cartviewTitle" : "Ich will ...",
		"cartTabBt" : "Bestellen",
		"dumpCart" : "Bestellzettel leeren?",
		"dumpItem" : "{0} entfernen?",
		"submitButton" : "Bestellen",
		"submitOrderProcess" : "Schicke Bestellung ...",
		"submitOrdersQuestion" : "Bestellung abschicken?",
		//Lounge
		"loungeviewTitle" : "Die Lounge",
		//MyOrders
		"myOrdersTitle" : "Bestellungen",
		"myOrdersTabBt" : "Bezahlen",
		"myOrdersTabLeaveBt" : "Verlassen",
		"payRequestButton" : "Bezahlen",
		"leaveButton" : "Verlassen",
		"orderTime" : "Bestellzeit",
		"myorderComment" : "Meine Wünsche",
		//Payment Request
		"paymentPickerTitle" : "Bezahlmethode",
		"paymentRequestSend": "Bitte einen Moment warten,</br>die Rechnung wird vorbereitet ...",
		//Settings
		"settingsTitle" : "Einstellungen",
		"nicknameDesc" : "Der Spitzname ist der Anzeigename für das Servicepersonal.</br>Änderungen wirken sich erst beim nächsten Check-In aus.",
		"newsletterRegisterBt": "Registrieren",
		"newsletterEmail" : "E-Mail",
		"newsletterRegisterSuccess" : "Danke! Eine Bestätigungsmail wird an {0} geschickt.",
		"newsletterInvalidEmail" : "Bitte gib eine gültige E-Mail Adresse an.",
		"newsletterDuplicateEmail" : "Diese E-Mail Adresse ist bereits registriert.",
		"newsletterPopupTitle" : "Newsletter abonnieren?", 
		"newsletterDontAskButton" : "Nicht mehr nachfragen!",
		"newsletterLabel" : "Nicht den Cloobster Big-Bang verpassen und für den Newsletter anmelden!",
		//Request
		"errorRequest" : "Anfrage konnte leider nicht bearbeitet werden.",
		"requestsButton" : "VIP",
		"requestsTitle" : "VIP",
		"requestCallWaiterSendMsd" : "Bitte einen Moment Geduld!<br>Es wird gleich jemand kommen.",
		"callWaiterButton" : "Bedienung rufen",
		"callWaiterRequestBadge" : "Bedienung gerufen",
		"cancelCallWaiterRequest" : "Danke, hat sich erledigt",
		"callWaiterCallHint" : "Gibt es ein Anliegen?",
		"callWaiterCancelHint" :	"Wir wurden gerufen und <br/>kommen so schnell wie möglich!",
		"vipGreetingMessage" : "Willkommen <span style='font-weight:bold;'>{0}</span> in deinem persönlichen VIP Bereich!",
		//Feedback
		"feedback" : "Feedback",
		"feedbackLabel" : "Sag uns deine Meinung.",
		"feedbackQuestion" : "Wie hat es dir gefallen?",
		"feedbackComment" : "Kommentar (optional)",
		"feedbackEmail" : "E-Mail (optional)",
		"feedbackCompleteTitle" : "Feedback abgeschickt",
		"feedbackCompleteMessage" : "Vielen Dank für Deine Meinung!",
		//Login
		"login.title" : "User Login",
		"login.field.email.placeholder" : "E-Mail",
		"login.field.password.placeholder" : "Passwort",
		"login.button.login" : "Login",
		"login.button.signup" : "Signup",
		"login.label.notamember" : "Kein Mitglied?",
		"account.signup.confirm.title" : "Werde Mitglied ...",
		"account.signup.confirm.message" : "Bei Cloobster registrieren?",
		"account.signup.success.title" : "Willkommen bei Cloobster",
		"account.signup.success.message" : "Danke das du dich registriert hast!<br/>",
		//errors
		"error" : "Fehler",
		"errorTitle" : "Fehler",		
		"errorMsg" : "Entschuldigung! Ein Fehler ist aufgetreten.<br/>Wir kümmern uns darum!",
		"errorResource" : "Daten konnten nicht vom Server geladen werden.",
		"errorPermission" : "Sitzung ist ungültig.",
		"errorCommunication" : "Es kann keine Verbindung zum Server hergestellt werden.<br/>Bitte probiere es noch einmal.",
		"error.menu.needsrefresh" : "Menü Daten nicht mehr aktuell. Bitte führen Sie die Bestellung nochmals durch.",
		"error.account.email.exists" : "Diese E-Mail wird bereits verwendet.",
		"error.account.email" : "Bitte gib eine gültige E-Mail an.",
		"error.account.password" : "Passwort muss min 6 Zeichen besitzen. Darunter 1 Zahl oder Sonderzeichen."
		}
	}
	
}());
