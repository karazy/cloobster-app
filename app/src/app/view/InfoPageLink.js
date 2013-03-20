/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageLink}
*/
Ext.define('EatSense.view.InfoPageLink', {
	extend: 'Ext.Panel',
	xtype: 'infopagelink',
	alternateClassName: 'IPLink',
	config: {
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'center'
		},		
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><tpl if="imageUrl"><img src="{imageUrl}"/></tpl><div>{shortText}</div>'
		),
		items: [
			{
				xtype: 'label',
				docked: 'top',
				cls: 'infopage-detail',
				styleHtmlContent: false
			},
			{
				xtype: 'fixedbutton',
				action: 'open-link',
				text: i10n.translate('infopage.link.button'),
				ui: 'action',
				iconMask: true,
				iconCls: 'link1'
			}
		],
		//record assigned to this infopage
		ipRecord: null
	}
});