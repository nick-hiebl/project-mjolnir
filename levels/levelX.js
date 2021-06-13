var LEVEL_X = {
    level_string: `1111111111111111
1111011111111111
1111011111111111
1111011111111111
1111011111131111
1111011111101111
1111011111101111
1111011111151111
1111000110001111
1111110110141111
1111110110121111
1111000110141111
1111010110121111
1111003000121111
1111111111121111
1111111111121111
1111111111101111
1111111111101111
1111111111191111
1111111111111111`,
    file_name: 'img/levels/level1.png',
    player: {
        i: 2,
        j: 4,
    },
    hammer: {
        i: 1,
        j: 4,
        facing: 1,
    },
    doors: [
        {
            id: 1,
            i: 9,
            j: 11,
            state: DOOR.CLOSED,
        },
        {
            id: 1,
            i: 11,
            j: 11,
            state: DOOR.CLOSED,
        },
    ],
    buttons: [
        {
            id: 1,
            i: 7,
            j: 11,
            state: BUTTON.UNPRESSED,
        },
    ],
};
