const gameContainer = document.getElementById("games-container");

class Game {
    constructor(name, imageSrc, pageUrl) {
        this.name = name;
        this.imageSrc = imageSrc;
        this.pageUrl = pageUrl;
    }

    createCard() {
        const card = document.createElement("a");
        card.classList.add("game-box");
        card.href = this.pageUrl;

        card.style.backgroundImage = `url(${this.imageSrc})`;

        card.style.setProperty("--game-title", `"${this.name}"`);

        return card;
    }

}

const games = [];

games.push(new Game("Undertale", "/", "/"));
games.push(new Game("Hyperlight Drifter", "/", "/"));
games.push(new Game("Celeste", "/", "/"));
games.push(new Game("Subnautica", "/", "/"));

for (let game of games) {
    gameContainer.appendChild(game.createCard());
}