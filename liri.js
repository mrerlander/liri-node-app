require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");
var fs = require("fs");


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var arg = process.argv[2];

if (arg === "my-tweets") {
    //code for displaying tweets
}

else if (arg === "spotify-this-song") {
    //code for displaying spotify song search results
    //format: spotify-this-song "song name here"
    //show artist, song name, link to spotify, album
    //if no song display ace of base - the sign info
}

else if (arg === "movie-this") {
    //code for displaying movie info
    //format: movie-this "movie name here"
    //show title, year, imdb rating, rotten tomatoes rating, country, language, plot, actors
    //if no movie display Mr. Nobody info 
}

else if (arg === "do-what-it-says") {
    //code for displaying random.txt
}