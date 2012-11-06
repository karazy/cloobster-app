Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',
	alternateClassName: 'IPDetail',
	config: {
		layout: 'fit',
		// styleHtmlContent: true,
		//TODO really use a tpl?
		cls: 'infopage-detail',
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><img src="{imageUrl}"/>{html}'
			)
	}
});