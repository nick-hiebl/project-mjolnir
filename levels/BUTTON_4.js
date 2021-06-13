var LVL_BUTTON_4 = {
    level_string: `1111111111111011
1111111111111011
1111111111111011
1111111111111011
1111111111100011
1111111300450011
1111111111100011
1111111130450011
1111111111100011
1111111113450011
1111111111100011
1116007000450011
1111111111100011
1111111111100011
1111111111100011
1111111111100011
1111111111111411
1111111111111011
1111111111111911
1111111111111111`,
    player: {
        i: 3,
        j: 13,
    },
    hammer: {
        i: 2,
        j: 13,
        facing: 1,
    },
    doors: [
        { id: 1, i: 5, j: 10, state: DOOR.CLOSED },
        { id: 2, i: 7, j: 10, state: DOOR.CLOSED },
        { id: 3, i: 9, j: 10, state: DOOR.CLOSED },
        { id: 4, i: 11, j: 10, state: DOOR.CLOSED },
        { id: 5, i: 16, j: 13, state: DOOR.CLOSED }
    ],
    buttons: [
        { id: 1, i: 5, j: 11, state: BUTTON.UNPRESSED },
        { id: 2, i: 7, j: 11, state: BUTTON.UNPRESSED },
        { id: 3, i: 9, j: 11, state: BUTTON.UNPRESSED },
        { id: 4, i: 11, j: 11, state: BUTTON.UNPRESSED }
    ],
    batteries: [
        { id: 5, i: 11, j: 3, powered: false }
    ],
};
