// Require env file
require("dotenv").config();

// links keys
var keys = require("./keys.js");

// Require request
var request = require("request");

// Spotify variables
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// moment variable
var moment = require("moment");

// fs varviable
const fs = require("fs");

// Take user command and input
var userInput = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");

//User input function
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "spotify-this-song":
            spotifySong();
            break;
        case "concert-this":
            concertSearch();
            break;
        case "movie-this":
            movieSearch();
            break;
        case "do-what-it-says":
            doSearch(userQuery);
            break;
        default:
            console.log("I don't understand. Please try a valid command.")
    }
};

userCommand(userInput, userQuery);

// Spotify function
function spotifySong() {
    console.log("\nSearching for your song request.");
    
    //Default to The Sign by Ace of Base
    if (!userQuery) {
        userQuery = "The Sign Ace of Base"
    };

    //Spotify search
    spotify.search({
        type: "track",
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            console.log("Error " + error + " occured.");
        }
        let spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
            console.log(`\n---------------\nAh ha! I found something. Here are the results...\n\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify link: ${data.tracks.items[i].external_urls.spotify}\n---------------\n`)
        };
    });
};

// Bands in town concert search function
function concertSearch() {
    console.log("\nSearching for your concert request.");
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let userBand = JSON.parse(body);
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {
                    console.log(`\n---------------\nAh ha! I found something. Here are the results...\n\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}`)
                    // Using moment to format date
                    let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY h:mm A");
                    console.log(`Date and Time: ${concertDate}\n\n---------------`);
                };
            } else {
                console.log('Band or concert not found!');
            };
        };
    });
};

// OMDB movie search function
function movieSearch() {
    console.log("\nSearching for your movie request.");
    if (!userQuery) {
        userQuery = "Mr Nobody";
    };
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=c88eeeb", function (error, response, body) {
        let userMovie = JSON.parse(body);
        let ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) {}

        if (!error && response.statusCode === 200) {
            console.log(`\n---------------\nAh ha! I found something. Here are the results...\n\nTitle: ${userMovie.Title}\nCast: ${userMovie.Actors}\nReleased: ${userMovie.Year}\nIMDb Rating: ${userMovie.imdbRating}\nRotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\nCountry: ${userMovie.Country}\nLanguage: ${userMovie.Language}\nPlot: ${userMovie.Plot}\n\n---------------`)
        } else {
            return console.log("Error: " + error + " occured.")
        };
    })
};

// do what is says function
function doSearch() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        let dataArr = data.split(",");
        userInput = dataArr[0];
        userQuery = dataArr[1];
        userCommand(userInput, userQuery);
    });
};