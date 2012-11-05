Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',
	alternateClassName: 'IPDetail',
	config: {
		styleHtmlContent: true,
		//TODO really use a tpl?
		tpl: new Ext.XTemplate(
			'<img src="{imageUrl}"/><h1>{title}</h1><pre>{shortText}</pre>'
			)
	}
});