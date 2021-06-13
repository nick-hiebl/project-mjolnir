const BUTTON = {
    UNPRESSED : 0,
    PRESSED: 1,
};

const DOOR = {
    CLOSED: 0,
    OPEN: 1,
};

const BLOCK = {
    EMPTY: 0,
    SOLID: 1,
    DESTRUCTABOX: 2,
    COLLECTABLE: 3,
    DOOR: 4,
    BUTTON: 5,
    BATTERY: 6,
    WINDOW: 7,
    EXIT: 9,
};

const TOOL_KEY = [
    [4,0,0,3,4,1,1,2,2,4,1,2,0,3,0,0],
    [2,0,1,4,2,4,1,1,2,4,4,4,2,4,3,3],
    [3,3,0,4,0,0,1,2,3,2,2,4,1,1,2,2],
    [0,1,4,1,0,0,1,2,0,3,2,2,3,0,3,0],
    [0,3,1,2,3,3,3,4,4,1,0,1,1,2,4,0],
    [0,1,4,2,0,1,3,0,1,0,0,0,2,0,4,3],
    [0,0,3,4,1,3,0,1,4,3,2,4,4,2,1,0],
    [3,2,3,4,1,2,4,0,2,4,3,4,1,4,3,4],
    [4,2,2,4,1,3,1,0,2,0,4,3,2,4,1,0],
    [4,4,4,2,1,4,1,4,1,4,2,3,3,0,3,0],
    [3,4,1,2,0,0,0,4,1,0,2,0,4,4,2,2],
    [3,0,0,2,1,3,3,0,4,1,1,4,1,4,0,0],
    [4,2,3,4,2,4,0,1,3,1,0,4,3,1,2,3],
    [2,4,3,1,1,2,4,2,0,2,0,1,0,4,2,3],
    [0,3,4,2,4,0,3,2,2,2,1,1,2,4,0,4],
    [0,2,3,1,4,0,2,0,3,4,0,4,1,3,1,0],
    [0,0,0,2,2,0,2,2,1,3,2,2,3,4,4,3],
    [4,4,1,4,0,3,1,2,2,4,3,1,0,1,0,0],
    [3,3,3,4,2,2,4,3,4,1,3,0,0,1,3,0],
    [0,4,1,3,2,4,1,1,4,2,0,2,3,2,4,1],
];
