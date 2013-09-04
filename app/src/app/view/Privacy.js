Ext.define('EatSense.view.Privacy', {
	extend: 'Ext.Panel',
	xtype: 'privacy',
	config: {
		scrollable : 'vertical',
    	modal: true,
		top: '5%',
		left: 5,
		right: 5,
		bottom: 10,
		styleHtmlCls: 'about-text',
		styleHtmlContent: true,
		autoDestroy: true,
		items: [
		{
			xtype: 'titlebar',
			title: i10n.translate('general.legalnotice'),
			docked: 'top'
		},
		{
			xtype: 'fixedbutton',
			docked: 'bottom',
			ui: 'action',
			text: i10n.translate('close'),
			action: 'close'
		}
		],
		html: 

		'<h2>AGB und Nutzungsbedingungen für Endnutzer der App „FRIZZ+“</h2>'+
		'<br/>'+
		'<b>1. Allgemeines – Geltungsbereich</b>'+
		'<br><br>'+
		'(1) Die App kann aus dem Google Play Store und dem iTunes App Store heruntergeladen werden. Diese AGB und Nutzungsbedingungen gelten für jeden Nutzer der die App auf dem eigenen Smartphone installiert. '+
		'<br><br>'+
		'<b>2. Preise und Vergütungen</b><br> '+
		'(1) Die Nutzung von FRIZZ+ ist für den Nutzer der App kostenfrei.'+
		'<br><br>'+
		'<b>5. Zulassung und Zugang zur Software/Applikation</b>'+
		'<br>'+
		'(1) Voraussetzung für die Nutzung der App ist die Zulassung durch die Firma FRIZZ Media & Marketing Darmstadt. '+
		'<br><br>'+
		'(2) Der Kunde hat im Zulassungsantrag (Kontakt- oder Registrierungsformular) die erforderlichen Daten vollständig und wahrheitsgemäß anzugeben und einen Ansprechpartner zu benennen. Für die Aktualisierung seiner Daten ist der Kunde selbst verantwortlich. Der Kunde erklärt sein Einverständnis mit den Allgemeinen Geschäftsbedingungen/Nutzungsbedingungen durch Drücken des entsprechenden Knopfes (Button) im Kontakt- oder Registrierungsformular. Die Annahme des Zulassungsantrags erfolgt durch Zulassungsbestätigung per Email.'+
		'<br><br>'+
		'(3) Der Kunde ist berechtigt, das in der Zulassungsbestätigung übermittelte Passwort nach dem erstmaligen Aufruf zu ändern. Der Kunde ist allein dafür verantwortlich, dass Dritten das Passwort nicht zugänglich ist. Jeglicher Missbrauch des Passworts geht allein zu Lasten des Kunden. Ebenfalls ist der Kunde für einen von ihm gewählten Nutzernamen allein verantwortlich, insbesondere darf der Nutzername nicht gegen Rechte Dritter noch gegen sonstige Namens-und Markenrechte oder gegen die guten Sitten verstoßen.'+
		'<br><br>'+
		'(4) Die Firma FRIZZ Media & Marketing Darmstadt ist berechtigt, einem Kunden die Zulassung zu entziehen oder den Zugang zur Software/Applikation zu sperren, falls ein hinreichender Verdacht besteht, dass er gegen diese Nutzungsbedingungen verstoßen hat. Der Kunde kann diese Maßnahmen abwenden, wenn er den Verdacht durch Vorlage geeigneter Nachweise auf eigene Kosten ausräumt.'+
		'<br><br>  '+
		'<b>3. Haftung</b>'+
		'<br>'+
		'(1) Die Firma FRIZZ Media & Marketing Darmstadt haftet für Vorsatz und grobe Fahrlässigkeit uneingeschränkt. '+
		'<br><br>'+
		'(2) Für von der Firma FRIZZ Media & Marketing Darmstadt nicht verschuldete Störungen innerhalb des Leitungsnetzes übernimmt die Firma FRIZZ Media & Marketing Darmstadt keine Haftung.'+
		'<br><br>'+
		'(3) Für den Verlust von Daten haftet die Firma FRIZZ Media & Marketing Darmstadt nach Maßgabe der vorstehenden Absätze nur dann, wenn ein solcher Verlust durch angemessene Datensicherungsmaßnahmen seitens des Kunden nicht vermeidbar gewesen wäre.'+
		'<br><br>'+
		'(4) Die Haftung erstreckt sich nicht auf Beeinträchtigungen des vertragsgemäßen Gebrauchs der von der Firma FRIZZ Media & Marketing Darmstadt erbrachten Leistungen, die durch eine unsachgemäße oder fehlerhafte Inanspruchnahme durch den Kunden verursacht worden sind.'+
		'<br><br>'+
		'(5) Die vorstehenden Haftungsbeschränkungen gelten sinngemäß auch zugunsten der Erfüllungsgehilfen der Firma FRIZZ Media & Marketing Darmstadt.'+
		'<br><br>'+
		'(6) Soweit über die Software/Applikation eine Möglichkeit der Weiterleitung auf Datenbanken, Websites, Dienste etc. Dritter, z.B. durch die Einstellung von Links oder Hyperlinks gegeben ist, haftet die Firma FRIZZ Media & Marketing Darmstadt weder für Zugänglichkeit, Bestand oder Sicherheit dieser Datenbanken oder Dienste, noch für den Inhalt derselben. Insbesondere haftet die Firma FRIZZ Media & Marketing Darmstadt nicht für deren Rechtmäßigkeit, inhaltliche Richtigkeit, Vollständigkeit, Aktualität, etc.'+
		'<br><br>'+
		'(7) Die vorstehenden Haftungsausschlüsse gelten nicht bei Verletzung von Leben, Körper und Gesundheit. Die Haftung nach Produkthaftungsgesetz bleibt unberührt.'+
		'<br><br> '+
		'<b>4. Datenschutz</b>'+
		'<br> '+
		'(1) Datenschutz - Bei Anlegen eines FRIZZ+ Kontos werden von uns Daten im Rahmen der gesetzlichen Bestimmungen erhoben, gespeichert und verarbeitet. Beim Besuch unseres Internetangebots werden die aktuell von Ihrem PC verwendete IP- Adresse, Datum und Uhrzeit, der Browsertyp und das Betriebssystem Ihres PC sowie die von Ihnen betrachteten Seiten protokolliert. Rückschlüsse auf personenbezogene Daten sind uns damit jedoch nicht möglich und auch nicht beabsichtigt.'+
		'<br><br>'+
		'Die personenbezogenen Daten, die Sie uns z. B. bei einer Bestellung oder per E-Mail mitteilen (z. B. Ihr Name und Ihre Kontaktdaten), werden nur zur Korrespondenz mit Ihnen und nur für den Zweck verarbeitet, zu dem Sie uns die Daten zur Verfügung gestellt haben. Wir geben Ihre Daten nur an das mit der Lieferung beauftragte Versandunternehmen weiter, soweit dies zur Lieferung der Waren notwendig ist. Zur Abwicklung von Zahlungen geben wir Ihre Zahlungsdaten an das mit der Zahlung beauftragte Kreditinstitut weiter.'+
		'<br><br>'+
		'Wir versichern, dass wir Ihre personenbezogenen Daten im übrigen nicht an Dritte weitergeben, es sei denn, dass wir dazu gesetzlich verpflichtet wären oder Sie vorher ausdrücklich eingewilligt haben. Soweit wir zur Durchführung und Abwicklung von Verarbeitungsprozessen Dienstleistungen Dritter in Anspruch nehmen, werden die Bestimmungen des Bundesdatenschutzgesetzes eingehalten.'+
		'<br><br>'+
		'(2) Dauer der Speicherung - Personenbezogene Daten, die uns über unsere Website mitgeteilt worden sind, werden nur so lange gespeichert, bis der Zweck erfüllt ist, zu dem sie uns anvertraut wurden. Soweit handels- und steuerrechtliche Aufbewahrungsfristen zu beachten sind, kann die Dauer der Speicherung bestimmter Daten bis zu 10 Jahre betragen.'+
		'<br><br>'+
		'(3) Unsere Software ist dem Stand der Technik entsprechend gesichert; dem Kunden ist jedoch bekannt, dass für alle Teilnehmer die Gefahr besteht, dass übermittelte Daten im übertragungsweg abgehört werden können. Die Vertraulichkeit der im Rahmen der Nutzung der Software/Applikation übermittelten Daten kann daher nicht gewährleistet werden.'+
		'<br><br>'+
		'(4) Der Kunde willigt darin ein, dass die Firma FRIZZ Media & Marketing Darmstadt Informationen und Daten über Nutzungsverhalten in anonymisierter Form speichert und ausschließlich in dieser anonymisierten Form für Marketingzwecke, z. B. für die Erstellung von Statistiken und Präsentationen, nutzen darf.'+
		'<br><br>'+
		'(5) Soweit nicht ausdrücklich vom Kunden untersagt, darf die FRIZZ Media & Marketing Darmstadt den Namen des Kundens als Referenz auf der Webseite und in sozialen Netzwerken nennen.'+
		'<br><br>'+
		'(6) Ihre Rechte - Sollten Sie mit der Speicherung Ihrer personenbezogenen Daten nicht mehr einverstanden oder diese unrichtig geworden sein, werden wir auf eine entsprechende Weisung hin im Rahmen der gesetzlichen Bestimmungen die Löschung, Korrektur oder Sperrung Ihrer Daten ver anlassen. Hierfür wenden Sie sich bitte an:'+
		'<br><br>'+
		'FRIZZ Media & Marketing Darmstadt<br/>'
		'Wilhelminenstr. 7a<br> '+
		'D-64283 Darmstadt<br> '+
		'E-Mail: kontakt@frizz-darmstadt.de<br> '+
		'Telefon: +49-(0)6151-9158-10<br> '+
		'<br>'+
		'(7) Links auf andere Internetseiten - Soweit wir von unserem Internetangebot auf die Webseiten Dritter verweisen oder verlinken, können wir keine Gewähr und Haftung für die Richtigkeit bzw. Vollständigkeit der Inhalte und die Datensicherheit dieser Websites übernehmen. Da wir keinen Einfluss auf die Einhaltung datenschutzrechtlicher Bestimmungen durch Dritte haben, sollten Sie die jeweils angebotenen Datenschutzerklärungen gesondert prüfen. '+
		'<br><br>'+
		'<b>5. Fremde Inhalte und sonstige Pflichten des Nutzers</b>'+
		'<br>'+
		'(1) Dem Kunden ist es untersagt, Inhalte (z. B. durch Links oder Frames) in der Sopftware/Applikation einzustellen, die gegen gesetzliche Vorschriften, behördliche Anordnungen oder gegen die guten Sitten verstoßen. Ferner ist es ihm untersagt, Inhalte einzustellen, die Rechte, insbesondere Urheber- oder Markenrechte Dritter verletzen.'+
		'<br><br>'+
		'(2) Die Firma FRIZZ Media & Marketing Darmstadt macht sich fremde Inhalte unter keinen Umständen zu Eigen und behält sich vor, fremde Inhalte zu sperren, wenn diese nach den geltenden Gesetzen strafbar sind oder erkennbar zur Vorbereitung strafbarer Handlungen dienen.'+
		'<br><br>'+
		'(3) Der Kunde wird die Firma FRIZZ Media & Marketing Darmstadt von sämtlichen Ansprüchen freistellen, die Dritte gegen die Firma FRIZZ Media & Marketing Darmstadt wegen der Verletzung ihrer Rechte oder wegen Rechtsverstößen aufgrund der vom Kunden eingestellten Angebote und/oder Inhalte geltend machen. Der Kunde übernimmt diesbezüglich auch die Kosten der Rechtsverteidigung von der Firma FRIZZ Media & Marketing Darmstadt einschließlich sämtlicher Gerichts- und Anwaltskosten.'+
		'<br><br>'+
		'(4) Der Kunde ist verpflichtet, die erforderlichen Datensicherungsvorkehrungen während der gesamten Vertragslaufzeit einzurichten und aufrechtzuerhalten. Dies bezieht sich im Wesentlichen auf den sorgfältigen und gewissenhaften Umgang mit Logins und Passwörtern.'+
		'<br><br> '+
		'<b>6. Schlussbestimmungen</b>'+
		'<br>'+
		'(1) Es gilt das Recht der Bundesrepublik Deutschland. Die Bestimmungen des UN-Kaufrechts finden keine Anwendung.'+
		'<br><br> '+
		'(2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist, sofern sich aus der Auftragsbestätigung nichts anderes ergibt, unser Geschäftssitz Erfüllungsort und Gerichtsstand; wir sind jedoch berechtigt, unseren Vertragspartner auch an dessen Gerichtstand zu verklagen.'+
		'<br><br> '+
		'(3) Sollten einzelne Bestimmungen des Vertrages mit dem Kunden einschließlich dieser Allgemeinen Geschäftsbedingungen ganz oder teilweise unwirksam sein oder werden, so wird hierdurch die Gültigkeit der übrigen Bestimmungen nicht berührt. Die ganz oder teilweise unwirksame Regelung soll durch eine Regelung ersetzt werden, deren wirtschaftlicher Erfolg dem der unwirksamen möglichst nahe kommt'+
		'<br><br>'
				
	}
});