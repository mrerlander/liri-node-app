require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var inquirer = require("inquirer");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = keys.omdb;

var arg1;
var arg2;
var stringArr = [];
var value;
var dashes = "------------------ \n";

inquirer.prompt([{
    type: "list",
    message: "What would you like to get?",
    choices: ["Tweets", "Song info", "Movie info", "Whatever's in the file"],
    name: "choice"
}]).then(function (answer) {

    switch (answer.choice) {
        case "Whatever's in the file":
            file();
            break;

        case "Tweets":
            arg1 = answer.choice;
            tweets();
            break;

        case "Song info":
            arg1 = answer.choice;
            spotifySong();
            break;

        case "Movie info":
            arg1 = answer.choice;
            movie()
            break;
    }
});

function file() {

    fs.readFile("./random.txt", "utf8", function (err, contents) {

        stringArr = contents.split(",");

        arg1 = stringArr[0];
        arg2 = stringArr[1];

        switch (arg1) {
            case "spotify-this-song":
                spotifySong();
                break;

            case "movie-this":
                movie();
                break;
        }

    });
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
    if (!arg2) {
        inquirer.prompt([{
            type: "input",
            message: "Input song title",
            name: "song"
        }]).then(function (song) {
            arg2 = song.song;

            value = song.song;

            //if no song display ace of base - the sign info
            if (value === "") {
                value = "the sign ace of base";
            }

            log();
            songSearch();

        });
    } else {
        value = arg2;
        log();
        songSearch();
    }
}

function movie() {

    if (!arg2) {
        inquirer.prompt([{
            type: "input",
            message: "Input movie title",
            name: "movie"
        }]).then(function (movie) {
            arg2 = movie.movie;

            value = movie.movie;

            //if no movie display Mr. Nobody info
            if (value === "") {
                value = "Mr. Nobody";
            }

            log();
            movieSearch();
        });
    } else {
        value = arg2;
        log();
        movieSearch();
    }
}

function movieSearch() {
    //code for displaying movie info
    request.get("http://www.omdbapi.com/?apikey=" + omdb.apikey + "&t=" + value, function (error, response, body) {

        var movieJSON = JSON.parse(body);

        if (movieJSON.Error) {
            console.log("please enter a valid movie");
            arg2 = "";
            movie();
        } else {            

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
        }
    });

}

function songSearch() {
    //code for displaying spotify song search results
    spotify.search({
        type: 'track',
        query: value,
        limit: "1"
    }, function (err, data) {
        if (err) {
            console.log("Please enter a valid song title");
            arg2 = "";
            spotifySong();
        } else{

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
    }
    });
}

function log() {
    fs.appendFile("log.txt", arg1 + "\n" + arg2 + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    });
}