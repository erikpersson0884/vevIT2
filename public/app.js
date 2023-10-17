
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
        showVevs()
        userDisplay.textContent = selectedUser;
        // Usage: Set a cookie with the name "username" and value "John" that expires in 30 days
        setCookie("user", selectedUser, 300);
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
                userDropdown.classList.toggle("hidden");
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
                userDropdown.classList.toggle("hidden");
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
                opponentDropdown.classList.toggle("hidden");
            });
        
            opponentList.appendChild(listItem);
        }
    }


    // Event listener for displaying the dropdown when "USER" is clicked
    userDisplay.addEventListener("click", () => {
        userDropdown.classList.toggle("hidden");
        userSearchInput.value = "";
        userSearchInput.focus();
    });

    opponentDisplay.addEventListener("click", () => {
        opponentDropdown.classList.toggle("hidden");
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
