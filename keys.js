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
    let next = false;
    let previous = false;

    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
        case 'w':
            override = !KEYS.UP;
            KEYS.UP = true;
            break;
        case 'ArrowLeft':
            event.preventDefault();
        case 'a':
            override = !KEYS.LEFT;
            KEYS.LEFT = true;
            break;
        case 'ArrowDown':
            event.preventDefault();
        case 's':
            override = !KEYS.DOWN;
            KEYS.DOWN = true;
            break;
        case 'ArrowRight':
            event.preventDefault();
        case 'd':
            override = !KEYS.RIGHT;
            KEYS.RIGHT = true;
            break;
        case 'r':
            reset = true;
            break;
        case 'n':
            next = true;
            break;
        case 'p':
            previous = true;
            break;
    }

    return {
        override,
        reset,
        next,
        previous,
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
