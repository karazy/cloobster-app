/**
* Holds templates for dasbhooard item configurations
* for easy access.
*
*/
Ext.define('EatSense.util.DashboardItemTemplates', {
	alternateClassName: ['dItemTpl'],
	statics: {

		'infopages' : {
				xtype : 'tilebutton',
				action: 'show-infopage',
				title: i10n.translate('clubdashboard.button.infopage'),
				text: i10n.translate('clubdashboard.button.infopage.text'),
				iconCls: 'info'
			},

			'products' : {
				xtype : 'tilebutton',
				action: 'show-menu',
				text: i10n.translate('clubdashboard.menu.text'),
				title: i10n.translate('menuTab'),
				iconCls: 'menu'
			},

			'actions' : {
				xtype : 'basictilebutton',
				action: 'show-requests',
				title: i10n.translate('clubdashboard.button.vip'),
				text: i10n.translate('clubdashboard.button.vip.text'),
				iconCls: 'vip',
				welcomeFn: function() {
					Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
				}
			},

			'feedback' : {
				xtype : 'basictilebutton',
				action: 'show-feedback',
				title: i10n.translate('clubdashboard.button.feedback'),
				text: i10n.translate('clubdashboard.button.feedback.text'),
				iconCls: 'feedback',
				welcomeFn: function() {
					Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
				}
			},

			'productsall' : 	{
				xtype : 'dashboardteaser',
				store : 'productStore',
				// clearBeforeFiltering: true,
				filter: [
					function(item) {
						if(item.get('hideInDashboard') === false && item.get('special') === false) {
							return true;
						}
						return false;
				    }
				],
				type: 'products',
				tpl: new Ext.XTemplate(
					'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
					'<div class="text-container">'+
						'<h3>{name}</h3>'+
						'<p>{shortDesc}</p>'+
					'</div>'+
					'<div class="teaser-icon menu-icon"></div>'
				)
			},

			'productsspecial': {
				xtype : 'dashboardteaser',
				store : 'productStore',
				filter: [
						
					function(item) {
						if(item.get('hideInDashboard') === false) {
							return true;
						}
						return false;
				    }, 
					{
						property: 'special',
						value: true
					}
				],
				// clearBeforeFiltering: true,
				type: 'products',
				tpl: new Ext.XTemplate(
					'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
					'<div class="text-container">'+
						'<h3>{name}</h3>'+
						'<p>{shortDesc}</p>'+									
					'</div>'+
					'<div class="teaser-icon star-icon"></div>'
				)
			},

			'infopagesall': {	xtype : 'dashboardteaser',
				type: 'infopages',
				store : 'infopageStore',
				filter: [
					function(item) {
						if(item.get('hideInDashboard') === false) {
							return true;
						}
						return false;
				    }
				],
				iconFit: true,
				tpl: new Ext.XTemplate(
					'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
					'<div class="text-container">'+
						'<h3>{title}</h3>'+
						'<p>{shortText}</p>'+
					'</div>'+
					'<div class="teaser-icon info-icon"></div>'
				)
			}

	}
});