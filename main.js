var canvas;
var level;

const BLOCK = {
    EMPTY: 0,
    SOLID: 1,
}

const N = 12;

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

const KEYS = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false,
};

function keyDown(event) {
    // Only set override to true if putting key down for the first time
    let override = false;

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
    }

    doMovement(override);
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
    if (level.grid[player.i + di][player.j + dj] != BLOCK.EMPTY) {
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

                if (level.grid[blastI][blastJ] !== BLOCK.SOLID) {
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

    level = { grid: [] };

    for (let i = 0; i < N; i++) {
        level.grid.push([]);
        for (let j = 0; j < N; j++) {
            const isEdge = i == 0 || i == N-1 || j == 0 || j == N-1;
            level.grid[i].push(isEdge ? BLOCK.SOLID : BLOCK.EMPTY);
        }
    }

    player.i = Math.floor(N/2);
    player.j = Math.floor(N/2);
    player.fromI = player.i;
    player.fromJ = player.j;

    hammer.i = player.i;
    hammer.j = player.j;

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

function lerp(a, b, factor) {
    return a * factor + b * (1 - factor);
}

function tanh(x) {
    const maxi = Math.exp(x);
    const mini = 1 / maxi;
    return (maxi - mini) / (maxi + mini);
}

function slow(x) {
    const factor = 1/2 * tanh(4*x - 1.5)+1/2;
    return factor;
}

function hori(x) {
    return 1/2 * tanh(8*x - 2.25) + 1/2;
}

function drawHammer(x, y, facing) {
    let prev = {
        i: hammer.i,
        j: hammer.j,
    };

    canvas.color('brown');
    canvas.lineWidth(GRID_SCALE*1/8);
    for (let link of hammer.chain) {
        canvas.line(
            (prev.i + 0.5) * GRID_SCALE,
            (prev.j + 0.5) * GRID_SCALE,
            (link.i + 0.5) * GRID_SCALE,
            (link.j + 0.5) * GRID_SCALE,
        );
        prev.i = link.i;
        prev.j = link.j;
        canvas.fillArc(
            (prev.i + 0.5) * GRID_SCALE,
            (prev.j + 0.5) * GRID_SCALE,
            GRID_SCALE / 16,
            GRID_SCALE / 16,
        );
    }

    const currI = player.fromI === player.i
        ? player.fromI
        : lerp(player.fromI, player.i, hori(player.animTimeLeft / WALK_DURATION));

    const currJ = player.fromJ === player.j
        ? player.fromJ
        : player.fromJ > player.j
            ? lerp(player.fromJ, player.j, slow(player.animTimeLeft / WALK_DURATION))
            : lerp(player.fromJ, player.j, player.animTimeLeft / WALK_DURATION);

    if (currI != prev.i && currJ != prev.j) {
        canvas.line(
            (prev.i + 0.5) * GRID_SCALE,
            (prev.j + 0.5) * GRID_SCALE,
            (player.i + 0.5) * GRID_SCALE,
            (player.j + 0.5) * GRID_SCALE,
        );
        prev.i = player.i;
        prev.j = player.j;
        canvas.fillArc(
            (prev.i + 0.5) * GRID_SCALE,
            (prev.j + 0.5) * GRID_SCALE,
            GRID_SCALE / 16,
            GRID_SCALE / 16,
        );
    }

    canvas.line(
        (prev.i + 0.5) * GRID_SCALE,
        (prev.j + 0.5) * GRID_SCALE,
        (currI + 0.5) * GRID_SCALE,
        (currJ + 0.5) * GRID_SCALE,
    );

    canvas.color('grey');
    canvas.save();
    canvas.translate((x + 0.5) * GRID_SCALE, (y + 0.5) * GRID_SCALE);
    canvas.rotate(facing * Math.PI / 2);
    if (hammer.blasting) {
        const frameNo = 4 + Math.floor((Date.now() % 256) / 64);

        canvas.drawFromSheet(
            image=IMAGES.hammerSheet,
            sx=SHEET_SCALE * frameNo,
            sy=0,
            sw=SHEET_SCALE,
            sh=SHEET_SCALE * 1.5,
            dx=-GRID_SCALE / 2,
            dy=-GRID_SCALE / 2,
            dw=GRID_SCALE,
            dh=GRID_SCALE * 1.5,
        );

        for (let iii = 1; iii < hammer.blastLength; iii++) {
            canvas.drawFromSheet(
                image=IMAGES.hammerSheet,
                sx=SHEET_SCALE * frameNo,
                sy=SHEET_SCALE * 1.5,
                sw=SHEET_SCALE,
                sh=SHEET_SCALE,
                dx=-GRID_SCALE / 2,
                dy=iii * GRID_SCALE,
                dw=GRID_SCALE,
                dh=GRID_SCALE,
            );
        }

        canvas.drawFromSheet(
            image=IMAGES.hammerSheet,
            sx=SHEET_SCALE * frameNo,
            sy=SHEET_SCALE * 2.5,
            sw=SHEET_SCALE,
            sh=SHEET_SCALE / 2,
            dx=-GRID_SCALE / 2,
            dy=hammer.blastLength * GRID_SCALE,
            dw=GRID_SCALE,
            dh=GRID_SCALE / 2,
        );
    } else {
        canvas.drawImage(
            IMAGES.hammer,
            -GRID_SCALE / 2,
            - GRID_SCALE / 2,
            GRID_SCALE,
            GRID_SCALE,
        );
    }
    
    canvas.restore();
}

function drawAlien(x, y, elapsedTime) {
    if (player.animTimeLeft > 0) {
        player.animTimeLeft -= elapsedTime;
        const frameNo = Math.floor((WALK_DURATION - player.animTimeLeft) / WALK_DURATION * WALK_FRAMES);

        if (player.j < player.fromJ) {
            canvas.drawFromSheet(
                image=IMAGES.alienUp,
                sx=SHEET_SCALE * frameNo,
                sy=0,
                sw=SHEET_SCALE,
                sh=SHEET_SCALE * 2,
                dx=x * GRID_SCALE,
                dy=y * GRID_SCALE,
                dw=GRID_SCALE,
                dh=GRID_SCALE * 2,
            );
        } else if (player.j > player.fromJ) {
            canvas.drawFromSheet(
                image=IMAGES.alienDown,
                sx=SHEET_SCALE * frameNo,
                sy=0,
                sw=SHEET_SCALE,
                sh=SHEET_SCALE * 2,
                dx=x * GRID_SCALE,
                dy=(y - 1) * GRID_SCALE,
                dw=GRID_SCALE,
                dh=GRID_SCALE * 2,
            );
        } else if (player.i > player.fromI) {
            canvas.drawFromSheet(
                image=IMAGES.alienRight,
                sx=SHEET_SCALE * 2 * frameNo,
                sy=0,
                sw=SHEET_SCALE * 2,
                sh=SHEET_SCALE,
                dx=(x - 1) * GRID_SCALE,
                dy=y * GRID_SCALE,
                dw=GRID_SCALE * 2,
                dh=GRID_SCALE,
            );
        }  else if (player.i < player.fromI) {
            canvas.drawFromSheet(
                image=IMAGES.alienLeft,
                sx=SHEET_SCALE * 2 * frameNo,
                sy=0,
                sw=SHEET_SCALE * 2,
                sh=SHEET_SCALE,
                dx=x * GRID_SCALE,
                dy=y * GRID_SCALE,
                dw=GRID_SCALE * 2,
                dh=GRID_SCALE,
            );
        }
    } else {
        const frames = 4;
        const rate = 200;
        const frameNo = Math.floor(Date.now() / rate) % frames;

        player.animTimeLeft = 0;
        player.fromI = player.i;
        player.fromJ = player.j;

        canvas.drawFromSheet(
            image=IMAGES.alienIdle,
            sx=SHEET_SCALE * frameNo,
            sy=0,
            sw=SHEET_SCALE,
            sh=SHEET_SCALE,
            dx=x * GRID_SCALE,
            dy=y * GRID_SCALE,
            dw=GRID_SCALE,
            dh=GRID_SCALE,
        );
    }
}

function update(elapsedTime) {
    // do stuff
    doMovement();

    // draw
    draw(elapsedTime);
}

function draw(elapsedTime) {
    // draw level
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            switch (level.grid[i][j]) {
                case BLOCK.SOLID:
                    canvas.color('black');
                    break;
                case BLOCK.EMPTY:
                    canvas.color('white');
                    break;
            }
            rectAt(i, j);
        }
    }

    for (let i = 0; i < N; i++) {
        canvas.color('hsla(0, 0%, 0%, 0.1)');
        canvas.line(i * GRID_SCALE, 0, i * GRID_SCALE, N * GRID_SCALE);
        canvas.line(0, i * GRID_SCALE, N * GRID_SCALE, i * GRID_SCALE);
    }

    // draw hammer
    drawHammer(hammer.i, hammer.j, hammer.facing);

    // draw player
    drawAlien(player.i, player.j, elapsedTime);
}

addSetup(setup);
