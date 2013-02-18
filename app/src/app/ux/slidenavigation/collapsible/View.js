/**
 *  {@link EatSense.ux.slidenavigation.collapsible.View} is a subclass of {@link Ext.Container}
 *  that provides a sliding main view with an underlying navigation list.  The
 *  concept was inspired by Facebook's mobile app.
 * 
 *  @author Weston Nielson <wnielson@github>
 *
 *  Component heavily modified to use for cloobster.
 *  @author Frederik Reifschneider
 */
Ext.define('EatSense.ux.slidenavigation.collapsible.View', {
    extend: 'Ext.Container',

    /**
     * @event activeitemchange
     * Fires whenever an item gets selected in the list
     * @param {Ext.Component} the activated item
     */ 
    
    requires: [
        'Ext.Button',
        'Ext.Container',
        'Ext.Function',
        'Ext.data.ModelManager',
        'Ext.Toolbar',
        'Ext.data.Model',
        'Ext.data.TreeStore',
        'Ext.dataview.List'
    ],
    
    xtype: 'slidenavigationviewcollapsible',
    
    config: {
        /**
         * @cfg {Object} list Configuration for the navigation list
         */
        list: {
            width: 250,
            maxDrag: null,
            itemCls: 'x-slidenavigation-item'
        },

        /**
         * @cfg {Object} container Configuration for the container
         */
        container: {},

        /**
         * @cfg {Array} items An array of items to put into the navigation list.
         * The items can either be Ext components or special objects with a "handler"
         * key, which should be a function to execute when selected.  Additionally, you
         * can define the order of the items by defining an 'order' parameter.
         */        
        items: [],
        
        /**
         * @cfg {Object} defaults An object of default values to apply to any Ext
         * components created from those listed in ``items``.
         */
        defaults: {
            layout: 'card'
        },
        
        /**
         * @cfg {String} slideSelector Class selector of object (or parent)
         * of which dragging should be allowed.  Defaults to the entire container.
         * For example, this could be set to something like 'x-toolbar' to restrict
         * dragging only to a toolbar.
         */
        slideSelector: '',
        
        /**
         * @cfg {Integer} slideDuration Number of miliseconds to animate the sliding
         * of the container when "flicked".  By default the animation is disable on
         * Android.
         */
        slideDuration: Ext.os.is.Android ? 0 : 100,
        
        /**
         * @cfg {Integer} selectSlideDuration Number of miliseconds to animate the sliding
         * of the container when list item is selected (if closeOnSelect = true). The default
         * value here of 300 gives a much nicer feel.  By default the animation is disable on
         * Android.
         */
        selectSlideDuration: Ext.os.is.Android ? 0 : 300,
        
        /**
         * @cfg {Boolean} closeOnSelect Whether or not to automatically close the container
         * when an item in the list is selected.  Default is true.
         */
        closeOnSelect: true,        

        /**
         * @cfg {String} headerItemTpl
         */
        headerItemTpl: [
            '<div style="min-height: 2.6em; padding: 0.4em 0.2em;">',
                '<tpl if="this.isExpanded(values)">',
                  '<span class="x-button x-button-plain">',
                    '<span class="x-button-icon arrow_down x-icon-mask"',
                    ' style="margin-right:0.4em; background-color: #cacaca !important; background-image: none !important;"></span>',
                    '<span style="color:#00bbe8;">{title}</span>',                
                  '</span>',
                '<tpl else>',
                  '<span class="x-button x-button-plain">',
                    '<span class="x-button-icon arrow_right x-icon-mask"',
                    ' style="margin-right:0.4em; background-color: #cacaca !important; background-image: none !important;"></span>',
                    '<span style="color:#00bbe8;">{title}</span>',
                  '</span>',
                '</tpl>',
            '</div>'
        ].join(''),

         /**
         * @cfg {String} staticHeaderItemTpl
         */
        staticHeaderItemTpl: [
             '<div style="height: 25px; padding: 7px 0em; font-size: 16px;',
                ' color: gray;">',
                '{title}',
            '</div>'
        ].join(''),

        /**
         * @cfg {String} contentItemTpl
         */
        contentItemTpl: [
            '<tpl if="iconCls">',
                '<div class="slidenav-icon {iconCls}"></div>',
            '</tpl>',
            '<div style="height: 30px; padding: 7px 0.8em 2px 0em; max-width: 180px; float:left; font-size: 16px; line-height: 16px;">',
                '{title}',
                '<div style="font-size: 12px;">{subtitle}</div>',
            '</div>',
            '<tpl if="marked">',
                '<div class="slidenav-icon marked-icon"></div>',
            '</tpl>',
            '<tpl if="badgeText">',
                '<span class="slidenav-badge">{badgeText}</span>',
            '</tpl>'
        ].join(''),

        /**
         * @cfg {Boolean} defaultExpanded
         */
        defaultExpanded: false,
        /**
         * @cfg {Boolean} useAnimation
         */
        useAnimation: true,

        //extended my Karazy GmbH
        /**
         * @cfg {Boolean} set to true when welcome mode is active
         */
        welcomeMode: false,
        /**
         * @cfg {Boolean} set to true when basic mode is active
         */
        basicMode: false,
        /**
         * @cfg {Boolean} set to true, to provide a visuell hint for menu when user is inactice
         */
        bounceWhenInactive: false
    },
        
    initConfig: function() {
       var me = this;

       me._indexCount = 0;
       me.assignIndexes(this.config.items);

        /**
         *  Create the store.
         */
        me.store = Ext.create('Ext.data.TreeStore', {
            model: me.getModel(),
            defaultRootProperty: 'items',
            root: { items: this.config.items },
            //TODO ST 2.1 Workaround http://www.sencha.com/forum/showthread.php?249230-ST-2.1-Store-remove-record-fails-with-Cannot-call-method-hasOwnProperty-of-null&p=912339#post912339
            destroyRemovedRecords: false            
        });

        // me.store.on('addrecords', this.addNewItems, this);
  
         /**
         *  Add the items into the list.
         */
         //me.addItems(me.config.items || []);
         delete me.config.items;
                
         me.callParent(arguments);
                
         /**
         *  This stores the instances of the components created.
         *  TODO: Support 'autoDestroy'.
         *  @private
         */
        me._cache = {};
        
        /**
         *  Default config values used for creating a slideButton.
         */
        me.slideButtonDefaults = {
            xtype: 'button',
            iconMask: true,
            iconCls: 'more',
            name: 'slidebutton',
            listeners: {
                release: me.toggleContainer,
                scope: me
            }
            /**
             *  To add the button into a toolbar, you can add the following
             *  to any item in your navigation list.
             */
            //selector: ['toolbar']
        };
        
        //me.config = Ext.merge({}, me.config, config || {});
        //return me.callParent(arguments);
    },
            
    initialize: function() {
        var me = this;

        this.callParent();
        
        this.addCls('x-slidenavigation');
       
        this.setList (this.createNavigationList());
        this.setContainer (this.createContainer());
        
        this.add([
            this.getList(),
            this.getContainer()
        ]);
        
        this.getList().getStore().each(function(item) {
            if(item.raw.preCreate) {
                me.addItemToContainer(item);    
            }            
        });
     
        // TODO: Make this optional, perhaps by defining
        // "selected: true" in the items list
        var firstitem = this.getList().getStore().getAt(0);
        if ( firstitem.isLeaf() ) {
            this.getList().select(0);
        } else {
            firstitem.expand();
            this.getList().select(1);
        }

        if(this.config.bounceWhenInactive) {
            var bounceTask = Ext.create('Ext.util.DelayedTask', function() {
                    this.doBounce(1);
                }, this),
            interval,
            me = this;

            interval = window.setInterval(bounceContainer, 10000);

            this.getContainer().element.on({
                touchstart: delayBounce
            });

            function delayBounce() {
                console.log('delayBounce');
                window.clearInterval(interval); 
                interval = window.setInterval(bounceContainer, 10000);
            }

            function bounceContainer() {
                 me.doBounce(1);
            }

            this.on('containertoggle', function(status) {
                if(status == 'open') {
                    window.clearInterval(interval);
                    this.getContainer().element.un({
                        touchstart: delayBounce
                    });
                }
            });
        }
    },

    addNewItems: function(_items) {
        this.assignIndexes(_items);
        this.getList().getStore().add(_items);
        this.getList().refresh();
    },

    assignIndexes: function (_items) {
       var me = this,
           index,
           items = Ext.isArray(_items) ? _items : [_items];

       Ext.each(items, function(item, index) {
           if ( Ext.isDefined(item.leaf) && 
                !Ext.isDefined(item.index)) { 
                item.index = me._indexCount;
                me._indexCount++;
           } else if(!Ext.isDefined(item.header)) {
               me.assignIndexes ( item.items );
           }
       });
    },

    /**
     *  Creates a button that can toggle the navigation menu.  For an example
     *  config, see ``slideButtonDefaults``.
     */
    createSlideButton: function(el, config) {
        var me = this,
            parent = el.down(config.selector);
        
        if (parent) {
            return parent.add(Ext.merge(me.slideButtonDefaults, config));
        }
        
        return false;
    },
    
    /**
     * Called when an list item has been tapped
     * @param {Ext.List} list The subList the item is on
     * @param {Number} index The id of the item tapped
     * @param {Ext.Element} target The list item tapped
     * @param {Ext.data.Record} record The record whichw as tapped
     * @param {Ext.event.Event} e The event
     */
    onItemTap: function(list, index, target, record, e) {
        var me = this,
            store = list.getStore(),
            item = store.getAt(index);

        if(record.get('header')) {
            //this is a header item, no action required
            return;
        }

        if (!item.isLeaf()) {
            if (item.isExpanded()) {
                item.collapse();
            } else {
                item.expand(false, this.onExpand, this);
            }
        }
    },

    overrideClose: false,
    prevsel: null,

    onSelect: function(list, item, eOpts) {
        var me = this,
            store = list.getStore(),
            container = me.getContainer(),
            index = item.raw.index;

        if ( index == undefined ) {
            list.deselect(item);
            this.overrideClose = true;
            list.select ( this.prevsel );
            return; // not a leaf
        }

        //if basic mode is active look for a basic fn, otherwise proceed as normal
        if(me.getBasicMode() === true && Ext.isFunction(item.raw.basicFn)) {
            //don't select item!
            list.deselect(item);
            list.select ( this.prevsel );
            item.raw.basicFn();
            return
        }

        //welcome mode is active look for a welcome fn, otherwise proceed as normal
        if(me.getWelcomeMode() === true && Ext.isFunction(item.raw.welcomeFn)) {
            //don't select item!
            list.deselect(item);
            list.select ( this.prevsel );
            item.raw.welcomeFn();
            return
        }

        this.prevsel = item;

        if (me._cache[index] == undefined) {
            //container = this.down('container[cls="x-slidenavigation-container"]');
            
            // If the object has a handler defined, then we don't need to
            // create an Ext object
            if (Ext.isFunction(item.raw.handler)) {
                me._cache[index] = item.raw.handler;
            }
            else {
                me._cache[index] = container.add(Ext.merge(me.config.defaults, item.raw));

                // Add a button for controlling the slide, if desired
                if ((item.raw.slideButton || false)) {
                    me.createSlideButton(me._cache[index], item.raw.slideButton);
                }
            }
        }

        if (Ext.isFunction(this._cache[index])) {
            this._cache[index]();
        } else {
            container.setActiveItem(this._cache[index]);
            this.fireEvent('activeitemchange', this._cache[index]);
        }
        
        if (this.config.closeOnSelect) {
            if (this.overrideClose) {
                this.overrideClose = false;
            } else {
                this.closeContainer(this.config.selectSlideDuration);
            }
        }
    },

    /**
    * CUSTOM EXTENSION!
    * Adds the given item to container.
    * @private item
    *   Item to add.
    */
    addItemToContainer: function(item) {
        var me = this,
            container = me.getContainer(),
            index = item.raw.index;

        me._cache[index] = container.add(Ext.merge(me.config.defaults, item.raw));

        // Add a button for controlling the slide, if desired
        if ((item.raw.slideButton || false)) {
            me.createSlideButton(me._cache[index], item.raw.slideButton);
        }
    },
    
    onContainerDrag: function(draggable, e, offsetX, offsetY, eOpts) {
        // if (offsetX < 1) {
        //     this.setClosed(true);
        // } else {
        //     this.setClosed(false);
        // }
    },
    
    onContainerDragstart: function(draggable, e, offset, eOpts) {
        if (this.config.slideSelector == false) {
            return false;
        }
        
        if (this.config.slideSelector) {
            node = e.target;
            while (node = node.parentNode) {
                if (node.className && node.className.indexOf(this.config.slideSelector) > -1) {
                    return true;
                }
            }
            return false;
        }
        return false;
    },
    
    onContainerDragend: function(draggable, e, eOpts) {
        var velocity  = Math.abs(e.deltaX / e.deltaTime),
            direction = (e.deltaX > 0) ? "right" : "left",
            offset    = Ext.clone(draggable.offset),
            threshold = parseInt(this.config.list.width * .70);
        
        switch (direction) {
            case "right":
                offset.x = (velocity > 0.75 || offset.x > threshold) ? this.config.list.width : 0;
                break;
            case "left":
                offset.x = (velocity > 0.75 || offset.x < threshold) ? 0 : this.config.list.width;
                break;
        }
        
        this.moveContainer(offset.x);
    },
    
    /**
     * Registers the model with Ext.ModelManager, if it hasn't been
     * already, and returns the name of the model for use in the store.
     */
    getModel: function() {
        var model = 'SlideNavigationPanelItem';
        
        if (!Ext.ModelManager.get(model)) {
            Ext.define(model, {
                extend: 'Ext.data.Model',
                config: {
                   // idProperty: 'index',
                    fields: [
                        //used internally for caching
                        'index',
                        //title used for display
                        {
                            name: 'title',
                            type: 'string'
                        },
                        //subtitle
                        {
                            name: 'subtitle',
                            type: 'string'
                        },
                        'slideButton', 
                        'handler',
                        //used to display a badgeText like in {@link Ext.Button}
                        'badgeText',
                        //if set to true will render this item as a seperator and without function
                        'header',
                        //if true hides this option when in basicmode
                        {
                            name: 'hideOnBasic',
                            type: 'boolean',
                            defaultValue: false
                        },
                        //a string used to select this button
                        'action',
                        //true if this is a record added dynamically
                        'dynamic',
                        //used to explicity mark an item, renders a icon after the name
                        'marked',
                        //area represented by this item
                        'areaId'
                    ] 
                }
            });
        }
        
        return model;
    },
    
    /**
     *  Closes the container.  See ``moveContainer`` for more details.
     */
    closeContainer: function(duration) {
        var duration = duration || this.config.slideDuration,
            slideBezelPanel;

        //defer to prevent false masking and flickering
        // Ext.defer(function() {
        //     this.getContainer().getActiveItem().setMasked(false);
        // }, 10, this);

        // slideBezelPanel = Ext.getCmp('slidenavigationbezel')

        // slideBezelPanel.setWidth('15px');
        // this.fireEvent('containertoggle', 'closed');

        // slideBezelPanel.element.un({
        //     tap: this.
        // });

        this.moveContainer(0, duration);   

        
        // this.getContainer().element.un({
        //     'tap': this.closeContainerNoDuration
        // });
    },
    
    /**
     *  Opens the container.  See ``moveContainer`` for more details.
     */
    openContainer: function(duration) {
        var duration = duration || this.config.slideDuration;
        this.getContainer().addCls('open');

        //defer to prevent false masking and flickering
        // Ext.defer(function() {
        //         this.getContainer().getActiveItem().setMasked(true);
        // }, 10, this);
        // this.moveContainer(this.config.list.width, duration);
        // Ext.getCmp('slidenavigationbezel').setWidth('100%');
        // this.fireEvent('containertoggle', 'open');

        this.moveContainer(this.config.list.width, duration);
    },
    
    toggleContainer: function(duration) {
        var duration = Ext.isNumber(duration) ? duration : this.config.slideDuration;
        if (this.isClosed()) {
            this.openContainer(duration);
        } else {
            this.closeContainer(duration);
        }
    },
    
    /**
     *  Moves the container to a specified ``offsetX`` pixels.  Positive
     *  integer values move the container that many pixels from the left edge
     *  of the window.  If ``duration`` is provided, it should be an integer
     *  number of milliseconds to animate the slide effect.  If no duration is
     *  provided, the default in ``config.slideDuration`` is used.
     */
    moveContainer: function(offsetX, duration) {
        var duration = duration || this.config.slideDuration,
            draggable = this.getContainer().draggableBehavior.draggable;
        
        draggable.setOffset(offsetX, 0, {
            duration: duration
        });
    },
    
    /**
     *  Returns true if the container is closed, false otherwise.  This is a
     *  computed value based off the current offset position of the container.
     */
    isClosed: function() {
        return (this.getContainer().draggableBehavior.draggable.offset.x == 0);
    },
    
    /**
     *  Sets the container as being closed.  This shouldn't ever be called
     *  directly as it is automatically called by the ``translatable``
     *  "animationend" event after the container has stopped moving.  All this
     *  really does is set the CSS class for the container.
     */
    setClosed: function(closed) {
        /**
         *  TODO: Consider some way to mask/disable certain elements when
         *        the container is opened.  The code commented-out below
         *        'works' but I think there is a better way to approach this.
         */
         
        if (closed) {
            this.getContainer().removeCls('open');
            Ext.getCmp('slidenavigationbezel').setWidth('15px');
            //defer to prevent false masking and flickering
            Ext.defer(function() {
                this.getContainer().getActiveItem().setMasked(false);
            }, 10, this);
            this.fireEvent('containertoggle', 'closed');
            
            /*
            Ext.each(this.getContainer().getActiveItem().getItems().items, function(item) {
                if (item.maskOnSlide) {
                    item.setMasked(false);
                }
            });
            */
        } else {
            this.getContainer().addCls('open');
            Ext.getCmp('slidenavigationbezel').setWidth('100%');
            //defer to prevent false masking and flickering
            Ext.defer(function() {
                this.getContainer().getActiveItem().setMasked(true);
            }, 10, this);
            this.fireEvent('containertoggle', 'open');

            /*
            Ext.each(this.getContainer().getActiveItem().getItems().items, function(item) {
                if (item.maskOnSlide) {
                    item.setMasked(true);
                }
            });
            */
        }

    },
    
    /**
     * Generates a new Ext.dataview.List object to be used for displaying
     * the navigation items.
     */
    createNavigationList: function(store) {
        var itemTpl = new Ext.XTemplate(
                '<tpl if="leaf">',
                    '<div class="accordion-list-content">',
                        this.getContentItemTpl(),
                    '</div>',
                '<tpl elseif="header">',
                    '<div>',
                        this.getStaticHeaderItemTpl(),
                    '</div>',
                '<tpl else>',
                    '<div class="accordion-list-header">',
                        this.getHeaderItemTpl(),
                    '</div>',
                '</tpl>',
                {
                    isExpanded: function(values) {
                        return values.expanded;
                    }
                });

        var list = Ext.create('Ext.dataview.List', Ext.merge({}, this.config.list, {
            docked: 'left',
            cls: 'x-slidenavigation-list',
            style: 'position: absolute; top: 0; left: 0; height: 100%;' +
                   'width: 100% !important; z-index: 5',
            itemTpl: itemTpl,
            listeners: {
                select: this.onSelect,
                scope: this
            }
        }));

        list.on('itemtap', this.onItemTap, this);
        list.setStore( this.store );
        list.setScrollable (true);

        return list;
    },
    
    /**
     *  Generates and returns the Ext.Container to be used for displaying
     *  content.  This is the "slideable" container that is positioned above
     *  the navigation list.
     */
    createContainer: function() {
        return Ext.create('Ext.Container', Ext.merge({}, this.config.container, {
            docked: 'left',
            cls: 'x-slidenavigation-container',
            style: 'width: 100%; height: 100%; position: absolute; opacity: 1; z-index: 5;',
            docked: 'left',
            layout: 'card',
            draggable: {
                direction: 'horizontal',
                constraint: {
                    min: { x: 0, y: 0 },
                    max: { x: this.config.list.maxDrag || Math.max(screen.width, screen.height), y: 0 }
                },
                listeners: {
                    dragstart: {
                        fn: this.onContainerDragstart,
                        order: 'before',
                        scope: this
                    },
                    // drag: Ext.Function.createThrottled(this.onContainerDrag, 100, this),
                    dragend: this.onContainerDragend,
                    scope: this
                },
                translatable: {
                    listeners: {
                        animationend: function(translatable, b, c) {
                            // Remove the class when the animation is finished, but only
                            // if we're "closed"
                            this.setClosed(this.isClosed());
                        },
                        scope: this // The "x-slidenavigation" container
                    }
                }
            }
        }));
    },
    
    /**
     *  Override the default method so that we actually return the active item in the list,
     *  otherwise this will always return the same thing (the main container, not the
     *  selected item).
     *
     */
/*    getActiveItem: function() {
        var selection = this.getList().getSelection();
        if (selection) {
            return selection[0];
        }
    }
*/

    /**
     * @event onExpand
     * Fires when a node is tapped on
     */
    onExpand: function() {
        if (!this.getUseAnimation()) {
            return;
        }

        var targets = this.getTargetItems();

        for (var i = 0; i < targets.length; i++) {
            Ext.Anim.run(Ext.get(targets[i]), 'fade', {
                duration: i === 0 ? 150 : i * 300
            });
        }
    },

    /**
     * @private
     */
    getTargetItems: function() {
        var header = Ext.query('.' + this.getCls() + ' .x-dataview-item'),
            isTarget = false,
            targets = [],
            elem;

        for (var i = 0; i < header.length; i++) {
            elem = Ext.get(header[i]);

            if (elem.hasCls('x-item-selected')) {
                isTarget = true;
                continue;
            }

            if (isTarget) {
                var content = elem.down('.accordion-list-content');
                if (content) {
                    targets.push(content);
                } else {
                    break;
                }
            }
        }

        return targets;
    },

    /**
    * Returns the first list record matching the given action.
    * @param {String} action
    *   Action to match the records property
    * @return {Ext.Model} record if found null otherwise
    */
    getItemByAction: function(action) {
        var record = null,
            list = this.getList();

        record = list.getStore().findRecord('action', action, 0, false, false, true);


        return record;
    },
    /**
    * Selects a navigation entry by given action.
    * @param {String} action of item to select.
    */
    selectByAction: function(action) {
        var list = this.getList(),
            //selected elements 
            selection = list.getSelection(),
            activeSelection,
            recordToSelect;
                
        if(selection.length > 0) {
            //since only one item is selectable (or should be ^^) grab it
            if(selection[0].get('action') == action) {
                //already the active element
                return;
            }
        }

        recordToSelect = this.getItemByAction(action);
        if(recordToSelect) {
            list.select(recordToSelect);    
        }        
    },

    doBounce: function(times, delay, callback) {
        var me = this,
            counter = 0,
            times = times || 1,
            delay = delay || 1000,
            containerEle = this.getContainer().element;

        bounceBaby();

        //TODO register cotainer tap and stop animation on tap
        // containerEle.on({
        //     touchstart: stopTheBounce,
        //     single: true
        // });

        function bounceBaby() {
            // me.getBounceAnimationIn().run(containerEle, {
            // });
            // return;

            if(counter < times) {
                me.getBounceAnimationOut().run(containerEle, {
                after: function() {
                    counter++;
                    me.getBounceAnimationIn().run(containerEle, {
                        after: function() {
                            if(counter < times) {
                                Ext.defer(function() {
                                    bounceBaby();
                                }, delay);
                            } else {
                                if(callback) {
                                    callback();
                                }
                            }                          
                        }
                    });
                }
                });
            } else {
                // containerEle.un({
                //     touchstart: stopTheBounce
                // });
            }
        }

        function stopTheBounce() {
            //increase times so that excecution stops
            counter = times + 1;
        }

        
    },

    getBounceAnimationOut: function() {
        var anim;

        anim = Ext.create('Ext.Anim',{
          autoClear: false,
          reverse: false,
          easing: 'ease-in',
          from:{'left':'0px'},
          to: {'left':'15px'},
          duration: 400,
        });
        return anim;
    },
    getBounceAnimationIn: function() {
        var anim;

        anim = Ext.create('Ext.Anim',{
          autoClear: false,
          easing: 'ease-out',
          from:{'left':'15px'},
          to: {'left':'0px'},
          duration: 150
        });
        return anim;
    }

});