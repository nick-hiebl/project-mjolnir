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
    backgroundStars: 'img/background/stars.png',
    backgroundNebula: 'img/background/nebula.png',
    backgroundDust: 'img/background/dust.png',
    backgroundPlanet: 'img/background/planet.png',
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
var trueCanvas;
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
        const door = findItem(i, j, level.doors);
        return door.state == DOOR.OPEN;
    }
    return block == BLOCK.EMPTY || block == BLOCK.COLLECTABLE || block == BLOCK.BUTTON || block == BLOCK.EXIT || block == BLOCK.BATTERY;
}

function isBlastable(i,j) {
    const block = level.grid[i][j];
    if (block == BLOCK.DOOR) {
        const door = findItem(i, j, level.doors);
        return door.state == DOOR.OPEN;
    }
    return block != BLOCK.SOLID;
}

function isDestructable(i, j) {
    const block = level.grid[i][j];
    return block == BLOCK.DESTRUCTABOX || block == BLOCK.COLLECTABLE;
}

function tryPowering(i, j) {
    const block = level.grid[i][j];

    if (block == BLOCK.BATTERY) {
        const battery = findItem(i, j, level.batteries);
        battery.powered = true;

        if (battery.id) {
            const doors = level.doors.filter(door => door.id == battery.id);
            for (const door of doors) {
                door.state = DOOR.OPEN;
            }
        }
    }
}

function findItem(i, j, list) {
    return list.find(item => item.i == i && item.j == j);
}

function findById(id, list) {
    return list.find(item => item.id == id);
}

function pickupCollectable(i,j) {
    level.grid[i][j] = BLOCK.EMPTY;
    level.collectables--;
}

function pressButtons() {
    // Check if player or hammer is on the button
    const activatedDoors = [];
    activatedDoors.push(...findMatchingDoors(player.i, player.j));
    activatedDoors.push(...findMatchingDoors(hammer.i, hammer.j));

    for (const door of level.doors) {
        if (samePos(hammer, door)) {
            door.state = DOOR.OPEN;
        } else if (door.state == DOOR.OPEN) {
            // Check if this door is opened by a powered battery
            const battery = findById(door.id, level.batteries)
            if (battery && battery.powered) {
                continue;
            }

            // Check if player is sitting on the door
            if (samePos(player, door)) {
                continue;
            }

            let isCorrect = false;

            // Check if this is one of the doors being opened by button currently
            for (const activatedDoor of activatedDoors) {
                if (samePos(door, activatedDoor)) {
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

function findMatchingDoors(i,j) {
    const button = findItem(i, j, level.buttons);
    if (button) {
        const doors = level.doors.filter(door => door.id == button.id);
        doors.forEach(door => {
            door.state = DOOR.OPEN;
        });
        return doors;
    }
    return [];
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

            let m = 0;
            while (true) {
                const blastI = oldest.i - (di ) * (m + 1);
                const blastJ = oldest.j - (dj ) * (m + 1);

                if (isBlastable(blastI, blastJ)) {
                    if (isDestructable(blastI, blastJ)) {
                        level.grid[blastI][blastJ] = BLOCK.EMPTY;
                    }
                    tryPowering(blastI, blastJ);

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

function getHiddenCanvas(width, height) {
    if (window.OffscreenCanvas) {
        return new Canvas(new OffscreenCanvas(width, height));
    } else {
        const element = document.createElement('canvas');
        element.width = width;
        element.height = height;
        return new Canvas(element);
    }
}

function setup() {
    window.addEventListener('keydown', (event) => {
        const { override, reset, next } = keyDown(event);

        if (next) {
            nextLevel();
        } else if (reset) {
            level = loadLevel(player, hammer, currentLevel);
        } else {
            movePlayer(override);
        }
    }, false);
    window.addEventListener('keyup', keyUp, false);

    trueCanvas = new Canvas('canvas');
    canvas = getHiddenCanvas(trueCanvas.width, trueCanvas.height);

    for (const key in IMAGE_FILE_NAMES) {
        const fileName = IMAGE_FILE_NAMES[key];
        if (fileName.includes('/background/')) {
            IMAGES[key] = canvas.loadPattern(fileName);
        } else {
            IMAGES[key] = loadImage(fileName);
        }
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
let bgOffset = 0;

let backgroundFrame = 0;

function nextLevel() {
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

function update(elapsedTime) {
    backgroundFrame += elapsedTime * .1;

    // do stuff
    if (!isLoading) {
        movePlayer();
    }

    if (player.animTimeLeft <= 0 && player.winning && !isLoading) {
        nextLevel();
    }

    if (isLoading) {
        nextLevelTime -= elapsedTime;
        const offset = Math.round(lerp(0, -canvas.width, nextLevelTime / LOADING_TIME));

        drawBackground(bgOffset + offset / 10);

        const transitionPoint = Math.round(lerp(100, -100, nextLevelTime / LOADING_TIME));

        canvas.save();
        canvas.translate(offset, 0);
        draw(elapsedTime, previousState, Math.max(0, transitionPoint));
        canvas.restore();

        canvas.save();
        canvas.translate(offset + canvas.width, 0);
        draw(elapsedTime, { level, player, hammer }, Math.max(0, -transitionPoint));
        canvas.restore();

        if (nextLevelTime <= 0) {
            isLoading = false;
            nextLevelTime = 0;
            previousBg = null;
            bgOffset = bgOffset + offset / 10;
        }
    } else {
        // draw
        drawBackground(bgOffset);
        // canvas.wipe();

        draw(elapsedTime, { level, player, hammer });
    }

    trueCanvas.ctx.clearRect(0, 0, 640, 512);
    trueCanvas.drawImage(canvas.cnv, 0, 0);
}


function drawBackground(offset) {
    // blank screen
    canvas.color('white');
    canvas.fillRect(0, 0, canvas.width, canvas.height);

    canvas.drawTiledImage(IMAGES.backgroundStars, Math.round(offset/10), 0);

    canvas.opacity(80);
    canvas.drawTiledImage(
        IMAGES.backgroundNebula,
        backgroundFrame/80 + Math.round(offset/5),
        0,
    );
    canvas.opacity(100);

    canvas.drawTiledImage(
        IMAGES.backgroundPlanet,
        backgroundFrame/10 + Math.round(offset/3),
        -backgroundFrame/100,
    );

    canvas.opacity(90);
    canvas.drawTiledImage(
        IMAGES.backgroundDust,
        500 + backgroundFrame/8 + Math.round(offset/1.5),
        (backgroundFrame)/300 + 120 * Math.sin(backgroundFrame * 0.0002),
    );
    canvas.opacity(100);
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
                if (blockType != BLOCK.SOLID) {
                    spriteAt(2, i, j);
                }
            }

            if (blockType == BLOCK.DESTRUCTABOX) {
                if (j <= player.j) {
                    spriteAt(10, i, j-1);
                    spriteAt(20, i, j);
                }
            } else if (blockType == BLOCK.COLLECTABLE) {
                spriteAt(12 + TOOL_KEY[i][j], i, j);
            } else if (level.grid[i][j] == BLOCK.DOOR) {
                const door = findItem(i, j, level.doors);
                if (!door || door.state === DOOR.OPEN) {
                    spriteAt(6, i, j);
                } else if (j <= player.j) {
                    spriteAt(11, i, j-1);
                    spriteAt(21, i, j);
                }
            } else if (level.grid[i][j] == BLOCK.BATTERY) {
                const battery = findItem(i, j, level.batteries);
                if (!battery || battery.powered) {
                    spriteAt(9, i, j);
                } else {
                    spriteAt(8, i, j);
                }
            } else if (level.grid[i][j] == BLOCK.BUTTON) {
                spriteAt(4, i, j);
            } else if (level.grid[i][j] == BLOCK.EXIT) {
                if (level.collectables > 0) {
                    spriteAt(7, i, j);
                } else {
                    spriteAt(17, i, j);
                }
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

    canvas.opacity(100);

    for (let i = 0; i < level.grid.length; i++) {
        for (let j = player.j + 1; j < level.grid[i].length; j++) {
            const blockType = level.grid[i][j];
            if (blockType == BLOCK.DESTRUCTABOX) {
                spriteAt(10, i, j-1);
                spriteAt(20, i, j);
            } else if (level.grid[i][j] == BLOCK.DOOR) {
                const door = findItem(i, j, level.doors);
                if (door && door.state === DOOR.CLOSED) {
                    spriteAt(11, i, j-1);
                    spriteAt(21, i, j);
                }
            }
        }
    }
}

addSetup(setup);

})();
