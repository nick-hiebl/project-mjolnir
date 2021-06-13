var LVL_GLASS_3 = {
    level_string: `1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1100011101111111
1100600700000761
1100011101111111
1130400001111111
1111111141111111
1111111191111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111
1111111101111111`,
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
        { id: DOOR_ID, i: 11, j: 4, state: DOOR.CLOSED },
        { id: DOOR_ID, i: 12, j: 8, state: DOOR.CLOSED }
    ],
    buttons: [
        
    ],
    batteries: [
        { id: BATTERY_ID, i: 9, j: 4, powered: false },
        { id: BATTERY_ID, i: 9, j: 14, powered: false }
    ],
};