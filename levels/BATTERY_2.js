var LVL_BATTERY_2 = {
    level_string: `1111111001111111
1111111001111111
1111111001111111
1111111001111111
1111111001111111
1111111001111111
1111111661111111
1111111441111111
1111111441111111
1111111441111111
1111111441111111
1111111991111111
1111111001111111
1111111001111111
1111111001111111
1111111001111111
1111111001111111
1111111001111111
1111111001111111
1111111001111111`,
    player: {
        i: 1,
        j: 7,
    },
    hammer: {
        i: 0,
        j: 7,
        facing: 1,
    },
    doors: [
        { id: DOOR_ID, i: 7, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 7, j: 8, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 8, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 8, j: 8, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 9, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 9, j: 8, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 10, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 10, j: 8, state: DOOR.CLOSED }
    ],
    buttons: [
        
    ],
    batteries: [
        { id: BATTERY_ID, i: 6, j: 7, powered: false },
        { id: BATTERY_ID, i: 6, j: 8, powered: false }
    ],
};
