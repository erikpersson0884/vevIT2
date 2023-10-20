





document.addEventListener("DOMContentLoaded", function() {
    const backButton = document.getElementById("backButton");
    const forwardButton = document.getElementById("forwardButton");
    const img = document.getElementById("img");
    const description = document.getElementById("description");
    
    let images = [
        {
            "id": 1,
            "img": "1.png",
            "description": "Här visas din användare, klicka på den för att byta användare."
        },
        {
            "id": 2,
            "img": "5.png",
            "description": "Här bokar du nya vev."
        },
        {
            "id": 3,
            "img": "6.png",
            "description": "Klicka på knappen motståndare för att välja vem du skall veva emot."
        },
        {
            "id": 4,
            "img": "7.png",
            "description": "Klicka här för att välja datum och tid för vevet."
        },
        {
            "id": 5,
            "img": "8.png",
            "description": "Klicka här för att boka vevet!"
        },
        {
            "id": 6,
            "img": "3.png",
            "description": "Här ser du vilka framtida vev du har."
        },
        {
            "id": 7,
            "img": "2.png",
            "description": "Här ser du vilka tidigare vev du haft, klicka på den användare som vunnit för att ställa in den som vinnare. Är det markerat med grönt innebär det att du vunnit!"
        },
        {
            "id": 8,
            "img": "4.png",
            "description": "Här klickar du för att ändra bakgrund och kontrastfärg för sidan."
        }
    ];
    
    let currentImgIndex = 0;
    
    function updateView() {
        if (currentImgIndex >= 0 && currentImgIndex < images.length) {
        const currentImg = images[currentImgIndex];
        img.src = "images/howto/" + currentImg.img;
        description.textContent = currentImg.description;
        }
    }
    
    backButton.addEventListener("click", function() {
        currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
        updateView();
    });
    
    forwardButton.addEventListener("click", function() {
        currentImgIndex = (currentImgIndex + 1) % images.length;
        updateView();
    });
    
    // Initialize the view
    updateView();
});
    