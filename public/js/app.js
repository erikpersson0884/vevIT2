import { getCookie, setCookie } from './cookie.js';


const userDisplay = document.getElementById("userDisplay");
const userDropdown = document.getElementById("userDropdown");
const userSearchInput = document.getElementById("userSearchInput");
const userList = document.getElementById("userList");

const opponentDisplay = document.getElementById("opponentDisplay");
const opponentDisplayDropdown = document.getElementById("opponentDropdown");
const opponentSearchInput = document.getElementById("opponentSearchInput");
const opponentList = document.getElementById("opponentList");

const selectOpponentSelect = document.getElementById("selectOpponentSelect");
const eventTimeInput = document.getElementById("eventTimeInput");
const bookEventButton = document.getElementById("bookVevButton");

const futureVevsUl = document.getElementById("futureVevs");
const pastVevsUl = document.getElementById("pastVevs");


let users = []; // To store the user data from users.json

let selectedOpponent = null; // To store the selected user
let eventTime = null; // To store the selected time


export function getCurrentTime() {
    // Get the current date and time in Sweden
    const now = new Date();
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      };
    
    return now.toLocaleString(undefined, options);
}


function updateWinner(vev, winner) {
    // Send a POST request to the server
    eventData = {
        vev: vev,
        winner: winner
    }
    fetch('/updateWinner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => {
        if (response.ok) {
            console.log(`winner was added`)
            showVevs();
        } else {
            // Handle the error here if needed
            console.error('Failed to update winner');
        }
    });
}


function getAllUsers(){
    // GET ALL USERS
    fetch('/getAllUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response body as JSON
        })
        .then(data => {
            users = data;
            populateUserList();
            populateOpponentList();
        })
}

getAllUsers();



// Set the value of the input element to the current date and time
document.getElementById("eventTimeInput").value = getCurrentTime();

function addUser() {
    const newUserName = userSearchInput.value;

    // Send a POST request to the server
    fetch('/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newUserName })
    })
    .then(response => {
        if (response.ok) {
            console.log(`${newUserName} was added`)
        } else {
            // Handle the error here if needed
            console.error('Failed to book event');
        }
    })
    selectedUser = {name: newUserName};
    updateselectedUser();
    getAllUsers();
}


function filterUsersSearch(searchInput) {
    if (!searchInput){
        return users;
    }
    const matchingUsers = users.filter(user => user.name.toLowerCase().includes(searchInput.toLowerCase()));
    return matchingUsers;
    
}


// Function to update the selected user display
function updateselectedUser() {
    showVevs()
    userDisplay.textContent = selectedUser;
    userSearchInput.value = null;
    setCookie("user", selectedUser, 300);
}

// Function to update the selected user display
function updateSelectedOpponent() {
    opponentDisplay.textContent = selectedOpponent;
}

// Function to populate the user list from users.json
export function populateUserList() {
    userList.innerHTML = "";

    var filteredUsers = filterUsersSearch(userSearchInput.value);

    filteredUsers.forEach(user => {
        const userlistItem = document.createElement("li");
        userlistItem.textContent = user.name;
    
        userlistItem.addEventListener("click", () => {
            selectedUser = user.name; // Use the formatted name
            updateselectedUser();
            userDropdown.classList.toggle("hidden");
        });
    
        userList.appendChild(userlistItem);
    });
    
    if (userSearchInput.value) {
        const newUserName = userSearchInput.value;
        const addUserlistItem = document.createElement("li");
        addUserlistItem.textContent = `ADD USER: ${newUserName} `;
        addUserlistItem.classList.add("addUserButton");

        addUserlistItem.addEventListener("click", () => {
            addUser();
            selectedUser = newUserName; // Use the formatted name
            updateselectedUser();
            userDropdown.classList.toggle("hidden");
        });

        userList.appendChild(addUserlistItem);
    }
    
}

export function populateOpponentList() {
    opponentList.innerHTML = "";

    var filteredOpponents = filterUsersSearch(opponentSearchInput.value);

    filteredOpponents.forEach(opponent => {
        const listItem = document.createElement("li");
        listItem.textContent = opponent.name;
    
        listItem.addEventListener("click", () => {
            selectedOpponent = opponent.name; // Use the formatted name
            updateSelectedOpponent();
            opponentDropdown.classList.toggle("hidden");
        });
    
        opponentList.appendChild(listItem);
    });
}









// Event listener for the "Book Event" button
bookEventButton.addEventListener("click", function() {
    eventTime = eventTimeInput.value;
    eventTime = eventTime.replace("T", " ");

    if (selectedUser && selectedOpponent && eventTime) {
        // Create an object with the data to be sent to the server
        const eventData = {
            user: selectedUser, // Include the selected user
            opponent: selectedOpponent,
            winner: null,
            bookingTime: getCurrentTime(),
            time: eventTime
        };

        // Send a POST request to the server
        fetch('/bookVev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        })
        .then(response => {
            if (response.ok) {
                showVevs();
            } 
            else if (response.status === 409){

                response.json().then(data => {
                    console.log('Conflict (409): ' + data.message);
                });

            } 
            else {
                // Handle the error here if needed
                console.error('Failed to book event');
            }
        })

    } else {
        console.error('Please select a user and enter an event time.');
    }
});

function populatePastVevs(vevs) {
    while (pastVevsUl.firstChild) {
        pastVevsUl.removeChild(pastVevsUl.firstChild);
    }

    vevs.forEach(function(vev){
        // Create a div element
        const div = document.createElement("div");
        div.classList.add("pastVevsLi")
        
        // Create three p tags and set their text content
        const p1 = document.createElement("p");
        p1.classList.add("DisplayVevsUser")
        p1.textContent = vev.user;
        p1.addEventListener("click", function() {
            updateWinner(vev, vev.user);
            });
        
        const p2 = document.createElement("p");
        p2.classList.add("DisplayVevsOpponent")
        p2.textContent = vev.opponent;
        p2.addEventListener("click", function() {
            updateWinner(vev, vev.opponent);
        });

        const p3 = document.createElement("p");
        p3.classList.add("DisplayVevsTime")
        p3.textContent = vev.time;
        
        // if (vev.user === vev.opponent) { // For my favorite user of this fine website, the ones that whishes to fight themself ˘‿˘ 
        //     if (vev.winner === null) {
        //         p1.classList.add("loser");
        //         p2.classList.add("loser");
        //     } else {
        //         p1.classList.add("winner");
        //         p2.classList.add("winner");
        //     }
        // } 
        // else if (vev.user === vev.winner) {
        //     p1.classList.add("winner");
        //     p2.classList.add("loser");
        // } 
        // else if (vev.opponent === vev.winner) {
        //     p2.classList.add("winner");
        //     p1.classList.add("loser");
        // }

        // Append the p tags to the div
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);

        if (selectedUser === vev.winner) {
            div.classList.add("winner")
        } else if (vev.opponent === vev.winner) {
            div.classList.add("loser")
        }


        // Append the div to the container
        pastVevsUl.appendChild(div);
    });
}

function populatefutureVevs(vevs){
    while (futureVevsUl.firstChild) {
        futureVevsUl.removeChild(futureVevsUl.firstChild);
    }

    vevs.forEach(function(vev){
        // Create a div element
        const div = document.createElement("div");
        div.classList.add("futureVevsLi")
        
        // Create three p tags and set their text content
        const p1 = document.createElement("p");
        p1.classList.add("DisplayVevsUser")
        p1.textContent = vev.user;
        
        const p2 = document.createElement("p");
        p2.classList.add("DisplayVevsOpponent")
        p2.textContent = vev.opponent;
        
        const p3 = document.createElement("p");
        p3.classList.add("DisplayVevsTime")
        p3.textContent = vev.time;
        
        // Append the p tags to the div
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);
    
        // Append the div to the container
        futureVevsUl.appendChild(div);
    });
};

function showVevs(){
    // GET THE BOOKED VEV
    fetch('/getAllVevs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'user': selectedUser
        },
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response body as JSON
        })
        .then(data => {
            const events = sortEventOnTime(data);
            populatePastVevs(events.pastEvents);
            populatefutureVevs(events.futureEvents);
    
        })
}



function sortEventOnTime(events) {
    let  pastEvents = [];
    let futureEvents = [];
    // const getEventDate = (event) => new Date(event.time);
    
    events.forEach(event => {
        if (event.time < getCurrentTime()) {     
            // Event is in the past
            pastEvents.push(event);
        } else {
        // Event is in the future
        futureEvents.push(event);
        }
    });
    return {
        pastEvents,
        futureEvents
    };

}

let selectedUser = getCookie("user"); // To store the selected user
if (selectedUser){
    updateselectedUser();
}

