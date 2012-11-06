/**
* Represents on InfoPage used in @see{EatSense.view.InfoPageCarousel}
*/
Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',
	alternateClassName: 'IPDetail',
	config: {
		layout: 'fit',
		cls: 'infopage-detail',
		// padding: '5 5 5 5',
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><img src="{imageUrl}"/><div>{html}</div>'
			)
	}
});