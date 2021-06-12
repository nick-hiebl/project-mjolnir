function resetPlayer(player, i, j) {
    player.i = i;
    player.j = j;
    player.fromI = i;
    player.fromJ = j;
    player.animTimeLeft = 0;
    player.winning = false;
}

function resetHammer(hammer, i, j, facing) {
    hammer.i = i;
    hammer.j = j;
    hammer.facing = facing;
    hammer.chain = [];
    hammer.links = 3;
    hammer.blasting = false;
    hammer.blastLength = 0;
}

function readLevelMap(levelData) {
    const level = {
        grid: [],
        background: loadImage(levelData.file_name),
        collectables: 0,
        doors: (levelData.doors || []).map(obj => Object.assign({}, obj)),
        buttons: (levelData.buttons || []).map(obj => Object.assign({}, obj)),
    };

    for (const row of levelData.level_string.split('\n')) {
        const thisRow = [];
        level.grid.push(thisRow);
        for (const char of row) {
            const blockType = parseInt(char, 10);
            thisRow.push(blockType);
            if (blockType == BLOCK.COLLECTABLE) {
                level.collectables++;
            }
        }
    }
    return level;
}

const LEVELS = [
    LEVEL_X,
    DUMMY_LEVEL,
    LEVEL_0,
];

function loadLevel(player, hammer, _number) {
    // resetPlayer(player, 2, 4);
    // resetHammer(hammer, 1, 4, 1);

    // return readLevelMap(LEVEL_STRING);

    const levelData = LEVELS[(_number % LEVELS.length) || 0];
    resetPlayer(player, levelData.player.i, levelData.player.j);
    resetHammer(hammer, levelData.hammer.i, levelData.hammer.j, levelData.hammer.facing);
    
    return readLevelMap(levelData);
}
