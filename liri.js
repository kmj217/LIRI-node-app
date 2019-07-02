// Require env file
require("dotenv").config();

// links keys
var keys = require("./keys.js");

// Require request
let request = require("request");

// Spotify variables
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Bands in town API
var bandsintown = (keys.bandsintown);

// moment variable
var moment = require("moment");

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
                    let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
                };
            } else {
                console.log('Band or concert not found!');
            };
        };
    });
};