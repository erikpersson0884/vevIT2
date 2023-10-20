
document.addEventListener("DOMContentLoaded", function() {
    const pastVevsUl = document.getElementById("pastVevs");
    let users = []; // To store the user data from users.json





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
            
            if (vev.user === vev.opponent) { // For my favorite user of this fine website, the ones that whishes to fight themself ˘‿˘ 
                if (vev.winner === null) {
                    p1.classList.add("loser");
                    p2.classList.add("loser");
                } else {
                    p1.classList.add("winner");
                    p2.classList.add("winner");
                }
            } 
            else if (vev.user === vev.winner) {
                p1.classList.add("winner");
                p2.classList.add("loser");
            } 
            else if (vev.opponent === vev.winner) {
                p2.classList.add("winner");
                p1.classList.add("loser");
            }

            // Append the p tags to the div
            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(p3);



            // Append the div to the container
            pastVevsUl.appendChild(div);
        });
    }
    


    function showVevs(){
        // GET THE BOOKED VEV
        fetch('/getAllVevs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'user': null
            },
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response body as JSON
            })
            .then(data => {
                console.log(data)
                const events = sortEventOnTime(data);
                populatePastVevs(events.pastEvents);
        
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




    showVevs();


});
