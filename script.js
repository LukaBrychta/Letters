// Aliases
const Application = PIXI.Application,
    Container = PIXI.Container,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics,
    TextStyle = PIXI.TextStyle;

// Define variables
let state, letter, square, sizeSquare, point, generateTime, gameScene;
// Array for working with squares and letters
let squares = [];
// Array for generating letters
let text = ["A", "B", "C", "D", "E"];

// Create a Pixi application
let app = new Application({
    width: 600,
    height: 450,
    antialias: true,
    backgroundColor: 0xF8F8F8,
});

// First game setup
setup();

function setup() {
    // Add the canvas
    document.body.appendChild(app.view);

    // Create the game scene
    gameScene = new Container;
    app.stage.addChild(gameScene);

    // Create down and right lines
    createLines();

    // Create stop game scene
    createStopGame();

    // Initial game state
    state = end;

    // Start the game loop
    app.ticker.add((delta) => gameLoop(delta));
};

function gameLoop(delta) {
    state(delta);
};

// Game states

function play(delta) {
    stopGame.visible = false;
    gameScene.visible = true;

    // Create new letter with square, when generateTime is null    
    generateTime -= (1 + (point / 25));
    if (generateTime <= 0) {
        createNewLetter();
        generateTime = 35;
    };

    // Moves all squares with letters
    square.vy = 0.2 + (point / 50);
    for (let square of squares) {
        square.y += square.vy * delta;

        // Check the loss 
        if (square.y + square.width >= app.view.height) {
            stopGame.text = "Game over";
            state = end;
        };
    };

    // Writes the points
    document.getElementById("point").textContent = point;

    // Check the win
    if (point >= 50) {
        stopGame.text = "You won"
        state = end;
    };
};

function pause() {
    stopGame.text = "Pause";
    gameScene.visible = false;
    stopGame.visible = true;
};

function end() {
    stopGame.visible = true;

    // Clearing all squares with letters and getting ready for a new game
    for (let i = squares.length - 1; i >= 0; i--) {
        square = squares[i];
        square.parent.removeChild(square);
        squares.splice(i, 1);
    };

    // Resetting the time for generating new letters
    generateTime = 0;
    // Resetting points
    point = 0;
};


// Keyboard response
window.addEventListener("keydown", function (event) {
    // Checking whether the status is play
    if (state == play) {
        let key = event.key.toUpperCase();
        let countKey = 0;

        // Counter of same keys
        for (let square of squares) {
            if (square.children[0].text == key) {
                countKey++;
            };
        };

        // 2 or more letters will be deleted and points will be added
        if (countKey >= 2) {
            for (let i = squares.length - 1; i >= 0; i--) {
                square = squares[i];
                if (square.children[0].text === key) {
                    square.parent.removeChild(square);
                    squares.splice(i, 1);
                }
            };
            point++;
        }
        // If less than 2 letters, 2 points are deducted
        else {
            if (point <= 2) {
                point = 0;
            }
            else {
                point = point - 2;
            };
        };
    };
}, true);

// Button response
let button = document.getElementById("startStop");
button.onclick = function () {
    if (state == play) {
        state = pause;
    }
    else if (state == pause) {
        state = play;
    }
    else if (state == end) {
        state = play;
    };
};

// Function

// Create new letter with square
function createNewLetter() {

    // Create square
    sizeSquare = Math.floor(Math.random() * (50) + 10);
    square = new Graphics();
    square.beginFill(0xCCCCCC);
    square.drawRect(0, 0, sizeSquare, sizeSquare);
    square.x = Math.floor(Math.random() * (app.view.width - sizeSquare));
    square.y = 0;
    square.vx = 0;
    square.vy = 0;
    square.endFill();

    // Create letter     
    let style = new TextStyle({
        fontSize: Math.floor(Math.random() * (sizeSquare - 12) + 12),
        fontWeight: 500,
    });
    letter = new Text(text[Math.floor(Math.random() * 5)], style);
    letter.y = sizeSquare / 2;
    letter.x = sizeSquare / 2;
    letter.anchor.set(0.5, 0.5);

    // Add the square to the game scene
    gameScene.addChild(square);
    // Add the letter to the square
    square.addChild(letter);
    // Add the square to array of squares
    squares.push(square);
};

// Create down and right lines
function createLines() {
    const line = new Graphics();
    line.lineStyle(2, 0x000000);

    line.moveTo(0, app.view.height);
    line.lineTo(app.view.width, app.view.height);

    line.moveTo(app.view.width, 0);
    line.lineTo(app.view.width, app.view.height);

    app.stage.addChild(line);
};

// Create stop game scene
function createStopGame() {
    let styleStopGame = new TextStyle({
        fontSize: 100,
        fontWeight: 500,
    });
    stopGame = new Text("", styleStopGame);
    stopGame.x = app.view.width / 2;
    stopGame.y = app.view.height / 2;
    stopGame.visible = false;
    stopGame.anchor.set(0.5, 0.5);
    app.stage.addChild(stopGame);
};