const WALK_DURATION = 300;
const WALK_FRAMES = 8;

const IMAGE_FILE_NAMES = {
    alien: 'img/alien.png',
    hammer: 'img/hammer.png',
    hammerSheet: 'img/hammersheet.png',
    alienIdle: 'img/alien-idle.png',
    alienUp: 'img/alien-up.png',
    alienDown: 'img/alien-down.png',
    alienLeft: 'img/alien-left.png',
    alienRight: 'img/alien-right.png',
    spaceBackground: 'img/Space_Background_3.png',
    spriteSheet: 'img/spritesheet.png',
};

const IMAGES = {};

const DIRECTIONS = [
    { i:  0, j: -1 },
    { i:  1, j:  0 },
    { i:  0, j:  1 },
    { i: -1, j:  0 },
];

const GRID_SCALE = 32;
const SHEET_SCALE = 32;

(() => {

var canvas;
var level;

const player = {
    i: 0,
    j: 0,
    fromI: 0,
    fromJ: 0,
    animTimeLeft: 0,
    winning: false,
};

const hammer = {
    i: 0,
    j: 0,
    facing: 0,
    chain: [],
    links: 3,
    blasting: false,
    blastLength: 0,
};

function samePos(a, b) {
    return a.i === b.i && a.j === b.j;
}

function isWalkable(i, j) {
    const block = level.grid[i][j];
    if (block == BLOCK.DOOR) {
        const door = findDoor(i,j);
        if (door.state == DOOR.CLOSED) {
            return false;
        } else {
            return true;
        }
    }
    return block == BLOCK.EMPTY || block == BLOCK.COLLECTABLE || block == BLOCK.BUTTON || block == BLOCK.EXIT;
}

function isBlastable(i,j) {
    const block = level.grid[i][j];
    if (block == BLOCK.DOOR) {
        const door = findDoor(i,j);
        if (door.state == DOOR.CLOSED) {
            return false;
        } else {
            return true;
        }
    }
    return block != BLOCK.SOLID
}

function isDestructable(i,j) {
    const block = level.grid[i][j];
    return block == BLOCK.DESTRUCTABOX || block == BLOCK.COLLECTABLE;
}

// The coordinates passed in here, are for the button. Finds the door associated with the button
function findDoor(i, j, actualLevel=level) {
    for (const door of actualLevel.doors) {
        if (door.i == i && door.j == j) {
            return door;
        }
    }
}

function findDoorById(id) {
    for (const door of level.doors) {
        if (door.id == id) {
            return door;
        }
    }
}

function findButton(i,j) {
    for (const button of level.buttons) {
        if (button.i == i && button.j == j) {
            return button;
        }
    }
}

function pickupCollectable(i,j) {
    level.grid[i][j] = BLOCK.EMPTY;
    level.collectables--;
}

function pressButtons() {
    // Check if player or hammer is on the button
    const activatedDoors = [];
    let result = findMatchingDoor(player.i, player.j)
    if (result) {
        activatedDoors.push(result);
    }
    result = findMatchingDoor(hammer.i, hammer.j)
    if (result) {
        activatedDoors.push(result);
    }
    for (const door of level.doors) {
        if (door.state == DOOR.OPEN) {
            let isCorrect = false;
            for (const activatedDoor of activatedDoors) {
                if (activatedDoor.i == door.i && activatedDoor.j == door.j) {
                    isCorrect = true;
                    break;
                }
            }
            if (!isCorrect) {
                door.state = DOOR.CLOSED;
            }
        }
    }
}

function findMatchingDoor(i,j) {
    const button = findButton(i,j);
    if (button != undefined) {
        const door = findDoorById(button.id);
        door.state = DOOR.OPEN;
        return { i: door.i, j: door.j }
    }
    return null;
}

function movePlayer(override=false) {
    if ((!override && player.animTimeLeft > 0) || player.winning) {
        return;
    }

    let di = 0;
    let dj = 0;

    if (KEYS.UP) {
        dj -= 1;
    } else if (KEYS.LEFT) {
        di -= 1;
    } else if (KEYS.DOWN) {
        dj += 1;
    } else if (KEYS.RIGHT) {
        di += 1;
    } else {
        return;
    }

    // check empty
    const targetBlock = level.grid[player.i + di][player.j + dj]
    if (!isWalkable(player.i + di, player.j + dj)) {
        return;
    } else if (targetBlock == BLOCK.COLLECTABLE) {
        pickupCollectable(player.i + di, player.j + dj);
    }

    const prevChain = hammer.chain[hammer.chain.length - 1] || hammer;

    if (!samePos(player, hammer)) {
        hammer.chain.push({
            i: player.i,
            j: player.j,
        });
    }

    player.fromI = player.i;
    player.fromJ = player.j;
    player.i += di;
    player.j += dj;
    player.animTimeLeft = WALK_DURATION;

    hammer.blasting = false;

    const isBackTracking =
        // Stepping onto previous chain square
        prevChain && samePos(player, prevChain);

    if (isBackTracking) {
        hammer.chain.pop();
        hammer.chain.pop();
    }

    //   0
    // 3   1
    //   2
    if (hammer.chain.length >= hammer.links) {
        const [oldest] = hammer.chain.splice(0, 1);

        const oldFacing = hammer.facing;

        for (const index in DIRECTIONS) {
            const { i, j } = DIRECTIONS[index];

            if (oldest.i - hammer.i === i && oldest.j - hammer.j === j) {
                hammer.facing = index;
                break;
            }
        }
        hammer.i = oldest.i;
        hammer.j = oldest.j;
        pressButtons();
        if (oldFacing != hammer.facing) {
            hammer.blasting = true;

            const { i: di, j: dj } = DIRECTIONS[hammer.facing];

            let m = 1;
            while (true) {
                const blastI = oldest.i - (di ) * (m + 1);
                const blastJ = oldest.j - (dj ) * (m + 1);

                if (isBlastable(blastI, blastJ)) {
                    if (isDestructable(blastI, blastJ)) {
                        level.grid[blastI][blastJ] = BLOCK.EMPTY;
                    }
                    m++;
                } else {
                    break;
                }
            }

            hammer.blastLength = m;
        }


    } else {
        pressButtons();
    }

    if (targetBlock == BLOCK.EXIT && level.collectables <= 0) {
        player.winning = true;
    }
}

let currentLevel = 0;

function setup() {
    window.addEventListener('keydown', (event) => {
        const override = keyDown(event);
        movePlayer(override);
    }, false);
    window.addEventListener('keyup', keyUp, false);

    canvas = new Canvas('canvas');

    for (const key in IMAGE_FILE_NAMES) {
        IMAGES[key] = loadImage(IMAGE_FILE_NAMES[key]);
    }

    level = loadLevel(player, hammer, 0);

    addUpdate(update);
}

function spriteAt(spriteIndex, i, j) {
    const spriteI = spriteIndex % 10;
    const spriteJ = Math.floor(spriteIndex / 10);
    canvas.drawFromSheet(
        IMAGES.spriteSheet,
        sx=SHEET_SCALE * spriteI,
        sy=SHEET_SCALE * spriteJ,
        sw=SHEET_SCALE,
        sh=SHEET_SCALE,
        dx=GRID_SCALE * i,
        dy=GRID_SCALE * j,
        dw=GRID_SCALE,
        dh=GRID_SCALE,
    );
}

const LOADING_TIME = 2000;
let isLoading = false;
let nextLevelTime = 0;

let previousState = null;

function update(elapsedTime) {
    // do stuff
    if (!isLoading) {
        movePlayer();
    }

    if (player.animTimeLeft <= 0 && player.winning && !isLoading) {
        isLoading = true;
        nextLevelTime = LOADING_TIME;
        previousState = {
            level: { ...level },
            player: { ...player },
            hammer: { ...hammer },
        };

        currentLevel++;

        level = loadLevel(player, hammer, currentLevel);
    }

    // draw
    drawBackground();

    if (isLoading) {
        nextLevelTime -= elapsedTime;
        if (nextLevelTime <= 0) {
            isLoading = false;
            nextLevelTime = 0;
            previousBg = null;
        }
        const offset = Math.round(lerp(0, -canvas.width, nextLevelTime / LOADING_TIME));

        const transitionPoint = Math.round(lerp(100, -100, nextLevelTime / LOADING_TIME));

        canvas.save();
        canvas.translate(offset, 0);
        draw(elapsedTime, previousState, Math.max(0, transitionPoint));
        canvas.restore();

        canvas.save();
        canvas.translate(offset + canvas.width, 0);
        draw(elapsedTime, { level, player, hammer }, Math.max(0, -transitionPoint));
        canvas.restore();
    } else {
        draw(elapsedTime, { level, player, hammer });
    }
}

function drawBackground() {
    // blank screen
    canvas.color('white');
    canvas.fillRect(0, 0, canvas.width, canvas.height);

    canvas.drawImage(IMAGES.spaceBackground, 0, 0);
}

function draw(elapsedTime, { level, player, hammer }, opacity = 100) {
    const bg = !!level.background;
    if (bg) {
        canvas.drawImage(level.background, 0, 0);
    }

    // draw level
    for (let i = 0; i < level.grid.length; i++) {
        for (let j = 0; j < level.grid[i].length; j++) {
            const blockType = level.grid[i][j];
            if (!bg) {
                if (blockType == BLOCK.SOLID) {
                    spriteAt(3, i, j);
                } else {
                    spriteAt(2, i, j);
                }
            }

            if (blockType == BLOCK.DESTRUCTABOX) {
                spriteAt(0, i, j);
            } else if (blockType == BLOCK.COLLECTABLE) {
                spriteAt(1, i, j);
            } else if (level.grid[i][j] == BLOCK.DOOR) {
                const door = findDoor(i, j, level);
                if (!door || door.state === DOOR.OPEN) {
                    spriteAt(6, i, j);
                } else {
                    spriteAt(5, i, j);
                }
            } else if (level.grid[i][j] == BLOCK.BUTTON) {
                spriteAt(4, i, j);
            } else if (level.grid[i][j] == BLOCK.EXIT) {
                spriteAt(7, i, j);
            }
        }
    }

    if (opacity !== 100) {
        canvas.opacity(opacity);
    }

    if (opacity > 0) {
        // draw hammer
        drawHammer(canvas, hammer, player);

        // draw player
        drawAlien(canvas, player, elapsedTime);
    }

    canvas.clearFilter();
}

addSetup(setup);

})();
