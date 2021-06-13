var LVL_BUTTON_3 = {
    level_string: `1111111111111111
1111111111110111
1111011111110111
1111311031110111
1100400045000111
1100500011111111
1100000011111111
1100000000111111
1000000000111111
1000000050111111
1100000000111111
1100000000111111
1100050000111111
1100400040111111
1101311131111111
1101111101111111
1101111101111111
1191111111111111
1111111111111111
1111111111111111`,
    player: {
        i: 2,
        j: 12,
    },
    hammer: {
        i: 1,
        j: 12,
        facing: 1,
    },
    doors: [
        { id: 1, i: 4, j: 4, state: DOOR.CLOSED },
        { id: 2, i: 4, j: 8, state: DOOR.CLOSED },
        { id: 3, i: 13, j: 4, state: DOOR.CLOSED },
        { id: 4, i: 13, j: 8, state: DOOR.CLOSED }
    ],
    buttons: [
        { id: 2, i: 4, j: 9, state: BUTTON.UNPRESSED },
        { id: 1, i: 5, j: 4, state: BUTTON.UNPRESSED },
        { id: 4, i: 9, j: 8, state: BUTTON.UNPRESSED },
        { id: 3, i: 12, j: 5, state: BUTTON.UNPRESSED }
    ],
    batteries: [
        
    ],
};
