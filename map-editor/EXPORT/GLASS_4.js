var LVL_GLASS_4 = {
    level_string: `1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1116406700011111
1110064700011111
1110330700011111
1110330700011111
1111110401111111
1111111191111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111`,
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
        { id: DOOR_ID, i: 7, j: 4, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 8, j: 6, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 11, j: 7, state: DOOR.CLOSED }
    ],
    buttons: [
        
    ],
    batteries: [
        { id: BATTERY_ID, i: 7, j: 3, powered: false },
        { id: BATTERY_ID, i: 7, j: 6, powered: false },
        { id: BATTERY_ID, i: 8, j: 5, powered: false }
    ],
};
