Class('EatSense.test.CloobsterTest', {
    isa     : Siesta.Test.SenchaTouch,

    methods : {

        checkIn: function(callback, scope) {
            this.diag('Perform checkin ...');
            this.chain(
                {
                    action : 'tap',
                    target : function() { 
                        return this.cq1('dashboard button[action=checkin]'); 
                    }
                },
                {
                    waitFor: 2000
                },
                // function(next) {
                //     this.waitForComponentVisible(Ext.Msg, next, this, 3000);
                // },
                { 
                    action : 'click', 
                    target : function() {
                        return Ext.Msg.down('textfield');
                    }
                },
                { 
                    action : 'type', 
                    target : function() 
                    {
                        return Ext.Msg.down('textfield');
                    },
                    text : 'basic001'
                    // 2498-4681
                },        
                {
                    action      : 'tap',
                    target      : function () {
                        return Ext.Msg.down('button[itemId=yes]');
                    } 
                },
                function(next) {
                    this.waitForComponentVisible(this.cq1('mainview checkinconfirmation'), next, this, 3000);
                },
                {
                    action : 'tap',
                    target : function() {
                        return this.cq1('checkinconfirmation button[action=confirm-checkin]');
                    }
                },
                function(next) {
                    this.waitForComponentVisible(this.cq1('lounge clubarea clubdashboard'), callback, this, 3000);
                },
                function() {
                    t.done();
                }
            );
        },

        checkInSteps: function(t) {
            var steps = [
                {
                    action : 'tap',
                    target : function() { 
                        return t.cq1('dashboard button[action=checkin]'); 
                    }
                },
                function(next) {
                    t.waitForComponentVisible(Ext.Msg, next, t, 3000);
                },
                { 
                    action : 'click', 
                    target : function() {
                        return Ext.Msg.down('textfield');
                    }
                },
                { 
                    action : 'type', 
                    target : function() 
                    {
                        return Ext.Msg.down('textfield');
                    },
                    text : 'basic001'
                    // 2498-4681
                },        
                {
                    action      : 'tap',
                    target      : function () {
                        return Ext.Msg.down('button[itemId=yes]');
                    } 
                },
                function(next) {
                    t.waitForComponentVisible(t.cq1('mainview checkinconfirmation'), next, t, 3000);
                },
                {
                    action : 'tap',
                    target : function() {
                        return t.cq1('checkinconfirmation button[action=confirm-checkin]');
                    }
                },
                function(next) {
                    t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard'), next, t, 3000);
                }
            ];

            return steps;
        },

        testUserLogin: function(_Ext, callback) {
            var defaultHeaders = _Ext.Ajax.getDefaultHeaders() || {};
            
            _Ext.Ajax.request({
                url: '/c/accounts/tokens',
                method: 'POST',
                headers: {
                    //provide credentials, they will be added to request header
                    'login': 'auto-test@karazy.net',
                    'password': 'test11'
                },
                //submit a timestamp to prevent iOS6 from caching the POST request
                jsonData: new Date().getTime(),
                scope: this,
                success: function(response) {
                    
                    _Ext.apply(defaultHeaders, {'X-Auth' : _Ext.decode(response.responseText).accessToken});

                    if(!_Ext.Ajax.getDefaultHeaders()) {
                        _Ext.Ajax.setDefaultHeaders(defaultHeaders);
                    }

                    callback();
                },
                failure: function(response) {
                    
                }
            });
        }
    }
});