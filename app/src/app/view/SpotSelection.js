/**
* Shows a list of available spots.
*/
Ext.define('EatSense.view.SpotSelection', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.BackButton', 'Ext.field.Search'],
	xtype: 'spotselection',
	config: {
		layout: 'fit',
		//make panel stay on top!
		style: 'z-index: 5;',
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('spotselection.title'),
				docked: 'top',
				items: [
					{
						xtype: 'backbutton',
						title: i10n.translate('cancel')
					}
				]
			},
			{
				xtype: 'label',
				docked: 'top',
				cls: 'general-label',
				html: i10n.translate('spotselection.description')
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
				store: 'spotStore',
				itemTpl: '{name}'
			}
		]
	}
});