/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageCarousel}
*/
Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',
	alternateClassName: 'IPDetail',
	config: {
		// layout: 'fit',
		scrollable: {
		    direction: 'vertical',
		    directionLock: true
		},
		cls: 'infopage-detail',
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><img src="{imageUrl}"/><div>{html}</div>'
		)
		
	}
});