/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageLink}
*/
Ext.define('EatSense.view.InfoPageLink', {
	extend: 'EatSense.view.InfoPageDetail',
	xtype: 'infopagelink',
	alternateClassName: 'IPLink',
	config: {
		// scrollable: null,
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'center'
		},
		cls: '',
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><tpl if="imageUrl"><img src="{imageUrl}"/></tpl><div>{shortText}</div>'
		),
		items: [
			{
				xtype: 'label',
				// docked: 'top',
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
		// ipRecord: null
	},

	updateIpRecord: function(newRecord, oldRecord) {
		var panel = this,
			label,
			html;

		label = panel.down('label');

		html = panel.getTpl().apply(newRecord.getData());
		label.setHtml(html);

		this.registerImageZoomTap(panel);

	}
});