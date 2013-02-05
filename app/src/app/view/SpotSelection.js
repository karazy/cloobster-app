/**
* Shows a list of available spots.
*/
Ext.define('EatSense.view.SpotSelection', {
	extend: 'Ext.Panel',
	requires: [],
	xtype: 'spotselection',
	config: {
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('spotselection.title'),
				docked: 'top',
				items: [
					xtype: 'backbutton'
				]
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
				store: 'spotStore',
				itemTpl: '{name}'
			}
		]
	}
});