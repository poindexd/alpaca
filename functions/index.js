var functions = require('firebase-functions');
var admin = require('firebase-admin');
var jsonata = require('jsonata');

admin.initializeApp(functions.config().firebase);

exports.score = functions.database.ref('results')
	.onWrite(event => {
	
	var survey = event.data.val();
	console.log(survey);

	//var endpointsRef = admin.database().ref('endpoints')
	//	.orderByChild('collection_id')
	//	.equalTo(survey.id);

	var scoredRef = admin.database().ref('scored');

	return scoredRef.push({'test':true});

	//Get endpoints for the collection
	/*
	return endpointsRef.once('value').then(snapshot => {
		//For each endpoint, score and push result
		snapshot.forEach(child => {
			var endpoint = child.val();
			var scored = jsonata(endpoint.expression).evaluate(survey);

			//Push to hotpath DB
			scoredRef.push(scored);

			//Push to 3rd Party endpoint
			//Requires Firebase paid plan
			//...http.post(scored, endpoint.url)...

		});
	});
	*/
	//res.end();
});