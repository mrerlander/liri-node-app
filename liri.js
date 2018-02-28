require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = keys.omdb;

var arg1 = process.argv[2];
var arg2 = process.argv[3];
var stringArr = [];

var dashes = "------------------ \n";

function switchCase() {
    switch (arg1) {
        case "do-what-it-says":
            file();
            break;

        case "my-tweets":
            tweets();
            break;

        case "spotify-this-song":
            spotifySong();
            break;

        case "movie-this":
            movie()
            break;
    }
}

function file() {
    var fileText = fs.readFileSync("./random.txt");
    stringArr = fileText.toString().split(",");

    arg1 = stringArr[0];
    arg2 = stringArr[1];
    switchCase();
}

function tweets() {
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
}

function spotifySong() {
    log();

    //if no song display ace of base - the sign info
    if (!arg2) {
        arg2 = "the sign ace of base";
    }

    for (var i = 4; i < process.argv.length; i++) {

        arg2 += "+" + process.argv[i];
    }

    console.log(arg2);
    //code for displaying spotify song search results
    spotify.search({
        type: 'track',
        query: arg2,
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
}

function movie() {
    log();

    //if no movie display Mr. Nobody info 
    if (!arg2) {
        arg2 = "Mr. Nobody";
    }

    for (var i = 4; i < process.argv.length; i++) {

        arg2 += "+" + process.argv[i];
    }

    //code for displaying movie info
    request.get("http://www.omdbapi.com/?apikey=" + omdb.apikey + "&t=" + arg2, function (error, response, body) {
        var movieJSON = JSON.parse(body);
console.log(movieJSON);
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
    fs.appendFile("log.txt", arg1 + "\n" + arg2 + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    });
}

switchCase();