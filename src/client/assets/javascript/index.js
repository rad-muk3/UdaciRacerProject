// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// GLOBAL VARIABLES to store ids
var store = {
  track_id: undefined,
  player_id: undefined,
  race_id: undefined,
}

/**
 *@description addEventListener to make our JavaScript to wait until DOM is loaded
 *@params{String} DOMContentLoaded DOM Event Loading
 *@params{function} specified function to run when the event occurs
 */
document.addEventListener("DOMContentLoaded", function() {
  onPageLoad()
  setupClickHandlers()
})

/**
 *@description async onPageLoad when HTML Page loads get the Race Tracks and Racers Info
 *
 *
 */
async function onPageLoad() {
  try {
    getTracks()
      .then(tracks => {
        const html = renderTrackCards(tracks)
        renderAt('#tracks', html)
      })

    getRacers()
      .then((racers) => {
        const html = renderRacerCars(racers)
        renderAt('#racers', html)
      })
  } catch (error) {
    console.log("Problem getting tracks and racers ::", error.message)
    console.error(error)
  }
}

/**
 *@description setupClickHandlers to select Tracks and Racer Pods
 *
 *
 */
function setupClickHandlers() {
  document.addEventListener('click', function(event) {
    //Help to stop propagating the event , so to enable clicking inside the button
    const pElem = event.target.parentElement;

    const {
      target
    } = event

    // Race track form field
    if (pElem.matches('.card.track')) {
      handleSelectTrack(pElem)
    }

    if (target.matches('.card.track')) {
      handleSelectTrack(target)
    }

    // Podracer form field
    if (pElem.matches('.card.podracer')) {
      handleSelectPodRacer(pElem)
    }

    if (target.matches('.card.podracer')) {
      handleSelectPodRacer(target)
    }

    // Submit create race form
    if (target.matches('#submit-create-race')) {
      event.preventDefault()

      // start race
      handleCreateRace()
    }

    // Handle acceleration click
    if (target.matches('#gas-peddle')) {
      handleAccelerate(target)
    }

  }, false)
}

async function delay(ms) {
  try {
    return await new Promise(resolve => setTimeout(resolve, ms));
  } catch (error) {
    console.log("an error shouldn't be possible here")
    console.log(error)
  }
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

/**
 *@description async handleCreateRace controls the flow of the race
 *@description renders the UI showing Countdown, logic to start and run the race
 *@description handles Error Handling
 */
async function handleCreateRace() {
  try {
    //Get player_id and track_id from the store
    const {
      track_id,
      player_id
    } = store;

    if (!track_id || !player_id) {
      alert(`Please select a track and a racer to start the race!`);
    } else {
      // invoke the API call to create the race, then save the result
      const race = await createRace(player_id, track_id);

      // render starting UI
      renderAt('#race', renderRaceStartView(race.Track, race.Cars))

      // TODO - update the store with the race id
      store.race_id = race.ID - 1;

      // The race has been created, now start the countdown
      // call the async function runCountdown
      await runCountdown()

      //call the async function startRace
      await startRace(store.race_id);

      //call the async function runRace
      await runRace(store.race_id);
    }
  } catch (err) {
    console.log("Problem with handleCreateRace ::", err);
    console.log(error);
  }

}

/**
 *@description runRace updates leaderBoard status every 500ms
 *@description based on status of inprogress/finished display results and resolve promise.
 *
 */
function runRace(raceID) {
  return new Promise(resolve => {
    // use Javascript's built in setInterval method to get race info every 500ms
    const raceTimeInterval = setInterval(() => {
      getRace(raceID)
        .then(res => {

          if (res.status === "in-progress") {
            renderAt('#leaderBoard', raceProgress(res.positions))

          } else if (res.status === "finished") {

            clearInterval(raceTimeInterval) //stop the interval from repeating
            renderAt('#race', resultsView(res.positions)) //display the results view
            resolve(res) // resolve the Promise.
          }
        })
        .catch(err => console.log("Problem with raceTimeInterval ::", err))
    }, 500);

  }).catch(err => console.log("Problem with runRace ::", err))

}

/**
 *@description async runCountdown uses SetInteval to set a time interval to being countDown
 *
 *
 */
async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000)
    let timer = 3

    return new Promise(resolve => {
      // use Javascript's built in setInterval method to count down once per second
      const setTimer = setInterval(() => {

        // run this DOM manipulation to decrement the countdown for the user
        document.getElementById('big-numbers').innerHTML = --timer

        // if the countdown is done, clear the interval, resolve the promise, and return
        if (timer === 0) {
          clearInterval(setTimer);
          return resolve(timer);
        }
      }, 1000);
    })
  } catch (error) {
    console.log("Problem with runCountdown ::", error);
  }
}

/**
 *@description handleSelectPodRacer selects a Pod Racer
 *@params{number} target podracer id
 */
function handleSelectPodRacer(target) {

  // remove class selected from all racer options
  const selected = document.querySelector('#racers .selected')
  if (selected) {
    selected.classList.remove('selected')
  }

  // add class selected to current target
  target.classList.add('selected')

  // save the selected racer to the store
  store.player_id = parseInt(target.id);
}

/**
 *@description handleSelectTrack selects a Track
 *@params{number} target track id
 */
function handleSelectTrack(target) {

  // remove class selected from all track options
  const selected = document.querySelector('#tracks .selected')
  if (selected) {
    selected.classList.remove('selected')
  }

  // add class selected to current target
  target.classList.add('selected')

  // save the selected track id to the store
  store.track_id = parseInt(target.id);
}

/**
 *@description handleAccelerate Invoke API call accelerate to accelerate selected racer
 *
 */
async function handleAccelerate() {
  try {
    console.log("accelerate button clicked")
    await accelerate(store.race_id)
  } catch (err) {
    console.log("Problem with handleAccelerate ::", error);
  }
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
  if (!racers.length) {
    return `
			<h4>Loading Racers...</4>
		`
  }

  const results = racers.map(renderRacerCard).join('')

  return `
		<ul id="racers">
			${results}
		</ul>
	`
}

//Pod Racer Names
const customRacersNames = {
  "Racer 1": "Danica Patrick",
  "Racer 2": "Mario Andretti",
  "Racer 3": "Michael Shumacker",
  "Racer 4": "Courtney Force",
  "Racer 5": "Janet Guthrie",
}

/**
 *@description renderRacerCard dipslays UI of Racer Stats
 *@params{Object} racer
 */
function renderRacerCard(racer) {
  const {
    id,
    driver_name,
    top_speed,
    acceleration,
    handling
  } = racer

  return `
		<li class="card podracer" id="${id}">
			<h3>${customRacersNames[driver_name]}</h3>
			<p>Top Speed: ${top_speed}</p>
			<p>Acceleration: ${acceleration}</p>
			<p>Handling: ${handling}</p>
		</li>
	`
}


function renderTrackCards(tracks) {
  if (!tracks.length) {
    return `
			<h4>Loading Tracks...</4>
		`
  }

  const results = tracks.map(renderTrackCard).join('')

  return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

//Track Names
const customTrackName = {
  "Track 1": "Augusta Speedway",
  "Track 2": "Beltsville Speedway",
  "Track 3": "Columbus Speedway",
  "Track 4": "Daytona Speedway",
  "Track 5": "FiveFlags Speedway",
  "Track 6": "GrandRapids SpeedDrome",
}

/**
 *@description renderTrackCard dipslays UI of Tracks
 *@params{Object} track
 */
function renderTrackCard(track) {
  const {
    id,
    name
  } = track

  return `
		<li id="${id}" class="card track">
			<h3>${customTrackName[name]}</h3>
		</li>
	`
}

function renderCountdown(count) {
  return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

/**
 *@description renderRaceStartView shows the UI when race starts
 *@params{Object} track racers
 */
function renderRaceStartView(track, racers) {
  return `
		<header>
			<h1>Race: ${customTrackName[track.name]}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer>
		  <p class="copyright">© Udacity NanoDegree JavaScript</p>
		</footer>
	`
}

/**
 *@description resultsView displays UI View of the final leaderboard stats with racers positions
 *@params{number} positions
 *
 */
function resultsView(positions) {
  positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

  return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<div class="backHome">
			    <a href="/race" class="startHome">Start a new race</a>
			</div>
		</main>
		<footer>
		   <p class="copyright">© Udacity NanoDegree JavaScript</p>
	  </footer>
	`
}

/**
 *@description raceProgress renders racers finish with completion percentage
 *@params{number} positions
 */
function raceProgress(positions) {

  const rTracks = positions.map(podRacer => {
    //Idea to compute racer completion percentage was got from
    //https://knowledge.udacity.com/questions/313864
    const completion = podRacer.segment / 201;
    const completePercentage = completion * 100;

    if (podRacer.id === store.player_id) {
      return `
      <div class="racetrack">
        <div class="race-car" style="bottom:${completion*50}%"></div>
          <div class="racer-name">
  		      <div>${customRacersNames[podRacer.driver_name]}(you)</div>
  		      <div>${Math.round(completePercentage)}%</div>
          </div>
      </div>
  		`
    } else {
      return `
      <div class="racetrack">
        <div class="race-car" style="bottom:${completion*50}%"></div>
          <div class="racer-name">
  		      <div>${customRacersNames[podRacer.driver_name]}</div>
  		      <div>${Math.round(completePercentage)}%</div>
          </div>
      </div>
  		`
    }

  }).join('');
  positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
  let count = 1

  const results = positions.map(p => {
    if (p.id === store.player_id) {
      return `
				<tr>
					<td>
						<h3>${count++} - ${customRacersNames[p.driver_name]}(you)</h3>
					</td>
				</tr>
			`
    }
    return `
			<tr>
				<td>
					<h3>${count++} - ${customRacersNames[p.driver_name]}</h3>
				</td>
			</tr>
		`
  }).join(' ')

  return `
	<main>
		<h3>Leaderboard</h3>
		<section id="leaderBoard" class="displayProgressBar">
		<div class="progressPodRacers">
			${results}
			</div>
			<div class="progressRacetracks">
			${rTracks}
			</div>
		</section>
	</main>
	`
}

function renderAt(element, html) {
  const node = document.querySelector(element)

  node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000'

function defaultFetchOpts() {
  return {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': SERVER,
    },
  }
}

/**
 *@description getTracks a fetch call with error handling to the API tracks endpoint
 *
 */
function getTracks() {
  // GET request to `${SERVER}/api/tracks`
  return fetch(`${SERVER}/api/tracks`, {
      method: 'GET',
      ...defaultFetchOpts(),
    })
    .then(response => response.json())
    .catch(err => console.log(err));
}

/**
 *@description getRacers a fetch call with error handling to the API cars endpoint
 *
 */
function getRacers() {
  // GET request to `${SERVER}/api/cars`
  return fetch(`${SERVER}/api/cars`, {
      method: 'GET',
      ...defaultFetchOpts(),
    })
    .then(response => response.json())
    .catch(err => console.log(err));
}

/**
 *@description createRace fecth call with error handling to POST API race endpoints
 *@params{number} player_id track_id
 */
function createRace(player_id, track_id) {
  player_id = parseInt(player_id)
  track_id = parseInt(track_id)
  const body = {
    player_id,
    track_id
  }

  return fetch(`${SERVER}/api/races`, {
      method: 'POST',
      ...defaultFetchOpts(),
      dataType: 'jsonp',
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .catch(err => console.log("Problem with createRace request::", err))
}

/**
 *@description getRace fetch call with error handling to API races id
 *@params{number} id
 */
function getRace(id) {
  // GET request to `${SERVER}/api/races/${id}`
  return fetch(`${SERVER}/api/races/${id}`, {
      method: 'GET',
      ...defaultFetchOpts(),
    })
    .then(response => response.json())
    .catch(err => console.log(err));
}

/**
 *@descirption startRace fetch call with error handling to API races start endpoint
 *
 */
function startRace(id) {
  return fetch(`${SERVER}/api/races/${id}/start`, {
      method: 'POST',
      ...defaultFetchOpts(),
    })
    .catch(err => console.log("Problem with startRace request::", err))
}

/**
 *@description accelerate fetch call to POST request to API accelerate endpoint
 *@params{number} id
 */
function accelerate(id) {

  // options parameter provided as defaultFetchOpts
  // no body or datatype needed for this request
  return fetch(`${SERVER}/api/races/${id}/accelerate`, {
      method: 'POST',
      ...defaultFetchOpts(),
    })
    .catch(err => console.log("Problem with accelerate request::", err))
}
