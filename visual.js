function Canvas(id) {
    this.cnv = document.querySelector('canvas#' + id);

    this.ctx = this.cnv.getContext('2d');
    this.width = this.cnv.width;
    this.height = this.cnv.height;

    this.resize = function(w, h) {
        this.width = w;
        this.height = h;

        this.cnv.setAttribute('width', w);
        this.cnv.setAttribute('height', h);
    }

    this.fillRect = function(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h);
    }

    this.strokeRect = function(x, y, w, h) {
        this.ctx.strokeRect(x, y, w, h);
    }

    this.fillCRect = function(x, y, w, h) {
        this.ctx.fillRect(x - w/2, y - h/2, w, h);
    }

    this.strokeCRect = function(x, y, w, h) {
        this.ctx.strokeRect(x - w/2, y - h/2, w, h);
    }

    this.fillArc = function(x, y, w, h, rotation, start, end) {
        this.ctx.beginPath();
        h = h || w;
        this.ctx.ellipse(x, y, w, h, rotation || 0,
            start || 0, end || 2 * Math.PI);
        this.ctx.fill();
    }

    this.fillSector = function(x, y, w, h, rotation, start, end) {
        this.ctx.beginPath();
        h = h || w;
        this.ctx.ellipse(x, y, w, h, rotation || 0,
            start || 0, end || 2 * Math.PI);
        this.ctx.lineTo(x, y);
        this.ctx.fill();
    }

    this.strokeArc = function(x, y, w, h, rotation, start, end) {
        this.ctx.beginPath();
        h = h || w;
        this.ctx.ellipse(x, y, w, h, rotation || 0,
            start || 0, end || 2 * Math.PI);
        this.ctx.stroke();
    }

    this.line = function(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    this.background = function() {
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    this.color = function(color) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
    }

    this.lineWidth = function(width) {
        this.ctx.lineWidth = width;
    }

    this.drawImage = function(image, dx, dy, dw, dh) {
        this.ctx.drawImage(
            image,
            dx,
            dy,
            dw || image.width,
            dh || image.height,
        );
    }

    this.drawFromSheet = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    this.save = function() {
        this.ctx.save();
    }

    this.restore = function() {
        this.ctx.restore();
    }

    this.translate = function(x, y) {
        this.ctx.translate(x, y);
    }

    this.rotate = function(a) {
        this.ctx.rotate(a);
    }

    this.opacity = function(opacity) {
        this.ctx.filter = `opacity(${opacity}%)`;
    }

    this.clearFilter = function() {
        this.ctx.filter = null;
    }
}

var SETUPS = [];
var UPDATES = [];

function beginLoop() {
    var frameId = 0;
    var lastFrame = Date.now();

    function loop() {
        var thisFrame = Date.now();
        var elapsed = thisFrame - lastFrame;

        frameId = window.requestAnimationFrame(loop);

        for (var u of UPDATES) {
            u(elapsed);
        }

        lastFrame = thisFrame;
    }

    loop();
}

function addUpdate(f) {
    UPDATES.push(f);
}

function addSetup(f) {
    SETUPS.push(f);
}

window.onload = function() {

    for (var s of SETUPS) {
        s();
    }

    beginLoop();
};

function loadImage(fileName, width=32, height=32) {
    const img = new Image();
    img.src = fileName;
    return img;
}
