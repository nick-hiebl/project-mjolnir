const KEYS = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false,
};

function keyDown(event) {
    // Only set override to true if putting key down for the first time
    let override = false;
    let reset = false;

    switch (event.key) {
        case 'w': case 'ArrowUp':
            override = !KEYS.UP;
            KEYS.UP = true;
            break;
        case 'a': case 'ArrowLeft':
            override = !KEYS.LEFT;
            KEYS.LEFT = true;
            break;
        case 's': case 'ArrowDown':
            override = !KEYS.DOWN;
            KEYS.DOWN = true;
            break;
        case 'd': case 'ArrowRight':
            override = !KEYS.RIGHT;
            KEYS.RIGHT = true;
            break;
        case 'r':
            reset = true;
            break;
    }

    return {
        override,
        reset,
    };
}

function keyUp(event) {
    switch (event.key) {
        case 'w': case 'ArrowUp':
            KEYS.UP = false;
            break;
        case 'a': case 'ArrowLeft':
            KEYS.LEFT = false;
            break;
        case 's': case 'ArrowDown':
            KEYS.DOWN = false;
            break;
        case 'd': case 'ArrowRight':
            KEYS.RIGHT = false;
            break;
    }
}
