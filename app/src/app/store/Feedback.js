/**
* Used to request a FeedbackForm whichs acts as a template
* used to submit filled out feedback.
*/
Ext.define('EatSense.store.Feedback', {
    extend  : 'Ext.data.Store',    
    requires: ['EatSense.model.FeedbackForm'],
    config : {
    	model   : 'EatSense.model.FeedbackForm',
    	storeId: 'feedbackStore'
    }
});