function drawHammer(canvas, hammer, player) {
    const x = hammer.i;
    const y = hammer.j;
    const facing = hammer.facing;

    let prev = {
        i: hammer.i,
        j: hammer.j,
    };

    canvas.color('brown');
    canvas.lineWidth(GRID_SCALE*1/8);

    const animationFactor = player.animTimeLeft / WALK_DURATION;

    if (player.animTimeLeft && !samePos(hammer, from(hammer))) {
        const currI = lerp(hammer.fromI, hammer.i, animationFactor);
        const currJ = lerp(hammer.fromJ, hammer.j, animationFactor);
        canvas.line(
            (hammer.i + 0.5) * GRID_SCALE,
            (hammer.j + 0.5) * GRID_SCALE,
            (currI + 0.5) * GRID_SCALE,
            (currJ + 0.5) * GRID_SCALE,
        );
        canvas.fillArc(
            (hammer.i + 0.5) * GRID_SCALE,
            (hammer.j + 0.5) * GRID_SCALE,
            GRID_SCALE / 16,
            GRID_SCALE / 16,
        );
    }

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
        : lerp(player.fromI, player.i, hori(animationFactor));

    const currJ = player.fromJ === player.j
        ? player.fromJ
        : player.fromJ > player.j
            ? lerp(player.fromJ, player.j, slow(animationFactor))
            : lerp(player.fromJ, player.j, animationFactor);

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

        // draw blast chain
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

        // draw final square
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

        // draw base of hammer
        if (player.animTimeLeft && !samePos(hammer, from(hammer))) {
            const selectedHeight = lerp(1, 1.5, animationFactor);
            canvas.drawFromSheet(
                image=IMAGES.hammerSheet,
                sx=SHEET_SCALE * frameNo,
                sy=0,
                sw=SHEET_SCALE,
                sh=SHEET_SCALE * selectedHeight,
                dx=-GRID_SCALE / 2,
                dy=lerp(GRID_SCALE / 2, -GRID_SCALE / 2, animationFactor),
                dw=GRID_SCALE,
                dh=GRID_SCALE * selectedHeight,
            );
        } else {
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
        }

        // draw blast
        canvas.drawFromSheet(
            image=IMAGES.hammerSheet,
            sx=SHEET_SCALE * frameNo,
            sy=SHEET_SCALE * 2.75,
            sw=SHEET_SCALE,
            sh=SHEET_SCALE / 4,
            dx=-GRID_SCALE / 2,
            dy=(hammer.blastLength + 0.25) * GRID_SCALE,
            dw=GRID_SCALE,
            dh=GRID_SCALE / 4,
        );
    } else {
        if (player.animTimeLeft && !samePos(hammer, from(hammer))) {
            canvas.drawImage(
                IMAGES.hammer,
                -GRID_SCALE / 2,
                lerp(GRID_SCALE / 2, -GRID_SCALE / 2, animationFactor),
                GRID_SCALE,
                GRID_SCALE,
            );
        } else {
            canvas.drawImage(
                IMAGES.hammer,
                -GRID_SCALE / 2,
                -GRID_SCALE / 2,
                GRID_SCALE,
                GRID_SCALE,
            );
        }
    }
    
    canvas.restore();
}
