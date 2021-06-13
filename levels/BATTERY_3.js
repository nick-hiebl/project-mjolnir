var LVL_BATTERY_3 = {
    level_string: `1111000000011111
1111000000011111
1111000000011111
1111000000011111
1111604440011111
1111604640011111
1111604440011111
1111000000011111
1111000000011111
1111000000011111
1111000000011111
1113400000011111
1111100000011111
1111110111111111
1111110111111111
1111119111111111
1111110111111111
1111110111111111
1111110111111111
1111110111111111`,
    player: {
        i: 2,
        j: 7,
    },
    hammer: {
        i: 1,
        j: 7,
        facing: 1,
    },
    doors: [
        { id: DOOR_ID, i: 4, j: 6, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 4, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 4, j: 8, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 5, j: 6, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 5, j: 8, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 6, j: 6, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 6, j: 7, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 6, j: 8, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 11, j: 4, state: DOOR.CLOSED }
    ],
    buttons: [
        
    ],
    batteries: [
        { id: BATTERY_ID, i: 4, j: 4, powered: false },
        { id: BATTERY_ID, i: 5, j: 4, powered: false },
        { id: BATTERY_ID, i: 5, j: 7, powered: false },
        { id: BATTERY_ID, i: 6, j: 4, powered: false }
    ],
};
