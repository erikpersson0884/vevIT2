document.addEventListener("DOMContentLoaded", function() {
    const userDisplay = document.getElementById("userDisplay");
    const userDropdown = document.getElementById("userDropdown");
    const userSearchInput = document.getElementById("userSearchInput");
    const userList = document.getElementById("userList");

    const selectOponentSelect = document.getElementById("selectOponentSelect");
    const eventTimeInput = document.getElementById("eventTimeInput");
    const bookEventButton = document.getElementById("bookVevButton");

    let users = []; // To store the user data from users.json

    let selectedUser = null; // To store the selected user
    let selectedOponent = null; // To store the selected user

    // Function to populate the user list from users.json
    function populateUserList() {
        userList.innerHTML = "";
        users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = user.name;
            listItem.addEventListener("click", () => {
                selectedUsers.push(user.name);
                updateSelectedUsers();
                userDropdown.style.display = "none";
            });
            userList.appendChild(listItem);
        });
    }

    // Function to update the selected user display
    function updateselectedUser() {
        userDisplay.textContent = selectedUser;
    }

    // Fetch user data from users.json
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            users = data;
            populateUserList();
        })
        .catch(error => console.error('Error fetching JSON:', error));

    // Event listener for displaying the dropdown when "USER" is clicked
    userDisplay.addEventListener("click", () => {
        userDropdown.style.display = "block";
        userSearchInput.value = "";
        userSearchInput.focus();
    });

    // Event listener for the search input
    userSearchInput.addEventListener("input", () => {
        const searchValue = userSearchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));
        populateUserList(filteredUsers);
    });







    // Event listener for the "Book Event" button
    bookEventButton.addEventListener("click", function() {
        const selectedUser = selectOponentSelect.value;
        const eventTime = eventTimeInput.value;

        if (selectedUser && eventTime) {
            // Create an object with the data to be sent to the server
            const eventData = {
                users: [selectedUser, ], // Include the selected user
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
                    // The POST request was successful
                    return response.json();
                } else {
                    // Handle the error here if needed
                    console.error('Failed to book event');
                }
            })
            .then(data => {
                // Handle the response from the server here if needed
                console.log('Event booked successfully:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            console.error('Please select a user and enter an event time.');
        }

        // Clear the selected option in the selectOponentSelect to allow re-selection
        selectOponentSelect.value = "";
    });
});
