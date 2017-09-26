import React, {Component} from 'react';
import './App.css';

class Board extends Component {
    constructor() {
        super();

        this.state = {
            player: 0,
            ties: 0,
            computer: 0,

            isPlayersTurn: true,

            board: ["", "", "", "", "", "", "", "", ""],
            newGameButton: "disabled",
            buttonColor: "primary"
        };
    }

    newGame() {
        this.setState({
            isPlayersTurn: true,
            board: ["", "", "", "", "", "", "", "", ""],
            newGameButton: "disabled"
        });
    }

    aiTurn() {
        if (!this.state.isPlayersTurn && this.state.board.indexOf("") !== -1) {
            this.gameHandler(minimax(fillSlots(this.state.board), "O").index);
        }
    }

    gameHandler(id) {
        const board = this.state.board;
        board[id] = this.state.isPlayersTurn ? "X" : "O";

        this.setState({
            board: board,
            isPlayersTurn: !this.state.isPlayersTurn
        },this.aiTurn);

        const ifWinner = doWeHaveAWinner(this.state.board);
        if (ifWinner) {
            if (ifWinner === "X") {
                this.setState({
                    player: this.state.player + 1,
                    newGameButton: "",
                    buttonColor: "danger"
                })
            } else {
                this.setState({
                    computer: this.state.computer + 1,
                    newGameButton: "",
                    buttonColor: "danger"
                })
            }
        } else if (this.state.board.indexOf("") === -1) {
            this.setState({
                ties: this.state.ties + 1,
                newGameButton: "",
                buttonColor: "danger"
            })
        }
    }

    renderBox(id) {
        return (
            <button
                className="btn btn-default creedButton"
                onClick={() => this.gameHandler(id)}
                disabled={this.state.board[id] || this.state.newGameButton === "" ? "disabled" : ""}>
                {this.state.board[id]}
            </button>
        );
    }

    renderNames(name) {
        return (
          <div className="col-md-4">
              <h4>{name}</h4>
          </div>
        );
    }

    renderScores(id) {
        return (
            <div className="col-md-4">
                <h4>{id === 0 ? this.state.player : id === 1 ? this.state.ties : this.state.computer}</h4>
            </div>
        );
    }

    render() {
        return (
            <div className="App">
                <div className="container">
                    <div className="col-md-6 well center">
                        <div className="row">
                            {this.renderBox(0)}
                            {this.renderBox(1)}
                            {this.renderBox(2)}
                        </div>
                        <div className="row">
                            {this.renderBox(3)}
                            {this.renderBox(4)}
                            {this.renderBox(5)}
                        </div>
                        <div className="row">
                            {this.renderBox(6)}
                            {this.renderBox(7)}
                            {this.renderBox(8)}
                        </div>
                        <div className="row">
                            {this.renderNames("Player(x)")}
                            {this.renderNames("Ties")}
                            {this.renderNames("Computer(o)")}
                        </div>
                        <div className="row">
                            {this.renderScores(0)}
                            {this.renderScores(1)}
                            {this.renderScores(2)}
                        </div>
                        <button className={"btn btn-" + this.state.buttonColor} onClick={this.newGame.bind(this)} disabled={this.state.newGameButton}>New game!</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Board;

function doWeHaveAWinner(board) {
    const winners = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ];

    for (let i=0; i<winners.length; i++) {
        if (board[winners[i][0]].length > 0 && board[winners[i][0]] === board[winners[i][1]] && board[winners[i][1]] === board[winners[i][2]]) {
            return board[winners[i][0]];
        }
    }

    return false;
}

function fillSlots(board) {
    const newBoard = [];
    for (let i=0; i<board.length; i++) {
        if (board[i] === "") {
            newBoard.push(i);
        } else {
            newBoard.push(board[i]);
        }
    }
    return newBoard;
}

function emptySlots(board) {
    return  board.filter(s => s !== "O" && s !== "X");
}

// minimaxi meetodi allikas https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
function minimax(newBoard, player){
    let availSpots = emptySlots(newBoard);

    // kontrollime, kas oleme jõudnud lõppseisu
    if (doWeHaveAWinner(newBoard, "X") === "X"){
        return {score:-10};
    } else if (doWeHaveAWinner(newBoard, "O") === "O"){
        return {score:10};
    } else if (availSpots.length === 0){
        return {score:0};
    }

    let moves = [];

    // vaba väljakukohtade läbi vaatamine
    for (let i = 0; i < availSpots.length; i++){
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        // kutsume meetodi uuesti välja, kui lõppseisu (võit, kaotus, viik) pole saavutatud
        if (player === "O"){
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else{
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        // tühja koha taastamine, et teisi võimalikke lahenduskombinatsioone testida
        newBoard[availSpots[i]] = move.index;

        // lisame uue võimaluse listi
        moves.push(move);
    }

    // otsime kõige efektiivsema käigu
    let bestMove;
    if(player === "O"){
        let bestScore = -10000;
        for(let i=0; i<moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for(let i = 0; i<moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}