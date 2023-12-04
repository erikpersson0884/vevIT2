import { getCookie, setCookie } from './cookie.js';


document.documentElement.style.setProperty("--background-color", getCookie("backgroundColor"));
console.log(getCookie("backgroundColor"));
document.documentElement.style.setProperty("--contrast-color", getCookie("contrastColor"));

const backgroundColor = '#000000';
const contrastColor = '#be1313';


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
    document.documentElement.style.setProperty("--background-color", backgroundColor);
    document.documentElement.style.setProperty("--contrast-color", contrastColor);
    setCookie("backgroundColor", backgroundColor, 300)
    setCookie("contrastColor", contrastColor, 300)
}
