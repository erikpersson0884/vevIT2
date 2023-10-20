
document.addEventListener("DOMContentLoaded", function() {
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

    let selectedUser = getCookie("user"); // To store the selected user
    if (selectedUser){
        updateselectedUser();
    }

    document.documentElement.style.setProperty("--background-color", getCookie("backgroundColor"));
    document.documentElement.style.setProperty("--contrast-color", getCookie("contrastColor"));



    // Code for the color picker to change site color
    const backgroundColorPicker = document.getElementById("backgroundColorPicker");
    const contrastColorPicker = document.getElementById("contrastColorPicker");
    const backgroundColorPreview = document.getElementById("backgroundColorPreview");
    const contrastColorPreview = document.getElementById("contrastColorPreview");

    const resetColorPickers = document.getElementById("resetColorPickers")


    // Trigger the custom color pickers when the previews is clicked
    backgroundColorPreview.addEventListener("click", function() {
        backgroundColorPicker.click(); // Trigger the custom color picker when the preview is clicked
    });

    contrastColorPreview.addEventListener("click", function() {
        contrastColorPicker.click(); // Trigger the custom color picker when the preview is clicked
    });


    backgroundColorPicker.addEventListener("input", () => {
        const selectedColor = backgroundColorPicker.value;
        document.documentElement.style.setProperty("--background-color", selectedColor);
        setCookie("backgroundColor", selectedColor, 300)
    });

    contrastColorPicker.addEventListener("input", () => {
        const selectedColor = contrastColorPicker.value;
        document.documentElement.style.setProperty("--contrast-color", selectedColor);
        setCookie("contrastColor", selectedColor, 300)
    });

    resetColorPickers.addEventListener("click", () => {
        resetColors();
    });

    function resetColors(){
        document.documentElement.style.setProperty("--background-color", "#000000");
        document.documentElement.style.setProperty("--contrast-color", "#21c937");
        setCookie("backgroundColor", "#000000", 300)
        setCookie("contrastColor", "#21c937", 300)
    }



    // Set a cookie with the user's name (e.g., "username")
    function setCookie(name, value, daysToExpire) {
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    }

    // Get the value of a cookie by name
    function getCookie(name) {
        const cookieName = name + "=";
        const cookieArray = document.cookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }

    // Delete a cookie by setting its expiration to the past
    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
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


    function validateDateInput() {
        const eventTimeInput = document.getElementById('eventTimeInput');
        const currentDateTime = new Date().toISOString().slice(0, 16);
        eventTimeInput.min = currentDateTime;
    }
    eventTimeInput.addEventListener('click', validateDateInput);

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

    // Get the current date and time in Sweden
    const now = new Date();
    const swedishNow = new Date(now.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' }));
    // Format the date and time as a string in "YYYY-MM-DDTHH:MM" format
    const formattedDateTime = swedishNow.toLocaleString('sv-SE').slice(0, 16);
    // Set the value of the input element to the current date and time
    document.getElementById("eventTimeInput").value = formattedDateTime;

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



    // Add an event listener to the search input field
    userSearchInput.addEventListener('input', populateUserList);
    opponentSearchInput.addEventListener('input', populateOpponentList);


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
    function populateUserList() {
        userList.innerHTML = "";

        var filteredUsers = filterUsersSearch(userSearchInput.value);

        filteredUsers.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = user.name;
        
            listItem.addEventListener("click", () => {
                selectedUser = user.name; // Use the formatted name
                updateselectedUser();
                userDropdown.classList.toggle("hidden");
            });
        
            userList.appendChild(listItem);
        });
        
        if (userSearchInput.value) {
            const newUserName = userSearchInput.value;
            const listItem = document.createElement("li");
            listItem.textContent = `ADD USER: ${newUserName} `;
            listItem.classList.add("addUserButton");

            listItem.addEventListener("click", () => {
                addUser();
                selectedUser = newUserName; // Use the formatted name
                updateselectedUser();
                userDropdown.classList.toggle("hidden");
            });

            userList.appendChild(listItem);
        }
        
    }

    function populateOpponentList() {
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


    // Event listener for displaying the dropdown when "USER" is clicked
    userDisplay.addEventListener("click", () => {
        userDropdown.classList.toggle("hidden");
        userSearchInput.value = "";
        populateUserList();
        userSearchInput.focus();
    });

    opponentDisplay.addEventListener("click", () => {
        opponentDropdown.classList.toggle("hidden");
        opponentSearchInput.value = "";
        opponentSearchInput.focus();
        populateOpponentList();
    });






    // Event listener for the "Book Event" button
    bookEventButton.addEventListener("click", function() {
        eventTime = eventTimeInput.value;
        eventTime = eventTime.replace("T", " ");

        if (selectedUser && selectedOpponent && eventTime) {
            // Create an object with the data to be sent to the server
            const currentTime = new Date();
            const eventData = {
                user: selectedUser, // Include the selected user
                opponent: selectedOpponent,
                winner: null,
                bookingTime: currentTime,
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
                } else {
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
            p1.classList.add("pastVevsUser")
            p1.textContent = vev.user;
            p1.addEventListener("click", function() {
                updateWinner(vev, vev.user);
              });
            
            const p2 = document.createElement("p");
            p2.classList.add("pastVevsOpponent")
            p2.textContent = vev.opponent;
            p2.addEventListener("click", function() {
                updateWinner(vev, vev.opponent);
            });

            const p3 = document.createElement("p");
            p3.classList.add("pastVevsTime")
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
            p1.classList.add("futureVevsUser")
            p1.textContent = vev.user;
            
            const p2 = document.createElement("p");
            p2.classList.add("futureVevsOpponent")
            p2.textContent = vev.opponent;
            
            const p3 = document.createElement("p");
            p3.classList.add("futureVevsTime")
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
        pastEvents = [];
        futureEvents = [];
        const getEventDate = (event) => new Date(event.time);

        const currentDateTime = new Date();
        
        
        events.forEach(event => {
            if (getEventDate(event) < currentDateTime) {     
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

});
