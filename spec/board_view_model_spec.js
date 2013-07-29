describe("BoardViewModel", function () {
    var boardViewModel;

    beforeEach(function () {
        board = new Board(4);
        boardViewModel = new BoardViewModel(board);
        boardViewModel.drawTiles();

        boardViewModel.board.mineMap = [
            [ 1,  1,  0,  0 ],
            ['B', 1,  1,  1 ],
            [ 1,  1,  1, 'B'],
            [ 0,  0,  1,  1 ]
        ];
    });

    function countRevealedTiles() {
        var sum=0;
        for (row = 0; row < Board.edgeLength; ++row) {
            for (col = 0; col < Board.edgeLength; ++col) {
                if (boardViewModel.tileStates[row][col] == 'revealed') ++sum;
            }
        }
        return sum;
    };

    describe("sweepSurroundingTiles", function () {

        it("reveals only the tile itself if it's got a non-zero score", function () {
            boardViewModel.sweepSurroundingTiles(3, 3);
            expect(boardViewModel.tileStates[3][3]).toEqual('revealed');
            expect(countRevealedTiles()).toEqual(1);
        });

        it("reveals neighboring tiles if tile has a zero score", function() {
            boardViewModel.sweepSurroundingTiles(0, 2);
            expect(boardViewModel.tileStates[0][1]).toEqual('revealed');
            expect(boardViewModel.tileStates[0][2]).toEqual('revealed');
            expect(boardViewModel.tileStates[0][3]).toEqual('revealed');
            expect(boardViewModel.tileStates[1][1]).toEqual('revealed');
            expect(boardViewModel.tileStates[1][2]).toEqual('revealed');
            expect(boardViewModel.tileStates[1][3]).toEqual('revealed');
            expect(countRevealedTiles()).toEqual(6);
        })
    });
});
