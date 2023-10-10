document.addEventListener("DOMContentLoaded", function() {
    const userDisplay = document.getElementById("userDisplay");
    const userDropdown = document.getElementById("userDropdown");
    const userSearchInput = document.getElementById("userSearchInput");
    const userList = document.getElementById("userList");

    const opponentDisplay = document.getElementById("opponentDisplay");
    const opponentDisplayDropdown = document.getElementById("opponentDropdown");
    const opponentDisplaySearchInput = document.getElementById("opponentSearchInput");
    const opponentList = document.getElementById("opponentList");

    const selectOpponentSelect = document.getElementById("selectOpponentSelect");
    const eventTimeInput = document.getElementById("eventTimeInput");
    const bookEventButton = document.getElementById("bookVevButton");

    const displayVevsUl = document.getElementById("displayVevs");

    let users = []; // To store the user data from users.json

    let selectedUser = null; // To store the selected user
    let selectedOpponent = null; // To store the selected user
    let eventTime = null; // To storre the selected time

    // Function to update the selected user display
    function updateselectedUser() {
        showVevs()
        userDisplay.textContent = selectedUser;
    }

    // Function to update the selected user display
    function updateSelectedOpponent() {
        opponentDisplay.textContent = selectedOpponent;
    }

    // Function to populate the user list from users.json
    function populateUserList() {
        userList.innerHTML = "";
        users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = user.name;
            listItem.addEventListener("click", () => {
                selectedUser = user.name;
                updateselectedUser();
                userDropdown.style.display = "none";
            });
            userList.appendChild(listItem);
        });
    }

    function populateOpponentList() {
        opponentList.innerHTML = "";
        users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = user.name;
            listItem.addEventListener("click", () => {
                selectedOpponent = user.name;
                updateSelectedOpponent();
                opponentDropdown.style.display = "none";
            });
            opponentList.appendChild(listItem);
        });
    }

    // Fetch user data from users.json
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            users = data;
            populateUserList();
            populateOpponentList();
        })
        .catch(error => console.error('Error fetching JSON:', error));

    // Event listener for displaying the dropdown when "USER" is clicked
    userDisplay.addEventListener("click", () => {
        userDropdown.style.display = "block";
        userSearchInput.value = "";
        userSearchInput.focus();
    });

    opponentDisplay.addEventListener("click", () => {
        opponentDropdown.style.display = "block";
        opponentSearchInput.value = "";
        opponentSearchInput.focus();
    });


    // Event listener for the search input
    userSearchInput.addEventListener("input", () => {
        const searchValue = userSearchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));
        populateUserList(filteredUsers);
    });

    opponentSearchInput.addEventListener("input", () => {
        const searchValue = opponentSearchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));
        populateOpponentList(filteredUsers);
    });

    // Event listener for displaying the dropdown when "USER" is clicked
    userDisplay.addEventListener("click", () => {
        userDropdown.style.display = "block";
        userSearchInput.value = "";
        userSearchInput.focus();
    });

    opponentDisplay.addEventListener("click", () => {
        opponentDropdown.style.display = "block";
        opponentSearchInput.value = "";
        opponentSearchInput.focus();
    });

    // Event listener for the search input
    userSearchInput.addEventListener("input", () => {
        const searchValue = userSearchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));
        populateUserList(filteredUsers);
    });

    opponentSearchInput.addEventListener("input", () => {
        const searchValue = userSearchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));
        populateOpponentList(filteredUsers);
    });








    // Event listener for the "Book Event" button
    bookEventButton.addEventListener("click", function() {
        console.log(eventTime)
        eventTime = eventTimeInput.value;
        console.log(eventTime)

        if (selectedUser && selectedOpponent && eventTime) {
            // Create an object with the data to be sent to the server
            const eventData = {
                user: selectedUser, // Include the selected user
                opponent: selectedOpponent,
                time: eventTime
            };

            // Send a POST request to the server
            fetch('/bookEvent', {
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

    
    function populateDisplayVevs(vevs){
        while (displayVevsUl.firstChild) {
            displayVevsUl.removeChild(displayVevsUl.firstChild);
        }

        vevs.forEach(function(vev){
            // Create a div element
            const div = document.createElement("div");
            div.classList.add("displayVevsLi")
            
            // Create three p tags and set their text content
            const p1 = document.createElement("p");
            p1.textContent = vev.user;
            
            const p2 = document.createElement("p");
            p2.textContent = vev.opponent;
            
            const p3 = document.createElement("p");
            p3.textContent = vev.time;
            
            // Append the p tags to the div
            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(p3);
        
            // Append the div to the container
            displayVevsUl.appendChild(div);
        });
    };

    function showVevs(){
        // GET THE BOOKED VEV
        fetch('/getLatestVev', {
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
                console.log(data);

                populateDisplayVevs(data);
        
            })
    }
});
