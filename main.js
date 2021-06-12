var canvas;
var level;

const BLOCK = {
    EMPTY: 0,
    SOLID: 1,
    DESTRUCTABOX: 2,
    COLLECTABLE: 3,
    DOOR_OPEN: 4,
    DOOR_CLOSED: 5,
    BUTTON: 6,
};

const player = {
    i: 0,
    j: 0,
    fromI: 0,
    fromJ: 0,
    animTimeLeft: 0,
};

const WALK_DURATION = 300;
const WALK_FRAMES = 8;

const hammer = {
    i: 0,
    j: 0,
    facing: 0,
    chain: [],
    links: 3,
    blasting: false,
    blastLength: 0,
};

const IMAGES = {};

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

const DIRECTIONS = [
    { i:  0, j: -1 },
    { i:  1, j:  0 },
    { i:  0, j:  1 },
    { i: -1, j:  0 },
]

function samePos(a, b) {
    return a.i === b.i && a.j === b.j;
}

function isWalkable(block) {
    return block == BLOCK.EMPTY || block == BLOCK.COLLECTABLE || block == BLOCK.DOOR_OPEN || block == BLOCK.BUTTON;
}

function isBlastable(block) {
    return block != BLOCK.SOLID && block != BLOCK.DOOR_CLOSED;
}

function isDestructable(block) {
    return block == BLOCK.DESTRUCTABOX || block == BLOCK.COLLECTABLE;
}

// The coordinates passed in here, are for the button. Finds the door associated with the button
function findDoor(i,j) {
    for (const button of level.buttons) {
        if (button.i == i && button.j == j) {
            const doorId = button.id;
            console.log("doorID:" , doorId);
            for( const door of level.doors) {
                if (door.id == doorId) {
                    console.log("DOOR:", door);
                    return door;
                }
            }
        }
    }

}

function doCollect(i,j) {
    level.grid[i][j] = BLOCK.EMPTY;
}
function doMovement(override=false) {
    if (!override && player.animTimeLeft > 0) {
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
    if (!isWalkable(targetBlock)) {
        return;
    } else if (targetBlock == BLOCK.COLLECTABLE) {
        doCollect(player.i + di, player.j + dj);
    } else if (targetBlock == BLOCK.BUTTON) {
        const toOpen = findDoor(player.i+di, player.j+dj);
        level.grid[toOpen.i][toOpen.j] = BLOCK.DOOR_OPEN;
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

        if (oldFacing != hammer.facing) {
            hammer.blasting = true;

            const { i: di, j: dj } = DIRECTIONS[hammer.facing];

            let m = 1;
            while (true) {
                const blastI = hammer.i - di * m;
                const blastJ = hammer.j - dj * m;

                if (isBlastable(level.grid[blastI][blastJ])) {
                    if (isDestructable(level.grid[blastI][blastJ])) {
                        level.grid[blastI][blastJ] = BLOCK.EMPTY;
                    }
                    m++;
                } else {
                    break;
                }
            }

            hammer.blastLength = m;
        }

        hammer.i = oldest.i;
        hammer.j = oldest.j;
    }
}

function setup() {
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    canvas = new Canvas('canvas');

    for (const key in IMAGE_FILE_NAMES) {
        IMAGES[key] = canvas.loadImage(IMAGE_FILE_NAMES[key]);
    }

    level = loadLevel(player, hammer, 0);

    addUpdate(update);
}

const GRID_SCALE = 32;

function rectAt(x, y) {
    canvas.fillRect(
        x * GRID_SCALE, y * GRID_SCALE, GRID_SCALE, GRID_SCALE,
    );
}


function imageAt(image, x, y) {
    canvas.drawImage(
        image,
        x * GRID_SCALE,
        y * GRID_SCALE,
        GRID_SCALE,
        GRID_SCALE,
    );
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

const SHEET_SCALE = 32;

function update(elapsedTime) {
    // do stuff
    doMovement();

    // draw
    draw(elapsedTime);
}

function draw(elapsedTime) {
    // blank screen
    canvas.color('white');
    canvas.fillRect(0, 0, canvas.width, canvas.height);

    canvas.drawImage(IMAGES.spaceBackground, 0, 0);

    const bg = !!level.background;
    if (bg) {
        canvas.drawImage(level.background, 0, 0, 640, 512);
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
            } else if (level.grid[i][j] == BLOCK.DOOR_CLOSED) {
                canvas.color('red');
                rectAt(i,j);
            } else if (level.grid[i][j] == BLOCK.DOOR_OPEN) {
                canvas.color('green');
                rectAt(i,j);
            } else if (level.grid[i][j] == BLOCK.BUTTON) {
                canvas.color('blue');
                rectAt(i,j);
            } 
        }
    }

    // draw hammer
    drawHammer(canvas, hammer);

    // draw player
    drawAlien(canvas, player.i, player.j, elapsedTime);
}

addSetup(setup);
