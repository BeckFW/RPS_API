const {describe, expect, it, test} = require('@jest/globals')
const { RPS } = require('./move')

const testMoves = ["Rock", "Paper", "Scissors"]; 

describe("Rock Paper Scissors Class", () => {

    const lowerCaseMoves = ["rock", "paper", "scissors"]; 
    const rps = new RPS(testMoves); 

    it("Can be created", () => { 
        expect(new RPS(testMoves)).toBeInstanceOf(RPS); 
    }); 

    it("Stores moves in lowercase", () => {
        expect(rps.availableMoves).toStrictEqual(lowerCaseMoves); 
    });

    it("Can generate a random move", () => {
        const result = rps.generateMove(); 

        expect(testMoves).toContain(result); 
    }); 

    
}); 

describe("RPS Can Win Matches", () => {

    const rps = new RPS(testMoves);

    it("Can WIN against ROCK", () => {
        expect(rps.win("rock")).toBe("Paper"); 
    }); 

    it("Can WIN against PAPER", () => {
        expect(rps.win("paper")).toBe("Scissors"); 
    }); 

    it("Can WIN against SCISSORS", () => {
        expect(rps.win("scissors")).toBe("Rock"); 
    })
}); 

describe("RPS Can Loose Matches", () => {
    
    const rps = new RPS(testMoves);
    
    it("Can LOOSE against ROCK", () => {
        expect(rps.loose("rock")).toBe("Scissors"); 
    }); 

    it("Can LOOSE against PAPER", () => {
        expect(rps.loose("paper")).toBe("Rock"); 
    }); 

    it("Can LOOSE against SCISSORS", () => {
        expect(rps.loose("scissors")).toBe("Paper"); 
    })
}); 

describe("RPS Match Balancing", () => {

    // Leave out best of 9 for now
    const rps = new RPS(testMoves); 
    const playerLoosingGame = {
        score: 1, 
        bestOf: 5, 
        gamesPlayed: 3, 
        multipleGames: true,
    }

    const playerWinningGame = { 
        score: 2, 
        bestOf: 5, 
        gamesPlayed: 3, 
        multipleGames: true,
    }

    const balancedGame = { 
        score: 2, 
        bestOf: 5, 
        gamesPlayed: 2, 
        multipleGames: true,
    }

    it("Has a higher win chance when NPC loosing", () => {
        expect(rps.findWinChance(playerWinningGame)).toBeGreaterThan(0.33); 
    }); 

    it("Has a lower win chance when NPC winning", () => {
        expect(rps.findWinChance(playerLoosingGame)).toBeLessThan(0.33); 
    });  

    it("Has a normal win chance when match is equal", () => {
        expect(rps.findWinChance(balancedGame)).toBe(0.33);
    });
})