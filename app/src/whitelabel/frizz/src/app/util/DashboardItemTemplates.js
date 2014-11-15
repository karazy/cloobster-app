/**
* Provides templates for dasbhooard item configurations.
*/
Ext.define('EatSense.util.DashboardItemTemplates', {
	alternateClassName: ['dItemTpl'],
	requires: ['EatSense.util.Helper'],
	singleton: true,

		factory: function(brand) {
             // 'this' in static methods refer to the class itself
             return new this(brand);
         },
		//map of factory methods returning the filters
		infopages : function() {
				var tpl = {
					xtype : 'tilebutton',
					action: 'show-infopage',
					title: i10n.translate('clubdashboard.button.infopage'),
					text: i10n.translate('clubdashboard.button.infopage.text'),
					iconCls: 'info'
				}

				return tpl;
			},

			products : function() {
				var tpl = {
					xtype : 'tilebutton',
					action: 'show-menu',
					text: i10n.translate('clubdashboard.menu.text'),
					title: i10n.translate('menuTab'),
					iconCls: 'menu'
				}
				return tpl;
			},

			actions : function() {
					var tpl = {
						xtype : 'basictilebutton',
						action: 'show-requests',
						title: i10n.translate('clubdashboard.button.vip'),
						text: i10n.translate('clubdashboard.button.vip.text'),
						iconCls: 'vip',
						welcomeFn: function() {
							Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
						}
					}
					return tpl;
			},

			feedback : function() {
					var tpl = {
						xtype : 'basictilebutton',
						action: 'show-feedback',
						title: i10n.translate('clubdashboard.button.feedback'),
						text: i10n.translate('clubdashboard.button.feedback.text'),
						iconCls: 'feedback',
						welcomeFn: function() {
							Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
						}
					}
				return tpl;
			},

			productsall : function() {
				var tpl = {
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
						'<tpl if="imageUrl"><div class="thumbnail"><img src="{imageUrl}=s360"></div></tpl>'+
						'<div class="text-container">'+
							'<div class="title">{name}</div>'+
							'<div class="text">{shortDesc}</div>'+
						'</div>'
						// '<div class="teaser-icon menu-icon"></div>'
					)
					}
				return tpl;
			},

			productsspecial: function() {
				var tpl = {
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
						'<tpl if="imageUrl"><div class="thumbnail"><img src="{imageUrl}=s360"></div></tpl>'+
						'<div class="text-container">'+
							'<div class="title">{name}</div>'+
							'<div class="text">{shortDesc}</div>'+									
						'</div>'
						// '<div class="teaser-icon star-icon"></div>'
					)
				}
				return tpl;
			},

			productsselected : function(entityIds) {
				var tpl = {
					xtype : 'dashboardteaser',
					store : 'productStore',
					filter: [
					    function(item) {
					    	if(!entityIds) {
					    		return false;
					    	}

			    			if(Ext.Array.contains(entityIds, item.get('id'))) {
			    				return true;
			    			}

			    			return false;
			    		}
					],
					type: 'products',
					tpl: new Ext.XTemplate(
						'<tpl if="imageUrl"><div class="thumbnail"><img src="{imageUrl}=s360"></div></tpl>'+
						'<div class="text-container">'+
							'<div class="title">{name}</div>'+
							'<div class="text">{shortDesc}</div>'+									
						'</div>'
						// '<div class="teaser-icon menu-icon"></div>'
					)
				}
				return tpl;
			},

			infopagesall : function() {
				var tpl = {
					xtype : 'dashboardteaser',
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
						'<tpl if="imageUrl"><div class="thumbnail"><img src="{imageUrl}=s360"></div></tpl>'+
						'<div class="text-container">'+
							'<div class="title">{title}</div>'+
							'<div class="text">{shortText}</div>'+
						'</div>'
						// '<div class="teaser-icon info-icon"></div>'
					)
				}
				return tpl;
			},

			infopagesselected : function(entityIds) {
				var tpl = {
					xtype : 'dashboardteaser',
					type: 'infopages',
					store : 'infopageStore',
					filter: [
					    function(item) {
					    	if(!entityIds) {
					    		return false;
					    	}

			    			if(Ext.Array.contains(entityIds, item.get('id'))) {
			    				return true;
			    			}

			    			return false;
			    		}
					],
					iconFit: true,
					tpl: new Ext.XTemplate(
						'<tpl if="imageUrl"><div class="thumbnail"><img src="{imageUrl}=s360"></div></tpl>'+
						'<div class="text-container">'+
							'<div class="title">{title}</div>'+
							'<div class="text">{shortText}</div>'+
						'</div>'
						// '<div class="teaser-icon info-icon"></div>'
					)
				}
				return tpl;
			},
			deztixevents: function() {
				var tpl = {
					xtype : 'tilebutton',
					action: 'show-ztix-events',
					type: 'deztixevents',
					text: i10n.translate('de.ztix.events.title.subtitle'),
					title: i10n.translate('de.ztix.events.title'),
					iconCls: 'calendar'
				}
				return tpl;
			},
			menusselected : function(entityIds) {
				var tpl = {
					xtype : 'dashboardteaser',
					store : 'menuStore',
					filter: [
					    function(item) {
					    	if(!entityIds) {
					    		return false;
					    	}

			    			if(Ext.Array.contains(entityIds, item.get('id'))) {
			    				return true;
			    			}

			    			return false;
			    		}
					],
					type: 'menus',
					tpl: new Ext.XTemplate(
						'<tpl if="imageUrl">',
							'<div class="thumbnail"><img src="{imageUrl}=s360"></div>',
						'</tpl>',
						'<div class="text-container">',
							'<div class="title">{title}</div>',
							'<div class="text">{description}</div>',
						'</div>'
					)
				}
				return tpl;
			},
			//2014-11-15 deactivated due to lack of intereset from ztix
			// deztixcoupons: function() {
			// 	var tpl = {
			// 		xtype : 'tilebutton',
			// 		action: 'show-ztix-coupons',
			// 		type: 'deztixcoupons',
			// 		text: i10n.translate('de.ztix.coupons.title.subtitle'),
			// 		title: i10n.translate('de.ztix.coupons.title'),
			// 		iconCls: 'gift'
			// 	}
			// 	return tpl;
			// },
			storecard: function() {
				var tpl = {
					xtype : 'tilebutton',
					action: 'show-storecard',
					type: 'storecard',
					text: i10n.translate('clubdashboard.button.storecard.text'),
					title: i10n.translate('clubdashboard.button.storecard'),
					iconCls: 'storecard'
				}
				return tpl;
			},

	/**
	* Get template assigned to given config.
	* @param {EatSense.model.DashboardItem} config
	*	config to get template for
	* @return 
	*	Template or null when none was found
	*/
	getTemplate: function(config) {
		var tpl,
			type;

		if(!config) {
			console.log('EatSense.util.DashboardItemTemplates.getTemplate: no config');
			return;
		}

		type = config.get('type');
		//create template by calling the template function
		if(appHelper.isFunction(this[type])) {
			tpl = this[type](config.raw.entityIds);	
		} else {
			console.log('EatSense.util.DashboardItemTemplates.getTemplate: no template found for ' + type);
		}
		

		return tpl;
	}
});