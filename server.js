const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


function filterItemsByUser(inputUser, jsonArray) {
    return jsonArray.filter(item => item.user === inputUser || item.opponent === inputUser);
}
  


  


// Define a route to handle the POST request for booking events
app.post('/bookVev', (req, res) => {
    const eventData = req.body;

    // Load existing data from the events.json file (if any)
    let eventDataArray = [];
    try {
        const data = fs.readFileSync('events.json', 'utf8');
        eventDataArray = JSON.parse(data);
    } catch (err) {
        console.error('Error reapng events.json:', err);
    }
    
    // Add the new event data to the array
    eventDataArray.push(eventData);

    // Write the updated data back to the events.json file
    fs.writeFileSync('events.json', JSON.stringify(eventDataArray, null, 4), 'utf8');

    // Respond with a JSON object indicating success
    res.status(200).json({ message: 'Event booked successfully' });
});



app.post('/updateWinner', (req, res) => {
    const { user, opponent, time } = req.body.vev; // Assuming req.body contains vev with user, opponent, and time properties
    const newWinner = req.body.winner;

    let eventDataArray = [];
    try {
        const data = fs.readFileSync('events.json', 'utf8');
        eventDataArray = JSON.parse(data);
    } catch (err) {
        console.error('Error reading events.json:', err);
    }

    let found = false;

    // Search for an event that matches the user, opponent, and time
    for (const event of eventDataArray) {
        if (event.user === user && event.opponent === opponent && event.time === time) {
            found = true;
            event.winner = newWinner; // Update the "winner" attribute
            break;
        }
    }

    if (found) {
        console.log('Event found and winner updated');
        
        // Save the updated eventDataArray back to the events.json file
        fs.writeFileSync('events.json', JSON.stringify(eventDataArray, null, 2));
        // Respond with a JSON object indicating success
        res.status(200).json({ message: 'Winner updated successfully' });
    } else {
        console.log('Event not found');
        // Event not found
        res.status(404).json({ message: 'Event not found' });

    }
});





// Define a route to handle the POST request for adding users 
app.post('/addUser', (req, res) => {
    const newUser = req.body;

    // Load existing data from the users.json file (if any)
    let usersDataArray = [];
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        usersDataArray = JSON.parse(data);
    } catch (err) {
        console.error('Error reading users.json:', err);
    }

    // Add the new event data to the array
    usersDataArray.push(newUser);

    // Write the updated data back to the events.json file
    fs.writeFileSync('users.json', JSON.stringify(usersDataArray, null, 4), 'utf8');

    // Respond with a JSON object indicating success
    res.status(200).json({ message: 'User added successfully' });
});

app.get('/getAllUsers', (req, res) => {

    let allUsers = []

    try {
        const data = fs.readFileSync('users.json', 'utf8');
        allUsers = JSON.parse(data);
    } catch (err) {
        console.error('Error reading users.json:', err);
    }

    // Respond with a JSON object indicating success or error
    if (allUsers == null) {
        res.status(500).json({ error: "allUsers was null" });
    } 
    else if (allUsers) {
        res.status(200).json(allUsers);
    }
    else {
        res.status(500).json({ error: 'Failed to retrieve allUsers' });
    }
});


app.get('/getAllVevs', (req, res) => {
    // Load existing data from the events.json file (if any)
    const user = req.headers.user; // Extract user from request headers
    let events = [];

    try {
        const data = fs.readFileSync('events.json', 'utf8');
        events = JSON.parse(data);
    } catch (err) {
        console.error('Error reading events.json:', err);
    }
    
    if (user === null){
        let events = filterItemsByUser(user, eventDataArray);
    }

    console.log(events)

    events = events.sort((a, b) => new Date(a.time) - new Date(b.time));
    

    // Respond with a JSON object indicating success or error
    if (user == null) {
        res.status(500).json({ error: "User was null" });
    } 
    else if (events) {
        res.status(200).json(events);
    }
    else {
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});







// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});