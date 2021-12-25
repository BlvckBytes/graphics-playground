/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/block.ts":
/*!**************************!*\
  !*** ./scripts/block.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var matrix_1 = __importDefault(__webpack_require__(/*! ./matrix */ "./scripts/matrix.ts"));
var vector_1 = __importDefault(__webpack_require__(/*! ./vector */ "./scripts/vector.ts"));
var Block = /** @class */ (function () {
    function Block(loc, sz) {
        this.loc = loc;
        this.sz = sz;
        // Starting off with no rotation
        this.rot = new vector_1.default(0, 0, 0);
    }
    /**
     * Rotate this block around all three of it's axies
     * where the center is used as the origin
     * @param rads Angles in radients
     * @param override Wheter to add to previous stare or override
     */
    Block.prototype.rotate = function (rads, override) {
        if (override === void 0) { override = false; }
        if (override)
            this.rot = rads;
        else
            this.rot.add(rads);
    };
    /**
     * Move this block around by the given distances
     * @param steps Steps per axis
     */
    Block.prototype.move = function (steps) {
        this.loc.add(steps);
    };
    /**
     * Apply all rotations from current state on a list of points
     * @param points List of points to transform
     * @returns New list of points
     */
    Block.prototype.applyRotations = function (points) {
        var res = [];
        for (var i = 0; i < points.length; i += 1) {
            // Matrix which represents the point's location as a
            // vector starting at (0, 0, 0)
            var mat = (points[i]).clone().sub(this.loc).toMatrix();
            // Apply rotations
            mat = matrix_1.default.mul(matrix_1.default.Rx(this.rot.x), mat);
            mat = matrix_1.default.mul(matrix_1.default.Ry(this.rot.y), mat);
            mat = matrix_1.default.mul(matrix_1.default.Rz(this.rot.z), mat);
            // Push resulting matrix as a vector
            // Shift this vector back into the local center
            res.push(new vector_1.default(mat[0][0], mat[1][0], mat[2][0]).add(this.loc));
        }
        return res;
    };
    /**
     * Collapse this block's state down into points and lines
     * @returns Information to be drawn on screen
     */
    Block.prototype.draw = function () {
        var points = this.applyRotations([
            // "Front" face, clockwise, starting top right
            new vector_1.default(this.loc.x - this.sz.x / 2, this.loc.y + this.sz.y / 2, this.loc.z - this.sz.z / 2),
            new vector_1.default(this.loc.x + this.sz.x / 2, this.loc.y + this.sz.y / 2, this.loc.z - this.sz.z / 2),
            new vector_1.default(this.loc.x + this.sz.x / 2, this.loc.y - this.sz.y / 2, this.loc.z - this.sz.z / 2),
            new vector_1.default(this.loc.x - this.sz.x / 2, this.loc.y - this.sz.y / 2, this.loc.z - this.sz.z / 2),
            // "Back" face, cszkwise, starting top right
            new vector_1.default(this.loc.x - this.sz.x / 2, this.loc.y + this.sz.y / 2, this.loc.z + this.sz.z / 2),
            new vector_1.default(this.loc.x + this.sz.x / 2, this.loc.y + this.sz.y / 2, this.loc.z + this.sz.z / 2),
            new vector_1.default(this.loc.x + this.sz.x / 2, this.loc.y - this.sz.y / 2, this.loc.z + this.sz.z / 2),
            new vector_1.default(this.loc.x - this.sz.x / 2, this.loc.y - this.sz.y / 2, this.loc.z + this.sz.z / 2),
        ]);
        // Connect up all points with lines
        var lines = [];
        for (var i = 0; i < 4; i += 1) {
            lines.push([points[i], points[(i + 1) % 4]]);
            lines.push([points[i + 4], points[(i + 1) % 4 + 4]]);
            lines.push([points[i], points[(i + 4)]]);
        }
        return { points: points, lines: lines };
    };
    return Block;
}());
exports["default"] = Block;


/***/ }),

/***/ "./scripts/color.ts":
/*!**************************!*\
  !*** ./scripts/color.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Color;
(function (Color) {
    Color["WHITE"] = "#F7F7F7";
    Color["BLACK"] = "#141414";
    Color["BLUE"] = "#5393EB";
    Color["RED"] = "#F45353";
    Color["GREEN"] = "#9ADD3E";
})(Color || (Color = {}));
exports["default"] = Color;


/***/ }),

/***/ "./scripts/main.ts":
/*!*************************!*\
  !*** ./scripts/main.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var screen_1 = __importDefault(__webpack_require__(/*! ./screen */ "./scripts/screen.ts"));
window.onload = function () {
    // Create screen based on element #cv
    var scr = new screen_1.default('cv');
    // Update at 60 FPS
    setInterval(function () { return scr.update(); }, 1 / 60);
};


/***/ }),

/***/ "./scripts/matrix.ts":
/*!***************************!*\
  !*** ./scripts/matrix.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Matrix = /** @class */ (function () {
    function Matrix() {
    }
    /**
     * Multiply two matrices together (cross product)
     * @param a Matrix A
     * @param b Matrix B
     * @returns Resulting matrix
     */
    Matrix.mul = function (a, b) {
        var aR = a.length;
        var aC = a[0].length;
        var bC = b[0].length;
        var res = new Array(aR);
        // For all rows of A
        for (var r = 0; r < aR; r += 1) {
            res[r] = new Array(bC); // Init array
            // For all columns of B
            for (var c = 0; c < bC; c += 1) {
                res[r][c] = 0; // Init slot
                // For all columns of A
                for (var i = 0; i < aC; i += 1)
                    res[r][c] += a[r][i] * b[i][c]; // Multiply and store
            }
        }
        return res;
    };
    // Rotate around the x-axis
    Matrix.Rx = function (a) { return [
        [1, 0, 0],
        [0, Math.cos(a), -Math.sin(a)],
        [0, Math.sin(a), Math.cos(a)],
    ]; };
    // Rotate around the y-axis
    Matrix.Ry = function (a) { return [
        [Math.cos(a), 0, Math.sin(a)],
        [0, 1, 0],
        [-Math.sin(a), 0, Math.cos(a)],
    ]; };
    // Rotate around the z-axis
    Matrix.Rz = function (a) { return [
        [Math.cos(a), -Math.sin(a), 0],
        [Math.sin(a), Math.cos(a), 0],
        [0, 0, 1],
    ]; };
    return Matrix;
}());
exports["default"] = Matrix;


/***/ }),

/***/ "./scripts/screen.ts":
/*!***************************!*\
  !*** ./scripts/screen.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var block_1 = __importDefault(__webpack_require__(/*! ./block */ "./scripts/block.ts"));
var color_1 = __importDefault(__webpack_require__(/*! ./color */ "./scripts/color.ts"));
var vector_1 = __importDefault(__webpack_require__(/*! ./vector */ "./scripts/vector.ts"));
var Screen = /** @class */ (function () {
    function Screen(identifier) {
        var _a;
        this.cvSz = new vector_1.default(0, 0);
        // Canvas appearance
        this.bg = color_1.default.BLACK;
        this.pointSz = 8;
        this.lineSz = 2;
        this.blocks = [];
        // Find target context from element-id
        var target = (_a = document.getElementById(identifier)) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (target === null)
            throw new Error("Could not find target canvas identified by #".concat(identifier));
        this.ctx = target;
        this.resizeCanvas();
        // Create test block
        this.blocks.push(new block_1.default(new vector_1.default(this.cvSz.x / 2, this.cvSz.y / 2, 0), new vector_1.default(100, 200, 100)));
    }
    /**
     * Resize the canvas to be as big as the browser
     * window allows (fullscreen)
     */
    Screen.prototype.resizeCanvas = function () {
        this.cvSz.x = window.innerWidth;
        this.cvSz.y = window.innerHeight;
        this.ctx.canvas.width = this.cvSz.x;
        this.ctx.canvas.height = this.cvSz.y;
    };
    Screen.prototype.project = function (v) {
        return v;
    };
    /**
     * Draw a point on the screen
     * @param loc Location of the center of the point
     * @param color Color of the point
     * @param fill Whether or not to fill this point
     */
    Screen.prototype.drawPoint = function (loc, color, fill) {
        if (fill === void 0) { fill = true; }
        this.ctx.save();
        this.ctx.fillStyle = fill ? color : '';
        this.ctx.strokeStyle = fill ? '' : color;
        this.ctx.lineWidth = this.lineSz;
        this.ctx.beginPath();
        this.ctx.arc(loc.x, loc.y, this.pointSz, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    };
    /**
     * Draw a line connecting two points on the screen
     * @param a Location of the start of the line
     * @param b Location of the end of the line
     * @param color Color of the line
     */
    Screen.prototype.drawLine = function (a, b, color) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.lineSz;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.stroke();
        this.ctx.restore();
    };
    /**
     * Clear the whole canvas
     */
    Screen.prototype.clear = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.bg;
        this.ctx.rect(0, 0, this.cvSz.x, this.cvSz.y);
        this.ctx.fill();
    };
    /**
     * Draw next frame
     */
    Screen.prototype.update = function () {
        this.clear();
        // Draw all blocks
        for (var i = 0; i < this.blocks.length; i += 1) {
            var info = this.blocks[i].draw();
            this.blocks[i].rotate(new vector_1.default(0.01, 0.01, 0.01));
            // Draw all points of this block
            for (var j = 0; j < info.points.length; j += 1)
                this.drawPoint(this.project(info.points[j]), color_1.default.RED, false);
            // Draw all lines of this block
            for (var j = 0; j < info.lines.length; j += 1) {
                var _a = info.lines[j], a = _a[0], b = _a[1];
                this.drawLine(this.project(a), this.project(b), color_1.default.WHITE);
            }
        }
    };
    return Screen;
}());
exports["default"] = Screen;


/***/ }),

/***/ "./scripts/vector.ts":
/*!***************************!*\
  !*** ./scripts/vector.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Vector = /** @class */ (function () {
    function Vector(x, y, z) {
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Add another vector in place
     * @param v Vector to add
     * @returns Self
     */
    Vector.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    };
    /**
     * Subtract another vector in place
     * @param v Vector to subtract
     * @returns Self
     */
    Vector.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    };
    /**
     * Multiply another vector in place
     * @param v Vector to multiply
     * @returns Self
     */
    Vector.prototype.mult = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    };
    /**
     * Get the matrix representation of this vector
     */
    Vector.prototype.toMatrix = function () {
        return [[this.x], [this.y], [this.z]];
    };
    /**
     * Create a carbon copy of this vector
     */
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y, this.z);
    };
    /**
     * Get the string representation of this vector's coordinates
     */
    Vector.prototype.stringify = function () {
        return "(".concat(this.x, ", ").concat(this.y, ", ").concat(this.z, ")");
    };
    return Vector;
}());
exports["default"] = Vector;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./scripts/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlGLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5RixJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFOUYsNENBQTRDO1lBQzVDLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFH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QUM7Ozs7Ozs7O1VDL0REO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib3VuY2luZy1jdWJlcy8uL3NjcmlwdHMvYmxvY2sudHMiLCJ3ZWJwYWNrOi8vYm91bmNpbmctY3ViZXMvLi9zY3JpcHRzL2NvbG9yLnRzIiwid2VicGFjazovL2JvdW5jaW5nLWN1YmVzLy4vc2NyaXB0cy9tYWluLnRzIiwid2VicGFjazovL2JvdW5jaW5nLWN1YmVzLy4vc2NyaXB0cy9tYXRyaXgudHMiLCJ3ZWJwYWNrOi8vYm91bmNpbmctY3ViZXMvLi9zY3JpcHRzL3NjcmVlbi50cyIsIndlYnBhY2s6Ly9ib3VuY2luZy1jdWJlcy8uL3NjcmlwdHMvdmVjdG9yLnRzIiwid2VicGFjazovL2JvdW5jaW5nLWN1YmVzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JvdW5jaW5nLWN1YmVzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYm91bmNpbmctY3ViZXMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JvdW5jaW5nLWN1YmVzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSURyYXdhYmxlIGZyb20gJy4vZHJhd2FibGUnO1xuaW1wb3J0IE1hdHJpeCBmcm9tICcuL21hdHJpeCc7XG5pbXBvcnQgVmVjdG9yIGZyb20gJy4vdmVjdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxvY2sge1xuXG4gIHJvdDogVmVjdG9yO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBsb2M6IFZlY3RvcixcbiAgICBwdWJsaWMgc3o6IFZlY3RvcixcbiAgKSB7XG4gICAgLy8gU3RhcnRpbmcgb2ZmIHdpdGggbm8gcm90YXRpb25cbiAgICB0aGlzLnJvdCA9IG5ldyBWZWN0b3IoMCwgMCwgMCk7XG4gIH1cblxuICAvKipcbiAgICogUm90YXRlIHRoaXMgYmxvY2sgYXJvdW5kIGFsbCB0aHJlZSBvZiBpdCdzIGF4aWVzXG4gICAqIHdoZXJlIHRoZSBjZW50ZXIgaXMgdXNlZCBhcyB0aGUgb3JpZ2luXG4gICAqIEBwYXJhbSByYWRzIEFuZ2xlcyBpbiByYWRpZW50c1xuICAgKiBAcGFyYW0gb3ZlcnJpZGUgV2hldGVyIHRvIGFkZCB0byBwcmV2aW91cyBzdGFyZSBvciBvdmVycmlkZVxuICAgKi9cbiAgcm90YXRlKHJhZHM6IFZlY3Rvciwgb3ZlcnJpZGUgPSBmYWxzZSkge1xuICAgIGlmIChvdmVycmlkZSlcbiAgICAgIHRoaXMucm90ID0gcmFkcztcbiAgICBlbHNlXG4gICAgICB0aGlzLnJvdC5hZGQocmFkcyk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZSB0aGlzIGJsb2NrIGFyb3VuZCBieSB0aGUgZ2l2ZW4gZGlzdGFuY2VzXG4gICAqIEBwYXJhbSBzdGVwcyBTdGVwcyBwZXIgYXhpc1xuICAgKi9cbiAgbW92ZShzdGVwczogVmVjdG9yKSB7XG4gICAgdGhpcy5sb2MuYWRkKHN0ZXBzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhbGwgcm90YXRpb25zIGZyb20gY3VycmVudCBzdGF0ZSBvbiBhIGxpc3Qgb2YgcG9pbnRzXG4gICAqIEBwYXJhbSBwb2ludHMgTGlzdCBvZiBwb2ludHMgdG8gdHJhbnNmb3JtXG4gICAqIEByZXR1cm5zIE5ldyBsaXN0IG9mIHBvaW50c1xuICAgKi9cbiAgcHJpdmF0ZSBhcHBseVJvdGF0aW9ucyhwb2ludHM6IFZlY3RvcltdKTogVmVjdG9yW10ge1xuICAgIGNvbnN0IHJlczogVmVjdG9yW10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAvLyBNYXRyaXggd2hpY2ggcmVwcmVzZW50cyB0aGUgcG9pbnQncyBsb2NhdGlvbiBhcyBhXG4gICAgICAvLyB2ZWN0b3Igc3RhcnRpbmcgYXQgKDAsIDAsIDApXG4gICAgICBsZXQgbWF0ID0gKHBvaW50c1tpXSkuY2xvbmUoKS5zdWIodGhpcy5sb2MpLnRvTWF0cml4KCk7XG5cbiAgICAgIC8vIEFwcGx5IHJvdGF0aW9uc1xuICAgICAgbWF0ID0gTWF0cml4Lm11bChNYXRyaXguUngodGhpcy5yb3QueCksIG1hdCk7XG4gICAgICBtYXQgPSBNYXRyaXgubXVsKE1hdHJpeC5SeSh0aGlzLnJvdC55KSwgbWF0KTtcbiAgICAgIG1hdCA9IE1hdHJpeC5tdWwoTWF0cml4LlJ6KHRoaXMucm90LnopLCBtYXQpO1xuXG4gICAgICAvLyBQdXNoIHJlc3VsdGluZyBtYXRyaXggYXMgYSB2ZWN0b3JcbiAgICAgIC8vIFNoaWZ0IHRoaXMgdmVjdG9yIGJhY2sgaW50byB0aGUgbG9jYWwgY2VudGVyXG4gICAgICByZXMucHVzaChuZXcgVmVjdG9yKFxuICAgICAgICBtYXRbMF1bMF0sXG4gICAgICAgIG1hdFsxXVswXSxcbiAgICAgICAgbWF0WzJdWzBdLFxuICAgICAgKS5hZGQodGhpcy5sb2MpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbGxhcHNlIHRoaXMgYmxvY2sncyBzdGF0ZSBkb3duIGludG8gcG9pbnRzIGFuZCBsaW5lc1xuICAgKiBAcmV0dXJucyBJbmZvcm1hdGlvbiB0byBiZSBkcmF3biBvbiBzY3JlZW5cbiAgICovXG4gIGRyYXcoKTogSURyYXdhYmxlIHtcbiAgICBjb25zdCBwb2ludHMgPSB0aGlzLmFwcGx5Um90YXRpb25zKFtcbiAgICAgIC8vIFwiRnJvbnRcIiBmYWNlLCBjbG9ja3dpc2UsIHN0YXJ0aW5nIHRvcCByaWdodFxuICAgICAgbmV3IFZlY3Rvcih0aGlzLmxvYy54IC0gdGhpcy5zei54IC8gMiwgdGhpcy5sb2MueSArIHRoaXMuc3oueSAvIDIsIHRoaXMubG9jLnogLSB0aGlzLnN6LnogLyAyKSxcbiAgICAgIG5ldyBWZWN0b3IodGhpcy5sb2MueCArIHRoaXMuc3oueCAvIDIsIHRoaXMubG9jLnkgKyB0aGlzLnN6LnkgLyAyLCB0aGlzLmxvYy56IC0gdGhpcy5zei56IC8gMiksXG4gICAgICBuZXcgVmVjdG9yKHRoaXMubG9jLnggKyB0aGlzLnN6LnggLyAyLCB0aGlzLmxvYy55IC0gdGhpcy5zei55IC8gMiwgdGhpcy5sb2MueiAtIHRoaXMuc3oueiAvIDIpLFxuICAgICAgbmV3IFZlY3Rvcih0aGlzLmxvYy54IC0gdGhpcy5zei54IC8gMiwgdGhpcy5sb2MueSAtIHRoaXMuc3oueSAvIDIsIHRoaXMubG9jLnogLSB0aGlzLnN6LnogLyAyKSxcbiAgICAgIFxuICAgICAgLy8gXCJCYWNrXCIgZmFjZSwgY3N6a3dpc2UsIHN0YXJ0aW5nIHRvcCByaWdodFxuICAgICAgbmV3IFZlY3Rvcih0aGlzLmxvYy54IC0gdGhpcy5zei54IC8gMiwgdGhpcy5sb2MueSArIHRoaXMuc3oueSAvIDIsIHRoaXMubG9jLnogKyB0aGlzLnN6LnogLyAyKSxcbiAgICAgIG5ldyBWZWN0b3IodGhpcy5sb2MueCArIHRoaXMuc3oueCAvIDIsIHRoaXMubG9jLnkgKyB0aGlzLnN6LnkgLyAyLCB0aGlzLmxvYy56ICsgdGhpcy5zei56IC8gMiksXG4gICAgICBuZXcgVmVjdG9yKHRoaXMubG9jLnggKyB0aGlzLnN6LnggLyAyLCB0aGlzLmxvYy55IC0gdGhpcy5zei55IC8gMiwgdGhpcy5sb2MueiArIHRoaXMuc3oueiAvIDIpLFxuICAgICAgbmV3IFZlY3Rvcih0aGlzLmxvYy54IC0gdGhpcy5zei54IC8gMiwgdGhpcy5sb2MueSAtIHRoaXMuc3oueSAvIDIsIHRoaXMubG9jLnogKyB0aGlzLnN6LnogLyAyKSxcbiAgICBdKTtcblxuICAgIC8vIENvbm5lY3QgdXAgYWxsIHBvaW50cyB3aXRoIGxpbmVzXG4gICAgY29uc3QgbGluZXM6IFtWZWN0b3IsIFZlY3Rvcl1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSArPSAxKSB7XG4gICAgICBsaW5lcy5wdXNoKFtwb2ludHNbaV0sIHBvaW50c1soaSArIDEpICUgNF1dKTtcbiAgICAgIGxpbmVzLnB1c2goW3BvaW50c1tpICsgNF0sIHBvaW50c1soaSArIDEpICUgNCArIDRdXSk7XG4gICAgICBsaW5lcy5wdXNoKFtwb2ludHNbaV0sIHBvaW50c1soaSArIDQpXV0pO1xuICAgIH1cblxuICAgIHJldHVybiB7IHBvaW50cywgbGluZXMgfTtcbiAgfVxufSIsImVudW0gQ29sb3Ige1xuICBXSElURSA9ICcjRjdGN0Y3JyxcbiAgQkxBQ0sgPSAnIzE0MTQxNCcsXG4gIEJMVUUgPSAnIzUzOTNFQicsXG4gIFJFRCA9ICcjRjQ1MzUzJyxcbiAgR1JFRU4gPSAnIzlBREQzRScsXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbG9yOyIsImltcG9ydCBTY3JlZW4gZnJvbSAnLi9zY3JlZW4nO1xuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICAvLyBDcmVhdGUgc2NyZWVuIGJhc2VkIG9uIGVsZW1lbnQgI2N2XG4gIGNvbnN0IHNjciA9IG5ldyBTY3JlZW4oJ2N2Jyk7XG5cbiAgLy8gVXBkYXRlIGF0IDYwIEZQU1xuICBzZXRJbnRlcnZhbCgoKSA9PiBzY3IudXBkYXRlKCksIDEvNjApO1xufTsiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRyaXgge1xuICAvLyBSb3RhdGUgYXJvdW5kIHRoZSB4LWF4aXNcbiAgc3RhdGljIFJ4ID0gKGE6IG51bWJlcikgPT4gW1xuICAgIFsxLCAwLCAwXSxcbiAgICBbMCwgTWF0aC5jb3MoYSksIC1NYXRoLnNpbihhKV0sXG4gICAgWzAsIE1hdGguc2luKGEpLCBNYXRoLmNvcyhhKV0sXG4gIF07XG5cbiAgLy8gUm90YXRlIGFyb3VuZCB0aGUgeS1heGlzXG4gIHN0YXRpYyBSeSA9IChhOiBudW1iZXIpID0+IFtcbiAgICBbTWF0aC5jb3MoYSksIDAsIE1hdGguc2luKGEpXSxcbiAgICBbMCwgMSwgMF0sXG4gICAgWy1NYXRoLnNpbihhKSwgMCwgTWF0aC5jb3MoYSldLFxuICBdO1xuXG4gIC8vIFJvdGF0ZSBhcm91bmQgdGhlIHotYXhpc1xuICBzdGF0aWMgUnogPSAoYTogbnVtYmVyKSA9PiBbXG4gICAgW01hdGguY29zKGEpLCAtTWF0aC5zaW4oYSksIDBdLFxuICAgIFtNYXRoLnNpbihhKSwgTWF0aC5jb3MoYSksIDBdLFxuICAgIFswLCAwLCAxXSxcbiAgXTtcblxuICAvKipcbiAgICogTXVsdGlwbHkgdHdvIG1hdHJpY2VzIHRvZ2V0aGVyIChjcm9zcyBwcm9kdWN0KVxuICAgKiBAcGFyYW0gYSBNYXRyaXggQVxuICAgKiBAcGFyYW0gYiBNYXRyaXggQlxuICAgKiBAcmV0dXJucyBSZXN1bHRpbmcgbWF0cml4XG4gICAqL1xuICBzdGF0aWMgbXVsKGE6IG51bWJlcltdW10sIGI6IG51bWJlcltdW10pOiBudW1iZXJbXVtdIHtcbiAgICBjb25zdCBhUiA9IGEubGVuZ3RoO1xuICAgIGNvbnN0IGFDID0gYVswXS5sZW5ndGg7XG4gICAgY29uc3QgYkMgPSBiWzBdLmxlbmd0aDtcbiAgICBjb25zdCByZXMgPSBuZXcgQXJyYXkoYVIpO1xuXG4gICAgLy8gRm9yIGFsbCByb3dzIG9mIEFcbiAgICBmb3IgKGxldCByID0gMDsgciA8IGFSOyByICs9IDEpIHtcbiAgICAgIHJlc1tyXSA9IG5ldyBBcnJheShiQyk7IC8vIEluaXQgYXJyYXlcblxuICAgICAgLy8gRm9yIGFsbCBjb2x1bW5zIG9mIEJcbiAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgYkM7IGMgKz0gMSkge1xuICAgICAgICByZXNbcl1bY10gPSAwOyAvLyBJbml0IHNsb3RcblxuICAgICAgICAvLyBGb3IgYWxsIGNvbHVtbnMgb2YgQVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFDOyBpICs9IDEpXG4gICAgICAgICAgcmVzW3JdW2NdICs9IGFbcl1baV0gKiBiW2ldW2NdOyAvLyBNdWx0aXBseSBhbmQgc3RvcmVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59IiwiaW1wb3J0IEJsb2NrIGZyb20gJy4vYmxvY2snO1xuaW1wb3J0IENvbG9yIGZyb20gJy4vY29sb3InO1xuaW1wb3J0IFZlY3RvciBmcm9tICcuL3ZlY3Rvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmVlbiB7XG5cbiAgLy8gQ2FudmFzIHJlZmVyZW5jZXNcbiAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJpdmF0ZSBjdlN6ID0gbmV3IFZlY3RvcigwLCAwKTtcblxuICAvLyBDYW52YXMgYXBwZWFyYW5jZVxuICBwcml2YXRlIGJnID0gQ29sb3IuQkxBQ0s7XG4gIHByaXZhdGUgcG9pbnRTeiA9IDg7XG4gIHByaXZhdGUgbGluZVN6ID0gMjtcblxuICBwcml2YXRlIGJsb2NrczogQmxvY2tbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGlkZW50aWZpZXI6IHN0cmluZykge1xuICAgIC8vIEZpbmQgdGFyZ2V0IGNvbnRleHQgZnJvbSBlbGVtZW50LWlkXG4gICAgY29uc3QgdGFyZ2V0ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkZW50aWZpZXIpIGFzIEhUTUxDYW52YXNFbGVtZW50KT8uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAodGFyZ2V0ID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0YXJnZXQgY2FudmFzIGlkZW50aWZpZWQgYnkgIyR7aWRlbnRpZmllcn1gKTtcbiAgICB0aGlzLmN0eCA9IHRhcmdldDtcblxuICAgIHRoaXMucmVzaXplQ2FudmFzKCk7XG5cbiAgICAvLyBDcmVhdGUgdGVzdCBibG9ja1xuICAgIHRoaXMuYmxvY2tzLnB1c2gobmV3IEJsb2NrKG5ldyBWZWN0b3IodGhpcy5jdlN6LnggLyAyLCB0aGlzLmN2U3oueSAvIDIsIDApLCBuZXcgVmVjdG9yKDEwMCwgMjAwLCAxMDApKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzaXplIHRoZSBjYW52YXMgdG8gYmUgYXMgYmlnIGFzIHRoZSBicm93c2VyXG4gICAqIHdpbmRvdyBhbGxvd3MgKGZ1bGxzY3JlZW4pXG4gICAqL1xuICBwcml2YXRlIHJlc2l6ZUNhbnZhcygpIHtcbiAgICB0aGlzLmN2U3oueCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuY3ZTei55ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY3R4LmNhbnZhcy53aWR0aCA9IHRoaXMuY3ZTei54O1xuICAgIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmN2U3oueTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvamVjdCh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgIHJldHVybiB2O1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgYSBwb2ludCBvbiB0aGUgc2NyZWVuXG4gICAqIEBwYXJhbSBsb2MgTG9jYXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgcG9pbnRcbiAgICogQHBhcmFtIGNvbG9yIENvbG9yIG9mIHRoZSBwb2ludFxuICAgKiBAcGFyYW0gZmlsbCBXaGV0aGVyIG9yIG5vdCB0byBmaWxsIHRoaXMgcG9pbnRcbiAgICovXG4gIHB1YmxpYyBkcmF3UG9pbnQobG9jOiBWZWN0b3IsIGNvbG9yOiBDb2xvciwgZmlsbCA9IHRydWUpIHtcbiAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gZmlsbCA/IGNvbG9yIDogJyc7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBmaWxsID8gJycgOiBjb2xvcjtcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVTejtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5hcmMobG9jLngsIGxvYy55LCB0aGlzLnBvaW50U3osIDAsIDIgKiBNYXRoLlBJKTtcbiAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgYSBsaW5lIGNvbm5lY3RpbmcgdHdvIHBvaW50cyBvbiB0aGUgc2NyZWVuXG4gICAqIEBwYXJhbSBhIExvY2F0aW9uIG9mIHRoZSBzdGFydCBvZiB0aGUgbGluZVxuICAgKiBAcGFyYW0gYiBMb2NhdGlvbiBvZiB0aGUgZW5kIG9mIHRoZSBsaW5lXG4gICAqIEBwYXJhbSBjb2xvciBDb2xvciBvZiB0aGUgbGluZVxuICAgKi9cbiAgcHVibGljIGRyYXdMaW5lKGE6IFZlY3RvciwgYjogVmVjdG9yLCBjb2xvcjogQ29sb3IpIHtcbiAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVTejtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5tb3ZlVG8oYS54LCBhLnkpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyhiLngsIGIueSk7XG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSB3aG9sZSBjYW52YXNcbiAgICovXG4gIHB1YmxpYyBjbGVhcigpIHtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmJnO1xuICAgIHRoaXMuY3R4LnJlY3QoMCwgMCwgdGhpcy5jdlN6LngsIHRoaXMuY3ZTei55KTtcbiAgICB0aGlzLmN0eC5maWxsKCk7XG4gIH1cblxuICAvKipcbiAgICogRHJhdyBuZXh0IGZyYW1lXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlKCkge1xuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIC8vIERyYXcgYWxsIGJsb2Nrc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGluZm8gPSB0aGlzLmJsb2Nrc1tpXS5kcmF3KCk7XG4gICAgICB0aGlzLmJsb2Nrc1tpXS5yb3RhdGUobmV3IFZlY3RvcigwLjAxLCAwLjAxLCAwLjAxKSk7XG4gICAgICBcbiAgICAgIC8vIERyYXcgYWxsIHBvaW50cyBvZiB0aGlzIGJsb2NrXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGluZm8ucG9pbnRzLmxlbmd0aDsgaiArPSAxKVxuICAgICAgICB0aGlzLmRyYXdQb2ludCh0aGlzLnByb2plY3QoaW5mby5wb2ludHNbal0pLCBDb2xvci5SRUQsIGZhbHNlKTtcblxuICAgICAgLy8gRHJhdyBhbGwgbGluZXMgb2YgdGhpcyBibG9ja1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpbmZvLmxpbmVzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGNvbnN0IFthLCBiXSA9IGluZm8ubGluZXNbal07XG4gICAgICAgIHRoaXMuZHJhd0xpbmUodGhpcy5wcm9qZWN0KGEpLCB0aGlzLnByb2plY3QoYiksIENvbG9yLldISVRFKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3Ige1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4OiBudW1iZXIsXG4gICAgcHVibGljIHk6IG51bWJlcixcbiAgICBwdWJsaWMgeiA9IDAsXG4gICkge31cblxuICAvKipcbiAgICogQWRkIGFub3RoZXIgdmVjdG9yIGluIHBsYWNlXG4gICAqIEBwYXJhbSB2IFZlY3RvciB0byBhZGRcbiAgICogQHJldHVybnMgU2VsZlxuICAgKi9cbiAgYWRkKHY6IFZlY3Rvcikge1xuICAgIHRoaXMueCArPSB2Lng7XG4gICAgdGhpcy55ICs9IHYueTtcbiAgICB0aGlzLnogKz0gdi56O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0IGFub3RoZXIgdmVjdG9yIGluIHBsYWNlXG4gICAqIEBwYXJhbSB2IFZlY3RvciB0byBzdWJ0cmFjdFxuICAgKiBAcmV0dXJucyBTZWxmXG4gICAqL1xuICBzdWIodjogVmVjdG9yKSB7XG4gICAgdGhpcy54IC09IHYueDtcbiAgICB0aGlzLnkgLT0gdi55O1xuICAgIHRoaXMueiAtPSB2Lno7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbHkgYW5vdGhlciB2ZWN0b3IgaW4gcGxhY2VcbiAgICogQHBhcmFtIHYgVmVjdG9yIHRvIG11bHRpcGx5XG4gICAqIEByZXR1cm5zIFNlbGZcbiAgICovXG4gIG11bHQodjogVmVjdG9yKSB7XG4gICAgdGhpcy54ICo9IHYueDtcbiAgICB0aGlzLnkgKj0gdi55O1xuICAgIHRoaXMueiAqPSB2Lno7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBtYXRyaXggcmVwcmVzZW50YXRpb24gb2YgdGhpcyB2ZWN0b3JcbiAgICovXG4gIHRvTWF0cml4KCkge1xuICAgIHJldHVybiBbW3RoaXMueF0sIFt0aGlzLnldLCBbdGhpcy56XV07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgY2FyYm9uIGNvcHkgb2YgdGhpcyB2ZWN0b3JcbiAgICovXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgdmVjdG9yJ3MgY29vcmRpbmF0ZXNcbiAgICovXG4gIHN0cmluZ2lmeSgpIHtcbiAgICByZXR1cm4gYCgke3RoaXMueH0sICR7dGhpcy55fSwgJHt0aGlzLnp9KWA7XG4gIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zY3JpcHRzL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=