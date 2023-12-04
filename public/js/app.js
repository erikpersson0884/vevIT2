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
const reasonForVevInput = document.getElementById("reasonForVevInput");
const bookEventButton = document.getElementById("bookVevButton");

const futureVevsUl = document.getElementById("futureVevs");
const pastVevsUl = document.getElementById("pastVevs");


let users = []; // To store the user data from users.json

let selectedOpponent = null; // To store the selected user
let eventTime = null; // To store the selected time

let currentDetailedVev = null;
let currentDetailedVevP = null;


function clearBookingInfo() {
    reasonForVevInput.value = "";
}


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
    const eventData = {
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
    showVevs();
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
            userDropdown.classList.toggle("show");
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
            userDropdown.classList.toggle("show");
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
            opponentDropdown.classList.toggle("show");
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
            time: eventTime,
            reasonForVev: reasonForVevInput.value
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
                clearBookingInfo();
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
 
        pastVevsUl.appendChild(createAPastVev(vev));
    });
};


function createAPastVev(vev){
        // Create a vevElement element
        const vevElement = document.createElement("li");
        vevElement.classList.add("VevsLi")

        vevElement.appendChild(createBasicVevInfo(vev));
        const DetailedVevInfoDiv = createDetailedVevInfo(vev);
        vevElement.appendChild(DetailedVevInfoDiv);

        // Add an event listener to the vevElement
        vevElement.addEventListener("click", function(event) {
            // Check if the clicked element or any of its ancestors is a <p> tag
            if (!(event.target.closest('p') && vevElement === currentDetailedVev) ) {
                // If not, proceed with your toggleDetailedVev logic
                toggleDetailedVev(vevElement, DetailedVevInfoDiv);
            }
        });
        
    return vevElement;
};


function createBasicVevInfo(vev){
    
    const basicVevInfoDiv = document.createElement("div");
    basicVevInfoDiv.classList.add("VevsLiDiv");

    const div1 = document.createElement("div");
    div1.classList.add("DisplayVevsUser")

    const p1 = document.createElement("p");
    p1.textContent = vev.user;
    p1.addEventListener("click", function() { // Eventlistener for updatig the winner
        if (basicVevInfoDiv.parentNode === currentDetailedVev && vev.winner !== vev.user){
            updateWinner(vev, vev.user);
        }
    });
    div1.appendChild(p1);

    const div2 = document.createElement("div");
    div2.classList.add("DisplayVevsOpponent")
    
    const p2 = document.createElement("p");
    p2.classList.add("DisplayVevsOpponent")
    p2.textContent = vev.opponent;

    p2.addEventListener("click", function() { // Eventlistener for updatig the winner
        if (basicVevInfoDiv.parentNode === currentDetailedVev && vev.winner !== vev.opponent){
            updateWinner(vev, vev.opponent);
        }
    });
    div2.appendChild(p2);
    
    const p3 = document.createElement("p");
    p3.classList.add("DisplayVevsTime")
    p3.textContent = vev.time;
    
    // Append the p tags to the vevElement
    basicVevInfoDiv.appendChild(div1);
    basicVevInfoDiv.appendChild(div2);
    basicVevInfoDiv.appendChild(p3);

    // Code for showing the winner, not working currently as the winner cannot be changed in detail view
    if (selectedUser === vev.winner) {
        basicVevInfoDiv.classList.add("winner")
    } else if (vev.opponent === vev.winner) {
        basicVevInfoDiv.classList.add("loser")
    }
    return basicVevInfoDiv;
};

function createDetailedVevInfo(vev){
    const DetailedVevInfoDiv = document.createElement("div");

    DetailedVevInfoDiv.appendChild(createVevReason(vev));

    const setWinnerButton = document.createElement("button");
    setWinnerButton.textContent = "Set vinner";
    setWinnerButton.classList.add("setWinnerButton");

    DetailedVevInfoDiv.appendChild(setWinnerButton);

    DetailedVevInfoDiv.classList.toggle("hidden");

    return DetailedVevInfoDiv;
}

function createVevReason(vev){
    const vevReason = document.createElement("p");
    if (vev.reasonForVev === "" || vev.reasonForVev === undefined){
        vevReason.textContent = "Ingen anledning, ¯\\_(ツ)_/¯";
    } else {
        vevReason.textContent = vev.reasonForVev;
    }

    return vevReason;
}




function populatefutureVevs(vevs){
    while (futureVevsUl.firstChild) {
        futureVevsUl.removeChild(futureVevsUl.firstChild);
    }

    vevs.forEach(function(vev){
        // Create a vevElement element
        const vevElement = document.createElement("li");
        vevElement.classList.add("VevsLi")

        const vevElementDiv = document.createElement("div");
        vevElementDiv.classList.add("VevsLiDiv");

        
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
        
        // Append the p tags to the vevElement
        vevElementDiv.appendChild(p1);
        vevElementDiv.appendChild(p2);
        vevElementDiv.appendChild(p3);

        vevElement.appendChild(vevElementDiv);

        const vevReason = document.createElement("p");
        if (vev.reasonForVev === "" || vev.reasonForVev === undefined){
            vevReason.textContent = "Ingen anledning, ¯\\_(ツ)_/¯";
        } else {
            vevReason.textContent = vev.reasonForVev;
        }
        vevReason.classList.toggle("hidden")
        
        vevElement.appendChild(vevReason);

        // Add an event listener to the vevElement
        vevElement.addEventListener("click", function() {
            toggleDetailedVev(vevElement, vevReason);
        });
    
        // Append the vevElement to the container
        futureVevsUl.appendChild(vevElement);
    });
};

function showVevs(){
    // GET THE BOOKED VEV
    fetch('/getVevs', {
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


function toggleDetailedVev(vevObject, vevReason) {
    if (!currentDetailedVev){
        vevObject.classList.add("currentActiveVev");
        vevReason.classList.add("DetailedVevInfo");
    } else {
        currentDetailedVev.classList.remove("currentActiveVev");
        currentDetailedVevP.classList.remove("DetailedVevInfo");

        if (currentDetailedVev !== vevObject){
            vevObject.classList.add("currentActiveVev");
            vevReason.classList.add("DetailedVevInfo");
        } else {
            currentDetailedVev = null;
            currentDetailedVevP = null;
            return;
        }
        
    }

    currentDetailedVev = vevObject;
    currentDetailedVevP = vevReason;

}
