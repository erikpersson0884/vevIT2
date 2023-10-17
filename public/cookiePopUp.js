document.addEventListener("DOMContentLoaded", function() {
    const popup = document.getElementById("cookie-consent-popup");
    const understoodButton = document.getElementById("understood-button");

    // Check if the user has already accepted cookies
    const hasAcceptedCookies = document.cookie.includes("cookiesAccepted=true");

    if (!hasAcceptedCookies) {
        popup.style.display = "block";
    }

    understoodButton.addEventListener("click", function() {
        popup.style.display = "none";
        // Set a cookie to remember that the user has accepted cookies
        document.cookie = "cookiesAccepted=true; expires=365; path=/";
    });
});
