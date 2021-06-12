var canvas;
var level;

const BLOCK = {
    EMPTY: 0,
    SOLID: 1,
    DESTRUCTABOX: 2,
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
    return block == BLOCK.EMPTY;
}

function isBlastable(block) {
    return block != BLOCK.SOLID;
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
    if (!isWalkable(level.grid[player.i + di][player.j + dj])) {
        return;
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
                    level.grid[blastI][blastJ] = BLOCK.EMPTY;
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

    canvas.drawImage(level.background, 0, 0, 640, 512);

    // draw level
    for (let i = 0; i < level.grid.length; i++) {
        for (let j = 0; j < level.grid[i].length; j++) {
            if (level.grid[i][j] == BLOCK.DESTRUCTABOX) {
                canvas.color('purple');
                rectAt(i, j);
            }
        }
    }

    // draw hammer
    drawHammer(canvas, hammer);

    // draw player
    drawAlien(canvas, player.i, player.j, elapsedTime);
}

addSetup(setup);
