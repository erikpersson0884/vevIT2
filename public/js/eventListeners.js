import { getCurrentTime, populateUserList, populateOpponentList } from './app.js';

document.addEventListener("DOMContentLoaded", function() {

    // Event listener for displaying the dropdown when "USER" is clicked
    userDisplay.addEventListener("click", () => {
        userDropdown.classList.toggle("show");
        userSearchInput.value = "";
        populateUserList();
        userSearchInput.focus();
    });

    opponentDisplay.addEventListener("click", () => {
        opponentDropdown.classList.toggle("show");
        opponentSearchInput.value = "";
        opponentSearchInput.focus();
        populateOpponentList();
    });

    eventTimeInput.addEventListener('click', function() {
        // Set the default time for time input
        eventTimeInput.min = getCurrentTime();
    });

    // Add an event listener to the search input field
    userSearchInput.addEventListener('input', populateUserList);
    opponentSearchInput.addEventListener('input', populateOpponentList);
});

