/**
 * Manage the mapping of tweets into Diffusion
 */

var twitter = require('./twitter');

var __tps;
var __tpsRunning = false;

var __reappt;

var tweetMetadata = new diffusion.metadata.RecordContent();
var tweetRecord = tweetMetadata.addRecord('tweet', tweetMetadata.occurs(1), {
	'tweetId' : tweetMetadata.string(),
	'message' : tweetMetadata.string(),
	'userId' : tweetMetadata.string(),
	'userName' : tweetMetadata.string(),
	'userScreenName' : tweetMetadata.string(),
	'timestamp' : tweetMetadata.string()
});

// global builder...
var tweetBuilder = tweetMetadata.builder();
// add with default values, so we can just .set from now on...
tweetBuilder.add('tweet', {
	tweetId : '123',
	message : 'My Tweet Message',
	userId : '456',
	userName : 'userName',
	userScreenName : 'userScreenName',
	timestamp : '9876543210'
});

function initTwitter(reappt) {
	__reappt = reappt;

	__tps = new twitter.TwitterPublicStream({
		consumerKey : 'K46BLq0r9kaCA83OwI11ZtKRq',
		consumerSecret : 'WrJB7EUIHQeS1AaRMsEzICUlU2e9ydunh5ZEUs8UDaAO4hue34',
		accessToken : '3058464649-xKVJh6iaefjp1N7aQ6us1vESfytY4uEOKJlIXJv',
		accessTokenSecret : '6VuMJ2S5syeOK6yfrjs8sw4IzsepZ6SHW8DPindS0DlLy'
	});

	__tps.on('connected', function(response) {
		O.i('Connected');
		O.d(' response[status] => ' + response.statusCode);
		O.d(' response[headers] => ' + JSON.stringify(response.headers));
		__tpsRunning = true;
	}).on('heartbeat', function() {
		O.i('heartbeat');
	}).on('close', function(reason) {
		O.w('Closed because: ' + reason);
		__tpsRunning = false;
	}).on('error', function(errObj) {
		O.e('TWITTER:: ' + errObj.type + ' error: ' + errObj.data);
		__tpsRunning = false;
	}).on('garbage', function(buffer) {
		O.d('\n\nGarbage => ' + buffer + '\n');
	});
}

function track(reappt, trackTerms) {

	O.i('Tracking terms: ' + trackTerms);
	if (!__tps) {
		initTwitter(reappt);
	}

	if (__tps.running) {
		__tps.stopTracking();
	}

	termsArr = trackTerms.split(',');
	termsArr.forEach(function(term) {
		__reappt.topics
				.add('ReapptChat/Twitter/Hashtag/' + term, tweetMetadata).on({
					complete : function() {
						O.t('Creation of topic complete');
					},
					error : function(err) {
						O.e('Error adding topic: ' + err.message);
					}
				});
	});

	__tps.removeAllListeners('data').on(
			'data',
			function(msg) {
				O.i('Parsed data!');
				O.i(' On => ' + msg['created_at']);
				var tweet = JSON.stringify(msg['text']);
				O.i(' Tweet => ' + tweet);
				O.i(' User => ' + msg['user']['name'] + '(@'
						+ msg['user']['screen_name'] + ')');
				O.d(' Full data => ' + JSON.stringify(msg));

				var tweetRecordValue = tweetBuilder.set('tweet', {
					tweetId : msg['id_str'],
					// message : encodeURIComponent(msg['text']),
					message : msg['text'],
					userId : msg['user']['id_str'],
					// userName : encodeURIComponent(msg['user']['name']),
					userName : msg['user']['name'],
					// userScreenName :
					// encodeURIComponent(msg['user']['screen_name']),
					userScreenName : msg['user']['screen_name'],
					timestamp : msg['timestamp_ms']
				});

				termsArr.forEach(function(term) {
					if (tweet.containsIgnoreCase(term)) {
						O.i(term + ' tweet');
						__reappt.topics.update(
								'ReapptChat/Twitter/Hashtag/' + term,
								tweetBuilder.build()).on({
							complete : function() {
								O.t('Update of topic complete');
							},
							error : function(err) {
								O.e('Error updating topic: ' + err.reason);
							}
						});
					} else {
						O.d('no ' + term + ' => no update!');
					}

				});
			});

	__tps.track(trackTerms);
}

module.exports = {
	track : track
};
