
// Set a cookie with the user's name (e.g., "username")
export function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
}

// Get the value of a cookie by name
export function getCookie(name) {
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

