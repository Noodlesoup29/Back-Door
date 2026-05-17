const scrollElement = document.getElementById("scroll-elm");

scrollElement.classList.add("item-hide");

let scrollTimer;

function showPopup() {
    if (!scrollElement.classList.contains("item-show") && window.scrollY <= 120) {
        scrollElement.classList.add("item-show");
        scrollElement.classList.remove("item-hide");
    }
}

function resetScrollTimer() {
    clearTimeout(scrollTimer);

    if (!scrollElement.classList.contains("item-hide")) {
        scrollElement.classList.add("item-hide");
        scrollElement.classList.remove("item-show");
    }

    scrollTimer = setTimeout(() => {
        showPopup();
    }, 1000);
}

window.addEventListener("scroll", () => {

    resetScrollTimer();
    window.scrollTo(0, window.scrollY); //Prevent right scroll

});


resetScrollTimer();