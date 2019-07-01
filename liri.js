// Require env file
require("dotenv").config();

// links keys
var keys = require("./keys.js");

// Spotify variables
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Take user command and input
let userInput = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");

//User input function
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "spotify-this-song":
            spotifySong();
            break;
        default:
            console.log("I don't understand. Please try a valid command.")
    }
};

userCommand(userInput, userQuery);

// Spotify function
function spotifySong() {
    console.log(`\nSearching for your request.`);

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