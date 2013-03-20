/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageCarousel}
*/
Ext.define('EatSense.view.InfoPageLink', {
	extend: 'Ext.Panel',
	xtype: 'infopagelink',
	alternateClassName: 'IPLink',
	config: {
		scrollable: {
		    direction: 'vertical',
		    directionLock: true
		},
		styleHtmlContent: false,
		cls: 'infopage-detail',
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><img src="{configimageUrl}"/><div>{html}</div>'
		)
	}
});