Ext.define('EatSense.view.About', {
	extend: 'Ext.Panel',
	requires: ['EatSense.ux.HTMLPanel'],
	xtype: 'about',
	config: {
		scrollable : 'vertical',
    	modal: true,
		top: '5%',
		left: 5,
		right: 5,
		bottom: 10,		
		autoDestroy: true,		
		items: [
		{
			xtype: 'titlebar',
			title: i10n.translate('general.companydetail'),
			docked: 'top'
		},
		{
			xtype: 'htmlpanel',
			//Set during creation
			// url: appConfig.getProp('impressumUrl'),
			cls: 'about-text'
		},
		{
			xtype: 'fixedbutton',
			docked: 'bottom',
			ui: 'action',
			text: i10n.translate('close'),
			action: 'close'
		}
		]
	}
});