Ext.define('EatSense.view.InfoPageOverview', {
	extend: 'Ext.Panel',
	xtype: 'infopageoverview',
	requires: ['Ext.field.Search', 'EatSense.view.components.SlidenavButton'],
	mixins: ['EatSense.mixin.ImageZoom'],
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
						title: i10n.translate('infopage.overview.title'),
						items: [
							{
								xtype: 'fixedbutton',
								iconCls: 'search',
								iconMask: true,
								align: 'right',
								action: 'toggle-search',
								ui: 'action'
							}
						]
					},
					{
						xtype: 'carousel',
						itemId: 'profilePictures',
						docked: 'top',
						style: {
							'height' : '150px'
						}
					},
					{
						xtype: 'list',
		   				allowDeselect: true,
		   				scrollToTopOnRefresh: true,
		   				store: 'infopageStore',
						itemCls: 'infopage-list-item',
						itemTpl: new Ext.XTemplate(
							'<div class="info">'+
								'<div class="thumbnail"><img src="{imageUrl}"/></div>'+
								// '<tpl if="type && type.toUpperCase() == \'LINK\'"><div class="link"></div></tpl>'+
								'<div>'+
									'<h3>{title}</h3>'+
									'<p>{shortText}</p>'+
								'</div>'+
							'</div>'
							),
						listeners: {
							select : function(dv, index, target, record, e, eOpts) {					
								Ext.defer((function() {
									dv.deselectAll();
								}), 1000, this);					
							}
						}
					},
				]},
			{
				xtype: 'infopagecarousel'
			},
			{
				xtype: 'panel',
				itemId: 'searchPanel',
				// layout: {
				// 	type: 'fit'
				// },
				style: {
					width: '80%'
				},
				modal: true,
				hideOnMaskTap: true,
				items: [
					{
						xtype: 'searchfield',
						// style: 'border-radius: .3em;',
						// cls: 'general-textfield'
					}
				]
			}
		]
	},
	initialize: function() {
		var searchBt = this.down('button[action=toggle-search]'),
			searchPanel = this.down('#searchPanel');

		if(searchBt) {
			searchBt.on({
				tap: function(button) {
					if(searchPanel.getHidden()) {
						searchPanel.setHidden(false);
						searchPanel.showBy(button);
					} else {
						searchPanel.setHidden(true);
					}
					
				},
				scope: this
			});
		}
	}
});