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

function drawAlien(canvas, x, y, elapsedTime) {
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