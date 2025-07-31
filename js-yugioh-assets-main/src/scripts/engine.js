const state = {
    score: {
        playScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    button: document.getElementById("next-duel"),
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue-Eyes White Dragon",
        type: "paper",
        Img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        Img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        Img: `${pathImages}Exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(randomIdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("width", "70px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(randomIdCard);
        });
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function duelResult(playerCardId, computerCardId) {
    const playerCard = cardData[playerCardId];
    const computerCard = cardData[computerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        return "win";
    } else if (playerCard.LoseOf.includes(computerCardId)) {
        return "lose";
    } else {
        return "draw";
    }
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(result) {
    state.button.style.display = "block";
    if (result === "win") {
        state.button.innerText = "VOCÊ GANHOU!";
        await playAudio(result);
        state.score.playScore++;
    } else if (result === "lose") {
        state.button.innerText = "VOCÊ PERDEU!";
        await playAudio(result);
        state.score.computerScore++;
    } else {
        state.button.innerText = "EMPATE!";
        await playAudio(result);
    }
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.innerHTML = "";
    state.fieldCards.computer.innerHTML = "";

    const playerImg = document.createElement("img");
    playerImg.src = cardData[cardId].Img;
    playerImg.setAttribute("height", "100%");
    playerImg.setAttribute("width", "100%");
    playerImg.style.objectFit = "contain";

    const computerImg = document.createElement("img");
    computerImg.src = cardData[computerCardId].Img;
    computerImg.setAttribute("height", "100%");
    computerImg.setAttribute("width", "100%");
    computerImg.style.objectFit = "contain";

    state.fieldCards.player.appendChild(playerImg);
    state.fieldCards.computer.appendChild(computerImg);

    await new Promise(resolve => setTimeout(resolve, 300));

    let result = await duelResult(Number(cardId), computerCardId);

    await updateScore();
    await drawButton(result);
}

async function removeAllCardsImages() {
    let cardsComputer = document.querySelector("#computer-cards");
    let imgElementsComputer = cardsComputer.querySelectorAll("img");
    imgElementsComputer.forEach((img) => img.remove());

    let cardsPlayer = document.querySelector("#player-cards");
    let imgElementsPlayer = cardsPlayer.querySelectorAll("img");
    imgElementsPlayer.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].Img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumber, fieldSide) {
    for (let i = 0; i < cardNumber; i++) {
        const randomIdCard = await getRandomCardId();
        const cardimage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardimage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "./src/assets/icons/card-back.png";
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";
    state.button.style.display = "none";

    state.fieldCards.player.innerHTML = "";
    state.fieldCards.computer.innerHTML = "";

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
    state.button.addEventListener("click", resetDuel);
    updateScore();

    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic && (backgroundMusic.paused || backgroundMusic.ended)) {
        backgroundMusic.play().catch(e => console.error("Error playing background music:", e));
    }
}

init();