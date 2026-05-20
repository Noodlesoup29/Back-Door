const gameContainer = document.getElementById("games-container");
const searchBar = document.getElementById("search-bar");


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

        this.card = card;

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

function searchGames(event){
    const query = event.target.value.toLowerCase();
    console.log(query);

    for(let game of games){
        const match = game.name.toLowerCase().includes(query);
        if(match){
            // Sets display back to default, removes the none override
            game.card.style.display = "";
        } 
        else{
            game.card.style.display = "none";
        }
    }
}

searchBar.addEventListener("input", searchGames);