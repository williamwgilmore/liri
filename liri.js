//Load libraries
var request = require('request');
var twitter = require('twitter');
var SpotifyWebApi = require('spotify-web-api-node');
var twitterKeys = require('./keys.js');
var fs = require('fs');

var queryURL;
var array = [];

var client = new twitter({
  consumer_key: twitterKeys.keys.consumer_key,
  consumer_secret: twitterKeys.keys.consumer_secret,
  access_token_key: twitterKeys.keys.access_token_key,
  access_token_secret: twitterKeys.keys.access_token_secret
});

//takes in the first argument, we expect a command
var command = process.argv[2];
//takes in the second argument, this can be a song or movie
var argument = process.argv[3];

//if the command is movie, send a request to IMBD
var movieCall = function(){

	//place the argument in the queryURL
	queryURL = "http://www.omdbapi.com/?t="+ argument +"&y=&plot=short&r=json&tomatoes=true";

	//request info from IMBD
	request(queryURL, function(error, response, body){
		if (!error && response.statusCode == 200){
			console.log(JSON.parse(body).Title);
			array.push(JSON.parse(body).Title);
			console.log(JSON.parse(body).Year);
			array.push(JSON.parse(body).Year);
			console.log(JSON.parse(body).imdbRating);
			array.push(JSON.parse(body).imdbRating);
			console.log(JSON.parse(body).Country);
			array.push(JSON.parse(body).Country);
			console.log(JSON.parse(body).Language);
			array.push(JSON.parse(body).Language);
			console.log(JSON.parse(body).Plot);
			array.push(JSON.parse(body).Plot);
			console.log(JSON.parse(body).Actors);
			array.push(JSON.parse(body).Actors);
			console.log(JSON.parse(body).tomatoRating);
			array.push(JSON.parse(body).tomatoRating);
			console.log(JSON.parse(body).tomatoURL);
			array.push(JSON.parse(body).tomatoURL);
			
			write();
		} else {
			console.log(error);
		}
	});
};

var tweet = function(){

	var params = {screen_name: 'katyperry',
				count: 20};
	
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
 		var stop = 20;
 		if (tweets.length<20){
 			stop = tweets.length;
 		}
 		if (!error) {
 			for (i=0; i< stop; i++){
 				console.log(i+1);
 				console.log(tweets[i].text);
 				console.log(tweets[i].created_at);
 				array.push(tweets[i].text);
 				array.push(tweets[i].created_at);
 				write();
 			}
  		}else{
  			console.log(error);
  		}
	});


};

var spot = function(){

// credentials are optional
	var spotifyApi = new SpotifyWebApi({
		clientId : '7e6408dcc536449fbb8af56422895224',
		clientSecret : '50a608cd09054a31b28790ab94f7ca56',
		redirectUri : 'http://www.example.com/callback'
	});

	queryURL = "https://api.spotify.com/v1/search?q=" + argument + "&type=track&market=US"

	request(queryURL, function(error, response, body){
		if (!error && response.statusCode == 200){
			var artist = JSON.parse(body).tracks.items[0].album.artists[0].name;
			var song = JSON.parse(body).tracks.items[0].name;
			var album = JSON.parse(body).tracks.items[0].album.name;
			var link = JSON.parse(body).tracks.items[0].album.artists[0].external_urls.spotify;
			console.log('Artist: ' + artist);
			console.log('Song:   ' + song);
 			console.log('Album:  ' + album);
    		console.log('Link:   ' + link);
			array.push(artist);
			array.push(song);
			array.push(album);
			array.push(link);
			write();
		} else {
			console.log(error);
		}
	});

//Another way to call spotify
	// spotifyApi.searchTracks(argument)
 // 	.then(function(data) {
 // 		console.log('Artist: ' + data.body.tracks.items[0].album.artists[0].name);
 // 		console.log('Song:   ' +data.body.tracks.items[0].name);
 // 		console.log('Album:  ' +data.body.tracks.items[0].album.name);
 //    	console.log('Link:   ' +data.body.tracks.items[0].album.artists[0].external_urls.spotify);

 // 	}, function(err) {
 //    		console.error(err);
 //  	});

};

var emptyArgument = function(songOrMovie){
	switch (songOrMovie){
		case 'song':
			argument = 'Ace of base the sign';
			break;
		case 'movie':
			argument = 'Mr Nobody';
			break;
		default:
			argument = '';
	}
};

var doThis = function(){
	fs.readFile('random.txt','utf8', function(error,data){
	var holdItems = data.split(',');

	command = holdItems[0];
	argument = holdItems[1];

	run();
	});
};


var write = function(){
	array.push('\r\n');
	fs.appendFile('log.txt', array , function(err){
		if (err){
			return console.log(err);
		}

		console.log('Added succesfully');
	});
};

//checks the entered command
var run = function(){
	switch (command){
		case 'my-tweets':
	        tweet();
	        break;
	    case 'spotify-this-song':
	        if (argument == undefined){
	        	emptyArgument('song');
	        };
	        spot();
	        break;
	    case 'movie-this':
	    	if (argument == undefined){
	        	emptyArgument('movie');
	        };
	        movieCall();
	        break;
	    case 'do-what-it-says':
	        doThis();
	        break;
	    case 'help':
	    	console.log('"my-tweets" lists the last 20 tweets of Katy Perry');
	    	console.log('"spotify-this-song <songname(optional)>" will return information and a link to the song.')
	    	console.log('"movie-this <moviename(optional)>" returns infromation about the movie');
	    	console.log('"do-what-it-says" runs one of the previous commands from a text file.');
	    default: 
	   	console.log('Sorry, invalid command. Type "node liri.js help" to see available commands.');
	}
};

run();