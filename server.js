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
    return jsonArray.filter(item => item.user === inputUser);
}
  


  


// Define a route to handle the POST request for booking events
app.post('/bookEvent', (req, res) => {
    const eventData = req.body;

    // Load existing data from the events.json file (if any)
    let eventDataArray = [];
    try {
        const data = fs.readFileSync('events.json', 'utf8');
        eventDataArray = JSON.parse(data);
    } catch (err) {
        console.error('Error reading events.json:', err);
    }

    // Add the new event data to the array
    eventDataArray.push(eventData);

    // Write the updated data back to the events.json file
    fs.writeFileSync('events.json', JSON.stringify(eventDataArray, null, 4), 'utf8');

    // Respond with a JSON object indicating success
    res.status(200).json({ message: 'Event booked successfully' });
});


app.get('/getLatestVev', (req, res) => {
    // Load existing data from the events.json file (if any)
    const user = req.headers.user; // Extract user from request headers

    let eventDataArray = [];

    try {
        const data = fs.readFileSync('events.json', 'utf8');
        eventDataArray = JSON.parse(data);
    } catch (err) {
        console.error('Error reading events.json:', err);
    }

    let events = filterItemsByUser(user, eventDataArray);



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