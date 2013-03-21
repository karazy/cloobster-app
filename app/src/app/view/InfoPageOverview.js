Ext.define('EatSense.view.InfoPageOverview', {
	extend: 'Ext.Panel',
	xtype: 'infopageoverview',
	requires: ['Ext.field.Search', 'EatSense.view.components.SlidenavButton'],
	config: {
		layout: 'card',
		activeItem: 0,
		items: [
				{
					xtype: 'panel',
					layout: {
						type: 'fit'
					},
					items: [
					{
						xtype: 'titlebar',
						docked: 'top',
						title: i10n.translate('infopage.overview.title')
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
		   				// grouped: true,
		   				store: 'infopageStore',
						itemCls: 'infopage-list-item',
						itemTpl: new Ext.XTemplate(
							'<div class="info">'+
								// '<tpl if="type && type.toUpperCase() == \'LINK\'"><div class="link"></div></tpl>'+
								'<h3>{title}</h3>'+
								'<div><div class="thumbnail"><img src="{imageUrl}"/></div><p>{shortText}</p></div>'+								
							'</div>'
							),
						listeners: {
							select : function(dv, index, target, record, e, eOpts) {					
								Ext.defer((function() {
									dv.deselectAll();
								}), 1000, this);					
							}
						}
					}
				]},
			{
				xtype: 'infopagecarousel'
			},
			{
				xtype: 'infopagelink'
			}
			
		]
	}
});