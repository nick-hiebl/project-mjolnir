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
    player: {
        i: 3,
        j: 10,
    },
    hammer: {
        i: 2,
        j: 10,
        facing: 2,
    },
    doors: [
        { id: DOOR_ID, i: 4, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 5, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 9, j: 2, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 9, j: 3, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 9, j: 11, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 9, j: 12, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 13, j: 4, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 13, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 14, j: 4, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 14, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 15, j: 4, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 16, j: 4, state: DOOR.CLOSED }
    ],
    buttons: [
        { id: BUTTON_ID, i: 6, j: 7, state: BUTTON.UNPRESSED },
        { id: BUTTON_ID, i: 9, j: 4, state: BUTTON.UNPRESSED },
        { id: BUTTON_ID, i: 9, j: 7, state: BUTTON.UNPRESSED },
        { id: BUTTON_ID, i: 9, j: 10, state: BUTTON.UNPRESSED },
        { id: BUTTON_ID, i: 12, j: 7, state: BUTTON.UNPRESSED }
    ],
    batteries: [
        
    ],
};
