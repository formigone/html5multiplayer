var Fruit = function (x, y, color_hex, width, height) {
    this.color = color_hex;
    this.x = x;
    this.y = y;
    this.width = width || 16;
    this.height = height || 16;
};

module.exports = Fruit;
