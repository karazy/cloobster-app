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
						xtype: 'backbutton'						
					}
				]
			},
			{
				xtype: 'label',
				docked: 'top',
				itemId: 'hotelInfo',
				cls: 'infopage-hotel-info',
				tpl: '<img src="{imageUrl}" /><h2>{name}</h2><h3>{slogan}</h3><p>{description}</p>'
			},
			{
				xtype: 'searchfield',
				docked: 'top',
				margin: '0 15 10 10',
				style: 'border-radius: .3em;',
				cls: 'general-textfield'
			},
			{
				xtype: 'list',
   				allowDeselect: true,
   				scrollToTopOnRefresh: true,
   				store: 'infopageStore',
				itemCls: 'infopage-list-item',
				itemTpl: '<div class="info"><h3>{title}</h3><div><div class="thumbnail"><img src="{imageUrl}"/></div><p>{shortText}</p></div></div>'
			}
		]
	}
});