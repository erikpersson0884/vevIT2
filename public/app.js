
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

    const displayVevsUl = document.getElementById("displayVevs");

    let users = []; // To store the user data from users.json

    let selectedUser = null; // To store the selected user
    let selectedOpponent = null; // To store the selected user
    let eventTime = null; // To store the selected time


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
                populateUserList(users);
                populateOpponentList(users);
            })
    }

    getAllUsers();

    // Get the current date and time
    var now = new Date();
    // Format the date and time as a string in "YYYY-MM-DDTHH:MM" format
    var formattedDateTime = now.toISOString().slice(0, 16);
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
            console.log("HEJ")
            return users;
        }
        const matchingUsers = users.filter(user => user.name.toLowerCase().includes(searchInput.toLowerCase()));
        return matchingUsers;
        
    }


    // Function to handle search input changes
    function handleUserSearchInputChange() {
        var filteredUsers = filterUsersSearch(userSearchInput.value);
        populateUserList(filteredUsers);
    }

    function handleOpponentSearchInputChange() {
        var filteredUsers = filterUsersSearch(opponentSearchInput.value);
        populateOpponentList(filteredUsers);
    }

    // Add an event listener to the search input field
    userSearchInput.addEventListener('input', handleUserSearchInputChange);
    opponentSearchInput.addEventListener('input', handleOpponentSearchInputChange);


    // Function to update the selected user display
    function updateselectedUser() {
        console.log(userSearchInput.value)
        showVevs()
        userDisplay.textContent = selectedUser;
    }

    // Function to update the selected user display
    function updateSelectedOpponent() {
        opponentDisplay.textContent = selectedOpponent;
    }

    // Function to populate the user list from users.json
    function populateUserList(usersToPopulate) {
        userList.innerHTML = "";


        const maxUsersToShow = 5; // Set the maximum number of users to show

        for (let i = 0; i < Math.min(maxUsersToShow, usersToPopulate.length); i++) {
            const user = usersToPopulate[i];

            const listItem = document.createElement("li");
            listItem.textContent = user.name;
        
            listItem.addEventListener("click", () => {
                selectedUser = user.name; // Use the formatted name
                updateselectedUser();
                userDropdown.style.display = "none";
            });
        
            userList.appendChild(listItem);
        }
        

        if (usersToPopulate.length < 5) {
            const newUserName = userSearchInput.value;
            const listItem = document.createElement("li");
            listItem.textContent = `ADD USER: ${newUserName} `;
            listItem.classList.add("addUserButton");

            listItem.addEventListener("click", () => {
                addUser();
                selectedUser = newUserName; // Use the formatted name
                updateselectedUser();
                userDropdown.style.display = "none";
            });

            userList.appendChild(listItem);
        }
    }

    function populateOpponentList(usersToPopulate) {
        opponentList.innerHTML = "";

        const maxUsersToShow = 5; // Set the maximum number of users to show

        for (let i = 0; i < Math.min(maxUsersToShow, usersToPopulate.length); i++) {
            const user = usersToPopulate[i];

            const listItem = document.createElement("li");
            listItem.textContent = user.name;
        
            listItem.addEventListener("click", () => {
                selectedOpponent = user.name; // Use the formatted name
                updateSelectedOpponent();
                opponentDropdown.style.display = "none";
            });
        
            opponentList.appendChild(listItem);
        }
    }


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






    // Event listener for the "Book Event" button
    bookEventButton.addEventListener("click", function() {
        eventTime = eventTimeInput.value;
        eventTime = eventTime.replace("T", " ");

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
                populateDisplayVevs(data);
        
            })
    }
});
