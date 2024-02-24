const express = require("express"); 
const router = express.Router();

const availableMoves = ["Rock", "Paper", "Scissors"];

// Rock Paper Scissors Class //

class RPS {
    constructor (moves) {
        this.availableMoves = moves.map((move) => {
            // Ensure that all moves are stored in lowercase
            return move = move.toLowerCase();
        }); 

        this.winChance = 0.33; // 33% chance of a winning play each round
    }

    generateMove = () => {
        // Generate a random move
        const randomNumber = Math.floor(Math.random()*3); 
        return availableMoves[randomNumber]; 
    }

    respond = (playerMove) => {
        // Respond to a player's move
        let random = Math.random(); 

        if (random <= this.winChance) { 
            // generate a win
            res.json({move: win(playerMove), winChance: this.winChance})
        } else {
            // loose
            res.json({move: loose(playerMove), winChance: this.winChance})
        }
    }

    win = (playerMove) => {
        switch (playerMove) {
            case "rock":
                return availableMoves[1]
            case "scissors": 
                return availableMoves[0]
            case "paper":
                return availableMoves[2]
            default:
                return "DEFAULT Rock"
        }
    }

    loose = (playerMove) => {
        switch (playerMove) {
            case "rock":
                return availableMoves[2]
            case "scissors": 
                return availableMoves[1]
            case "paper":
                return availableMoves[0]
            default:
                return "DEFAULT Rock"
        }
    }

    findWinChance = (gameData) => { 
        const standardWinChance = 0.33; 
        const increasedWinChance = 0.66;
        const decreasedWinChance = 0.17

        const {score, bestOf, gamesPlayed, multipleGames} = gameData;
        
        // If the player has played multiple games, adjust the odds of winning

        if (multipleGames) {
            // Find out if the player is going to win
            switch (bestOf) {
                case 3:
                // Best of 3 match
                    if (gamesPlayed >= 1 && score >= 1) {
                        this.winChance = increasedWinChance;
                    } else if (gamesPlayed >= 1 && score < 1) {
                        this.winChance = decreasedWinChance;
                    }
                    else {
                        this.winChance = standardWinChance; 
                    }
                    break; 
                case 5:
                // Best of 5 match
                    if (gamesPlayed > 2 && score >= 2) {
                        this.winChance = increasedWinChance;
                    } else if (gamesPlayed > 2 && score < 2) {
                        this.winChance = decreasedWinChance;
                    }
                    else {
                        this.winChance = standardWinChance; 
                    }
                    break; 
                case 9:
                // Best of 9 match - not supported currently
                    if (gamesPlayed >= 4 && score >= 4) {
                        this.winChance = increasedWinChance
                    } else {
                        this.winChance = decreasedWinChance; 
                    }
                    break;
                default:
                    break;
            }
        }

        return this.winChance; 
    }

    generateCustomChanceMove = (customChance, playerMove) => {
        const random = Math.random(); 

        if (random < customChance) {
            return this.win(playerMove); 
        } else {
            return this.loose(playerMove); 
        }
    }
}
// ------------------------- // 

// Create intance of RPS class
const rpsGame = new RPS(availableMoves); 

// ------------------------- // 
// --- Moves API Routes --- //

router.get("/", (req, res) => {
    // Return all available moves
    res.json(rpsGame.availableMoves); 
});

router.get("/generate", (req, res) => {
    // Generate a random move
    res.json({move: rpsGame.generateMove()})
});

router.get("/respond/:moveID", (req, res) => {
    // Generate a response to a player move
    const move = req.params.moveID.toLowerCase(); 
    res.json({move: rpsGame.respond(move)})
});

router.get("/win/:moveID", (req, res) => {
    // Generate a winning response
    const move = req.params.moveID.toLowerCase(); 
    res.json({move: rpsGame.win(move)});

});

router.get("/loose/:moveID", (req, res) => {
    // Generate a loosing response
    let move = req.params.moveID.toLowerCase();
    res.json({move: rpsGame.loose(move)});

});

router.get("/findWinChance/:gameData", (req, res) => {
    // Decide on an appropriate win chance based on previous games
    const gameData = req.params.gameData;
    res.json({move: rpsGame.findWinChance(gameData)})
})

module.exports = {
    router, 
    RPS,
}