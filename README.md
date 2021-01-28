# Welcome to the One and only UdaciRacer Simulation Game

## Project Introduction

This project simulates a car-race game using JavaScript Asynchronous Programming.


The game mechanics are this: you select a player and track, the game begins and you accelerate your racer by clicking an acceleration button. As you accelerate so do the other players and the leaderboard live-updates as players change position on the track. The final view is a results page displaying the players' rankings.

The game has three main views:

1. The form to create a race

2. The race progress view (this includes the live-updating leaderboard and acceleration button)

3. The race results view

## Starter Code


1. An API. The API is provided in the form of a binary held in the bin folder. This pre-built API will create the race selected by the players and return a stream of information lasting the duration of the race, resulting in a final ranking of racers.

2. HTML Views.The final output will be a HTML View with an Accelerator Button , which the user clicks to start the race.
The column called LeaderBoard will keep updating the positions of the Racers and a progress bar will indicate the percentage time for all the racers in the game. The End result will be a view with the LeaderBoard showing the order of the racers positions and the progress Bar update for each racer.

## Getting Started

In order to build this game, we need to run two things: the game engine API and the front end.


1. To start the Game API:
   - Locate your Operating System and type the specific command on the Terminal Window:
     Example if you are on Mac, open a Terminal window and run
       `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx`  
      or if you are on Windows or other platforms please use the following:
       `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server.exe`   
        `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux`



2. Start the Frontend

You can either use `npm install && npm start` or `yarn && yarn start` at the root of this project. Then you should be able to access http://localhost:3000.
If you don't have npm or yarn installed, you can find them in their
respective sites:
    Node Install : https://nodejs.org/en/
    Yarn Install : https://yarnpkg.com/lang/en/docs/install

   Now to  View the UdaciRacerSim App :
   Open another Terminal Window and run `npm start` This will start your App to listen on port 3000
   On your Browser Window, type http://localhost:3000
   This opens your App and start the Race on the Home Page of the App,


## Asynchronous Programming

In this project I have made calls to the API endpoints using
Promises, and Async/Await sequencing with Error handling.    
