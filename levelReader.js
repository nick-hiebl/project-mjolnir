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
    hammer.fromI = i;
    hammer.fromJ = j;
    hammer.facing = facing;
    hammer.chain = [];
    hammer.links = 3;
    hammer.blasting = false;
    hammer.blastLength = 0;
}

function clone(obj) {
    return Object.assign({}, obj);
}

function readLevelMap(levelData) {
    const level = {
        grid: [],
        background: levelData.file_name ? loadImage(levelData.file_name) : null,
        collectables: 0,
        doors: (levelData.doors || []).map(clone),
        buttons: (levelData.buttons || []).map(clone),
        batteries: (levelData.batteries || []).map(clone),
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
    // Intro Levels
    LVL_INTRO_0,
    LVL_INTRO_1,
    LVL_INTRO_2,
    
    LVL_DESTRUCT_0,
    LVL_DESTRUCT_1,
    LVL_DESTRUCT_2,
    LVL_DESTRUCT_3,
    LVL_DESTRUCT_4,
    LVL_DESTRUCT_5,
    
    LVL_COLLECT_0,
    LVL_COLLECT_1,
    LVL_COLLECT_2,
    LVL_COLLECT_3,
    LVL_COLLECT_4,
    LVL_COLLECT_5,
    LVL_COLLECT_6,
    LVL_COLLECT_7,
    LVL_COLLECT_8,
    LVL_COLLECT_9,
    
    LVL_BATTERY_0,
    LVL_BATTERY_1,
    LVL_BATTERY_2,
    LVL_BATTERY_3,
    LVL_BATTERY_4,
    
    LVL_GLASS_0,
    LVL_GLASS_1,
    LVL_GLASS_2,
    LVL_GLASS_3,
    LVL_GLASS_4,
    LVL_GLASS_5,
    
    
    LVL_BUTTON_0,
    LVL_BUTTON_1,
    LVL_BUTTON_2,
    LVL_BUTTON_3,
    LVL_BUTTON_4,
    LVL_BUTTON_5,

    /// Development Levels
    //LVL_EMPTY,
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
