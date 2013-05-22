/**
* Detail view for visits.
*/
Ext.define('EatSense.view.VisitDetail', {
	extend: 'Ext.Panel',
	requires: ['Ext.field.DatePicker'],
	xtype: 'visitdetail',
	config: {
		layout: {
			type: 'fit'
		},
	}
});