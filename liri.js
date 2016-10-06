// Using the require keyword lets us access all of the exports 
// in our ess.js file

var request = require('request');
var spotify = require('spotify');
var Twitter = require('twitter');
var fs = require('fs');

// Take two arguments. 
// The first will be the action (i.e. "my-tweets", "spotify-this-song", etc.)
// The second will be the amount that return result etc.
// Store all of the arguments in an array 
var nodeArgs = process.argv;
var action = nodeArgs[2];
// Create an empty variable for holding the movie name
var value = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i=3; i<nodeArgs.length; i++){
	if (i>3 && i< nodeArgs.length){
		value = value + "+" + nodeArgs[i];
	}
	else {
		value = value + nodeArgs[i];
	}
}

// We will then create a switch-case statement (if-then would also work).
// The switch-case will direct which function gets run.
switch(action){
    case 'my-tweets':
        getTweets();
    break;

    case 'spotify-this-song':
    	if (!nodeArgs[3]) {
			//set default to "The Sign" if no song entered
			value = 'The Sign';			
		} 
		getSpotify(value);
    break;

    case 'movie-this':
    	if (!nodeArgs[3]) {
			//set default to "The Sign" if no song entered
			value = 'Mr. Nobody';			
		} 
        getMovie(value);
    break;

    case 'do-what-it-says':
        getText();
    break;
}

// If the "getTweets" function is called...
function getTweets(){
	
	var stuffINeed = require('./keys.js');
	var params = {screen_name: 'sharktale49'};

	var client = new Twitter({
  		consumer_key: stuffINeed.twitterKeys.consumer_key,
  		consumer_secret: stuffINeed.twitterKeys.consumer_secret,
  		access_token_key: stuffINeed.twitterKeys.access_token_key,
  		access_token_secret: stuffINeed.twitterKeys.access_token_secret
	});

	client.get('statuses/user_timeline',params, function(error, tweets, response) {
  		if(error) throw error;
  		for (var i= 1; i < tweets.length; i++) {
			outPutText ('', tweets[i].text);
			outPutText ('Tweeted: ', tweets[i].created_at);	 
		}	    
	});    
}

// If the "getSpotify" function is called...
function getSpotify(localValue){
		
	spotify.search({ type: 'track', query: localValue }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
    var dataArr = data.tracks.items;

    for ( var i = 0; i < 5; i++) {
	    	outPutText('\nResult #:', i+1);
			outPutText('\nArtist name: '+ dataArr[i].artists[0].name);
			outPutText('Song title: '+ dataArr[i].name);
			outPutText('Preview link: '+ dataArr[i].preview_url);
			outPutText('Album: '+ dataArr[i].album.name);	    
		}     
    });
}    

// If the "getMovie" function is called
function getMovie(localValue){
	   
    // Then run a request to the OMDB API with the movie specified 
	var queryUrl = 'http://www.omdbapi.com/?t=' + localValue +'&y=&plot=short&tomatoes=true&r=json';

	request(queryUrl, function (error, response, body) {

	// If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode == 200) {
			var result = JSON.parse(body);
		
			outPutText('\nMovie title: ' , result["Title"]);
			outPutText('Release Year: ' , result["Year"]);
			outPutText('IMDB rating: ' , result["imdbRating"]);
			outPutText('Country: ' , result["Country"]);
			outPutText('Language: ' , result["Language"]);
			outPutText('Plot: ' , result["Plot"]);
			outPutText('Actors: ' , result["Actors"]);
			outPutText('Rotten Tomatoes Rating: ' , result["tomatoRating"]);
			outPutText('Rotten Tomatoes URL: ' , result["tomatoURL"]);
		}
	});
}    

// If the "getText" function is called
function getText(){	

	fs.readFile('random.txt','utf8',function(err,data) {
		//split the string of items separated by commas into an array of items
		fileTxtArr = data.split(',');

		for (var i = 0; i < fileTxtArr.length; i++) {			
		
			if (fileTxtArr[i] == "my-tweets" ) {
				getTweets();
			} else if (fileTxtArr[i] == "spotify-this-song"){      
				var j = i + 1 ;
				if (fileTxtArr[j] == "my-tweets" || fileTxtArr[j] == "spotify-this-song" || fileTxtArr[j] == "movie-this" ) {
					value = 'The Sign';			
				} else{
					value = fileTxtArr[j];
				}
				getSpotify(value);	

			} else if (fileTxtArr[i] == "movie-this" ){
				var x = i + 1 ;
				if(fileTxtArr[x] == "my-tweets" || fileTxtArr[x] == "spotify-this-song" || fileTxtArr[x] == "movie-this") {
					value = 'Mr.Nobody';
				} else {
					value = fileTxtArr[x];				
				}
				getMovie(value);			
			}
		} // end of for loop

	}); //end of fs.readFile
}

function outPutText (textString, valueOut){
	console.log(textString + valueOut);
	fs.appendFile('log.txt' , '\n' + textString + valueOut);

}

    




