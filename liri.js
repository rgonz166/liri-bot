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

// Global Variables
var divide = "\n------------------\n";
var newLog = "\n=======================\n";

runCommand(command);

function runCommand(com){
    // switch statement for command
    switch(com){
        case "concert-this":
            console.log("Searching concert for " + term);
            concert(term);
            break;
        case "spotify-this-song":
            spotifyThis(term);
            break;
        case "movie-this":
            movieThis(term);
            break;
        case "do-what-it-says":
            fs.appendFile("log.txt",(newLog+"Running random.txt on "+moment().format("LLLL") +"\n"),function(err){
                if(err) throw err;
            });
            fs.readFile('random.txt','utf8',function(err,data){
                if(err) throw err;
                var text = data;
                term = text.split(",")[1];
                runCommand(text.split(",")[0]);
            });
            break;
    }
}




function concert(artist){
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    fs.appendFile("log.txt",(newLog+"Searching concert for " + artist + " on "+moment().format("LLLL") +"\n"),function(err){
        if(err) throw err;
    });
    axios.get(URL).then(function(res){
        var data = res.data;
        for(var concerts of data){
            var venue = concerts.venue;
            var venName = venue.name;
            var region = venue.region;
            var location = "";
            (region === "") ? location = venue.city + ", " + venue.country :location = venue.city + " " + region;
            var date = moment(concerts.datetime).format("MM/DD/YYYY");
            var str = "Venue: " + venName +"\nLocation: " + location + "\nDate: " + date + divide;
            console.log(str);
            toLog(str);
        }
    },function(err){
        if(err) throw err
    });
}

function spotifyThis(song){
    fs.appendFile("log.txt",(newLog+"Searching spotify for " + song + " on "+moment().format("LLLL") +"\n"),function(err){
        if(err) throw err;
    });
    spotify.search({type:'track',query:song,limit:1},function(err,data){
        if(err){
            return console.log('Error occured: ' +err);
        }
        var track = data.tracks.items[0];
        var artists = track;
        var trackName = track.name;
        var preview = track.preview_url;
        var album=track.album.name;
        var str = "\nTrack: "+trackName+"\nPreview URL: "+preview+"\nAlbum: "+album +divide;
        console.log(str);
        toLog(str);
    })
}

function movieThis(movie){
    fs.appendFile("log.txt",(newLog+"Searching movie for " + movie + " on "+moment().format("LLLL") +"\n"),function(err){
        if(err) throw err;
    });
    // search for movie using omdb query URL
    var URL = 'http://www.omdbapi.com/?apikey=trilogy&type="movie"&t=' +movie; //insert omdb url string here
    axios.get(URL).then(function(res){
        var data = res.data;

        var title = data.Title;
        var year = data.Year;
        var ratingIMDB = data.imdbRating;
        var ratingRT = data.Ratings[1].Value;
        var country = data.Country;
        var language = data.Language;
        var plot = data.Plot;
        var actors = data.Actors;

        var str = "\nTitle: " + title + "\nYear: " + year + "\nIMDB rating: " + ratingIMDB + "\nRotten Tomatoes Rating: "+ratingRT+"\nCountry Produced: "+country + "\nLanguage: "+ language+"\nPlot: "+plot+"\nActors: "+actors +divide;
        console.log(str);
        toLog(str);
    })
}

// Prints to log.txt
function toLog(str) {
    fs.appendFile('log.txt',str,function(err){
        if(err) throw err;
    })
}