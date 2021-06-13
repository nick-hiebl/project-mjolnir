var LVL_BATTERY_4 = {
    level_string: `1111111100111111
1111111100111111
1111111100111111
1111111100111111
1111111166111111
1111111166111111
1111111100111111
1111111100111111
1111111144111111
1111111144111111
1111111133111111
1111111100111111
1111111190111111
1111111100111111
1111111100111111
1111111100111111
1111111100111111
1111111100111111
1111111100111111
1111111100111111`,
    player: {
        i: 2,
        j: 8,
    },
    hammer: {
        i: 1,
        j: 8,
        facing: 1,
    },
    doors: [
        { id: 1, i: 8, j: 8, state: DOOR.CLOSED },
        { id: 3, i: 8, j: 9, state: DOOR.CLOSED },
        { id: 2, i: 9, j: 8, state: DOOR.CLOSED },
        { id: 4, i: 9, j: 9, state: DOOR.CLOSED }
    ],
    buttons: [
        
    ],
    batteries: [
        { id: 1, i: 4, j: 8, powered: false },
        { id: 3, i: 4, j: 9, powered: false },
        { id: 2, i: 5, j: 8, powered: false },
        { id: 4, i: 5, j: 9, powered: false }
    ],
};
