/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageCarousel}
*/
Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',
	alternateClassName: 'IPDetail',
	config: {
		scrollable: {
		    direction: 'vertical',
		    directionLock: true
		},
		styleHtmlContent: false,
		cls: 'infopage-detail',
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><tpl if="imageUrl"><img src="{imageUrl}"/></tpl><div>{html}</div>'
		),
		//record assigned to this infopage
		ipRecord: null
		
	}
});