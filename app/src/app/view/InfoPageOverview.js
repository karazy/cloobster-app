Ext.define('EatSense.view.InfoPageOverview', {
	extend: 'Ext.Panel',
	xtype: 'infopageoverview',
	requires: ['Ext.field.Search'],
	config: {
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				title: i10n.translate('infopage.overview.title'),
				items: [
					{
						xtype: 'backbutton',
						padding: '5 5 0 5'
					}
				]
			},
			{
				xtype: 'searchfield',
				docked: 'top'
			},
			{
				xtype: 'list',
				grouped     : true,
   				indexBar    : true,
   				store: 'infopageStore',
				itemCls: 'infopage-list-item',
				itemTpl: '<img src="{image}"/><h2>{title}</h2><p>{shortDesc}</p>'
			}
		]
	}
});