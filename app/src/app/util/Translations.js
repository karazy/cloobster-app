Ext.define('EatSense.util.Translations',{
	statics: {
		//list all translated languages
		available: ["EN", "DE", "ES", "IT", "FR"],
		data: {
	
		// General translations
		"ok" : {
			"DE" :  "OK",
			"EN" :  "OK",
			"ES" : "OK",
			"IT" : "OK",
			"FR" : "Ok"
		},
		"cancel" : {
			"DE" :  "Abbrechen",
			"EN" :  "Cancel",
			"ES" : "Cancelar",
			"IT" : "Annulla",
			"FR" : "Annuler"
		},
		"back" : {
			"DE" :  "Zurück",
			"EN" :  "Back",
			"ES" : "Atrás",
			"IT" : "Indietro",
			"FR" : "Retour"
		},
		"change" : {
			"DE" :  "Ändern",
			"EN" :  "Change",
			"ES" : "Modificar",
			"IT" : "Modifica",
			"FR" : "Modifier"
		},
		"barcode" : {
			"DE" :  "Barcode",
			"EN" :  "Bar code",
			"ES" : "Código de barras",
			"IT" : "Codice a barre",
			"FR" : "Code barres"
		},
		"close" : {
			"DE" :  "Schliessen",
			"EN" :  "Close",
			"ES" : "Cerrar",
			"IT" : "Chiudi",
			"FR" : "Fermer"
		},
		"loadingMsg" : {
			"DE" :  "Laden",
			"EN" :  "Loading",
			"ES" : "Cargando...",
			"IT" : "Caricamento...",
			"FR" : "Chargement"
		},
		"general.processing" : {
			"DE" :  "In Bearbeitung",
			"EN" :  "Processing",
			"ES" : "Procesando...",
			"IT" : "Operazione in corso...",
			"FR" : "Opération en cours"
		},
		"general.credentials.invalid" : {
			"DE" :  "Passwort und/oder Benutzername falsch!",
			"EN" :  "Password and/or user name incorrect!",
			"ES" : "¡Usuario y/o contraseña incorrectos!",
			"IT" : "Password o nome utente non corretti",
			"FR" : "Mot de passe ou nom d’utilisateur invalide"
		},
		"general.comingsoon" : {
			"DE" :  "Demnächst",
			"EN" :  "Coming soon",
			"ES" : "Próximamente",
			"IT" : "Prossimamente",
			"FR" : "Prochainement"
		},
		"general.about" : {
			"DE" :  "Information",
			"EN" :  "About",
			"ES" : "Acerca de",
			"IT" : "Chi siamo",
			"FR" : "à Propos de"
		},
		"general.companydetail" : {
			"DE" : "Impressum",
			"EN" : "Legal Notice",
			"ES" : "Pie de imprenta",
			"IT" : "Note legali",
			"FR" : "Mentions légales"
		},
		"general.legalnotice" : {
			"DE" : "AGB",
			"EN" : "Terms and conditions",
			"ES" : "Condiciones generales",
			"IT" : "Termini e condizioni",
			"FR" : "Conditions générales"
		},
		"general.help.dashboard.msg" : {
			"DE" :  "<b>Willkommen</b><br/>Um auf das Menü zuzugreifen,<br/>tippen Sie auf die Lasche links unten<br/> oder wischen Sie vom linken<br/> zum rechten Rand.",
			"EN" : "<b>Welcome</b><br/>You can access the menu<br/> by tapping the button at the lower left<br/> or by swiping from the left<br/> to the right edge.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"general.help.dashboard.gotit" : {
			"DE" :  "Alles klar!",
			"EN" : "Lets go!",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"save" : {
			"DE" :  "Speichern",
			"EN" :  "Save",
			"ES" : "Guardar",
			"IT" : "Salva",
			"FR" : "Enregistrer"
		},
		"hint" : {
			"DE" :  "Hinweis",
			"EN" :  "Message",
			"ES" : "Aviso",
			"IT" : "Messaggio",
			"FR" : "Message"
		},
		"success" : {
			"DE" :  "Erfolg",
			"EN" :  "Success",
			"ES" : "Éxito",
			"IT" : "Riuscito",
			"FR" : "Succès"
		},
		"yes" : {
			"DE" :  "Ja",
			"EN" :  "Yes",
			"ES" : "Sí",
			"IT" : "Sì",
			"FR" : "oui"
		},
		"no" : {
			"DE" :  "Nein",
			"EN" :  "No",
			"ES" : "No",
			"IT" : "No",
			"FR" : "Non"
		},
		"or" : {
			"DE" : "oder",
			"EN" : "or",
			"ES" : "o",
			"IT" : "o",
			"FR" : "ou"
		},
		"continue" : {
			"DE" :  "Weiter",
			"EN" :  "Next",
			"ES" : "Siguiente",
			"IT" : "Successivo",
			"FR" : "Suivant"
		},
		"leave" : {
			"DE" :  "Verlassen",
			"EN" :  "Quit",
			"ES" : "Cerrar",
			"IT" : "Chiudi",
			"FR" : "Quitter"
		},
		"retry" : {
			"DE" :  "Wiederholen",
			"EN" : "Retry",
			"ES" : "Intentar de nuevo",
			"IT" : "Riprova",
			"FR" : "réessayer"
		},
		"channelTokenError" : {
			"DE" :  "Updates im Hintergrund nicht funktionsfähig.",
			"EN" :  "Updates have not been successful.",
			"ES" : "No ha sido posible realizar las actualizaciones",
			"IT" : "Aggiornamento non riuscito",
			"FR" : "Les mises à jour n’ont pas été installées correctement"
		},
		"android.backbutton.exit" : {
			"DE" :  "Nochmal drücken, um zu beenden.",
			"EN" :  "Please confirm to close.",
			"ES" : "Confirmar cierre",
			"IT" : "Conferma per chiudere",
			"FR" : ""
		},
		"terms" : {
			"DE" :  "AGB",
			"EN" : "Terms",
			"ES" : "Aviso legal",
			"IT" : "Termini e condizioni",
			"FR" : "Conditions générales"
		},
		"delete" : {
			"DE" :  "Löschen",
			"EN" : "Delete",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"edit" : {
			"DE" :  "Bearbeiten",
			"EN" : "Edit",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"urlscheme.handle" : {
			"DE" :  "Einchecken oder Ort merken?",
			"EN" : "Check in or save place?",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"urlscheme.handle.visitonly" : {
			"DE" :  "Ort merken?",
			"EN" : "Save place?",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"urlscheme.tovisit" : {
			"DE" :  "Merken",
			"EN" : "Save",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"urlscheme.checkin" : {
			"DE" :  "Check in",
			"EN" : "Check in",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"pullrefresh" : {
			"DE" :  "Ziehen zum aktualisieren",
			"EN" : "Pull to refresh",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"releaserefreshtext" : {
			"DE" :  "Loslassen zum aktualisieren",
			"EN" : "Release to refresh",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		//month
		"month.0" : {
			"DE" :  "Januar",
			"EN" : "January",
			"ES" : "",
			"IT" : ""
		},
		"month.1" : {
			"DE" :  "Feburar",
			"EN" : "Feburary",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.2" : {
			"DE" :  "März",
			"EN" : "March",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.3" : {
			"DE" :  "April",
			"EN" : "April",
			"ES" : "",
			"IT" : ""
		},
		"month.4" : {
			"DE" :  "Mai",
			"EN" : "May",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.5" : {
			"DE" :  "Juni",
			"EN" : "June",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.6" : {
			"DE" :  "Juli",
			"EN" : "July",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.7" : {
			"DE" :  "August",
			"EN" : "August",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.8" : {
			"DE" :  "September",
			"EN" : "September",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.9" : {
			"DE" :  "Oktober",
			"EN" : "October",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.10" : {
			"DE" :  "November",
			"EN" : "November",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"month.11" : {
			"DE" :  "Dezember",
			"EN" : "December",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		// main menu
		"checkInButton" : {
			"DE" :  "Check-in",
			"EN" :  "Check-in",
			"ES" : "Iniciar sesión",
			"IT" : "Check-in",
			"FR" : ""
		},
		"currentDealsButton" : {
			"DE" :  "Deals",
			"EN" :  "Deals",
			"ES" : "Ofertas",
			"IT" : "Offerte",
			"FR" : "Offre"
		},
		"newRestaurantsButton" : {
			"DE" :  "Neue Restaurants",
			"EN" :  "New Locations",
			"ES" : "Nuevos restaurantes",
			"IT" : "Nuovi ristoranti",
			"FR" : "Nouveaux restaurants"
		},
		"settingsButton" : {
			"DE" :  "Einstellungen",
			"EN" :  "Settings",
			"ES" : "Perfil",
			"IT" : "Profilo",
			"FR" : "Profil"
		},
		"slidenav.list.title" : {
			"DE" :  "Menü",
			"EN" : "Menu",
			"ES" : "Menú",
			"IT" : "Menù",
			"FR" : "Menu"
		},
		"slidenav.button.home" : {
			"DE" :  "Startseite",
			"EN" : "Home",
			"ES" : "Inicio",
			"IT" : "Home",
			"FR" : "Accueil"
		},
		"slidenav.header.areas" : {
			"DE" :  "Sie sind eingecheckt",
			"EN" : "You checked in",
			"ES" : "Sesión iniciada",
			"IT" : "Hai fatto il check in",
			"FR" : "Vous êtes enregistré"
		},
		"slidenav.header.areas.subtitle" : {
			"DE" :  "Angebote in anderen Bereichen sehen",
			"EN" : "See offers of other areas",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"slidenav.button.dashboard" : {
			"DE" :  "Favoriten",
			"EN" : "Favorits",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"slidenav.header.help" : {
			"DE" : "Alles in meiner Hand",
			"EN" : "All in my hand",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		//Dashboard
		"dashboard.button.checkin" : {
			"DE" :  "Einchecken",
			"EN" :  "Check in",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"dashboard.button.tovisit" : {
			"DE" :  "Neuer Favorit",
			"EN" : "Add favorit",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"dashboard.button.demo" : {
			"DE" : "Demo",
			"EN" : "Demo",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"dashboardLabel1" : {
			"DE" :  "<h2>You Are Guest</h2><p>"+
			"Check in and enjoy our service.</p>",
			"EN" : "<h2>You Are Guest</h2><p>"+
				"Check in and enjoy our service.</p>",
			"ES" : "<h2>Está Usted en su casa</h2><p>"+
				"Inicie sesión y disfrute del servicio.</p>",
			"IT" : "<h2>Sei il benvenuto</h2><p>"+
				"Fai il check-in e godi dei nostri servizi.</p>",
			"FR" : "Enregistrez-vous et profitez de nos services"
		},
		"dashboardLabel2" : {
			"DE" :  "1. Einchecken<br/>2. Bestellen<br/>3. Genießen",
			"EN" :  "1. Check in<br/>2. Order<br/>3. Enjoy",
			"ES" : "1. Inicie sesión<br/>2. Solicite<br/>3. Disfrute",
			"IT" : "1. Fai il check-in<br/>2. Ordina <br/>3. Buon divertimento",
			"FR" : ""
		},
		"dashboard.button.settings" : {
			"DE" : "<h2>Account</h2><p>Dein Profil, Facebook, E-Mail</p>",
			"EN" : "<h2>Account</h2><p>Your Profile, Facebook, e-mail</p>",
			"ES" : "<h2>Cuenta</h2><p>Perfil, Facebook, correo electrónico</p>",
			"IT" : "<h2>Account</h2><p>Il tuo profilo, Facebook, E-Mail</p>",
			"FR" : ""
		},
		// Checkin
		"checkInTitle" : {
			"DE" :  "Check-in",
			"EN" :  "Check-in",
			"ES" : "Iniciar sesión",
			"IT" : "Check-in",
			"FR" : "Check-in"
		},
		"barcodePromptTitle" : {
			"DE" :  "Barcode-Abfrage",
			"EN" :  "Read bar code",
			"ES" : "Leer código de barras",
			"IT" : "Leggi il codice a barre",
			"FR" : "Lire le code barres"
		},
		"barcodePromptText" : {
			"DE" :  "Bitte QR-Code eingeben.",
			"EN" :  "Please enter qr-code code.",
			"ES" : "Introduzca el código de barras",
			"IT" : "Prego inserire il codice a barre",
			"FR" : ""
		},
		"checkInStep1Label1" : {
			"DE" : "Mit welchem Namen<br/>möchtest du einchecken?",
			"EN" :  "Please choose an alias.",
			"ES" : "Por favor, elija un nombre",
			"IT" : "Scegli un nome utente",
			"FR" : "Choisissez un pseudonyme"
		},
		"refreshNicknameBt" : {
			"DE" :  "Neu",
			"EN" :  "New",
			"ES" : "Nuevo",
			"IT" : "Nuovo",
			"FR" : "Nouveau"
		},
		"checkInStep1Button" : {
			"DE" :  "Los geht's",
			"EN" :  "Continue",
			"ES" : "Continuar",
			"IT" : "Continua",
			"FR" : "Continuer"
		},
		"nicknameToggleHint" : {
			"DE" :  "Nein/Ja",
			"EN" :  "No/Yes",
			"ES" : "No/Sí",
			"IT" : "No/Sì",
			"FR" : "Non/Oui"
		},
		"checkInStep2Label1" : {
			"DE" :  "Andere haben hier bereits eingecheckt.",
			"EN" :  "Someone else has checked in at this location.",
			"ES" : "Alguien ha iniciado sesión en esta ubicación",
			"IT" : "Qualcun'altro ha fatto il check-in qui",
			"FR" : "D’autres ont séjourné dans cet hôtel"
		},
		"checkInStep2Label2" : {
			"DE" :  "Mit einer anderen Person einchecken?",
			"EN" :  "Share check-in location with someone else?",
			"ES" : "¿Desea compartir su ubicación con alguien más?",
			"IT" : "Vuoi includere nel tuo check-in un'altra persona?",
			"FR" : "S’inscrire avec une autre personne?"
		},
		"checkInStep2OnMyOwnButton" : {
			"DE" :  "Ich bin alleine hier.",
			"EN" :  "I am on my own.",
			"ES" : "Estoy solo.",
			"IT" : "Sono qui da solo",
			"FR" : "Je suis seul(e)"
		},
		"checkInErrorBarcode" : {
			"DE" :  "Der Barcode ist nicht valide oder inaktiv!",
			"EN" :  "Bar code is not valid or inactive.",
			"ES" : "El código de barras no es válido o está inactivo.",
			"IT" : "Il codice a barre risulta invalido o inattivo",
			"FR" : "Le code n’est pas valide ou n’est pas activé!"
		},
		"checkInErrorNickname" : {
			"DE" :  "Der Name muss zwischen {0} und {1} Zeichen lang sein.",
			"EN" :  "Name must be between {0} and {1} characters.",
			"ES" : "El nombre debe tener entre {0} y {1} caracteres.",
			"IT" : "Il nome deve contenere un numero di caratteri tra {0} e {1}.",
			"FR" : "Les noms doivet comprendre entre (0) et (1)charactère."
		},
		"checkInErrorNicknameExists" : {
			"DE" :  "Der Name wird an diesem Ort bereits benutzt.",
			"EN" :  "Name already in use at this location.",
			"ES" : "El nombre ya está en uso en esta ubicación",
			"IT" : "Il nome utente è già in uso in questo luogo",
			"FR" : "Le nom est déjà utilisé à cet endroit"
		},
		"saveNicknameToggle" : {
			"DE" :  "Namen merken?",
			"EN" :  "Remember name?",
			"ES" : "¿Recordar nombre?",
			"IT" : "Ricordare il nome?",
			"FR" : "Enregistrer le nom?"
		},
		"checkInCanceled" : {
			"DE" :  "Sitzung wurde durch Servicepersonal beendet.",
			"EN" :  "Session has been closed.",
			"ES" : "Se cerró la sesión.",
			"IT" : "La sessione è stata chiusa",
			"FR" : "Fin de la session"
		},
		"checkin.confirm.title" : {
			"DE" :  "Willkommen",
			"EN" : "Welcome",
			"ES" : "Bienvenido",
			"IT" : "Benvenuto",
			"FR" : "Bienvenue"
		},
		"nickname" : {
			"DE" :  "Name",
			"EN" :  "Name",
			"ES" : "Nombre",
			"IT" : "Nome",
			"FR" : "Nom"
		},
		"checkin.init.loading" : {
			"DE" :  "CheckIn bei {0} ...",
			"EN" : "Check-in at {0} ...",
			"ES" : "Iniciar sesión en {0} ...",
			"IT" : "Check-in a {0} ...",
			"FR" : "S’enregistrer à"
		},
		"restoreStateLoading" : {
			"DE" :  "Check-in wiederherstellen",
			"EN" :  "Restore check-in",
			"ES" : "Restaurar sesión",
			"IT" : "Ripristina il check-in",
			"FR" : "Restaurer la session"
		},
		"restoreStateFailed" : {
			"DE" :  "Check-in nicht mehr gültig.<br/>Bitte neu einchecken.",
			"EN" :  "Check-in invalid.<br/>Please check in again",
			"ES" : "Sesión no iniciada.<br/>Iniciar sesión de nuevo.",
			"IT" : "Check-in non valido",
			"FR" : "La session n’est plus valide"
		},
		"checkin.restore.inactive" : {
			"DE" :  "Check-in abgelaufen. <br/>Bitte neu einchecken.",
			"EN" : "Check-in expired.<br/>Please check in again.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"checkin.nickname.palceholder" : {
			"DE" :  "z. B. Max Mustermann",
			"EN" : "e.g. John Doe",
			"ES" : "P. ej: Miguel Pérez",
			"IT" : "es. Mario Rossi",
			"FR" : "ex: Michel Dupont"
		},
		"checkin.demo.msg" : {
			"DE" :  "Im Demo Hotel einchecken?",
			"EN" : "Check-In at demo hotel?",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		// Menu
		"menuTab" : {
			"DE" :  "Angebote",
			"EN" :  "Offers",
			"ES" : "Ofertas",
			"IT" : "Offerte",
			"FR" : "Offre"
		},
		"menuTitle" : {
			"DE" :  "Unser Angebot",
			"EN" :  "Our Offer",
			"ES" : "Nuestra oferta",
			"IT" : "La nostra offerta",
			"FR" : "Notre offre"
		},
		"choicesPanelTitle" : {
			"DE" :  "Bitte wählen Sie",
			"EN" :  "Please choose",
			"ES" : "Por favor, elija",
			"IT" : "Scegliere, prego",
			"FR" : "Choisissez svp"
		},
		"putIntoCartButton" : {
			"DE" :  "Warenkorb",
			"EN" :  "Add to cart",
			"ES" : "Añadir a la cesta",
			"IT" : "Aggiungi al carrello",
			"FR" : "Ajouter au panier"
		},
		"choiceValErrMandatory" : {
			"DE" :  "Bitte eine Auswahl treffen für {0}.",
			"EN" :  "Please make a choice for {0}.",
			"ES" : "Por favor, elija una opción para {0}.",
			"IT" : "Scegli un'opzione per {0}.",
			"FR" : "Choisissez une option svp"
		},
		"choiceValErrMin" : {
			"DE" :  "Bitte min. {0} Option(en) in {1} auswählen.",
			"EN" :  "Please select at least {0} option(s) in {1}.",
			"ES" : "Por favor, seleccione {0} opción(es) de {1}.",
			"IT" : "Per favore, seleziona almeno {0} opzione (-i) in {1}.", 
			"FR" : "Choisissez au minimum une option svp"
		},
		"choiceValErrMax" : {
			"DE" :  "Bitte max. {0} Optionen in {1} auswählen.",
			"EN" :  "Please do not exceed {0} option(s) in {1}.",
			"ES" : "Por favor, seleccione un máximo de {0} opciones en {1}.",
			"IT" : "Per favore, seleziona un massimo di {0} opzione (-i) in {1}.", 
			"FR" : "S’il vous plaît choisissez au maximum (0) options en (1)"
		},
		"menu.product.detail.loading" : {
			"DE" :  "Lade Produktdaten...",
			"EN" :  "Loading product information",
			"ES" : "Cargando información del producto",
			"IT" : "Caricamento informazioni prodotto",
			"FR" : "Chargement des informations sur le produit"
		},
		//Order
		"orderInvalid" : {
			"DE" :  "Bitte Auswahl überprüfen.",
			"EN" :  "Please confirm your choice.",
			"ES" : "Confirmar selección",
			"IT" : "Conferma la tua selezione",
			"FR" : "Veuillez confirmer votre choix svp"
		},
		"orderPlaced" : {
			"DE" :  "Bestellung im Warenkorb.",
			"EN" :  "Add to cart.",
			"ES" : "Añadir a la cesta",
			"IT" : "Aggiungi al carrello",
			"FR" : "Ajouter au panier"
		},
		"cartEmpty" : {
			"DE" :  "Noch keine Bestellung getätigt.",
			"EN" :  "No current order.",
			"ES" : "No hay ningún pedido",
			"IT" : "Nessun ordine al momento",
			"FR" : "Aucun article dans le panier"
		},
		"productPutIntoCardMsg" : {
			"DE" :  "{0} in Warenkorb gelegt.",
			"EN" :  "{0} added to cart.",
			"ES" : "{0} añadido a la cesta.",
			"IT" : "{0} aggiunto al carrello.",
			"FR" : "Ajouté au panier"
		},
		"orderRemoved" : {
			"DE" :  "Bestellung entfernt.",
			"EN" :  "Order deleted.",
			"ES" : "Pedido eliminado",
			"IT" : "Ordine cancellato.",
			"FR" : "Commande annulée"
		},
		"orderComment" : {
			"DE" :  "Besondere Wünsche",
			"EN" :  "Add your comments here",
			"ES" : "Escriba sus comentarios aquí:",
			"IT" : "Esigenze particolari?",
			"FR" : "Vos commentaires"
		},
		"amount" : {
			"DE" :  "Menge",
			"EN" :  "Amount",
			"ES" : "Cantidad",
			"IT" : "Quantità",
			"FR" : "Quantité"
		},
		"amountspinnerLabel" : {
			"DE" :  "Ich will",
			"EN" :  "I want",
			"ES" : "Desearía",
			"IT" : "Vorrei",
			"FR" : "Je veux"
		},
		"orderSubmit" : {
			"DE" :  "Bestellung abgeschickt ...",
			"EN" :  "Order sent ...",
			"ES" : "Solicitud enviada",
			"IT" : "Ordine inviato",
			"FR" : "Commande envoyée"
		},
		"productCartBt" : {
			"DE" :  "Warenkorb",
			"EN" :  "Add to cart",
			"ES" : "Añadir a la cesta",
			"IT" : "Aggiungere al carrello",
			"FR" : "Panier"
		},
		"orderCanceled" : {
			"DE" :  "{0} wurde storniert.",
			"EN" :  "{0} has been canceled.",
			"ES" : "{0} cancelada.",
			"IT" : "{0} è stato annullato.",
			"FR" : "a été annulée"
		},
		"order.detail.title" : {
			"DE" :  "Editieren",
			"EN" : "Edit",
			"ES" : "Editar",
			"IT" : "Modifica",
			"FR" : "Modifier"
		},
		"order.disabled" : {
			"DE" :  "Dieses Angebot dient nur zur Information.",
			"EN" : "This offer only serves for information.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		//Cart
		"cartviewTitle" : {
			"DE" :  "Bestellung",
			"EN" :  "Order",
			"ES" : "Pedido",
			"IT" : "Ordine",
			"FR" : "Commander"
		},
		"cartTabBt" : {
			"DE" :  "Warenkorb",
			"EN" :  "Cart",
			"ES" : "Cesta",
			"IT" : "Carrello",
			"FR" : "Panier"
		},
		"dumpCart" : {
			"DE" :  "Warenkorb leeren?",
			"EN" :  "Empty cart?",
			"ES" : "¿Vaciar cesta?",
			"IT" : "Svuotare il carrello?",
			"FR" : "Vider le panier?"
		},
		"dumpItem" : {
			"DE" :  "{0} entfernen?",
			"EN" :  "Cancel {0}?",
			"ES" : "¿Cancelar {0}?",
			"IT" : "Eliminare {0}?",
			"FR" : "Annuler"
		},
		"submitButton" : {
			"DE" :  "Senden",
			"EN" :  "Send",
			"ES" : "Enviar",
			"IT" : "Invia",
			"FR" : "Envoyer"
		},
		"submitOrderProcess" : {
			"DE" :  "Schicke Bestellung",
			"EN" :  "Sending order",
			"ES" : "Enviar pedido",
			"IT" : "Ordine in invio...",
			"FR" : "Envoyer la commande"
		},
		"submitOrdersQuestion" : {
			"DE" :  "Bestellung verbindlich abschicken?",
			"EN" :  "Confirm & send order?",
			"ES" : "¿Confirmar y enviar pedido?",
			"IT" : "Confermi l'invio dell'ordine?",
			"FR" : "Confirmer la commande?"
		},
		"cart.button.deleteall" : {
			"DE" :  "Löschen",
			"EN" :  "Delete",
			"ES" : "Eliminar",
			"IT" : "Cancella",
			"FR" : "Supprimer"
		},
		//Lounge Dashboard
		"clubdashboard.tab.title" : {
			"DE" :  "Home",
			"EN" :  "Home",
			"ES" : "Inicio",
			"IT" : "Home",
			"FR" : "Accueil"
		},
		"clubdashboard.label.description" : {
			// "DE" :  "<h2>{0},</h2><p>Herzlich Willkommen im</p><p>\"{1}\"</p>",
			"DE" : "Willkommen <span class='user'>{0}</span>,<br/><span class='location-marker'></span> {1}",
			"EN" :  "<h2>{0},</h2><p>welcome to</p><p>\"{1}\"</p>",			
			"ES" : "<h2>{0},</h2><p>Bienvenido ",
			"IT" : "Benvenuto a</p><p>\"{1}\"</p>",
			"FR" : "<h2>{0},</h2><p>Bienvenue a</p><p>\"{1}\"</p> "
		},
		"clubdashboard.button.vip" : {
			"DE" :  "Service Call",
			"EN" :  "Service Call",
			"ES" : "Llamada de servicio",
			"IT" : "Service Call",
			"FR" : "Service call"
		},
		"clubdashboard.button.vip.text" : {
			"DE" :  "Fragen Sie uns",
			"EN" :  "Ask us",
			"ES" : "Pregúntenos",
			"IT" : "Inviaci una domanda",
			"FR" : "Posez-nous vos questions"
		},
		"clubdashboard.button.feedback" : {
			"DE" :  "Feedback",
			"EN" :  "Feedback",
			"ES" : "Comentarios",
			"IT" : "Feedback",
			"FR" : "Commentaires"
		},
		"clubdashboard.button.feedback.text" : {
			"DE" :  "Ihre Meinung",
			"EN" : "Tell us",
			"ES" : "Su opinión",
			"IT" : "Il tuo commento",
			"FR" : "Votre avis"
		},
		"clubdashboard.button.infopage" : {
			"DE" :  "A bis Z",
			"EN" : "A to Z",
			"ES" : "De la A a la Z",
			"IT" : "Dalla A alla Z",
			"FR" : "A à Z"
		},
		"clubdashboard.button.infopage.text" : {
			"DE" :  "Alle Informationen",
			"EN" : "All information",
			"ES" : "Toda la información",
			"IT" : "Tutte le informazioni",
			"FR" : "Toutes les informations"
		},
		"clubdashboard.button.info" : {
			"DE" :  "Info",
			"EN" :  "Info",
			"ES" : "Información",
			"IT" : "Info",
			"FR" : "Informations"
		},
		"clubdashboard.button.events" : {
			"DE" :  "Events",
			"EN" :  "Events",
			"ES" : "Eventos",
			"IT" : "Eventi",
			"FR" : "évènements"
		},
		"clubdashboard.button.aroundme" : {
			"DE" :  "Around me",
			"EN" :  "Around me",
			"ES" : "En torno a mí",
			"IT" : "Intorno a me",
			"FR" : "Autour de moi"
		},
		"clubdashboard.button.exit" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave",
			"ES" : "Salir",
			"IT" : "Esci",
			"FR" : "Quitter"
		},
		"clubdashboard.leave.message" : {
			"DE" :  "Wirklich verlassen?",
			"EN" :  "Do you want to quit?",
			"ES" : "¿Está Usted seguro de que desea salir?",
			"IT" : "Sei sicuro di voler uscire?",
			"FR" : "Voulez-vous vraiment quitter?"
		},
		"clubdashboard.welcomespot.title" : {
			"DE" :  "Herzlich Willkommen",
			"EN" : "Welcome",
			"ES" : "Bienvenido",
			"IT" : "Benvenuto",
			"FR" : "Bienvenue"
		},
		"clubdashboard.welcomespot.text" : {
			"DE" :  "Diese Funktion steht hier nicht zur Verfügung. Bitte checken Sie an einer geeigneten Stelle "+
			"in unserem Haus ein.",
			"EN" : "This function is not available here. Please checkin at another spot in our house.",
			"ES" : "Función no disponible aquí. Por favor, pruebe otro spot",
			"IT" : "Questa funzione non è disponibile qui. Fai il check-in in un altro punto del nostro locale",
			"FR" : "Cette fonction n’est pas disponible. "
		},
		"clubdashboard.menu.text" : {
			"DE" :  "Unsere Angebote",
			"EN" : "Our offers",
			"ES" : "Nuestras ofertas",
			"IT" : "Le nostre offerte",
			"FR" : "Notre offre"
		},
		//Info Pages
		"infopage.overview.title" : {
			"DE" :  "Information",
			"EN" : "Information",
			"ES" : "Información útil",
			"IT" : "Informazioni utili",
			"FR" : "Informations utiles"
		},
		"infopage.loadingmsg" : {
			"DE" : "Lade Infoseiten...",
			"EN" : "Loading infopages...",
			"ES" : "Cargando páginas informativas",
			"IT" : "Pagina informativa in carimento",
			"FR" : "Chargement de pages d’information"
		},
		"infopage.link.button" : {
			"DE" :  "Link öffnen",
			"EN" : "Open link",
			"ES" : "Abrir enlace",
			"IT" : "Apri link",
			"FR" : "Ouvrir lien"
		},
		//MyOrders
		"myOrdersTitle" : {
			"DE" :  "Bestellung",
			"EN" :  "Order",
			"ES" : "Pedido",
			"IT" : "Ordinato",
			"FR" : "Commander"
		},
		"myOrdersTabBt" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave",
			"ES" : "Salir",
			"IT" : "Uscire",
			"FR" : "quitter"
		},
		"myOrdersTabLeaveBt" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave",
			"ES" : "Salir",
			"IT" : "Uscire",
			"FR" : "Quitter"
		},
		"payRequestButton" : {
			"DE" :  "Bezahlen",
			"EN" :  "Bill",
			"ES" : "Factura",
			"IT" : "Conto",
			"FR" : "Facture"
		},
		"leaveButton" : {
			"DE" :  "Verlassen",
			"EN" :  "Leave",
			"ES" : "Salir",
			"IT" : "Uscire",
			"FR" : "Quitter"
		},
		"orderTime" : {
			"DE" :  "Bestellzeit",
			"EN" :  "Order lead-time",
			"ES" : "Tiempo para realizar el pedido",
			"IT" : "Tempo di esecuzione dell'ordine",
			"FR" : "Temps de commande"
		},
		"myorderComment" : {
			"DE" :  "Meine Wünsche",
			"EN" :  "My order",
			"ES" : "Mi pedido",
			"IT" : "Il mio ordine",
			"FR" : "Commande"
		},
		"myorders.description" : {
			"DE" :  "Hier werden Ihre abgeschickten Bestellungen angezeigt.<br/>Zur Zeit haben Sie nichts bestellt.",
			"EN" :  "Your ordered items are listed here.<br/>There are no recent orders.",
			"ES" : "Los artículos solicitados se encuentran en la siguiente lista.<br/>No hay pedidos recientes.",
			"IT" : "I tuoi ordini sono elencati qui.<br/>Nessun ordine recente.",
			"FR" : "Ici vous pouvez voir le récapitulatif de votre commande. .<br/> Aucune commande n’a été effectuée pour l’instant."
		},
		//Payment Request
		"paymentPickerTitle" : {
			"DE" :  "Bezahlmethode",
			"EN" :  "Payment method",
			"ES" : "Modo de pago",
			"IT" : "Metodo di pagamento",
			"FR" : "Moyen de paiement"
		},
		"paymentRequestSend" : {
			"DE" :  "Sende Bezahlwunsch.",
			"EN" :  "Sending payment request.",
			"ES" : "Su solicitud de pago ha sido enviada",
			"IT" : "La tua richiesta di pagamento è stata inviata",
			"FR" : "Votre demande de paiement a été envoyée."
		},
		"myorders.messages.billnew.message" : {
		 	"DE" :  "Ihre Rechnung ({0}) wurde erstellt.",
		 	"EN" : "Your bill ({0}) has been issued.",
		 	"ES" : "Su factura ({0}) ha sido emitida.",
			"IT" : "Il tuo conto ({0}) è stato emesso",
			"FR" : "Votre commande a été envoyée"
		}, 
		//Settings
		"settingsTitle" : {
			"DE" :  "Profil",
			"EN" :  "Profile",
			"ES" : "Perfil",
			"IT" : "Profilo",
			"FR" : "Profil"
		},
		"nicknameDesc" : {
			"DE" :  "Der Name der bei einem Check-In verwendet wird.",
			"EN" :  "Name is used to identify your Check-In.",
			"ES" : "El nombre se utiliza para identificar sus pedidos. Los cambios surtirán efecto después de que Usted haya iniciado sesión de nuevo",
			"IT" : "Il nome serve per identificare il tuo ordine. Le modifiche saranno effettive al prossimo check-in.",
			"FR" : "Ce nom est utilisé pour identifiers vos commandes. Les chagements seront pris en compte lors de votre prochaine connection."
		},
		"newsletterRegisterBt" : {
			"DE" :  "Registrieren",
			"EN" :  "Register",
			"ES" : "Regístrese",
			"IT" : "Registrati",
			"FR" : "Enregistrement"
		},
		"newsletterEmail" : {
			"DE" :  "E-Mail",
			"EN" :  "Email",
			"ES" : "Correo electrónico",
			"IT" : "E-mail",
			"FR" : "E-mail"
		},
		"newsletterRegisterSuccess" : {
			"DE" :  "Danke! Eine Bestätigungsmail wird an {0} geschickt.",
			"EN" :  "Thank you! Confirmation email will be sent to {0} shortly.",
			"ES" : "¡Muchas gracias! En breve, recibirá la confirmación en el correo electrónico {0}",
			"IT" : "Grazie! Un'email di conferma verrà inviata a breve a {0}.",
			"FR" : "Merci! Un E-mail de confirmation sera envoyé à"
		},
		"newsletterInvalidEmail" : {
			"DE" :  "Bitte eine gültige E-Mail Adresse eingeben.",
			"EN" :  "Please enter a valid email address.",
			"ES" : "Por favor, introduzca una dirección de correo electrónico válida.",
			"IT" : "Per favore, inserisci un indirizzo email valido.",
			"FR" : "Entrez une adresse mail valide svp"
		},
		"newsletterDuplicateEmail" : {
			"DE" :  "Diese E-Mail Adresse ist bereits registriert.",
			"EN" :  "Email already exists.",
			"ES" : "La dirección de correo electrónica introducida ya se encuentra en el sistema",
			"IT" : "L'email è già presente nel sistema",
			"FR" : "Cette adresse mail existe déjà"
		},
		"newsletterPopupTitle" : {
			"DE" :  "Newsletter abonnieren?",
			"EN" :  "Subscribe to newsletter?",
			"ES" : "¿Desea suscribirse al boletín?",
			"IT" : "Desideri iscriverti alla newsletter?",
			"FR" : "Recevoir la newsletter?"
		}, 
		"newsletterDontAskButton" : {
			"DE" :  "Nicht mehr nachfragen!",
			"EN" :  "Please don't ask again!",
			"ES" : "No volver a preguntar",
			"IT" : "Non chiedere di nuovo",
			"FR" : "Ne plus demander!"
		},
		"newsletterLabel" : {
			"DE" :  "Nicht den Cloobster Big-Bang verpassen und für den Newsletter anmelden!",
			"EN" :  "Subscribe to newsletter!",
			"ES" : "¡No deje pasar esta gran oportunidad y suscríbase al boletín!",
			"IT" : "Non perdere questa grande opportunità e iscriviti alla newsletter",
			"FR" : "M’inscrire à la newsletter!"
		},
		"settings.button.logout" : {
			"DE" : "Logout",
			"EN" : "Logout",
			"ES" : "Cerrar sesión",
			"IT" : "Log out",
			"FR" : "déconnexion"
		},
		"settings.account.label.edit" : {
			"DE" :  "Ändern Sie:",
			"EN" :  "Change:",
			"ES" : "Cambiar:",
			"IT" : "Modifica:",
			"FR" : "Modifiez"
		},
		"settings.account.label.email" : {
			"DE" :  "Account E-Mail",
			"EN" :  "Account email address",
			"ES" : "Dirección de correo electrónico",
			"IT" : "E-mail account",
			"FR" : "Compte E-mail"
		},
		"settings.account.field.email" : {
			"DE" :  "E-Mail",
			"EN" :  "Email address",
			"ES" : "Dirección de correo electrónico",
			"IT" : "E-mail",
			"FR" : "E-mail"
		},
		"settings.account.button.email" : {
			"DE" :  "E-Mail",
			"EN" :  "Email",
			"ES" : "Correo electrónico",
			"IT" : "E-mail",
			"FR" : "E-mail"
		},
		"settings.account.label.password" : {
			"DE" :  "Account Passwort",
			"EN" :  "Account password",
			"ES" : "Contraseña de la cuenta",
			"IT" : "Account password",
			"FR" : "Compte mot de passe"
		},
		"settings.account.field.password" : {
			"DE" :  "Passwort",
			"EN" :  "Password",
			"ES" : "Contraseña",
			"IT" : "Password",
			"FR" : "Mot de passe"
		},
		"settings.account.button.password" : {
			"DE" :  "Passwort",
			"EN" :  "Password",
			"ES" : "Contraseña",
			"IT" : "Password",
			"FR" : "Mot de passe"
		},
		"settings.button.login" : {
			"DE" :  "Login/Anmelden",
			"EN" : "Login/Register",
			"ES" : "Iniciar sesión/Registrarse",
			"IT" : "Log in/Registrati",
			"FR" : "Se connecter/s’inscrire"
		},
		"settings.account.email" : {
			"DE" :  "Ihr Konto:<br/>{email}",
			"EN" :  "Your account:<br/>{email}",
			"ES" : "Su cuenta:<br/>{email}",
			"IT" : "Il tuo account:<br/>{email}",
			"FR" : "Votre compte: :<br/>{email} "
		},
		"settings.account.fbconnected" : {
			"DE" :  "Account mit Facebook verknüpft.",
			"EN" :  "Account linked with Facebook.",
			"ES" : "Cuenta asociada a Facebook",
			"IT" : "Account associato a Facebook",
			"FR" : "Connecter votre compte à Facebook"
		},
		"settings.section.infos" : {
			"DE" :  "Weitere Infos",
			"EN" :  "Other data",
			"ES" : "Más información",
			"IT" : "Più informazioni",
			"FR" : "Plus d’infos"
		},
		"emailsetting.title" : {
			"DE" :  "E-Mail ändern",
			"EN" :  "Change email address",
			"ES" : "Cambiar dirección de correo electrónico",
			"IT" : "Cambia indirizzo email",
			"FR" : "Modifier l’adresse mail"
		},
		"emailsetting.description" : {
			"DE" :  "E-Mail für Account ändern",
			"EN" :  "Change email for your account.",
			"ES" : "Cambiar contraseña de la cuenta",
			"IT" : "Cambia email per il tuo account",
			"FR" : "Changer l’adresse mail de votre compte"
		},
		"emailsetting.password.field" : {
			"DE" :  "Passwort",
			"EN" :  "Password",
			"ES" : "Contraseña",
			"IT" : "Password",
			"FR" : "Mot de passe"
		},
		"emailsetting.email.field" : {
			"DE" :  "Neue E-Mail",
			"EN" :  "New email address",
			"ES" : "Nueva dirección de correo electrónico",
			"IT" : "Nuova email",
			"FR" : "Nouvelle adresse mail"
		},
		"emailsetting.repeat.field" : {
			"DE" :  "E-Mail wiederholen",
			"EN" :  "Repeat email address",
			"ES" : "Repita la dirección de correo electrónico",
			"IT" : "Ripeti l'indirizzo email",
			"FR" : "Répéter l’adresse mail"
		},
		"emailsetting.error.noemail" : {
			"DE" :  "Neue E-Mail darf nicht leer sein.",
			"EN" :  "Email address cannot be empty.",
			"ES" : "El campo 'Dirección de correo electrónico' es obligatorio",
			"IT" : "Il campo \"email\" è obbligatorio",
			"FR" : "Le champ “adresse mail” est obligatoire"
		},
		"emailsetting.error.invalidmail" : {
			"DE" :  "Ungültige E-Mail.",
			"EN" :  "Invalid email address.",
			"ES" : "Dirección de correo electrónico incorrecta",
			"IT" : "Indirizzo email non valido",
			"FR" : "Adresse mail invalide"
		},
		"emailsetting.error.nopassword" : {
			"DE" :  "Passwort darf nicht leer sein.",
			"EN" :  "Password cannot be empty.",
			"ES" : "Contraseña obligatoria",
			"IT" : "Password obbligatoria",
			"FR" : "Mot de passe obligatoire"
		},
		"emailsetting.error.emailmatch" : {
			"DE" :  "E-Mails stimmen nicht überein",
			"EN" :  "Email address does not match.",
			"ES" : "Las direcciones de correo electrónico no coinciden",
			"IT" : "Gli indirizzi email non coincidono.",
			"FR" : "L’adresse mail n’est pas valide"
		},
		"emailsetting.success" : {
			"DE" :  "E-Mail erfolgreich geändert. Eine Bestätigung wurde an neue Adresse geschickt.",
			"EN" :  "Email address has been changed. A confirmation email has been sent to new address.",
			"ES" : "Dirección de correo electrónico modificada. Seguidamente, se le enviará la confirmación a su nueva dirección.",
			"IT" : "L'indirizzo email è stato cambiato con successo. Una conferma verrà inviata al nuovo indirizzo.",
			"FR" : "L’adresse mail a été modifiée avec succeès. Un mail de confirmation vous été envoyé à votre nouvelle adresse."
		},
		"passwordsetting.title" : {
			"DE" :  "Passwort ändern",
			"EN" :  "Change password",
			"ES" : "Cambiar contraseña",
			"IT" : "Modifica password",
			"FR" : "Modifier mot de passe"
		},
		"passwordsetting.description" : {
			"DE" :  "Passwort für Account ändern",
			"EN" :  "Change password for your account.",
			"ES" : "Cambiar contraseña para su cuenta de",
			"IT" : "Modifica la password del tuo account",
			"FR" : "Modifier le mot de passe de votre compte"
		},
		"passwordsetting.oldpassword.field" : {
			"DE" :  "Altes Passwort",
			"EN" :  "Old password",
			"ES" : "Antigua contraseña",
			"IT" : "Vecchia password",
			"FR" : "Ancien mot de passe"
		},
		"passwordsetting.newpassword.field" : {
			"DE" :  "Neues Passwort",
			"EN" :  "New password",
			"ES" : "Nueva contraseña",
			"IT" : "Nuova password",
			"FR" : "Nouveau mot de passe"
		},
		"passwordsetting.repeatpassword.field" : {
			"DE" :  "Passwort wiederholen",
			"EN" :  "Repeast password",
			"ES" : "Repetir contraseña",
			"IT" : "Ripeti password",
			"FR" : "Répéter le mot de passe"
		},
		"passwordsetting.error.newpassword" : {
			"DE" :  "Neues Passwort darf nicht leer sein.",
			"EN" :  "New password cannot be empty.",
			"ES" : "El campo 'nueva contraseña' es obligatorio",
			"IT" : "Il campo \"nuova password\" è obbligatorio.",
			"FR" : "Le champ “nouveau mot de passe” est obligatoire"
		},
		"passwordsetting.error.passwordmatch" : {
			"DE" :  "Passwörter stimmen nicht überein",
			"EN" :  "Password does not match.",
			"ES" : "Las contraseñas no coinciden",
			"IT" : "Le password non coincidono",
			"FR" : "Mot de passe invalide"
		},
		"passwordsetting.error.nopassword" : {
			"DE" :  "Altes Passwort darf nicht leer sein.",
			"EN" :  "Old password cannot be empty.",
			"ES" : "El campo 'Antigua contraseña' es obligatorio",
			"IT" : "Il campo \"vecchia password\" è obbligatorio.",
			"FR" : "Le champ “ancien mot de passe” est obligatoire"
		},
		"passwordsetting.success" : {
			"DE" :  "Passwort erfolgreich geändert.",
			"EN" :  "Password has been changed.",
			"ES" : "La contraseña ha sido modificada con éxito",
			"IT" : "La password è stata modificata con successo.",
			"FR" : "Le mot de passe a été modifié avec succès"
		},
		"settings.button.connectfb" : {
			"DE" :  "Verbinden mit Facebook",
			"EN" :  "Connect with Facebook",
			"ES" : "Conectar con Facebook",
			"IT" : "Connettiti con Facebook",
			"FR" : "Connectez-vous sur Facebook"
		},
		//Request
		"errorRequest" : {
			"DE" :  "Anfrage konnte leider nicht bearbeitet werden.",
			"EN" : "Request could not be processed.",
			"ES" : "Su petición no ha podido ser procesada",
			"IT" : "La richiesta non ha potuto essere processata",
			"FR" : "Votre demande n’a pu être traitée"
		},
		"requestsButton" : {
			"DE" :  "VIP",
			"EN" :  "VIP",
			"ES" : "VIP",
			"IT" : "VIP",
			"FR" : "VIP"
		},
		"requestsTitle" : {
			"DE" :  "Service Call",
			"EN" :  "Service Call",
			"ES" : "Llamada de servicio",
			"IT" : "Service",
			"FR" : "Service Call"
		},
		"requestCallWaiterSendMsd" : {
			"DE" :  "Bitte einen Moment Geduld!<br>Es wird gleich jemand kommen.",
			"EN" :  "One moment please!<br>We'll be serving you soon.",
			"ES" : "Un momento, por favor<br>Le atenderemos enseguida.",
			"IT" : "Attendere prego",
			"FR" : "Veuillez patienter svp."
		},
		"callWaiterButton" : {
			"DE" :  "Service Call",
			"EN" :  "Service Call",
			"ES" : "Llamada de servicio",
			"IT" : "Service Call",
			"FR" : "Service Call"
		},
		"callWaiterRequestBadge" : {
			"DE" :  "Sie haben uns gerufen.",
			"EN" :  "We'll be at your service soon.",
			"ES" : "En breve, le atenderemos",
			"IT" : "A breve soddisferemo la tua richiesta",
			"FR" : ""
		},
		"cancelCallWaiterRequest" : {
			"DE" :  "Danke, hat sich erledigt",
			"EN" :  "Cancel request",
			"ES" : "Cancelar solicitud",
			"IT" : "Annulla richiesta",
			"FR" : "Demande annulée"
		},
		"callWaiterCallHint" : {
			"DE" :  "Können wir für Sie da sein?",
			"EN" :  "What can we do for you?",
			"ES" : "¿Qué podemos hacer por Usted?",
			"IT" : "Cosa possiamo fare per te?",
			"FR" : "Que pouvons-nous faire pour vous?"
		},
		"callWaiterCancelHint" : {
			"DE" :  "Wir wurden gerufen und <br/>melden uns so schnell wie möglich!",
			"EN" :  "We have been notified!<br>We'll be serving you soon.",
			"ES" : "¡Llamada recibida!<br/>Le atenderemos enseguida.",
			"IT" : "Abbiamo ricevuto la tua richiesta!<br>La soddisferemo a breve.",
			"FR" : "Votre demande a bien été prise en compte. Nous vous contacterons dans les meilleurs délais. "
		},
		"vipGreetingMessage" : {
			"DE" :  "Willkommen <span style='font-weight:bold;'>{0}</span><br/>in Ihrem persönlichen VIP-Bereich!",
			"EN" :  "Welcome, <span style='font-weight:bold;'>{0}</span>,<br/> to your personal VIP area!",
			"ES" : "Bienvenido <span style='font-weight:bold;'>{0}</span><br/> a su área personal VIP!",
			"IT" : "Benvenuto <span style='font-weight:bold;'>{0}</span><br/> nella tua area personale VIP!",
			"FR" : "Bienvenue, <span style='font-weight:bold;'>{0}</span>,<br/> dans votre carré VIP!"
		},
		//Feedback
		"feedback" : {
			"DE" :  "Feedback",
			"EN" :  "Feedback",
			"ES" : "Comentarios",
			"IT" : "Feedback",
			"FR" : "Commentaires"
		},
		"feedback.button.send" : {
			"DE" :  "Senden",
			"EN" : "Send",
			"ES" : "Enviar",
			"IT" : "Invia",
			"FR" : "Envoyer"
		},
		"feedbackLabel" : {
			"DE" :  "Sagen Sie uns Ihre Meinung.",
			"EN" :  "We value your feedback.",
			"ES" : "Valoramos sus comentarios",
			"IT" : "Diamo valore alla tua opinione",
			"FR" : "Laissez vos commentaires"
		},
		"feedbackQuestion" : {
			"DE" :  "Wie hat es Ihnen gefallen?",
			"EN" :  "Did you enjoy your stay?",
			"ES" : "¿Ha disfrutado de su estancia?",
			"IT" : "Il tuo soggiorno è stato piacevole?",
			"FR" : "Avez-vous apprécié votre séjour?"
		},
		"feedbackComment" : {
			"DE" :  "Kommentar (optional)",
			"EN" :  "Comment (optional)",
			"ES" : "Comentario (opcional)",
			"IT" : "Commenti (facoltativo)",
			"FR" : "Commentaires"
		},
		"feedbackEmail" : {
			"DE" :  "E-Mail (optional)",
			"EN" :  "Email (optional)",
			"ES" : "Correo electrónico (opcional)",
			"IT" : "email (facoltativo)",
			"FR" : "Adresse E-mail (facultatif)"
		},
		"feedbackCompleteTitle" : {
			"DE" :  "Feedback abgeschickt",
			"EN" :  "Feedback has been sent",
			"ES" : "Comentarios enviados",
			"IT" : "Commento inviato",
			"FR" : "Votre commentaire a été envoyé"
		},
		"feedbackCompleteMessage" : {
			"DE" :  "Vielen Dank für Ihre Meinung!",
			"EN" :  "Thank you for your feedback!",
			"ES" : "¡Muchas gracias por sus comentarios!",
			"IT" : "Grazie mille per il tuo commento!",
			"FR" : "Merci beaucoup pour votre commentaire"
		},
		//Login
		"login.title" : {
			"DE" :  "Account",
			"EN" :  "Account",
			"ES" : "Cuenta",
			"IT" : "Account",
			"FR" : "Compte"
		},
		"login.description" : {
			"DE" : "<h1>Gleich geht es weiter</h1><h5>registriere Dich um alle Features nutzen zu können</h5>",
			"EN" : "<h1>Just a moment</h1><h5>please signup to use all features</h5>",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"login.field.email.placeholder" : {
			"DE" :  "E-Mail",
			"EN" :  "Email",
			"ES" : "Dirección de correo electrónico",
			"IT" : "email",
			"FR" : "Adresse mail"
		},
		"login.field.password.placeholder" : {
			"DE" :  "Passwort",
			"EN" :  "Password",
			"ES" : "Contraseña",
			"IT" : "Password",
			"FR" : "Mot de passe"
		},
		"login.button.login" : {
			"DE" :  "Login",
			"EN" :  "Login",
			"ES" : "Iniciar sesión",
			"IT" : "Log in",
			"FR" : "Se connecter"
		},
		"login.button.signup" : {
			"DE" :  "Registrieren",
			"EN" :  "Sign-up",
			"ES" : "Registrarse",
			"IT" : "Registrati",
			"FR" : "S’inscrire"
		},
		"login.button.signupfb" : {
			"DE" :  "Facebook",
			"EN" :  "Facebook",
			"ES" : "Facebook",
			"IT" : "Facebook",
			"FR" : "Facebook"
		},
		"login.button.pwforgot" : {
			"DE" :  "Neues Passwort",
			"EN" : "New Password",
			"ES" : "Nueva contraseña",
			"IT" : "Nuova password",
			"FR" : "Nouveau mot de passe"
		},
		"login.label.pwforgot" : {
			"DE" :  "Passwort vergessen?",
			"EN" : "Password forgotten?",
			"ES" : "¿Olvidó su contraseña?",
			"IT" : "Password dimenticata?",
			"FR" : "Mot de passe oublié?"
		},
		"login.label.notamember" : {
			"DE" :  "Kein Mitglied?",
			"EN" :  "Not a member?",
			"ES" : "¿No es Usted miembro aún?",
			"IT" : "Non ancora membro?",
			"FR" : "Pas encore membre?"
		},
		"account.signup.confirm.title" : {
			"DE" :  "Werde Mitglied ...",
			"EN" :  "Register ...",
			"ES" : "Regístrese",
			"IT" : "Registrati...",
			"FR" : "Devenez membre"
		},
		"account.signup.confirm.message" : {
			"DE" :  "Registrieren und unsere AGB akzeptieren?",
			"EN" :  "Register and accept our terms of use?",
			"ES" : "¿Desea registrarse y aceptar las condiciones generales?",
			"IT" : "Desideri registrarti ed accettare i termini di servizio?",
			"FR" : "S’inscrire et accepter nos conditions générales"
		},
		"account.signupfb.confirm.message" : {
			"DE" :  "Account mit Facebook Daten anlegen?",
			"EN" :  "Create Account with Facebook?",
			"ES" : "¿Desea asociar su cuenta a Facebook?",
			"IT" : "Desideri connettere il tuo account a Facebook?",
			"FR" : "Créer votre compte à partir de vos données Facebook? "
		},
		"account.signup.success.title" : {
			"DE" :  "Willkommen ",
			"EN" :  "Welcome",
			"ES" : "Bienvenido",
			"IT" : "Benvenuto",
			"FR" : "Bienvenue"
		},
		"account.signup.success.message" : {
			"DE" :  "Danke, dass Sie sich registriert haben!",
			"EN" :  "Thank you for your registration!",
			"ES" : "¡Muchas gracias por registrarse!",
			"IT" : "Grazie per esserti registrato!",
			"FR" : "Merci pour votre inscription!"
		},
		"account.logout.confirm.title" : {
			"DE" :  "Abmelden",
			"EN" :  "Log-out",
			"ES" : "Cerrar sesión",
			"IT" : "Log out",
			"FR" : "Se déconnecter"
		},
		"account.logout.confirm.message" : {
			"DE" :  "Möchten Sie sich abmelden?",
			"EN" :  "Do you want to log out?",
			"ES" : "¿Desea cerrar sesión?",
			"IT" : "Desideri fare il log out?",
			"FR" : "Voulez-vous désactiver votre compte?"
		},
		"account.passwordrequest.message" : {
			"DE" :  "Bitte geben Sie Ihre<br/>Account E-Mail ein.",
			"EN" :  "Please enter your<br/>email address.",
			"ES" : "Por favor, introduzca su<br/>cuenta.",
			"IT" : "Per favore, inserisci <br/> la tua mail.",
			"FR" : "Entrez svp votre adresse mail."
		},
		"account.passwordrequest.notexisting" : {
			"DE" :  "Zu dieser E-Mail existiert kein Account.",
			"EN" :  "No account exists for this email address.",
			"ES" : "No hay ninguna cuenta vinculada a esta dirección de correo",
			"IT" : "Nessun account è associato a questa mail",
			"FR" : "Aucun compte  n’est associé à cette adresse mail"
		},
		"account.passwordrequest.success" : {
			"DE" :  "Link zum zurücksetzen des Passworts verschickt.",
			"EN" :  "Link for resetting password has been sent. ",
			"ES" : "Se le ha enviado un enlace para restablecer la contraseña",
			"IT" : "Il link per resettare la password è stato inviato",
			"FR" : "Le lien pour réactualiser votre mot de passe vous a été envoyé."
		},
		"account.register.yes" : {
			"DE" :  "Login/Anmelden",
			"EN" : "Login/Signup",
			"ES" : "Iniciar sesión/Registrarse",
			"IT" : "Log in/ Registrati",
			"FR" : "Se connecter/ s’inscrire"
		},
		"account.register.no" : {
			"DE" :  "Nein Danke",
			"EN" : "No thanks",
			"ES" : "No, gracias",
			"IT" : "No, grazie",
			"FR" : "Non, merci"
		},
		"account.required" : {
			"DE" :  "Dieses Feature benötigt einen Account.",
			"EN" : "This feature requires an account.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		//history
		"history.title" : {
			"DE" :  "MyPlaces",
			"EN" :  "MyPlaces",
			"ES" : "Mis Sitios",
			"IT" : "I miei luoghi",
			"FR" : "Mes endroits"
		},
		"dashboard.button.history" : {
			"DE" :  "Verlauf",
			"EN" :  "History",
			"ES" : "Plazas visitadas",
			"IT" : "",
			"FR" : "mes endroits"
		},
		"history.detail.title" : {
			"DE" :  "Rechnung",
			"EN" :  "Bill",
			"ES" : "Factura",
			"IT" : "Conto",
			"FR" : "Facture"
		},
		"history.detail.list.paging" : {
			"DE" :  "Mehr laden...",
			"EN" :  "Show more...",
			"ES" : "Mostrar más...",
			"IT" : "Mostrami di più...",
			"FR" : "En savoir plus..."
		},
		"history.noaccount" : {
			"DE" :  "Erinnere dich, wo Du warst! Dieses Feature benötigt einen cloobster Account.",
			"EN" :  "Remember where you were! This feature requires a cloobster account.",
			"ES" : "¡Recuerde dónde estaba! Para acceder a esta función, necesita una cuenta cloobster",
			"IT" : "Ricorda dove sei stato! Questa funzione necessita di un account cloobster.",
			"FR" : "Souvenez-vous où vous étiez! Cette fonction nécessite l’ouverture d’un compte Cloobster"
		},
		"history.list.description" : {
			"DE" :  "Hier werden Ihre alten Bestellungen aufgelistet.",
			"EN" :  "Your old orders. No hits.",
			"ES" : "Lista de lugares que ha visitado. Todavía no ha visitado ningún lugar.",
			"IT" : "Lista dei luoghi visitiati. Non hai ancora visitato nessun luogo.",
			"FR" : "Voici ici la liste des endroits que vous avez visté. Vous n’avez pas encore visité d’endroits"
		},
		//social
		"social.checkin" : {
			"DE" :  "Hat gerade eingecheckt bei {0}.",
			"EN" : "Has just checked in at {0}.",
			"ES" : "Acaba de iniciar sesión en {0}.",
			"IT" : "Ha appena fatto il check-in a {0}.",
			"FR" : "A déjà envoyé à "
		},
		//facebook
		"facebook.connect.notlogin" : {
			"DE" :  "Sie sind nicht eingeloggt.",
			"EN" :  "You are not logged in.",
			"ES" : "No ha iniciado sesión",
			"IT" : "Non hai fatto effettuato l'accesso",
			"FR" : "Vous n’êtes pas connecté"
		},
		"facebook.connect.confirm" : {
			"DE" : "Account mit Facebook verbinden?",
			"EN" : "Connect account with Facebook?",
			"ES" : "¿Asociar la cuenta de a la de Facebook?",
			"IT" : "Connettere l'account a Facebook?",
			"FR" : "Connecter votre compte avec Facebook?"
		},		
		"facebook.connect.success" : {
			"DE" : "Account erfolgreich verbunden.",
			"EN" : "account successfully linked.",
			"ES" : "Cuenta de asociada con éxito",
			"IT" : "Account connesso con successo.",
			"FR" : "Votre compte a été  connecté avec succès."
		},
		"facebook.action.nologin" : {
			"DE" :  "Um bei Facebook zu posten brauchen Sie einen Account, der mit Facebook verknüpft ist.",
			"EN" :  "To post on your Facebook wall, you need a account linked with Facebook.",
			"ES" : "Necesita una cuenta para poder publicar en el muro de Facebook",
			"IT" : "Per postare su Facebook hai bisogno di un account.",
			"FR" : "Pour laisser un commentaire une votre “mur”il vous faut un compte connecté à Facebook" 
		},
		"facebook.connect.canceled" : {
			"DE" :  "Facebook login nicht erfolgreich.",
			"EN" :  "Facebook login failed.",
			"ES" : "Fallo en el inicio de sesión de Facebook",
			"IT" : "Login Facebook non riuscito.",
			"FR" : "La connection à Facebook à échoué  "
		},
		//spot selection
		"spotselection.title" : {
			"DE" :  "Spot Auswahl",
			"EN" : "Spot Selection",
			"ES" : "Seleccione spot",
			"IT" : "Seleziona lo Spot",
			"FR" : "sélectionner spot"
		},
		"spotselection.description" : {
			"DE" :  "Bitte wählen Sie Ihren aktuellen Spot aus.",
			"EN" : "Please select your current spot.",
			"ES" : "Por favor, seleccione su spot actual",
			"IT" : "Per favore, seleziona il tuo Spot attuale. ",
			"FR" : "Séletionnez svp votre spot"
		},
		"checkin.switchspot.msgtitle" : {
			"DE" :  "Spotwechsel",
			"EN" : "Switch spot",
			"ES" : "Cambiar spot",
			"IT" : "Cambia Spot",
			"FR" : "Changer spot"
		},
		"checkin.switchspot.switch" : {
			"DE" :  "Wechseln",
			"EN" : "Switch",
			"ES" : "Cambiar",
			"IT" : "Cambia",
			"FR" : "Changer"
		},
		"checkin.switchspot.stay" : {
			"DE" :  "Bleiben",
			"EN" : "Stay",
			"ES" : "Permanecer",
			"IT" : "Rimani",
			"FR" : "Rester"
		},
		"checkin.switchmasterspot.barcode" : {			
			"DE" :  "Um	dieses	Produkt	zu bestellen, scannen Sie bitte den Barcode ihres Spots (Standort).",
			"EN" : "To order this product, please scan the barcode of your current spot.",
			"ES" : "Para solicitar este producto, escanee el código de barras de su spot actual.",
			"IT" : "Per ordinare questo prodotto, scansiona il codice a barre del tuo Spot attuale.",
			"FR" : "Afin de commander ce produit, veuillez scanner le code barre de votre actuel spot"
		},
		"checkin.switchmasterspot.list" : {
			"DE" : "Um	dieses Produkt	zu	bestellen, wählen Sie bitte Ihren Spot (Standort) aus der Liste.",
			"EN" : "To order this product, please select your spot from the list.",
			"ES" : "Para solicitar el producto, seleccione su spot de la lista",
			"IT" : "Per ordinare questo prodotto, seleziona il tuo Spot dalla lista",
			"FR" : "Afin de commander ce produit, veuillez sélectionner  votre spot dans la liste "
		},
		"checkin.switchspot.barcode" : {			
			"DE" :  "Um	dieses	Produkt	zu bestellen müssen Sie von \"{0}\" nach \"{1}\" wechseln. "+
					"Scannen Sie hierfür den Barcode des neuen Spots. Warenkorb wird geleert.",
			"EN" : "To order this product you have to switch from \"{0}\" to \"{1}\". "+
					"Please scan the barcode of your new spot. Cart will be cleared.",
			"ES" : "Con el fin de solicitar este producto, deberá cambiar de \"{0}\" a \"{1}\". "+
					"Por favor, escanee el código de barras de su nuevo spot. Se vaciará la cesta.",
			"IT" : "Per ordinare questo prodotto, devi cambiare da \"{0}\" a \"{1}\". "+
					"Scannerizza il codice a barre del tuo nuovo Spot. Il carrello verrà svuotato.",
			"FR" : "Afin de commander ce produit, vous devez changer de \"{0}\" à  \"{1}\". "+
					"Pour celà, scannez le code barres du nouveau spot. Votre panier est vide."
		},
		"checkin.switchspot.list" : {
			"DE" : "Um	dieses	Produkt	zu	bestellen müssen Sie von \"{0}\" nach \"{1}\" wechseln. "+
					"Wählen Sie hierfür den neuen Spot (Standort) aus der Liste. Warenkorb wird geleert.",
			"EN" : "To order this product you have to switch from \"{0}\" to \"{1}\". "+
					"Please select your new spot from the list. Cart will be cleared.",
			"ES" : "Para seleccionar el producto, deberá cambiar de \"{0}\" a \"{1}\. Seleccione un nuevo spot de la lista. Se vaciará su cesta",
			"IT" : "Per ordinare questo prodotto, devi cambiare da \"{0}\" a \"{1}\". "+
					"Scannerizza il codice a barre del tuo nuovo Spot. Il carrello verrà svuotato.",
			"FR" : "Pour commander ce produit, vous devez changer de \"{0}\" à  \"{1}\". "+
					"Choisissez pour celà le nouveau spot dans la liste.Votre panier est vide."
		},
		"checkin.switchspot.orders.barcode" : {
			"DE" :  "Um	dieses	Produkt	zu bestellen, schliessen Sie bitte zuerst ihre aktuellen Bestellungen in Höhe von {0} ab. "+
					"Dann wechseln Sie von \"{1}\" nach \"{2}\" durch scannen des neuen Spots. Warenkorb wird geleert.",
			"EN" : "To order this product you have to complete your current order balance of {0}. " + 
					"Afterwards please scan your new spot to switch from \"{1}\" to \"{2}\". Cart will be cleared.",
			"ES" : "Para solicitar este producto, deberá completar su order balance de {0}."+
					"Posteriormente, escanee su nuevo spot para cambiar de \"{1}\" to \"{2}\". Se vaciará la cesta.",
			"IT" : "Per ordinare questo prodotto, devi prima completare il tuo ordine attuale di {0}. "+
					"Successivamente, scannerizza il tuo nuovo Spot per cambiare da \"{1}\" to \"{2}\". Il carrello verrà svuotato.",
			"FR" : "Afin de commander ce produit,veuillez tout d’abord terminer vos commandes actuelles à hauteur de {0}. Ensuite passez de \"{1}\" à \"{2}\" en scannant le nouveau spot. Votre panier est vide. "
		},
		"checkin.switchspot.orders.list" : {
			"DE" :  "Um	dieses	Produkt	zu bestellen, schliessen Sie bitte zuerst ihre aktuellen Bestellungen in Höhe von {0} ab. "+
					"Dann wechseln Sie von \"{1}\" nach \"{2}\" durch Auswahl des neuen Spots. Warenkorb wird geleert.",
			"EN" : "To order this product you have to complete your current order balance of {0}. " +
					"Afterwards please select your new spot from the list to switch from \"{1}\" to \"{2}\". Cart will be cleared.",
			"ES" : "Para pedir este producto, Usted deberá completar su order balance de {0}. Posteriormente, escanee su nuevo spot para cambiar de \"{1}\" a \"{2}\". Se vaciará la cesta.",
      "IT" : "Per ordinare questo prodotto, devi prima completare il tuo ordine attuale di {0}. "+
					"Successivamente, scannerizza il tuo nuovo Spot per cambiare da \"{1}\" to \"{2}\". Il carrello verrà svuotato.",
			"FR" : "Afin de commander ce produit,veuillez tout d’abord terminer vos commandes actuelles à hauteur de {0}. "+
					"Ensuite passez de \"{1}\" à \"{2}\" en sélectionnant un nouveau spot dans la liste. Votre panier est vide. "
		},
		"checkin.switchspot.confirmselected" : {
			"DE" :  "An Spot {0} einchecken?",
			"EN" : "CheckIn at spot {0}?",
			"ES" : "Para solicitar este producto, Usted deberá cambiar de \"{0}\" a \"{1}\". "+ "Por favor, escanee el código de barras de su nuevo spot. Se vaciará la cesta.",
			"IT" : "Fare il check-in nello Spot {0}?",
			"FR" : "Enregistrer le spot {0}?"
		},
		"area.switch.notification" : {
			"DE" :  "Produkte aus dem Bereich {0} werden angezeigt.",
			"EN" : "Products from area {0} will be displayed.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		//contact info
		"contactinfo.title" : {
			"DE" :  "Kontakt",
			"EN" : "Contact",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"contactinfo.phonenumbers" : {
			"DE" :  "Telefonnummern",
			"EN" : "Phone numbers",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"contactinfo.location.phone" : {
			"DE" :  "Anrufen",
			"EN" : "Call",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"contactinfo.location.url" : {
			"DE" :  "Webseite",
			"EN" : "Website",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"contactinfo.address" : {
			"DE" :  "Adresse",
			"EN" : "Address",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"contactinfo.location.maps" : {
			"DE" :  "Route",
			"EN" : "Route",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"contactinfo.map.title" : {
			"DE" :  "Karte",
			"EN" : "Map",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"contactinfo.fburl" : {
			"DE" : "Facebook Seite",
			"EN" : "Facebook Page",
			"ES" : "Facebook Page",
			"IT" : "Facebook Page",
			"FR" : "Facebook Page"
		},
		//tovisit
		"tovisit.list.emptytext" : {
			// "DE" : "<div><h1>ToVisit Liste</h1><p>nie wieder einen<br/> spannenden Ort<br/> vergessen</p></div><div><h1>In meiner Hand</h1><p>cloobster QR Code<br/>scannen, eintreten<br/>und entdecken</p></div><div class='menu-help'>Tippen oder <br/>von links Wischen</div><canvas id='skylinecanvas' style='position: absolute; bottom: 0; left:0; right:0;'></canvas>",
			"DE" : "<div><h1>Favoriten</h1><p>deine Lieblingsorte<br/>immer dabei</p></div><div><h1>FRIZZ QR</h1><p>scannen.<br/>Angebote & Infos<br/>zum Ort.</p></div>",
			"EN" : "<div><h1>Favorites</h1><p>and never forget an<br/> exiting location<br/>again</p></div><div><h1>All in my hand</h1><p>frizz QR code<br/>scan, enter<br/>and discover</p></div>",// <div class='menu-help'>Tap or <br/> swipe from left</div><canvas id='skylinecanvas' style='position: absolute; bottom: 0; left:0; right:0;'></canvas>",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.action.scan" : {
			"DE" :  "Scan",
			"EN" : "Scan",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.action.manual" : {
			"DE" :  "Manuell",
			"EN" : "Manual",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.formnew.locationname" : {
			"DE" :  "Welchen Ort merken?",
			"EN" : "Which location to remember?",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.formnew.comment" : {
			"DE" :  "Bemerkung",
			"EN" : "Comment",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.formnew.visitdate" : {
			"DE" :  "Wann besuchen?",
			"EN" : "Visit date?",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.title.new" : {
			"DE" : "Favorit",
			"EN" : "Favorite",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.title.existing" : {
			"DE" :  "Favorit",
			"EN" : "Favorite",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.savebutton" : {
			"DE" :  "Merken",
			"EN" : "Remember",			
			"ES" : "Recordarse",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.scanbutton" : {
			"DE" :  "Scannen",
			"EN" : "Scan",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.form.locationname.required" : {
			"DE" :  "Location Name wird benötigt.",
			"EN" : "Location name is required.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.detail.title" : {
			"DE" :  "Favorit",
			"EN" : "Favorite",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.detail.sneakinbutton" : {
			"DE" :  "Eintreten",
			"EN" : "Enter",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.camerabutton" : {
			"DE" :  "Foto hinzufügen",
			"EN" : "Add photo",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.map.nogeodata" : {
			"DE" :  "Keine Geo Daten gefunden/vorhanden.",
			"EN" : "No geo data exists/found.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.delete" : {
			"DE" :  "Favorit löschen?",
			"EN" : "Delete favorite?",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.date.description" : {
			"DE" :  "geplanter Besuch",
			"EN" : "planed visit",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.nolocation.title" : {
			"DE" :  "Dies ist leider keine<br/> frizz Location",
			"EN" : "We're sorry<br/> this is no frizz location",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"tovisit.nolocation.description" : {
			"DE" :  "Alle Infos - Alle Angebote",
			"EN" : "All Information - All Offers",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		//ztix events
		"de.ztix.events.title" : {
			"DE" :  "Veranstaltungen",
			"EN" : "Event",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"de.ztix.events.empty" : {
			"DE" : "<div class='empty-image'></div><div>Keine Veranstaltungen gefunden.</div>",
			"EN" : "<div class='empty-image'></div><div>No events found.</div>",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"ztixevent.button.openlink" : {
			"DE" :  "Buchen",
			"EN" : "Book",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"de.ztix.events.title.subtitle" : {
			"DE" :  "Das sollten Sie nicht verpassen",
			"EN" : "Exciting events",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		// "de.ztix.events.noeventsinmonth" : {
		// 	"DE" :  "Keine Veranstaltungen in diesem Monat.",
		// 	"EN" : "No events in this month.",
		// 	"ES" : "",
		// 	"IT" : "",
		// 	"FR" : ""
		// },
		//errors
		"error" : {
			"DE" :  "Fehler",
			"EN" :  "Error",
			"ES" : "Error",
			"IT" : "Errore",
			"FR" : "Erreur"
		},
		"errorTitle" : {
			"DE" :  "Fehler",
			"EN" :  "Error",
			"ES" : "Error",
			"IT" : "Errore",
			"FR" : "Erreur"
		},		
		"errorMsg" : {
			"DE" :  "Entschuldigung! Ein Fehler ist aufgetreten.<br/>Wir kümmern uns darum!",
			"EN" :  "We apologies! An error has occurred.<br/>We'll fix it as soon as possible.",
			"ES" : "¡Lo sentimos! Ha habido un error.<br/>Lo solucionaremos lo más pronto posible.",
			"IT" : "Ci scusiamo per l'errore.<br/> Ce ne occuperemo il prima possibile.",
			"FR" : "Toutes nos excuses, une erreur est survenue. <br/>Nous la réparons aussi vite que possible."
		},
		"errorResource" : {
			"DE" :  "Daten konnten nicht vom Server geladen werden.",
			"EN" :  "Data error... Connection to server has failed.",
			"ES" : "Error...La conexión al servidor ha fallado",
			"IT" : "Errore: connessione al server non riuscita.",
			"FR" : "Erreur...la connection au serveur a échoué."
		},
		"errorPermission" : {
			"DE" :  "Sitzung ist ungültig.",
			"EN" :  "Session is invalid.",
			"ES" : "Sesión no válida",
			"IT" : "Sessione non valida.",
			"FR" : "Session invalide"
		},
		"errorCommunication" : {
			"DE" :  "Es kann momentan keine Verbindung hergestellt werden.<br/>Bitte probiere es noch einmal und prüfe deinen Netzwerkstatus.",
			"EN" :  "Connection temporarily not available.<br/ Please try again.",
			"ES" : "La conexión no está disponible temporalmente.<br/Inténtelo de nuevo y compruebe su conexión a la red.",
			"IT" : "Connessione non disponibile al momento.<br/ Controlla lo stato della tua connessione e riprova.",
			"FR" : "Aucune connection ne peut être établie pour le moment. <br/>Veuillez réessayer ultérieurement et vérifier votre statut de connection. "
		},
		"error.menu.needsrefresh" : {
			"DE" :  "Auswahl nicht mehr aktuell. Bitte führen Sie die Bestellung nochmals durch.",
			"EN" :  "Your order has been changed. Please order again.",
			"ES" : "Su pedido ha sido modificado. Por favor, realice su pedido de nuevo",
			"IT" : "Il tuo ordine è stato modificato. Per favore, prova di nuovo.",
			"FR" : "Votre commande a été modifiée. Veuillez commander à nouveau."
		},
		"error.account.email.exists" : {
			"DE" :  "Diese E-Mail wird bereits verwendet.",
			"EN" :  "Email address exists.",
			"ES" : "Dirección de correo electrónico ya registrada",
			"IT" : "L'indirizzo email è già stato registrato.",
			"FR" : "Cette adresse mail existe déjà."
		},
		"error.account.email" : {
			"DE" :  "Bitte geben Sie eine gültige E-Mail ein.",
			"EN" :  "Please enter a valid email address.",
			"ES" : "Introduzca una dirección de correo válida",
			"IT" : "Inserisci un indirizzo mail valido",
			"FR" : "Veuillez entrer une adresse mail valide"
		},
		"error.account.password" : {
			"DE" :  "Passwort muss min. 6 Zeichen besitzen. Darunter 1 Zahl oder 1 Sonderzeichen.",
			"EN" :  "Password must have 6 characters including 1 number or special character.",
			"ES" : "La contraseña debe tener 6 caracteres, incluido un número o un carácter especial",
			"IT" : "La password deve contenere minimo 6 caratteri, tra cui un numero o un carattere speciale.",
			"FR" : "Le mot de passe doit contenir au moins 6 charactères, dont 1 chiffre ou un charactère spécial"
		},
		"error.account.nocredentials" : {
			"DE" :  "Bitte geben Sie Ihre Zugangsdaten ein, um sich einzuloggen.",
			"EN" :  "Please enter user name and password to proceed.",
			"ES" : "Por favor, introduzca el nombre de usuario y la contraseña para continuar",
			"IT" : "Prego inserire l'username e la password per continuare.",
			"FR" : "Veuillez entrer votre nom d’utilisateur et votre mot de passe pour continuer."
		},
		"error.account.required" : {
			"DE" :  "Ein Account wird für diese Funktion benötigt.",
			"EN" : "Please login/register to use this function.",
			"ES" : "Inicie sesión/regístrese para utilizar esta función",
			"IT" : "Per utilizzare questa funzione, registrati o fai il log-in.",
			"FR" : "Un compte est nécessaire pour utiliser cette fonction"
		},
		"error.account.credentials.invalid" : {
			"DE" :  "Gespeicherte Zugangsdaten ungültig. Bitte neu einloggen.",
			"EN" :  "Login data invalid. Please log in again.",
			"ES" : "Inicio de sesión incorrecto. Inicie sesión de nuevo",
			"IT" : "Login non valido. Riprova.",
			"FR" : "Données de connection invalides. Veuillez réessayer"
		},
		"error.account.facebook.exists" : {
			"DE" :  "Dieser Facebook Account ist mit einem andere Account verknüpft.",
			"EN" : "This Facebook account is linked with another Account.",
			"ES" : "Esta cuenta de Facebook está asociada a otra cuenta",
			"IT" : "Questo account di Facebook è già connesso a un altro account.",
			"FR" : "Ce compte Facebook est associé à un autre compte"
		},
		"error.account.inactive" : {
			"DE" :  "Ihr Account ist inaktiv. Kontaktieren Sie bitte support@cloobster.com",
			"EN" : "Your account is inactive. Please contact support@cloobster.com",
			"ES" : "Su cuenta está inactiva. Contacte con support@cloobster.com",
			"IT" : "Il tuo account non è attivo. Contatta, per favore, support@cloobster.com,",
			"FR" : "Votre compte est inactif. Veuillez contacter support@cloobster."
		},
		"error.version" : {
			"DE" :  "Ihre Version ist veraltet. Bitte aktualisieren Sie die Version.",
			"EN" : "Your version is outdated. Please update!",
			"ES" : "Está utilizando una versión antigua de su cuenta. ¡Actualícela!",
			"IT" : "Stai utilizzando una versiona non aggiornata. Aggiornala ora!",
			"FR" : "Votre version n’est pas à jour. Veuillez actualiser votre version."
		},
		"error.checkin.switchspot.businesses.mismatch" : {
			"DE" :  "Dieser Spot ist ungültig.",
			"EN" : "This spot is invalid.",
			"ES" : "Este spot no es válido",
			"IT" : "Questo Spot non è valido.",
			"FR" : "Ce spot est invalide"
		},
		"error.checkin.switchspot.area.mismatch" : {
			"DE" :  "Dieser Spot gehört nicht zum ausgewählten Servicebereich.",
			"EN" : "This spot does not belong to your selected service area.",
			"ES" : "Este spot no pertenece al área de servicio seleccionada",
			"IT" : "Questo Spot non appartiene all'area di servizio selezionata.",
			"FR" : "Ce spot n’appartient à la zone de services sélectionnée"
		},
		"error.checkin.switchspot.welcome" : {
			"DE" :  "Dieser Spot repräsentiert keinen Standort. Bitte checken Sie an anderer Stelle ein.",
			"EN" : "This spot doesn't represent a real spot. Please check in at another place.",
			"ES" : "Este spot no representa un spot real. Inicie sesión en otro lugar",
			"IT" : "Questo Spot non esiste. Per favore, fai il check-in in un altro punto.",
			"FR" : "Ce spot ne représente aucune position. Veuillez trouver une autre place"
		},
		"error.appengine" : {
			"DE" :  "Es liegt eine Serverstörung vor. Wir arbeiten an einer Lösung.",
			"EN" : "Currently server errors exist. We are working on a solution.",
			"ES" : "Fallo en los servidores. Estamos intentando solucionarlo",
			"IT" : "In questo momento c'è un errore nel server. Stiamo lavorando ad una soluzione.",
			"FR" : "Il s’agit d’une erreur de serveur. Nous cherchons une solution."
		},
		"error.gps.position" : {
			"DE" :  "Position kann nicht bestimmt werden.",
			"EN" : "Can't locate your position.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		"error.takepicture" : {
			"DE" :  "Foto aufnehmen fehlgeschlagen.",
			"EN" : "Taking a picture failed.",
			"ES" : "",
			"IT" : "",
			"FR" : ""
		},
		//system
		"network.slow" : {
			"DE" :  "Die Verbindung ist langsam. Dies kann die Anwendung verlangsamen.",
			"EN" : "Your are on a slow connection. This may slow down the app.",
			"ES" : "Su conexión va lenta. Ello puede enlentecer el funcionamiento de la aplicación",
			"IT" : "La tua connessione è lenta. Questo puà rallentare il funzionamento dell app.",
			"FR" : "La connection est lente. Celà peut ralentir l’application."
		}
	}
	}
});