var LVL_BUTTON_2 = {
    level_string: `1111111111111111
1101111111111111
1100000011111111
1111111011101111
1100054011131111
1101111011101111
1134450505443001
1111111011501111
1111111011101111
1111111011111111
1111111011111111
1111111011111111
1111111011111111
1111111011111111
1111111011111111
1111111011111111
1111110000000911
1111111111111111
1111111111111111
1111111111111111`,
    player: {
        i: 2,
        j: 2,
    },
    hammer: {
        i: 1,
        j: 2,
        facing: 1,
    },
    doors: [
        { id: DOOR_ID, i: 4, j: 6, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 6, j: 3, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 6, j: 4, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 6, j: 10, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 6, j: 11, state: DOOR.CLOSED }
    ],
    buttons: [
        { id: BUTTON_ID, i: 4, j: 5, state: BUTTON.UNPRESSED },
        { id: BUTTON_ID, i: 6, j: 5, state: BUTTON.UNPRESSED },
        { id: BUTTON_ID, i: 6, j: 7, state: BUTTON.UNPRESSED },
        { id: BUTTON_ID, i: 6, j: 9, state: BUTTON.UNPRESSED },
        { id: BUTTON_ID, i: 7, j: 10, state: BUTTON.UNPRESSED }
    ],
    batteries: [
        
    ],
};
