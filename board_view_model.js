var BoardViewModel;

BoardViewModel = (function () {

    function BoardViewModel(board) {
        this.board = board;
        this.tileStates = [];
        this.iterateOverNeighbors = this.board.iterateOverNeighbors.bind(this);
        this.gameInProgress = true;
        return this;
    }

    BoardViewModel.prototype = {

        // Start game, when DOM ready
        startGame: function () {
            this.drawTiles();
            $('#validate').click(this.validateGame.bind(this));
            $('#new-game').click(this.newGame.bind(this));
        },

        revealTile: function (row, col) {
            this.tileStates[row][col] = 'revealed';
            var tile = $('#row' + row + 'col' + col).addClass('revealed');
            if (this.board.mineMap[row][col] == 'B') {
                tile.addClass('mine');
            } else {
                tile.find('span').text(this.board.mineMap[row][col]);
            }
        },

        revealRemainingTiles: function() {
            for (var row = 0; row < Board.edgeLength; ++row) {
                for (var col = 0; col < Board.edgeLength; ++col) {
                    if (this.tileStates[row][col] == 'covered')
                        this.revealTile(row,col);
                }
            }
        },

        sweepSurroundingTiles: function (row, col) {
            this.revealTile(row, col);
            if (this.board.mineMap[row][col] == 0) {
                this.iterateOverNeighbors(row, col, function (rowalt, colalt) {
                    if (this.tileStates[rowalt][colalt] == 'revealed')
                        return;
                    this.revealTile(rowalt, colalt);
                    if (this.board.mineMap[rowalt][colalt] == 0)
                        this.sweepSurroundingTiles(rowalt, colalt);
                });
            }
        },

        drawTiles: function () {
            var edge = 50;
            $('.board').css('height', edge * Board.edgeLength)
                .css('width', edge * Board.edgeLength);
            for (var row = 0; row < Board.edgeLength; ++row) {
                this.tileStates.push(new Array(Board.edgeLength));
                for (var col = 0; col < Board.edgeLength; ++col) {
                    this.tileStates[row][col] = 'covered';
                    $('<div><span></span></div>').appendTo('#board')
                        .addClass('tile')
                        .attr('id', 'row' + row + 'col' + col)
                        .css('top', (edge * row) + 'px')
                        .css('left', (edge * col ) + 'px')
//                        .css('left', (edge * col - halfBoardLength) + 'px')
                        .data({row: row, col: col});
                }
            }
            var instance = this;
            $('.tile').click(function (event) {
                instance.processClick(this, event)
            });
        },

        resetTiles: function () {
            for (var row = 0; row < Board.edgeLength; ++row) {
                for (var col = 0; col < Board.edgeLength; ++col) {
                    this.tileStates[row][col] = 'covered';
                    $('#row' + row + 'col' + col).removeClass("revealed mine").find('span').text('');
                }
            }
        },

        processClick: function (tile, event) {
            if (!this.gameInProgress) return;
            var coords = $(tile).data();
            if (this.board.mineMap[coords.row][coords.col] == 'B') {
                this.revealTile(coords.row, coords.col);
                this.gameLost();
            } else {
                this.sweepSurroundingTiles(coords.row, coords.col);
            }
        },

        newGame: function () {
            this.resetTiles();
            this.board.reset();
            $('#message').removeClass();
            this.gameInProgress = true;
        },

        validateGame: function () {
            if (!this.gameInProgress) return;
            var won = this.tileStates.every(function (row, rowIdx) {
                return row.every(function (tileState, colIdx) {
                    return tileState == 'revealed' || (tileState == 'covered' && this.board.mineMap[rowIdx][colIdx] == 'B');
                }, this);
            }, this);
            if (won) this.gameWon(); else this.gameLost();
        },

        gameLost: function () {
            this.gameInProgress = false;
            this.revealRemainingTiles();
            $('#board').effect('shake', null, 100);
            $('#message').addClass('lost');
        },

        gameWon: function () {
            this.gameInProgress = false;
            this.revealRemainingTiles();
            $('#board').effect('pulsate', null, 100);
            $('#message').addClass('won');
        }
    }

    return BoardViewModel;
})();
