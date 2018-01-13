require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var Twitter = require('twitter');
var spotify = require("spotify");
var fs = require('fs');

var cmdInput = process.argv[2];

getInput(cmdInput);



function getInput(cmdInput, args) {
    if (logged()) {
        switch (cmdInput) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            if (args) {
                console.log(' Argument passed: ' + args);
                spotifySong(args);
            }
            else {
                if (process.argv[3] != null) {
                    var song = process.argv.slice(3).join('+');
                    spotifySong(song);
                }
                else {
                    spotifySong('The Sign');
                }
            }
            break;
        case 'movie-this':
            if (args) {
                myMovieDetails(args);
            }
            else {
                var movie = process.argv.slice(3).join('+');
                myMovieDetails(movie);
            }
            break;
        case 'do-what-it-says':
            runCommand();
            break;
        }
    }
}

// code for my-tweets 
function myTweets() {
    var client = new Twitter(keys.twitterKeys);
    var params = {
        screen_name: 'hoarau_brandon'
        , count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(' Tweet: ' + tweets[i].text)
                console.log(" Tweet Number: " + (i + 1))
                console.log(' Created: ' + tweets[i].created_at)
            }
        }
    });
}

// spotify code 
function spotifySong(song) {
    spotify.search({
        'type': 'track',
        'query': song 
    }, function (error, data) {
        if (error) {
            console.log(error + "\n");
        }
        else {
              
                console.log('Artist: ' + data.tracks.album.artists[0].name);
              
                console.log('Song Name: ' + data.tracks.name);
               
                console.log('Preview URL: ' + data.tracks.preview_url);
                
                console.log('Album Name: ' + data.tracks.album.name);
                console.log('===================================')
            
        }
    });
}

// all of the movie-this code goes here
function myMovieDetails(movie) {
    var query = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&r=json&tomatoes=true';
    request(query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieDetails = JSON.parse(body);
            // default
            if (movieDetails.Response === 'False') {
                myMovieDetails('Mr. Nobody');
            }
            else {
               
                console.log(" Title: " + JSON.parse(body)["Title"]);
                console.log(" Release Year: " + JSON.parse(body)["Released"]);
                console.log(" IMDB Rating: " + JSON.parse(body)["imdbRating"]);
                console.log(" Country: " + JSON.parse(body)["Country"]);
                console.log(" Language: " + JSON.parse(body)["Language"]);
                console.log(" Plot: " + JSON.parse(body)["Plot"]);
                console.log(" Actors: " + JSON.parse(body)["Actors"]);
                console.log(" Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
                console.log(" Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
            
            }
        }
    });
}

function runCommand() {
    fs.readFile('random.txt', 'utf-8', function (error, data) {
        var fileCommands = data.split(',');
        getInput(fileCommands[0], fileCommands[1]);
    });
}

function logged() {
    //input
    var inputs = process.argv.slice(2).join(" ");
    // appends data 
    fs.appendFile("log.txt", "node liri.js: " + inputs + "\n", function (error) {
        if (error) {
            throw error;
        }
        else {
            console.log(" updated log file! ");
        }
    });
    return true;
}