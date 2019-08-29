// Requires
require("dotenv").config();
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var moment = require('moment'); //moment().format()
var axios = require('axios');

// Node js get inputs
var command = process.argv[2];
var term = process.argv.splice(3).join(" ");

// switch statement for command
switch(command){
    case "concert-this":
        console.log("Searching concert for " + term);
        concert(term);
        break;
    case "spotify-this-song":
        spotifyThis(term);
        break;
    case "movie-this":
        break;
    case "do-what-it-says":
        break;
}

function concert(artist){
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    fs.appendFile("log.txt",("Searching concert for " + artist + " on "+moment().format("LLLL") +"\n"),function(err){
        if(err) throw err;
    });
    axios.get(URL).then(function(res){
        var data = res.data;
        var divide = "\n------------------\n";
        for(var concerts of data){
            var venue = concerts.venue;
            var venName = venue.name;
            var region = venue.region;
            var location = "";
            (region === "") ? location = venue.city + ", " + venue.country :location = venue.city + " " + region;
            var date = moment(concerts.datetime).format("MM/DD/YYYY");
            var str = "Venue: " + venName +"\nLocation: " + location + "\nDate: " + date + divide;
            console.log(str);
            fs.appendFile('log.txt',str,function(err){
                if(err) throw err;
            })
        }
    },function(err){
        if(err) throw err
    });
}

function spotifyThis(song){
    // console.log(moment());
}
