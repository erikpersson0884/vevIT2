document.addEventListener("DOMContentLoaded", function() {
    const userDisplay = document.getElementById("userDisplay");
    const userDropdown = document.getElementById("userDropdown");
    const searchInput = document.getElementById("searchInput");
    const userList = document.getElementById("userList");

    let selectedUsers = []; // To store the selected users
    let users = []; // To store the user data from users.json

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

    // Function to update the selected users display
    function updateSelectedUsers() {
        userDisplay.textContent = selectedUsers.join(", ");
    }

    // Fetch user data from users.json
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            users = data.slice(0, 5); // Get the first 5 users
            populateUserList();
        })
        .catch(error => console.error('Error fetching JSON:', error));

    // Event listener for displaying the dropdown when "USER" is clicked
    userDisplay.addEventListener("click", () => {
        userDropdown.style.display = "block";
        searchInput.value = "";
        searchInput.focus();
    });

    // Event listener for the search input
    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));
        populateUserList(filteredUsers);
    });

    const selectElement = document.getElementById("selectOponentSelect");
    const eventTimeInput = document.getElementById("chooseTimeInput");
    const bookEventButton = document.getElementById("bookVevButton");

    // Fetch the JSON data from the users.json file and populate the select element
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const option = document.createElement("option");
                option.textContent = user.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));

    // Event listener for the "Book Event" button
    bookEventButton.addEventListener("click", function() {
        const selectedUser = selectElement.value;
        const eventTime = eventTimeInput.value;

        if (selectedUser && eventTime) {
            selectedUsers.push(selectedUser); // Add the currently selected user
            const eventData = {
                users: selectedUsers, // Include all selected users
                time: eventTime
            };

            // Send the event data to the server using a POST request
            fetch('/bookEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            })
            .then(response => {
                if (response.ok) {
                    console.log('Event booked successfully for users:', selectedUsers);
                } else {
                    console.error('Failed to book event.');
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            console.error('Please select a user and enter an event time.');
        }
    });
});
