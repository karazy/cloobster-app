Ext.define('EatSense.view.NoLocation', {
	extend: 'Ext.Panel',
	xtype: 'nolocation',
	config: {
		layout: {
			type: 'vbox',
			align: 'center',
			pack: 'center'
		},
		//make panel stay on top!
		style: 'z-index: 5;',
		autoDestroy: true,
		fullscreen: true,
		cls: 'nolocation',
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',	
				items: [
					{
						xtype: 'backbutton'
					}
				]
			},
			{
				xtype: 'label',
				cls: 'title',
				html: i10n.translate('tovisit.nolocation.title')
			},
			{
				xtype: 'image',
				src: 'res/images/help/app_screenshot.jpg',
				width: '100%',
				height: '70%'
			},
			{
				xtype: 'label',
				cls: 'description',
				html: i10n.translate('tovisit.nolocation.description')
			}
		]
	},

	initialize: function() {
		var me = this,
			button;

		button = this.down('button[action=back]');
		//add backhandler
		Ext.Viewport.fireEvent('addbackhandler', closePanel);

		if(button) {
			button.on({
				tap: closePanel,
				scope: this
			})
		}

		function closePanel() {
			//remove backhandler
			Ext.Viewport.fireEvent('removebackhandler', closePanel);
			me.destroy();
		}		
	}
});