var Board;

Board = (function () {

    function Board(edgeLength, mineCount) {
        this.mineMap = null;

        Board.edgeLength = edgeLength || 8;
        Board.mineCount = mineCount || 10;

        this.initMineMap();
        this.placeMines();
        this.computeProximityScores();

        return this;
    }

    Board.prototype = {

        initMineMap: function () {
            this.mineMap = new Array(Board.edgeLength);
            for (var i = 0; i < Board.edgeLength; ++i) {
                this.mineMap[i] = new Array(Board.edgeLength);
            }
        },

        reset: function(newMineCount) {
            console.log ('new mine count', newMineCount)
            if (newMineCount) Board.mineCount = newMineCount;
            console.log ('Board.mineCount', Board.mineCount)
            for (var row = 0; row < Board.edgeLength; ++row) {
                for (var col = 0; col < Board.edgeLength; ++col) {
                    this.mineMap[row][col] = undefined;
                }
            }
            this.placeMines();
            this.computeProximityScores();
        },

        placeMines: function () {
            var row, col, i = 0;
            while (i < Board.mineCount) {
                row = Math.floor(Math.random() * Board.edgeLength);
                col = Math.floor(Math.random() * Board.edgeLength);
                if (this.mineMap[row][col] != 'B') {
                    this.mineMap[row][col] = 'B';
                    ++i;
                }
                else {
                }
            }
        },

        // Loop over surrounding tiles from col-1...col+1, row-1...row+1 excluding edges of the board, calling
        // fct on every new tile.
        iterateOverNeighbors: function (row, col, fct) {
            var row_offs_start = -1,
                row_offs_end = 1,
                col_offs_start = -1,
                col_offs_end = 1;

            // Edge control -- don't iterate outside of board dimension
            if (row_offs_start + row < 0) row_offs_start = 0;
            if (col_offs_start + col < 0) col_offs_start = 0;
            if (row_offs_end + row >= Board.edgeLength) row_offs_end = 0;
            if (col_offs_end + col >= Board.edgeLength) col_offs_end = 0;

            for (var dr = row_offs_start; dr <= row_offs_end; ++dr) {
                for (var dc = col_offs_start; dc <= col_offs_end; ++dc) {
                    if (dr === 0 && dc === 0) continue;  // skip center, not a neighbor
                    fct.call(this, dr + row, dc + col);
                }
            }
        },

        countSurroundingMines: function (row, col) {
            var i = 0;
            this.iterateOverNeighbors(row, col, function (rowalt, colalt) {
                if (this.mineMap[rowalt][colalt] == 'B') ++i;
            })
            return i;
        },

        computeProximityScores: function () {
            for (var row = 0; row < Board.edgeLength; ++row) {
                for (var col = 0; col < Board.edgeLength; ++col) {
                    if (this.mineMap[row][col] === undefined) {
                        this.mineMap[row][col] = this.countSurroundingMines(row, col);
                    }
                }
            }
        }
    }

    return Board;

})();

