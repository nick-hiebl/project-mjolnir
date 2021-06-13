var LVL_BUTTON_5 = {
    level_string: `1111111111011111
1111111111011111
1111111111011111
1111111611011111
1111111411011111
1111111401011111
1111000500011111
1111000000011111
1110000000011111
1644500500544611
1111000000001111
1111000000011111
1111000500011111
1111410411111111
1111411411111111
1111411611111111
1111411111111111
1111911111111111
1111011111111111
1111011111111111`,
    file_name: 'img/levels/level_final.png',
    player: {
        i: 3,
        j: 10,
    },
    hammer: {
        i: 2,
        j: 10,
        facing: 1,
    },
    doors: [
        { id: 1, i: 4, j: 7, state: DOOR.CLOSED },
        { id: 2, i: 5, j: 7, state: DOOR.CLOSED },
        { id: 1, i: 9, j: 2, state: DOOR.CLOSED },
        { id: 3, i: 9, j: 3, state: DOOR.CLOSED },
        { id: 4, i: 9, j: 11, state: DOOR.CLOSED },
        { id: 1, i: 9, j: 12, state: DOOR.CLOSED },
        { id: 11, i: 13, j: 4, state: DOOR.CLOSED },
        { id: 5, i: 13, j: 7, state: DOOR.CLOSED },
        { id: 12, i: 14, j: 4, state: DOOR.CLOSED },
        { id: 1, i: 14, j: 7, state: DOOR.CLOSED },
        { id: 13, i: 15, j: 4, state: DOOR.CLOSED },
        { id: 14, i: 16, j: 4, state: DOOR.CLOSED }
    ],
    buttons: [
        { id: 3, i: 6, j: 7, state: BUTTON.UNPRESSED },
        { id: 4, i: 9, j: 4, state: BUTTON.UNPRESSED },
        { id: 1, i: 9, j: 7, state: BUTTON.UNPRESSED },
        { id: 2, i: 9, j: 10, state: BUTTON.UNPRESSED },
        { id: 5, i: 12, j: 7, state: BUTTON.UNPRESSED }
    ],
    batteries: [
        { id: 11, i: 9, j: 1, powered: false },
        { id: 12, i: 15, j: 7, powered: false },
        { id: 13, i: 9, j: 13, powered: false },
        { id: 14, i: 3, j: 7, powered: false },
    ],
};
