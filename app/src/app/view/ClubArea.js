/**
* Acts as Container for ClubDashboard, Feedback, Requests etc.
* which are all found in the first tab of Lounge view.
* ClubDashboard is the first visible item after checkin.
*/
Ext.define('EatSense.view.ClubArea', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.ClubDashboard', 'EatSense.view.Feedback'],
	xtype: 'clubarea',
	config: {
		iconCls : 'home',
		title: i10n.translate('clubdashboard.tab.title'),
		iconMask: true,
		layout: 'card',
		activeItem: 0,
		items: [
				{
					xtype: 'clubdashboard'
				},
				{
					xtype: 'feedback'
				},
				{
					xtype: 'requeststab'
				}
		]
	}
	
});