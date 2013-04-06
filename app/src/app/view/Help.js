/**
* A floating panel displaing a help text.
*
*
*/
Ext.define('EatSense.view.Help', {
	extend: 'Ext.Panel',
	config: {
		modal: true,
		// hideOnMaskTap: true,
		floatingCls: '',
		cls: '',
		centered: true,
		zIndex: 110,
		width: '95%',
		style: {

		},
		layout: {
			type: 'vbox',
			align: 'center',
			pack: 'center'
		},
		items: [
			{
				xtype: 'label',				
				html: i10n.translate('general.help.dashboard.msg'),
				style: {
					'color' : 'white',
					'text-align' : 'center',
					// 'font-size' : '20px',
					// 'padding' : '20px'
				}
			},
			{
				xtype: 'fixedbutton',
				text: i10n.translate('general.help.dashboard.gotit'),
				padding: '5 20',
				margin: '5 20',
				ui: 'action'
			},
			{
				xtype: 'label',
				html: '<div style="position: fixed; height: 35%; width: 50%; bottom: 5px; left: 40px;">'+
				'<img src="res/images/help/arrow_sw.png" width="100%" height="100%"></div>'
			}
		]
	},

	initialize: function(help) {
		var me = this,
			button;
		console.log('EatSense.view.Help.initialize');

		button = this.down('button');
		//add backhandler
		Ext.Viewport.fireEvent('addbackhandler', closeHelp);

		if(button) {
			button.on({
				tap: closeHelp,
				scope: this
			})
		}

		function closeHelp() {
			//remove backhandler
			Ext.Viewport.fireEvent('removebackhandler', closeHelp);
			me.destroy();
		}		
	}
});