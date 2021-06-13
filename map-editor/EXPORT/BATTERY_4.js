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
        { id: DOOR_ID, i: 8, j: 8, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 8, j: 9, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 9, j: 8, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 9, j: 9, state: DOOR.CLOSED }
    ],
    buttons: [
        
    ],
    batteries: [
        { id: BATTERY_ID, i: 4, j: 8, powered: false },
        { id: BATTERY_ID, i: 4, j: 9, powered: false },
        { id: BATTERY_ID, i: 5, j: 8, powered: false },
        { id: BATTERY_ID, i: 5, j: 9, powered: false }
    ],
};
