var MULTI_TEST = {
    level_string: `1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1110000000011111
1110000000011111
1110000400011111
1110000000011111
1110000200011111
1110070000011111
1110000030011111
1110600000011111
1110000000011111
1111111111011111
1111111111911111
1111111111111111
1111111111111111
1111111111111111`,
    player: {
        i: 8,
        j: 4,
    },
    hammer: {
        i: 7,
        j: 4,
        facing: 2,
    },
    doors: [
        { id: 1, i: 8, j: 7, state: DOOR.CLOSED }
    ],
    buttons: [
        
    ],
    batteries: [
        { id: 1, i: 13, j: 4, powered: false }
    ],
};