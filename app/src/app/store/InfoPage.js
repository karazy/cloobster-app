Ext.define('EatSense.store.InfoPage', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.InfoPage'],
	config: {
		storeId: 'infopageStore',
		model: 'EatSense.model.InfoPage',
		//TODO Dummy Data remove
		data : [
        {title: 'A',    shortText: 'A wie Ameise'},
        {title: 'B', shortText: 'B wie Bmeise'},
        {title: 'C', shortText: 'C wie Caesar'},
        {title: 'Z', shortText: 'Z wie Z'},
        {title: 'Deutschland', shortText: 'Heimatland', imageUrl: 'res/images/flags/Germany.png'},
        {title: 'D2', shortText: 'Zweiter Eintrag mit D'},
        {title: 'D3', shortText: 'Dritter Eintrag mit D'},
        {title: 'D4', shortText: '4. Eintrag mit D'},
        {title: 'England', shortText: 'Verrückte Inselbewohner', imageUrl: 'res/images/flags/UK.png'},
        {title: 'Frankfreich', shortText: 'Frankreich (amtlich République française, deutsch Französische Republik; Kurzform frz.: France [fʀɑ̃s]) ist ein demokratischer, zentralistischer Einheitsstaat in Westeuropa mit Überseeinseln und -gebieten auf mehreren Kontinenten. Metropolitan-Frankreich erstreckt sich vom Mittelmeer bis zum Ärmelkanal und der Nordsee, sowie vom Rhein bis zum Atlantischen Ozean.', imageUrl: 'res/images/flags/France.png'},
        {title: 'Spanien', shortText: 'Spanien (amtlich Königreich Spanien, spanisch Reino de España [ˈrejno ð(e) esˈpaɲa]) ist ein Staat mit einer parlamentarischen Erbmonarchie, der größtenteils auf der im Südwesten Europas gelegenen Iberischen Halbinsel liegt. Die Hauptstadt ist Madrid.', imageUrl: 'res/images/flags/Spain.png'},
        {title: 'Portugal', shortText: 'Portugal (amtl. República Portuguesa) ist ein europäischer Staat im Westen der Iberischen Halbinsel. ', imageUrl: 'res/images/flags/Portugal.png'},
        {title: 'Polen', shortText: 'Polen (polnisch Polska [ˈpɔlska], amtlich Rzeczpospolita Polska,  [ʐɛʈ͡ʂpɔsˈpɔlita ˈpɔlska]?/i, deutsch Republik Polen) ist ein Staat in Mitteleuropa. Hauptstadt und zugleich größte Stadt des Landes ist Warschau. ', imageUrl: 'res/images/flags/Poland.png'},
    	],
		grouper: {
            groupFn: function(record) {
            	var title = record.get('title') || '';

            	if(title) {
            		title = title.substr(0, 1)
            	}

                return title;
            },
            sortProperty: 'title'
        }
	}
});