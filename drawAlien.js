function drawAlien(canvas, player, elapsedTime) {
    const x = player.i;
    const y = player.j;

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