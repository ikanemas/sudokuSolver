const grid = document.getElementById("sudoku-grid");
let selectedCell = null;
for (let i = 0; i < 81; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    const row = Math.floor (i/9);
    const col = i%9;
    if (col === 2 || col === 5) {
        input.style.borderRight ="3px solid black";}
    if (row === 2 || row === 5) {
        input.style.borderBottom = "3px solid black"; }
    input.dataset.index = i;
    input.addEventListener("input", function() {
        this.value = this.value.replace(/[^1-9]/g,"");
    });
    input.addEventListener("click", function() {
        selectedCell = this;
    });
    grid.appendChild(input);
}

function getBoard(){
    const inputs = document.querySelectorAll("#sudoku-grid input");
    const board = [];
    for (let row = 0; row<9; row++) {
        const currentRow = [];
        for (let col = 0; col<9; col++){
            const index = row*9 + col;
            const value = inputs[index].value;
                currentRow.push(value ===""? 0 : Number(value));
        }
        board.push(currentRow);
    }
    return board;
}

function isValid(board, row, col, number){
    for (let i = 0; i<9; i++){
        if (board[row][i] === number){
            return false;
        }
    }
    for (let i = 0; i<9; i++){
        if (board[i][col] === number){
            return false;
        }
    }
    const startRow = Math.floor(row /3)* 3;
    const startCol = Math.floor(col /3)* 3;
    for (let r=0; r<3; r++){
        for (let c=0; c<3; c++){
            if (board[startRow + r][startCol + c] === number){
                return false;
            }
        }
    }
    return true;
}

function solve(board){
    for (let row=0; row<9; row++){
        for (let col=0; col<9; col++){
            if (board[row][col] === 0){
                for (let number = 1; number<=9; number++){
                    if (isValid(board, row, col, number)){
                        board[row][col] = number;
                        if (solve(board)){
                            return true;
                        }
                        board [row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function displayBoard(board, originalBoard = null){
    const inputs = document.querySelectorAll("#sudoku-grid input");
    for (let row=0; row<9; row++){
        for (let col=0; col<9; col++){
            const index = row * 9 + col;
            inputs[index].value=board[row][col] === 0 ? "" : board[row][col];
            if (originalBoard && originalBoard [row][col] !== 0){
                inputs[index].style.fontWeight = "bold";}
            else{
                inputs[index].style.fontWeight= "normal";}
        }
    }
}

function solveSudoku(){
    const board = getBoard();
    const originalBoard = board.map(row => [...row]);
    const message = document.getElementById("message");
    if (solve(board)){
        displayBoard(board, originalBoard);
        message.textContent = "Sudoku solved!";}
    else{
        message.textContent = "No solution exists.";
    }
}

function clearBoard(){
    const inputs = document.querySelectorAll("#sudoku-grid input");
    inputs.forEach(input => {
        input.value = "";
        input.style.fontWeight = "normal";
        input.classList.remove("hint-cell");
    });
    selectedCell = null;
    document.getElementById("message").textContent = "";
}

function example(){
    const inputs = document.querySelectorAll("#sudoku-grid input");
    const exampleBoard = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    displayBoard(exampleBoard);
}

function hint(){
    const message = document.getElementById("message");
    if(selectedCell === null){
        message.textContent = "Please select an empty cell first.";
        return;}
    if (selectedCell.value !== ""){
        message.textContent = "Please select an empty cell.";
        return;}
    const board = getBoard();
    const solvedBoard = board.map(row =>[...row]);
    if (!solve(solvedBoard)){
        message.textContent = "No solution exists.";
    return;}
    const index = Number(selectedCell.dataset.index);
    const row = Math.floor(index/9);
    const col = index % 9;
    selectedCell.value = solvedBoard[row][col];
    selectedCell.classList.add("hint-cell");
    message.textContent = "Hint provided.";
}

function shuffle(array){
    for (let i = array.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];}
    return array;
}

function generateSolvedBoard(board){
    for (let row = 0; row<9; row++){
        for (let col = 0; col<9; col++){
            if (board[row][col] === 0){
                const numbers = shuffle([1,2,3,4,5,6,7,8,9]);
                for (let number of numbers){
                    if (isValid(board,row, col, number)){
                        board[row][col] = number;
                        if (generateSolvedBoard(board)){
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function createEmptyBoard(){
    return Array.from({length: 9},()=> Array(9).fill(0));
}

//const board = createEmptyBoard();
//generateSolvedBoard(board);
//console.log(board);

function generateSudoku(){
    const board = createEmptyBoard();
    generateSolvedBoard(board);
    removeNumbers(board,40);
    displayBoard(board,board);
    document.getElementById("message").textContent = "New Sudoku generated.";
}

function removeNumbers(board, amount){
    let removed = 0;
    const cells = [];
    for (let i = 0; i <81; i++){
        cells.push(i);
    }
    shuffle(cells);
    for (let index of cells){
        if (removed >= amount){
            break;
        }
        const row = Math.floor(index / 9);
        const col = index % 9;
        const backup = board[row][col];
        board[row][col] = 0;

        const testBoard = board.map(row => [...row]);
        const solutions = countSolution(testBoard);
        if (solutions === 1){
            removed++;
        } else {
            board[row][col] = backup;
        }
    }
    return removed;

    //while (removed < amount){
        //const row = Math.floor(Math.random() * 9);
        //const col = Math.floor(Math.random() * 9); 
        //if (board[row][col] !== 0){
            //board[row][col] = 0;
            //removed++;
        //}
    //}
}

function countSolution(board, limit = 2){
    for (let row = 0; row<9; row++){
        for (let col = 0; col<9; col++){
            if(board[row][col] === 0){
                let count = 0;
                for (let number = 1; number<= 9; number++){
                    if (isValid(board, row, col, number)){
                        board[row][col] = number;
                        count+= countSolution(board, limit - count);
                        board [row][col] = 0;
                        if (count >= limit){
                            return count;
                        }
                    }
                }
                return count;
            }
        }
    }
    return 1;
}