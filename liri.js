//Load libraries
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');


//takes in the first argument, we expect a command
var command = process.argv[2];
//takes in the second argument, this can be a song or movie
var argument = process.argv[3];

//if the command is movie, send a request to IMBD
var movieCall = function(){

	//place the argument in the queryURL
	queryURL = "http://www.omdbapi.com/?t="+ argument +"&y=&plot=short&r=json";

	//request info from IMBD
	request(queryURL, function(error, response, body){
		if (!error && response.statusCode == 200){
			console.log(JSON.parse(body).Title);
			console.log(JSON.parse(body).Year);
			console.log(JSON.parse(body).imdbRating);
			console.log(JSON.parse(body).Country);
			console.log(JSON.parse(body).Language);
			console.log(JSON.parse(body).Plot);
			console.log(JSON.parse(body).Actors);
			// console.log(JSON.parse(body).);
			// console.log(JSON.parse(body));
		}
	});
}

var tweet = function(){

	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
 		if (!error) {
    		console.log(tweets);
  		}
	});
};

var spot = function(){

	// spotify.search({ type: 'track', query: argument }, function(err, data) {
 //    	if ( err ) {
 //        	console.log('Error occurred: ' + err);
 //        	return;
 //    	}

 // 	console.log(data.tracks.items[0].album.name);
 // 	console.log(data.tracks.items[0].artists[1].name);
 // 	console.log(data.tracks.items[0].artists[0].name);
 // 	console.log(data.tracks.items[0].album.external_urls.spotify);
	// });
	queryURL = "https://api.spotify.com/v1/search?q="+ argument;


	request(queryURL, function(error, response, body){
		if (!error && response.statusCode == 200){
			console.log(JSON.parse(body));
			// console.log(JSON.parse(body).Year);
			// console.log(JSON.parse(body).imdbRating);
			// console.log(JSON.parse(body).Country);
			// console.log(JSON.parse(body).Language);
			// console.log(JSON.parse(body).Plot);
			// console.log(JSON.parse(body).Actors);
			// console.log(JSON.parse(body).);
			// console.log(JSON.parse(body));
		}
	});
	console.log('hello');
}

//checks the entered command
switch (command){
	case 'my-tweets':
        tweet();
        break;
    case 'spotify-this-song':
        spot();
        break;
    case 'movie-this':
        movieCall();
        break;
    case 'do-what-it-says':
        
        break;
    default: 
   	console.log('Sorry, invalid command.');
};

