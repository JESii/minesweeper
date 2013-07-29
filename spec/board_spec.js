describe("Board", function () {
    var board;

    beforeEach(function () {
        board = new Board();
    });

    describe("iterateOverNeighbors", function () {

        describe("without recursion", function () {

            it("runs the function in 'this' context of object", function () {
                board.obj = null;
                board.iterateOverNeighbors(1, 1, function () {
                    this.obj = 'abc';
                })

                expect(board.obj).toEqual('abc')
            });

            it("calls it once for each surrounding tile including diagonals", function () {
                var neighbors = [];
                board.iterateOverNeighbors(1, 1, function (row, col) {
                    neighbors.push([row, col]);
                })

                expect(neighbors).toEqual([  // relative to (1,1)
                    [0, 0], [0, 1], [0, 2],
                    [1, 0],         [1, 2],
                    [2, 0], [2, 1], [2, 2]
                ]);
            });


            it("does not iterate beyond board boundary, top left", function() {
                var neighbors = [];
                board.iterateOverNeighbors(0, 0, function (row, col) {
                    neighbors.push([row, col]);
                })

                expect(neighbors).toEqual([  // relative to (1,1)
                    [0, 1], [1, 0], [1, 1]
                ]);
            });

            it("does not iterate beyond board boundary, bottom right", function() {
                var neighbors = [];
                board.iterateOverNeighbors(Board.edgeLength-1, Board.edgeLength-1, function (row, col) {
                    neighbors.push([row, col]);
                })

                expect(neighbors).toEqual([  // relative to (7,7)
                    [6, 6], [6, 7], [7, 6]
                ]);
            });
        });

    });

});