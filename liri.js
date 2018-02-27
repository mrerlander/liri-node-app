require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = keys.omdb;

var arg;
var arg2;
var stringArr = [];

var dashes = "------------------ \n";

if (process.argv[2] === "do-what-it-says") {
    var fileText = fs.readFileSync("./random.txt");
    stringArr = fileText.toString().split(",");

    arg = stringArr[0];
    arg2 = stringArr[1];
} else {
    arg = process.argv[2];
    arg2 = process.argv[3];
}

if (arg === "my-tweets") {
    log();

    //code for displaying tweets
    client.get("statuses/user_timeline.json", {
        screen_name: "mikeytime",
        count: "20"
    }, function (error, tweets, response) {

        function printTweets() {
            var output = "";
            for (var key in tweets) {
                output += dashes + tweets[key].text + "\n" + tweets[key].created_at + "\n";
            }
            return output;
        }

        console.log(printTweets());

        fs.appendFile("log.txt", printTweets(), function (err) {
            if (err) {
                console.log(err);
            }
        });
    });

} else if (arg === "spotify-this-song") {
    log();

    //format: spotify-this-song "song name here"
    var song;

    //if no song display ace of base - the sign info
    if (!arg2) {
        song = "the sign ace of base";
    } else {
        song = arg2;
    }

    //code for displaying spotify song search results
    spotify.search({
        type: 'track',
        query: song,
        limit: "1"
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //show artist, song name, link to spotify, album
        function printSongs() {
            var track = "Track: " + data.tracks.items[0].name + "\n";
            var artist = "Artist: " + data.tracks.items[0].artists[0].name + "\n";
            var album = "Album: " + data.tracks.items[0].album.name + "\n";
            var link = "Link: " + data.tracks.items[0].external_urls.spotify + "\n";

            return dashes + track + artist + album + link;
        }

        console.log(printSongs());

        fs.appendFile("log.txt", printSongs(), function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
} else if (arg === "movie-this") {
    log();

    //format: movie-this "movie name here"
    var movie;

    //if no movie display Mr. Nobody info 
    if (!arg2) {
        movie = "Mr. Nobody";
    } else {
        movie = arg2;
    }

    //code for displaying movie info
    request.get("http://www.omdbapi.com/?apikey=" + omdb.apikey + "&t=" + movie, function (error, response, body) {
        var movieJSON = JSON.parse(body);

        function printMovie() {
            //show title, year, imdb rating, rotten tomatoes rating, country, language, plot, actors
            var title = movieJSON.Title + "\n";
            var year = movieJSON.Year + "\n";
            var imdbRating = movieJSON.Ratings[0].Source + " " + movieJSON.Ratings[0].Value + "\n";
            var rottenRating = movieJSON.Ratings[1].Source + " " + movieJSON.Ratings[1].Value + "\n";
            var country = movieJSON.Country + "\n";
            var language = movieJSON.Language + "\n";
            var plot = movieJSON.Plot + "\n";
            var actors = movieJSON.Actors + "\n";

            return dashes + title + year + imdbRating + rottenRating + country + language + plot + actors;
        }

        console.log(printMovie());

        fs.appendFile("log.txt", printMovie(), function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}

function log() {
    fs.appendFile("log.txt", arg + "\n" + arg2 + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    });
}