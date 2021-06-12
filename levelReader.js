const FILE_NAME = 'img/levels/level1.png';

const LEVEL_STRING = `1111111111111111
1111011111111111
1111011111111111
1111011111111111
1111011111131111
1111011111101111
1111011111101111
1111011111161111
1111000110001111
1111110110151111
1111110110121111
1111000110121111
1111010110121111
1111003000121111
1111111111121111
1111111111121111
1111111111101111
1111111111101111
1111111111101111
1111111111111111`;

const doors = [
    {
        id: 1,
        i: 9,
        j: 11,
    },
]

const buttons = [
    {
        id: 1,
        i: 7,
        j: 11,
    },
]
function resetPlayer(player, i, j) {
    player.i = i;
    player.j = j;
    player.fromI = i;
    player.fromJ = j;
    player.animTimeLeft = 0;
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

function readLevelMap(string) {
    const level = {
        grid: [],
        background: canvas.loadImage(FILE_NAME),
        collectables: 0,
        doors: [],
        buttons: [],
    };

    // TODO: Remove this when we move to JSON
    level.doors = doors
    level.buttons = buttons
    console.log(level.doors, level.buttons);
    for (const row of string.split('\n')) {
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

function loadLevel(player, hammer, _number) {
    resetPlayer(player, 2, 4);
    resetHammer(hammer, 1, 4, 1);
    
    return readLevelMap(LEVEL_STRING);
}
