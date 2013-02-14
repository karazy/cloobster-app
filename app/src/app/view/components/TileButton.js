/**
* A square button in "pinterest" style used on the dashboard.
*/
Ext.define('EatSense.view.components.TileButton', {
	// extend: 'GT.override.FixedButton',
    extend: 'Ext.Button',
	xtype: 'tilebutton',
	requires: [],
	config: {

		/**
         * @cfg {String} text
         * The Button text.
         * @accessor
         */
        title: null,

        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'tilebutton',

        /**
         * @cfg {Boolean} expandIcon
         * Set to true, to not shrink the icon to a fixed size
         * @accessor
         */
        expandIcon: false,

        /**
         * @cfg {Boolean} expandIcon
         * Set to true, to fit the icon completely to the avail size
         * @accessor
         */
        fitIcon: false,

        /**
         * @cfg {String} labelCls
         * The CSS class to add to the field's label element.
         * @accessor
         */
        labelCls: Ext.baseCSSPrefix + 'tilebutton-label',

        /**
         * @cfg {String} pressedCls
         * The CSS class to add to button in pressed mode.
         * @accessor
         */
        pressedCls: Ext.baseCSSPrefix + 'tilebutton-pressed',

        /**
         * @cfg {String} badgeCls
         * The CSS class for button badge.
         * @accessor
         */
        badgeCls: Ext.baseCSSPrefix + 'tilebutton-badge',

        /**
        * @cfg {String} iconAlign
        * @see Ext.Button
        */
        iconAlign: 'top'
		
	},
	template: [
        {
            tag: 'span',
            reference: 'badgeElement',
            className: Ext.baseCSSPrefix + 'tilebutton-badge',
            hidden: true
        },
        {
            tag: 'div',
            className: Ext.baseCSSPrefix + 'tilebutton-icon',
            reference: 'iconElement',
            hidden: true
        },
        {
            tag: 'div',
            reference: 'titleElement',
            className: Ext.baseCSSPrefix + 'tilebutton-title',
            hidden: true
        },
        {
            tag: 'div',
            reference: 'textElement',
            // className: Ext.baseCSSPrefix + 'tilebutton-text',
            hidden: true
        }
    ],

    /**
     * @private
     */
    updateTitle: function(text) {
        var titleElement = this.titleElement;
        if (titleElement) {
            if (text) {
                titleElement.show();
                titleElement.setHtml(text);
            }
            else {
                titleElement.hide();
            }
        }
    },
    /**
    * @private
    */
    updateExpandIcon: function(expand) {
    	var iconElement = this.iconElement;

    	if(iconElement) {
    		if(expand === true) {
    			iconElement.addCls('x-tilebutton-icon-expand');
    		} else {
    			iconElement.removeCls('x-tilebutton-icon-expand');
    		}
    	}
    },
    /**
    * @private
    */
    updateExpandIcon: function(expand) {
        var iconElement = this.iconElement;

        if(iconElement) {
            if(expand === true) {
                iconElement.addCls('x-tilebutton-icon-fit');
            } else {
                iconElement.removeCls('x-tilebutton-icon-fit');
            }
        }
    },
    /**
     * @private
     * Copied from Ext.Button
     * If not present resetting the Icon did not work. See Ticket #433
     */
    updateIcon: function(icon) {
        var me = this,
            element = me.iconElement;

        if (icon) {
            me.showIconElement();
            element.setStyle('background-image', 'url(' + icon + ')');
            me.refreshIconAlign();
            me.refreshIconMask();
        }
        else {
            element.setStyle('background-image', '');
            me.hideIconElement();
            me.setIconAlign(false);
        }
    }
});