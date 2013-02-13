Class('EatSense.test.CloobsterTest', {
    isa     : Siesta.Test.SenchaTouch,

    methods : {

        checkIn: function(barcode, callback) {
            this.diag('Perform checkin ...');
            this.chain(
                {
                    action : 'tap',
                    target : this.cq1('dashboard button[action=checkin]')
                },
                function(next) {
                    this.waitForComponentVisible(this.getExt().Msg, next, this, 3000);
                },
                {
                    action : 'click', 
                    target : this.getExt().Msg.down('textfield')
                },
                { 
                    action : 'type', 
                    target : function() {
                        return this.getExt().Msg.down('textfield');
                    }, 
                    text : barcode
                },
                {
                    action      : 'tap',
                    target      : function () {
                        return this.getExt().Msg.down('button[itemId=yes]');
                    } 
                },
                function(next) {
                    this.waitForComponentVisible(this.cq1('mainview checkinconfirmation'), next, this, 3000);
                },
                { 
                    action: 'click', 
                    target: function() {
                        return this.cq1('checkinconfirmation #nicknameTf');
                    }
                },
                {
                    action : 'type',
                    target: function() {
                        return this.cq1('checkinconfirmation #nicknameTf');
                    },
                    text : 'Test User'
                },
                {
                    action : 'tap',
                    target : function() {
                        return this.cq1('checkinconfirmation button[action=confirm-checkin]');
                    }
                },
                function(next) {
                    this.diag('check in complete...');
                    callback();
                }
            );
        },


        testUserLogin: function(_Ext, callback) {
            var defaultHeaders = _Ext.Ajax.getDefaultHeaders() || {};
            //try this.getExt()
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