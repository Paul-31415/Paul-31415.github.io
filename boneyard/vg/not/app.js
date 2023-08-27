/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("pixi.js");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    vec_zero() {
        return this.vec_scale(0);
    }
    vec_addEq(other) {
        return this.vec_set(this.vec_add(other));
    }
    vec_addD(other) {
        return other.vec_addEq(this);
    }
    vec_addDEq(other) {
        return this.vec_addEq(other);
    }
    vec_fmaEq(other, scale) {
        return this.vec_addDEq(other.vec_scale(scale));
    }
    vec_neg() {
        return this.vec_scale(-1);
    }
    vec_negEq() {
        return this.vec_scaleEq(-1);
    }
    vec_sub(other) {
        return this.vec_add(other.vec_neg());
    }
    vec_subEq(other) {
        return this.vec_addEq(other.vec_neg());
    }
    vec_subD(other) {
        return other.vec_negEq().vec_addEq(this);
    }
    vec_subDEq(other) {
        return this.vec_subEq(other);
    }
    vec_scaleEq(s) {
        return this.vec_set(this.vec_scale(s));
    }
    vec_lerp(other, alpha) {
        return this.vec_scale(1 - alpha).vec_addDEq(other.vec_scale(alpha));
    }
    vec_lerpEq(other, alpha) {
        return this.vec_scaleEq(1 - alpha).vec_addDEq(other.vec_scale(alpha));
    }
    vec_lerpD(other, alpha) {
        return this.vec_scale(1 - alpha).vec_addDEq(other.vec_scaleEq(alpha));
    }
    vec_lerpDEq(other, alpha) {
        return this.vec_scaleEq(1 - alpha).vec_addDEq(other.vec_scaleEq(alpha));
    }
}
exports.Vector = Vector;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var B_Spline_1, D_Spline_1;
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = __webpack_require__(1);
const save_1 = __webpack_require__(5);
const binary_search_1 = __webpack_require__(6);
const float_difference_1 = __webpack_require__(7);
let B_Spline = B_Spline_1 = class B_Spline extends vector_1.Vector {
    constructor(control_points, knot_vec) {
        super();
        this.control_points = control_points;
        this.knot_vec = knot_vec;
    }
    get order() {
        return this.knot_vec.length - this.control_points.length;
    }
    curve_eval(t) {
        if (this.order <= 0) {
            return this.control_points[0].vec_zero();
        }
        const b = this.basis(t);
        const v = this.control_points[b.start].vec_scale(b.weights[0]);
        for (let i = 1; i < b.weights.length; i++)
            v.vec_fmaEq(this.control_points[b.start + i], b.weights[i]);
        return v;
    }
    basis(t) {
        const o = this.order;
        let region = binary_search_1.ascending_search_right(this.knot_vec, t);
        while (region < this.knot_vec.length && float_difference_1.float_near(this.knot_vec[region], t, B_Spline_1.EPSILON)) {
            region++;
        }
        const k = Math.max(o, Math.min(this.knot_vec.length - o, region));
        const bweights = this.basis_ITS(k - 1, o - 1, t);
        return { start: k - o, weights: bweights };
    }
    basis_ITS(k, p, u) {
        const N = Array(p + 1).fill(0);
        N[p] = 1;
        for (let i = 1; i <= p; i++) {
            for (let j = i - 1; j >= 0; j--) {
                const an = (u - this.knot_vec[k - j]);
                const ad = (this.knot_vec[k + i - j] - this.knot_vec[k - j]);
                const A = (ad != 0) ? an / ad : 0;
                const tmp = N[p - j] * A;
                N[p - (j + 1)] += N[p - j] - tmp;
                N[p - j] = tmp;
            }
        }
        return N;
    }
    _insert_knot_res_and_ind(t, times = 1) {
        const region = binary_search_1.ascending_search_right(this.knot_vec, t);
        const o = this.order;
        const k = Math.max(o, Math.min(this.knot_vec.length - o, region));
        const tri = this.support_net(t, times);
        const res = Array(times + o - 2);
        for (let i = 1; i < tri.length - 1; i++) {
            res[i - 1] = tri[i][0];
            res[res.length - i] = tri[i][tri[i].length - 1];
        }
        if (tri[tri.length - 1].length === 1) {
            const p = tri[tri.length - 1][0];
            res[tri.length - 2] = p;
            res[res.length - tri.length + 1] = p;
            const z = p.vec_zero();
            for (let i = tri.length - 1; i < res.length - tri.length + 1; i++) {
                res[i] = z;
            }
        }
        else {
            for (let i = 0; i < tri[tri.length - 1].length; i++) {
                res[i + tri.length - 2] = tri[tri.length - 1][i];
            }
        }
        const kres = Array(times).fill(t);
        return { res: { a: res, s: k - o + 1, d: o - 2 }, kres: { a: kres, s: region, d: 0 } };
    }
    insert_knot(t, times = 1) {
        const r = this._insert_knot_res_and_ind(t, times);
        this.control_points.splice(r.res.s, r.res.d, ...r.res.a);
        this.knot_vec.splice(r.kres.s, r.kres.d, ...r.kres.a);
        return r.kres.s;
    }
    CDB_triangle(k, p, t, h = Infinity) {
        const res = [];
        res[0] = Array(p + 1);
        for (let i = 0; i < res[0].length; i++) {
            res[0][i] = this.control_points[k + i];
        }
        for (let r = 1; r <= p && r <= h; r++) {
            res[r] = Array(p + 1 - r);
            for (let i = 0; i < res[r].length; i++) {
                const bi = k + i + r;
                const s = p - r + 1;
                const an = (t - this.knot_vec[bi]);
                const ad = (this.knot_vec[bi + s] - this.knot_vec[bi]);
                const a = (ad != 0) ? an / ad : 0;
                res[r][i] = res[r - 1][i].vec_lerp(res[r - 1][i + 1], a);
            }
        }
        return res;
    }
    support_net(t, h = Infinity) {
        const o = this.order;
        const region = binary_search_1.ascending_search_right(this.knot_vec, t);
        const k = Math.max(o, Math.min(this.knot_vec.length - o, region));
        return this.CDB_triangle(k - o, o - 1, t, h);
    }
    effected_region(k) {
        const p = this.order - 1;
        return { start: this.knot_vec[Math.max(0, k - p)], end: this.knot_vec[Math.min(this.knot_vec.length, k + p + 1)] };
    }
    bisect(t) {
        const p = this.order - 1;
        const c = this.vec_copy();
        const r = c.insert_knot(t, p);
        const l = c.control_points.length;
        const low = new B_Spline_1(c.control_points.slice(0, Math.max(p, r)), c.knot_vec.slice(0, Math.max(p, r + p + 1)));
        const high = new B_Spline_1(c.control_points.slice(Math.min(r - 1, l - p - 1)), c.knot_vec.slice(Math.min(r + p, l)));
        return { low: low, high: high };
    }
    rle_knot_vec() {
        const u = [this.knot_vec[0]];
        const z = [1];
        for (let i = 1; i < this.knot_vec.length; i++) {
            if (float_difference_1.float_near(u[u.length - 1], this.knot_vec[i], B_Spline_1.EPSILON)) {
                z[z.length - 1]++;
            }
            else {
                u.push(this.knot_vec[i]);
                z.push(1);
            }
        }
        return { u: u, z: z };
    }
    degree_elevate_and_insert_knots(m, t, times) {
        const konsts = Array(this.order - 1);
        let curv = this;
        for (let i = 0; i < konsts.length; i++) {
            const r = curv.curve_derivative();
            konsts[i] = r.trimmed_knots;
            curv = r.curve;
        }
        const kre = curv.rle_knot_vec();
        const rp = new Array(curv.control_points.length + m * (kre.u.length - 1));
        const rk = new Array(curv.knot_vec.length + m * (kre.u.length));
        let ri = 0, si = 0, ti = 0;
        for (let i = 0; i < kre.u.length - 1; i++) {
            for (let j = 0; j < kre.z[i]; j++) {
                rp[ri] = curv.control_points[si];
                rk[ri] = curv.knot_vec[si];
                ri++;
                si++;
            }
            for (let j = 0; j < m; j++) {
                rp[ri] = rp[ri - 1];
                rk[ri] = rk[ri - 1];
                ri++;
            }
        }
        for (let j = 0; j < kre.z[kre.z.length - 1] - 1; j++) {
            rp[ri] = curv.control_points[si];
            rk[ri] = curv.knot_vec[si];
            ri++;
            si++;
        }
        rk[ri] = curv.knot_vec[si];
        ri++;
        for (let j = 0; j < m; j++) {
            rk[ri] = rk[ri - 1];
            ri++;
        }
        curv.knot_vec = rk;
        curv.control_points = rp;
        for (let i = 0; i < t.length; i++) {
            curv.insert_knot(t[i], times[i]);
        }
        for (let i = konsts.length - 1; i >= 0; i--) {
            curv = curv.curve_integral(konsts[i]);
        }
        return curv;
    }
    degree_elevate(m) {
        return this.degree_elevate_and_insert_knots(m, [], []);
    }
    remove_knot(i) {
        throw new Error("Method not implemented.");
    }
    multiplicity(i) {
        const k = this.knot_vec[i];
        let n = 1;
        for (let o = i - 1; o >= 0 && float_difference_1.float_near(this.knot_vec[o], k, B_Spline_1.EPSILON); o--) {
            n++;
        }
        for (let o = i + 1; o < this.knot_vec.length &&
            float_difference_1.float_near(this.knot_vec[o], k, B_Spline_1.EPSILON); o++) {
            n++;
        }
        return n;
    }
    curve_derivative() {
        const q = new Array(this.control_points.length - 1);
        const kn = new Array(this.knot_vec.length - 2);
        for (let i = 0; i < kn.length; i++) {
            kn[i] = this.knot_vec[i + 1];
        }
        const p = this.order - 1;
        for (let i = 0; i < q.length; i++) {
            const pt = this.control_points[i + 1].vec_sub(this.control_points[i]);
            if (float_difference_1.float_near(this.knot_vec[i + 1 + p], this.knot_vec[i + 1], B_Spline_1.EPSILON)) {
                q[i] = pt;
            }
            else {
                const d = this.knot_vec[i + 1 + p] - this.knot_vec[i + 1];
                q[i] = pt.vec_scaleEq(p / d);
            }
        }
        return { curve: new B_Spline_1(q, kn), trimmed_knots: { l: this.knot_vec[0], h: this.knot_vec[this.knot_vec.length - 1], c: this.control_points[0] } };
    }
    curve_integral(trimmed_knots = {}) {
        const tk = {
            l: (trimmed_knots.l ? trimmed_knots.l : this.knot_vec[0]),
            h: (trimmed_knots.h ? trimmed_knots.h : this.knot_vec[this.knot_vec.length - 1]),
            c: (trimmed_knots.c ? trimmed_knots.c : this.control_points[0].vec_zero())
        };
        const q = new Array(this.control_points.length + 1);
        const kn = new Array(this.knot_vec.length + 2);
        kn[0] = tk.l;
        kn[kn.length - 1] = tk.h;
        for (let i = 0; i < this.knot_vec.length; i++) {
            kn[i + 1] = this.knot_vec[i];
        }
        const p = this.order;
        let c = tk.c;
        q[0] = c;
        for (let i = 1; i < q.length; i++) {
            if (float_difference_1.float_near(kn[i - 1 + p + 1], kn[i], B_Spline_1.EPSILON)) {
                c = this.control_points[i - 1].vec_add(c);
            }
            else {
                const d = kn[i - 1 + p + 1] - kn[i];
                c = this.control_points[i - 1].vec_scale(d / p).vec_addEq(c);
            }
            q[i] = c;
        }
        return new B_Spline_1(q, kn);
    }
    vec_copy() {
        return new B_Spline_1([...this.control_points], [...this.knot_vec]);
    }
    vec_set(other) {
        this.control_points = other.control_points;
        this.knot_vec = other.knot_vec;
        return this;
    }
    spline_match(other) {
        const odif = other.order - this.order;
        if (odif < 0) {
            const r = other.spline_match(this);
            return { this: r.other, other: r.this };
        }
        let vec = (odif > 0) ? this.degree_elevate(odif) : this.vec_copy();
        other = other.vec_copy();
        const kv1 = vec.rle_knot_vec();
        const kv2 = other.rle_knot_vec();
        let i1 = 0, i2 = 0;
        let kiv1 = [];
        let kiv2 = [];
        let kit1 = [];
        let kit2 = [];
        while (i1 < kv1.u.length && i2 < kv2.u.length) {
            if (float_difference_1.float_near(kv1.u[i1], kv2.u[i2], B_Spline_1.EPSILON)) {
                const d = kv1.z[i1] - kv2.z[i2];
                if (d < 0) {
                    vec.insert_knot(kv2.u[i2], -d);
                }
                else {
                    if (d > 0) {
                        other.insert_knot(kv1.u[i1], d);
                    }
                }
                i1++;
                i2++;
            }
            else {
                if (kv2.u[i2] < kv1.u[i1]) {
                    vec.insert_knot(kv2.u[i2], kv2.z[i2]);
                    i2++;
                }
                else {
                    other.insert_knot(kv1.u[i1], kv1.z[i1]);
                    i1++;
                }
            }
        }
        while (i1 < kv1.u.length) {
            other.insert_knot(kv1.u[i1], kv1.z[i1]);
            i1++;
        }
        while (i2 < kv2.u.length) {
            vec.insert_knot(kv2.u[i2], kv2.z[i2]);
            i2++;
        }
        vec = vec.degree_elevate_and_insert_knots(0, kiv1, kit1);
        other = other.degree_elevate_and_insert_knots(0, kiv2, kit2);
        return { this: vec, other: other };
    }
    vec_add(other) {
        const r = this.spline_match(other);
        const vec = r.this;
        const o = r.other;
        const sum = new Array(vec.control_points.length);
        for (let i = 0; i < sum.length; i++) {
            sum[i] = vec.control_points[i].vec_add(o.control_points[i]);
        }
        return new B_Spline_1(sum, vec.knot_vec);
    }
    vec_scale(s) {
        const res = Array(this.control_points.length);
        for (let i = 0; i < this.control_points.length; i++)
            res[i] = this.control_points[i].vec_scale(s);
        return new B_Spline_1(res, [...this.knot_vec]);
    }
};
B_Spline.EPSILON = 1 / 256 / 256 / 256;
B_Spline = B_Spline_1 = __decorate([
    save_1.Saveable.register
], B_Spline);
exports.B_Spline = B_Spline;
let D_Spline = D_Spline_1 = class D_Spline extends vector_1.Vector {
    constructor(coefs) {
        super();
        this.coefs = coefs;
    }
    get order() {
        return this.coefs.length - 1;
    }
    get length() {
        return this.coefs.length;
    }
    curve_eval(t) {
        const r = this.coefs[0].vec_copy();
        let tp = t;
        for (let i = 1; i < this.length; i++) {
            r.vec_fmaEq(this.coefs[i], tp);
            tp *= t / (i + 1);
        }
        return r;
    }
    curve_derivative(t = 1) {
        if (t < this.length) {
            return new D_Spline_1(this.coefs.slice(t));
        }
        return new D_Spline_1([this.coefs[0].vec_zero()]);
    }
    curve_integral(t = 1) {
        const zero = this.coefs[0].vec_zero();
        const r = Array(t).fill(zero);
        r.push(...this.coefs);
        return new D_Spline_1(r);
    }
    coef(i) {
        return i >= this.coefs.length ? this.coefs[0].vec_zero() : this.coefs[i];
    }
    vec_add(other) {
        const res = Array(Math.max(this.length, other.length));
        for (let i = 0; i < res.length; i++)
            res[i] = i < this.length ? (i < other.length ? this.coefs[i].vec_add(other.coefs[i]) : this.coefs[i].vec_copy()) : other.coefs[i].vec_copy();
        return new D_Spline_1(res);
    }
    vec_scale(s) {
        const res = Array(this.length);
        for (let i = 0; i < res.length; i++)
            res[i] = this.coefs[i].vec_scale(s);
        return new D_Spline_1(res);
    }
    vec_copy() {
        return new D_Spline_1([...this.coefs]);
    }
    vec_set(other) {
        this.coefs = other.coefs;
        return this;
    }
};
D_Spline = D_Spline_1 = __decorate([
    save_1.Saveable.register
], D_Spline);
exports.D_Spline = D_Spline;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const PIXI = __webpack_require__(0);
const vector_1 = __webpack_require__(1);
function point2d(x = 0, y = 0) { return new Point2d(new PIXI.Point(x, y)); }
exports.point2d = point2d;
class Point2d extends vector_1.Vector {
    constructor(p) {
        super();
        this.p = p;
    }
    get x() { return this.p.x; }
    set x(v) { this.p.x = v; }
    get y() { return this.p.y; }
    set y(v) { this.p.y = v; }
    vec_add(other) {
        return new Point2d(new PIXI.Point(this.x + other.x, this.y + other.y));
    }
    vec_scale(s) {
        return new Point2d(new PIXI.Point(this.x * s, this.y * s));
    }
    vec_copy() {
        return new Point2d(new PIXI.Point(this.x, this.y));
    }
    vec_set(other) {
        this.p.copy(other.p);
        return this;
    }
}
exports.Point2d = Point2d;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const PIXI = __webpack_require__(0);
const b_spline_1 = __webpack_require__(2);
const point2d_1 = __webpack_require__(3);
let renderer = PIXI.autoDetectRenderer();
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoResize: true
});
document.body.appendChild(app.view);
window.onresize = function (_event) {
    app.renderer.resize(window.innerWidth, window.innerHeight);
};
function hilbert_coords(t, n) {
    let x = 0;
    let y = 0;
    let rot = 0;
    let inv = 0;
    for (let i = 0; i < n; i++) {
        t *= 4;
        const ind = Math.floor(t) ^ inv;
        x *= 2;
        y *= 2;
        x += [[0, 0, 1, 1], [1, 0, 0, 1], [1, 1, 0, 0], [0, 1, 1, 0]][rot][ind];
        y += [[0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 0, 1], [1, 1, 0, 0]][rot][ind];
        rot = (rot + [3, 0, 0, 1][ind]) % 4;
        t %= 1;
        if (ind === 0 || ind === 3) {
            inv ^= 0x3;
        }
    }
    const d = 1 << n;
    return point2d_1.point2d(x / d, y / d);
}
function hilbert_curve(n) {
    const res = new Array();
    const d = 1 << (n * 2);
    for (let i = 0; i < d; i++) {
        res[i] = hilbert_coords(i / d, n);
    }
    return res;
}
function parray_add_scale(a, s, p) {
    for (let i = 0; i < a.length; i++) {
        a[i].vec_scaleEq(s);
        a[i].vec_addEq(p);
    }
    return a;
}
function uniform_knot_vec(len, o) {
    const res = Array(len + o);
    for (let i = 0; i < len + o; i++) {
        res[i] = (i - o + 1) / (1 + len - o);
    }
    return res;
}
function uniform_ended_knot_vec(len, o) {
    const res = Array(len + o);
    for (let i = 0; i <= len - o; i++) {
        res[i + o - 1] = i / (1 + len - o);
    }
    for (let i = 0; i < o; i++) {
        res[i] = 0;
        res[len + i] = 1;
    }
    return res;
}
let iter = 3;
const testSpline = new b_spline_1.B_Spline(parray_add_scale(hilbert_curve(iter), 400, point2d_1.point2d(-200, -200)), uniform_ended_knot_vec(1 << (2 * iter), 5));
iter = 2;
function hilbspline(iter, order) {
    return new b_spline_1.B_Spline(parray_add_scale(hilbert_curve(iter), 400, point2d_1.point2d(-200, -200)), uniform_ended_knot_vec(1 << (2 * iter), order));
}
const spa = [];
for (let i = 1; i <= 7; i++) {
    spa[spa.length] = hilbspline(i, 2);
}
const testSplurf = new b_spline_1.B_Spline(spa, uniform_ended_knot_vec(spa.length, 2));
function plotCurve(c, res, cur = undefined) {
    if (!cur) {
        cur = new PIXI.Graphics();
    }
    cur.lineStyle(2, 0xff4400);
    const p = c.curve_eval(0).p;
    cur.moveTo(p.x, p.y);
    for (let i = 1; i <= res; i++) {
        const p = c.curve_eval(i / res).p;
        cur.lineTo(p.x, p.y);
    }
    return cur;
}
let t = .5;
const circ = new PIXI.Graphics();
circ.beginFill(0xffff00).drawCircle(0, 0, 16).endFill();
const cur = new PIXI.Graphics();
function draw(testSpline) {
    cur.clear();
    plotCurve(testSpline, 1 << 13, cur);
}
draw(testSpline);
app.stage.addChild(cur);
app.stage.addChild(circ);
cur.position.x = 300;
cur.position.y = 300;
circ.position.x = 300;
circ.position.y = 300;
function physLoop(delta) {
    t += 1 / (1 << 9);
    const spl = testSplurf.curve_eval(t % 1);
    const p = spl.curve_eval(t % 1).p;
    draw(spl);
    {
        circ.clear();
        circ.moveTo(p.x, p.y);
        circ.beginFill(0xffff00).drawCircle(p.x, p.y, 8).endFill();
        if (false) {
            const pyr = testSpline.support_net(t % 1);
            for (let i = 0; i < pyr.length; i++) {
                const colr = 0x808080 + (0x7f7f7f & (Math.sin(i + 1) * 0xffffff));
                circ.moveTo(pyr[i][0].x, pyr[i][0].y);
                circ.beginFill(colr).drawCircle(pyr[i][0].x, pyr[i][0].y, 2).endFill();
                circ.moveTo(pyr[i][0].x, pyr[i][0].y);
                circ.lineStyle(.5, colr - 0x404040);
                for (let j = 1; j < pyr[i].length; j++) {
                    circ.lineTo(pyr[i][j].x, pyr[i][j].y);
                    circ.beginFill(colr).drawCircle(pyr[i][j].x, pyr[i][j].y, 2).endFill();
                    circ.moveTo(pyr[i][j].x, pyr[i][j].y);
                }
            }
        }
    }
    cur;
}
app.ticker.add(physLoop);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const UUID = __webpack_require__(8);
const threadDenominator = 100;
var threadi = 0;
const threadFunc = function (f, ...args) {
    if ((threadi = (threadi + 1) % threadDenominator) == 0) {
        setImmediate(f, ...args);
    }
    else {
        f(...args);
    }
};
class NegatedSet extends Set {
    constructor(a = []) {
        super(a);
    }
    add(value) {
        super.delete(value);
        return this;
    }
    has(value) {
        return !super.has(value);
    }
    fill() {
        return super.clear();
    }
    delete(value) {
        const r = super.has(value);
        super.add(value);
        return !r;
    }
    get size() {
        return -super.size;
    }
}
exports.NegatedSet = NegatedSet;
var Saveable;
(function (Saveable) {
    const implementations = [];
    function GetImplementations() {
        return implementations;
    }
    Saveable.GetImplementations = GetImplementations;
    function register(ctor) {
        implementations.push(ctor);
        return ctor;
    }
    Saveable.register = register;
})(Saveable || (Saveable = {}));
exports.Saveable = Saveable;
class BiMap {
    constructor() {
        this.f = new Map();
        this.b = new Map();
    }
    set(k, v) {
        this.f.set(k, v);
        this.b.set(v, k);
        return this;
    }
    get(k) {
        return this.f.get(k);
    }
    getKey(v) {
        return this.b.get(v);
    }
    has(k) {
        return this.f.has(k);
    }
    hasVal(v) {
        return this.b.has(v);
    }
    delete(k) {
        if (this.has(k)) {
            const v = this.f.get(k);
            this.f.delete(k);
            this.b.delete(v);
            return true;
        }
        else {
            return false;
        }
    }
    deleteVal(v) {
        if (this.hasVal(v)) {
            const k = this.b.get(v);
            this.f.delete(k);
            this.b.delete(v);
            return true;
        }
        else {
            return false;
        }
    }
    size() {
        return (this.f.size);
    }
}
exports.BiMap = BiMap;
function isIgnored(o, k) {
    if (o._saveIgnore != null) {
        return o._saveIgnore.has(k);
    }
    return false;
}
function Constructor(o) {
    return o;
}
class WrappedObject {
    constructor(N, o = null, t = null) {
        this.N = N;
        if (o != null) {
            this.O = o;
        }
        if (t != null) {
            this.T = t;
        }
    }
}
function getlowEntropyUUIDFunc() {
    let lowEntropyUUID_value = 0;
    function lowEntropyUUID() {
        return "" + (lowEntropyUUID_value++);
    }
    return lowEntropyUUID;
}
var lowEntropy = true;
var concise = true;
function getUUIDfunction() {
    var u = UUID;
    if (lowEntropy) {
        u = getlowEntropyUUIDFunc();
    }
    function getUUIDVerbose(o) {
        if (o.constructor != null) {
            return o.constructor.name + " instance named:" + o._saveName + " id:" + u();
        }
        else {
            return "unknown instance id:" + u();
        }
    }
    function getUUIDConcise(o) {
        return u();
    }
    if (concise) {
        return getUUIDConcise;
    }
    else {
        return getUUIDVerbose;
    }
}
class TreeProgressBar {
    constructor() { this.numerators = [0]; this.denominators = [1]; }
    getProgress() {
        var d = 1;
        var p = 0;
        for (var i = 0; i < this.numerators.length; i++) {
            if (this.denominators[i] != 0) {
                d *= this.denominators[i];
                p += this.numerators[i] / d;
            }
        }
        return p;
    }
    addSub(d) {
        this.numerators.push(0);
        this.denominators.push(d);
    }
    remSub() {
        this.numerators.pop();
        this.denominators.pop();
    }
    get numerator() {
        return this.numerators[this.numerators.length - 1];
    }
    set numerator(n) {
        this.numerators[this.numerators.length - 1] = n;
    }
    get denominator() {
        return this.denominators[this.denominators.length - 1];
    }
    set denominator(n) {
        this.denominators[this.denominators.length - 1] = n;
    }
}
exports.TreeProgressBar = TreeProgressBar;
function convertToJSONable(o, progBar = new TreeProgressBar(), names = new BiMap(), types = new Map(), uuidFunc = getUUIDfunction()) {
    if (names.hasVal(o)) {
        return new WrappedObject(names.getKey(o));
    }
    else {
        if (o == null) {
            return o;
        }
        if (o._saveSpecial != null) {
            return o._saveSpecial(names);
        }
        const uuid = uuidFunc(o);
        names.set(uuid, o);
        var obj = {};
        var ito = o;
        if (Array.isArray(o)) {
            obj = [];
        }
        else if (o instanceof Map) {
            ito = Array.from(o.entries());
            obj = [];
        }
        else if (o instanceof Set) {
            ito = Array.from(o);
            obj = [];
        }
        var name = "unknown type id:" + UUID();
        if (o.constructor != null) {
            name = "" + o.constructor.name;
        }
        const wo = new WrappedObject(uuid, obj, name);
        types.set(name, o.__proto__);
        progBar.addSub(0);
        for (var i in ito) {
            progBar.denominator++;
        }
        for (var i in ito) {
            if ((typeof ito[i]) == "object") {
                if (!isIgnored(o, i)) {
                    wo.O[i] = convertToJSONable(ito[i], progBar, names, types, uuidFunc);
                }
            }
            else {
                wo.O[i] = ito[i];
            }
            progBar.numerator++;
        }
        progBar.remSub();
        return wo;
    }
}
function threadFuncHalt(p, f, ...a) {
    if (!p.halt) {
        threadFunc(f, ...a);
    }
}
function asyncConvertToJSONable(o, pros, names = new BiMap(), types = new Map(), uuidFunc = getUUIDfunction(), cont) {
    const progBar = pros.progress;
    if (names.hasVal(o)) {
        threadFuncHalt(pros, cont, new WrappedObject(names.getKey(o)));
        return;
    }
    else {
        if (o == null) {
            threadFuncHalt(pros, cont, o);
            return;
        }
        if (o._saveSpecial != null) {
            threadFuncHalt(pros, cont, o._saveSpecial(names));
            return;
        }
        const uuid = uuidFunc(o);
        names.set(uuid, o);
        var obj = {};
        var ito = o;
        if (Array.isArray(o)) {
            obj = [];
        }
        else if (o instanceof Map) {
            ito = Array.from(o.entries());
            obj = [];
        }
        else if (o instanceof Set) {
            ito = Array.from(o);
            obj = [];
        }
        var name = "unknown type id:" + UUID();
        if (o.constructor != null) {
            name = "" + o.constructor.name;
        }
        const wo = new WrappedObject(uuid, obj, name);
        types.set(name, o.__proto__);
        progBar.addSub(0);
        const keys = [];
        for (var i in ito) {
            keys.push(i);
        }
        progBar.denominator = keys.length;
        var indx = 0;
        const iterstep = function (cont) {
            if (indx < keys.length) {
                const i = keys[indx];
                indx++;
                progBar.numerator++;
                if (!isIgnored(o, i)) {
                    if ((typeof ito[i]) == "object") {
                        const setandcont = function (res) {
                            wo.O[i] = res;
                            iterstep(cont);
                        };
                        threadFuncHalt(pros, asyncConvertToJSONable, ito[i], pros, names, types, uuidFunc, setandcont);
                        return;
                    }
                    else {
                        wo.O[i] = ito[i];
                        threadFuncHalt(pros, iterstep, cont);
                        return;
                    }
                }
                else {
                    threadFuncHalt(pros, iterstep, cont);
                    return;
                }
            }
            else {
                progBar.remSub();
                threadFuncHalt(pros, cont, wo);
                return;
            }
        };
        threadFuncHalt(pros, iterstep, cont);
    }
}
class UnresolvedReference {
    constructor(name, nameSpace, referers = []) {
        this.name = name;
        this.nameSpace = nameSpace;
        this.referers = referers;
        this._____isUnresolvedReference = true;
    }
    addReferer(o, n) {
        this.referers.push({ o: o, n: n });
    }
    tryResolve() {
        if (this.nameSpace.has(this.name)) {
            const r = this.nameSpace.get(this.name);
            for (var i in this.referers) {
                this.referers[i].o[this.referers[i].n] = r;
            }
            return true;
        }
        return false;
    }
}
function convertFromJSONable(o, progBar = new TreeProgressBar(), names = new Map(), types = new Map(), unresolvedRefs = new Set(), throwOnUnknownTypes = false, localObj = {}, localName = "") {
    if (o == null) {
        return o;
    }
    if (o.O == null) {
        if (names.has(o.N)) {
            const r = names.get(o.N);
            if (r._____isUnresolvedReference == true) {
                r.addReferer(localObj, localName);
            }
            return r;
        }
        else {
            const ur = new UnresolvedReference(o.N, names);
            ur.addReferer(localObj, localName);
            unresolvedRefs.add(ur);
            names.set(o.N, ur);
            return ur;
        }
    }
    else {
        if (!types.has(o.T)) {
            if (throwOnUnknownTypes) {
                throw new Error("Encountered unknown type:" + o.T);
            }
        }
        var ro = { __proto__: types.get(o.T) };
        if (o.T == "Array" || o.T == "Map" || o.T == "Set") {
            ro = [];
        }
        progBar.addSub(0);
        for (var i in o.O) {
            progBar.denominator++;
        }
        for (var i in o.O) {
            if ((typeof o.O[i]) == "object") {
                ro[i] = convertFromJSONable(o.O[i], progBar, names, types, unresolvedRefs, throwOnUnknownTypes, ro, i);
            }
            else {
                ro[i] = o.O[i];
            }
            progBar.numerator++;
        }
        progBar.remSub();
        if (o.T == "Map") {
            ro = new Map(ro);
        }
        else if (o.T == "Set") {
            ro = new Set(ro);
        }
        if (ro._loadSpecial != null) {
            ro = ro._loadSpecial();
        }
        if (names.has(o.N)) {
            const r = names.get(o.N);
            names.delete(o.N);
            if (r._____isUnresolvedReference == true) {
                names.set(o.N, ro);
                if (!r.tryResolve()) {
                    throw new Error("UnresolvedReference had wrong name or namespace.");
                }
                unresolvedRefs.delete(r);
                return ro;
            }
        }
        names.set(o.N, ro);
        return ro;
    }
}
function asyncConvertFromJSONable(o, pros, names = new Map(), types = new Map(), unresolvedRefs = new Set(), throwOnUnknownTypes = false, cont, localObj = {}, localName = "") {
    const progBar = pros.progress;
    if (o == null) {
        threadFuncHalt(pros, cont, o);
        return;
    }
    if (o.O == null) {
        if (names.has(o.N)) {
            const r = names.get(o.N);
            if (r._____isUnresolvedReference == true) {
                r.addReferer(localObj, localName);
            }
            threadFuncHalt(pros, cont, r);
            return;
        }
        else {
            const ur = new UnresolvedReference(o.N, names);
            ur.addReferer(localObj, localName);
            unresolvedRefs.add(ur);
            names.set(o.N, ur);
            threadFuncHalt(pros, cont, ur);
            return;
        }
    }
    else {
        if (!types.has(o.T)) {
            if (throwOnUnknownTypes) {
                pros.throw(new Error("Encountered unknown type:" + o.T));
                return;
            }
        }
        var ro = { __proto__: types.get(o.T) };
        if (o.T == "Array" || o.T == "Map" || o.T == "Set") {
            ro = [];
        }
        progBar.addSub(0);
        const keys = [];
        for (var i in o.O) {
            progBar.denominator++;
            keys.push(i);
        }
        var indx = 0;
        const loopStep = function (cont) {
            if (indx < keys.length) {
                const i = keys[indx];
                indx++;
                if ((typeof o.O[i]) == "object") {
                    const conti = function (o) {
                        ro[i] = o;
                        progBar.numerator++;
                        loopStep(cont);
                        return;
                    };
                    threadFuncHalt(pros, asyncConvertFromJSONable, o.O[i], pros, names, types, unresolvedRefs, throwOnUnknownTypes, conti, ro, i);
                }
                else {
                    ro[i] = o.O[i];
                    progBar.numerator++;
                    threadFuncHalt(pros, loopStep, cont);
                    return;
                }
            }
            else {
                progBar.remSub();
                if (o.T == "Map") {
                    ro = new Map(ro);
                }
                else if (o.T == "Set") {
                    ro = new Set(ro);
                }
                if (ro._loadSpecial != null) {
                    ro = ro._loadSpecial();
                }
                if (names.has(o.N)) {
                    const r = names.get(o.N);
                    names.delete(o.N);
                    if (r._____isUnresolvedReference == true) {
                        names.set(o.N, ro);
                        if (!r.tryResolve()) {
                            throw new Error("UnresolvedReference had wrong name or namespace.");
                        }
                        unresolvedRefs.delete(r);
                        threadFuncHalt(pros, cont, ro);
                        return;
                    }
                }
                names.set(o.N, ro);
                threadFuncHalt(pros, cont, ro);
                return;
            }
        };
        threadFuncHalt(pros, loopStep, cont);
        return;
    }
}
class functionWrapper {
    constructor(f) { this.code = f.toString(); }
    toFunction() {
        const func = eval("(" + this.code + ")");
        return func;
    }
}
class AsyncTreeProcess {
    constructor(progress) {
        this.progress = progress;
        this.done = false;
        this.failed = false;
        this.halt = false;
    }
    set(r) {
        this.result = r;
        this.done = true;
    }
    throw(e) {
        this.error = e;
        this.failed = true;
    }
    stop() {
        this.halt = true;
    }
}
exports.AsyncTreeProcess = AsyncTreeProcess;
function getSaveableTypes() {
    const prims = [Array, Map, Set];
    const types = new Map();
    for (var i in prims) {
        types.set(prims[i].name, prims[i].prototype);
    }
    const saveables = Saveable.GetImplementations();
    for (var x = 0; x < saveables.length; x++) {
        types.set(saveables[x].name, saveables[x].prototype);
    }
    return types;
}
function save(o, pbar = new TreeProgressBar(), names = new BiMap()) {
    const types = new Map();
    const jsonable = convertToJSONable(o, pbar, names, types);
    return JSON.stringify(jsonable);
}
exports.save = save;
function nop() { }
function asyncSave(o, names = new BiMap(), cb = (p) => nop()) {
    const pros = new AsyncTreeProcess(new TreeProgressBar());
    const ret = function (o) {
        pros.set(JSON.stringify(o));
        cb(pros);
    };
    const types = new Map();
    threadFunc(asyncConvertToJSONable, o, pros, names, types, getUUIDfunction(), ret);
    return pros;
}
exports.asyncSave = asyncSave;
function load(s, pbar = new TreeProgressBar(), names = new Map(), types = getSaveableTypes(), unresolvedRefs = new Set()) {
    const inObj = JSON.parse(s);
    return convertFromJSONable(inObj, pbar, names, types, unresolvedRefs);
}
exports.load = load;
function asyncLoad(s, cb = (p) => nop(), names = new Map(), types = getSaveableTypes(), unresolvedRefs = new Set()) {
    const inObj = JSON.parse(s);
    const pros = new AsyncTreeProcess(new TreeProgressBar());
    const ret = function (o) {
        pros.set(o);
        cb(pros);
    };
    threadFunc(asyncConvertFromJSONable, inObj, pros, names, types, unresolvedRefs, false, ret);
    return pros;
}
exports.asyncLoad = asyncLoad;
function copyStringToClipboard(str) {
    var el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
function download(filename, text) {
}
exports.download = download;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function ascending_search_right(arr, val, low = 0, high = Infinity) {
    low = Math.max(0, Math.floor(low));
    high = Math.min(Math.floor(high), arr.length - 1);
    while (low <= high) {
        const mid = Math.floor((high + low) / 2);
        const v = arr[mid];
        if (v < val)
            low = mid + 1;
        else if (v == val)
            return mid;
        else
            high = mid - 1;
    }
    return low;
}
exports.ascending_search_right = ascending_search_right;
function descending_search_right(arr, val, low = 0, high = Infinity) {
    low = Math.max(0, Math.floor(low));
    high = Math.min(Math.floor(high), arr.length - 1);
    while (low <= high) {
        const mid = Math.floor((high + low) / 2);
        const v = arr[mid];
        if (v > val)
            low = mid + 1;
        else if (v == val)
            return mid;
        else
            high = mid - 1;
    }
    return low;
}
exports.descending_search_right = descending_search_right;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function float_dif(a, b) {
    const dif = a - b;
    const prec = Math.abs(a) + Math.abs(b);
    if (prec == 0)
        return 0;
    return dif / prec;
}
exports.float_dif = float_dif;
function float_near(a, b, epsilon) {
    return Math.abs(float_dif(a, b)) <= epsilon;
}
exports.float_near = float_near;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("uuid/v4");

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWM4NGEzOGE4N2JlZDlmNjk0MWQiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGl4aS5qc1wiIiwid2VicGFjazovLy8uL2FwcC92ZWN0b3IvdmVjdG9yLnRzIiwid2VicGFjazovLy8uL2FwcC9jdXJ2ZS9iX3NwbGluZS50cyIsIndlYnBhY2s6Ly8vLi9hcHAvdmVjdG9yL3BvaW50MmQudHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2luZGV4LnRzIiwid2VicGFjazovLy8uL2FwcC9zYXZlLnRzIiwid2VicGFjazovLy8uL2FwcC90b29scy9iaW5hcnlfc2VhcmNoLnRzIiwid2VicGFjazovLy8uL2FwcC90b29scy9mbG9hdF9kaWZmZXJlbmNlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcInV1aWQvdjRcIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsb0M7Ozs7Ozs7OztBQ2FBLE1BQXNCLE1BQU07SUFVeEIsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBSUQsU0FBUyxDQUFDLEtBQVE7UUFDZCxPQUFPLElBQUksQ0FB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QUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMxQztRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMs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QUMsRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDNUosQ0FBQztJQUlELGNBQWMsQ0FBQyxnQkFBbUQsRUFBRTtRQUNoRSxNQUFNLEVBQUUsR0FBRztZQUNQLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoRixDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdFLENBQUM7UUFFRixNQUFNLENBQUMsR0FBUSxJQUFJLEtBQUssQ0FBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLEVBQUUsR0FBYSxJQUFJLEtBQUssQ0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNiLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQztRQUNELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixJQUFJLDZCQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3hELENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0M7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hFO1lBQ0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNaO1FBQ0QsT0FBTyxJQUFJLFVBQVEsQ0FBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUlELFFBQVE7UUFDSixPQUFPLElBQUksVUFBUSxDQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFDRCxPQUFPLENBQUMsS0FBa0I7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWtCO1FBQzNCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN0QyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDVixNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVuRSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQixNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFakMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO1FBQ3hCLElBQUksSUFBSSxHQUFhLEVBQUUsQ0FBQztRQUN4QixJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7UUFDeEIsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUMzQyxJQUFJLDZCQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDcEQsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBR1AsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2xDO3FCQUFNO29CQUNILElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFHUCxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ25DO2lCQUNKO2dCQUNELEVBQUUsRUFBRSxDQUFDO2dCQUNMLEVBQUUsRUFBRSxDQUFDO2FBQ1I7aUJBQU07Z0JBQ0gsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBR3ZCLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLEVBQUUsRUFBRSxDQUFDO2lCQUNSO3FCQUFNO29CQUdILEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLEVBQUUsRUFBRSxDQUFDO2lCQUNSO2FBQ0o7U0FDSjtRQUNELE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBR3RCLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEMsRUFBRSxFQUFFLENBQUM7U0FDUjtRQUNELE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBR3RCLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsRUFBRSxFQUFFLENBQUM7U0FDUjtRQUlELEdBQUcsR0FBRyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RCxLQUFLLEdBQUcsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFHN0QsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxPQUFPLENBQUMsS0FBa0I7UUFDdEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDbEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxJQUFJLFVBQVEsQ0FBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTlDLENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUztRQUNmLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7WUFDL0MsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sSUFBSSxVQUFRLENBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBR0o7QUFwZFUsZ0JBQU8sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFGNUIsUUFBUTtJQURwQixlQUFRLENBQUMsUUFBUTtHQUNMLFFBQVEsQ0FzZHBCO0FBdGRZLDRCQUFRO0FBd2RyQixJQUFhLFFBQVEsZ0JBQXJCLE1BQWEsUUFBZ0MsU0FBUSxlQUFtQjtJQUVwRSxZQUFtQixLQUFVO1FBQUksS0FBSyxFQUFFLENBQUM7UUFBdEIsVUFBSyxHQUFMLEtBQUssQ0FBSztJQUFhLENBQUM7SUFDM0MsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUNELFVBQVUsQ0FBQyxDQUFTO1FBQ2hCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDckI7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxnQkFBZ0IsQ0FBQyxJQUFZLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNqQixPQUFPLElBQUksVUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksVUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNELGNBQWMsQ0FBQyxJQUFZLENBQUM7UUFDeEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxNQUFNLENBQUMsR0FBUSxLQUFLLENBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsT0FBTyxJQUFJLFVBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxDQUFDLENBQVM7UUFDVixPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQWtCO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQy9CLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFF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LElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRTNELElBQUksS0FBSyxFQUFFO1lBQ1AsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2pDLE1BQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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XG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGFjODRhMzhhODdiZWQ5ZjY5NDFkIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBpeGkuanNcIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcblxuLy9mdW5jdGlvbiBjb21waWxlX2V4cHI8VCBleHRlbmRzIFZlY3RvcjxUPj4oZXhwcjogc3RyaW5nKTogKGE6IFZlY3RvcjxUPltdKSA9PiBWZWN0b3I8VD4ge1xuXG5cblxuXG4vL31cblxuXG5cblxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmVjdG9yPFQgZXh0ZW5kcyBWZWN0b3I8VD4+e1xuXG4gICAgLy8gICAgY29uc3RydWN0b3IoKSB7IH0gLy96ZXJvXG5cbiAgICBhYnN0cmFjdCB2ZWNfYWRkKG90aGVyOiBUKTogVDtcbiAgICBhYnN0cmFjdCB2ZWNfc2NhbGUoczogbnVtYmVyKTogVDtcblxuICAgIGFic3RyYWN0IHZlY19jb3B5KCk6IFQ7IC8vc2hhbGxvdyBjb3B5IG9mIHZlY3RvclxuICAgIGFic3RyYWN0IHZlY19zZXQob3RoZXI6IFQpOiBUOy8vc2V0cyB0aGlzIHZlY3RvciB0byBhbm90aGVyIHZlY3RvclxuXG4gICAgdmVjX3plcm8oKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlY19zY2FsZSgwKTtcbiAgICB9XG5cblxuICAgIC8vb3B0aW9uYWwgb3B0aW1pemF0aW9uIHN0dWZmXG4gICAgdmVjX2FkZEVxKG90aGVyOiBUKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlY19zZXQodGhpcy52ZWNfYWRkKG90aGVyKSk7XG4gICAgfVxuICAgIHZlY19hZGREKG90aGVyOiBUKTogVCB7XG4gICAgICAgIHJldHVybiBvdGhlci52ZWNfYWRkRXEodGhpcyBhcyBhbnkgYXMgVCk7XG4gICAgfVxuICAgIHZlY19hZGRERXEob3RoZXI6IFQpOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVjX2FkZEVxKG90aGVyKTtcbiAgICB9XG5cbiAgICB2ZWNfZm1hRXEob3RoZXI6IFQsIHNjYWxlOiBudW1iZXIpOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVjX2FkZERFcShvdGhlci52ZWNfc2NhbGUoc2NhbGUpKTtcbiAgICB9XG5cbiAgICB2ZWNfbmVnKCk6IFQge1xuICAgICAgICByZXR1cm4gdGhpcy52ZWNfc2NhbGUoLTEpO1xuICAgIH1cbiAgICB2ZWNfbmVnRXEoKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlY19zY2FsZUVxKC0xKTtcbiAgICB9XG5cbiAgICB2ZWNfc3ViKG90aGVyOiBUKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlY19hZGQob3RoZXIudmVjX25lZygpKTtcbiAgICB9XG4gICAgdmVjX3N1YkVxKG90aGVyOiBUKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlY19hZGRFcShvdGhlci52ZWNfbmVnKCkpO1xuICAgIH1cbiAgICB2ZWNfc3ViRChvdGhlcjogVCk6IFQge1xuICAgICAgICByZXR1cm4gb3RoZXIudmVjX25lZ0VxKCkudmVjX2FkZEVxKHRoaXMgYXMgYW55IGFzIFQpO1xuICAgIH1cbiAgICB2ZWNfc3ViREVxKG90aGVyOiBUKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlY19zdWJFcShvdGhlcik7XG4gICAgfVxuXG4gICAgdmVjX3NjYWxlRXEoczogbnVtYmVyKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlY19zZXQodGhpcy52ZWNfc2NhbGUocykpO1xuICAgIH1cblxuICAgIHZlY19sZXJwKG90aGVyOiBULCBhbHBoYTogbnVtYmVyKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlY19zY2FsZSgxIC0gYWxwaGEpLnZlY19hZGRERXEob3RoZXIudmVjX3NjYWxlKGFscGhhKSk7XG4gICAgfVxuICAgIHZlY19sZXJwRXEob3RoZXI6IFQsIGFscGhhOiBudW1iZXIpOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVjX3NjYWxlRXEoMSAtIGFscGhhKS52ZWNfYWRkREVxKG90aGVyLnZlY19zY2FsZShhbHBoYSkpO1xuICAgIH1cbiAgICB2ZWNfbGVycEQob3RoZXI6IFQsIGFscGhhOiBudW1iZXIpOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVjX3NjYWxlKDEgLSBhbHBoYSkudmVjX2FkZERFcShvdGhlci52ZWNfc2NhbGVFcShhbHBoYSkpO1xuICAgIH1cbiAgICB2ZWNfbGVycERFcShvdGhlcjogVCwgYWxwaGE6IG51bWJlcik6IFQge1xuICAgICAgICByZXR1cm4gdGhpcy52ZWNfc2NhbGVFcSgxIC0gYWxwaGEpLnZlY19hZGRERXEob3RoZXIudmVjX3NjYWxlRXEoYWxwaGEpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9ybWVkVmVjdG9yPFQgZXh0ZW5kcyBOb3JtZWRWZWN0b3I8VD4+IGV4dGVuZHMgVmVjdG9yPFQ+IHtcbiAgICB2ZWNfbm9ybTogKCkgPT4gbnVtYmVyO1xuICAgIHZlY19ub3JtMjogKCkgPT4gbnVtYmVyO1xufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvdmVjdG9yL3ZlY3Rvci50cyIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi92ZWN0b3IvdmVjdG9yXCI7XG5pbXBvcnQgeyBORFZlY3RvciB9IGZyb20gXCIuLi92ZWN0b3IvbmR2ZWNcIjtcbmltcG9ydCB7IEN1cnZlIH0gZnJvbSBcIi4vY3VydmVcIjtcbmltcG9ydCB7IFNhdmVhYmxlIH0gZnJvbSBcIi4uL3NhdmVcIjtcbmltcG9ydCB7IGFzY2VuZGluZ19zZWFyY2hfcmlnaHQgfSBmcm9tIFwiLi4vdG9vbHMvYmluYXJ5X3NlYXJjaFwiO1xuaW1wb3J0IHsgZmxvYXRfbmVhciB9IGZyb20gXCIuLi90b29scy9mbG9hdF9kaWZmZXJlbmNlXCI7XG5cblxuXG5AU2F2ZWFibGUucmVnaXN0ZXJcbmV4cG9ydCBjbGFzcyBCX1NwbGluZTxUIGV4dGVuZHMgVmVjdG9yPGFueT4+IGV4dGVuZHMgVmVjdG9yPEJfU3BsaW5lPFQ+PiBpbXBsZW1lbnRzIEN1cnZlPFQ+LCBTYXZlYWJsZSB7XG4gICAgX3NhdmVOYW1lPzogc3RyaW5nO1xuICAgIHN0YXRpYyBFUFNJTE9OID0gMSAvIDI1NiAvIDI1NiAvIDI1NjsgLy8gMjU2IC8gMjU2IC8gMjU2OyAvLyB1c2VkIGZvciBrbm90IGVxdWFsaXR5IHRlc3RzXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvbnRyb2xfcG9pbnRzOiBUW10sIHB1YmxpYyBrbm90X3ZlYzogbnVtYmVyW10pIHsgc3VwZXIoKTsgfVxuICAgIGdldCBvcmRlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5rbm90X3ZlYy5sZW5ndGggLSB0aGlzLmNvbnRyb2xfcG9pbnRzLmxlbmd0aDtcbiAgICB9XG4gICAgY3VydmVfZXZhbCh0OiBudW1iZXIpOiBUIHtcbiAgICAgICAgaWYgKHRoaXMub3JkZXIgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbF9wb2ludHNbMF0udmVjX3plcm8oKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiID0gdGhpcy5iYXNpcyh0KTtcbiAgICAgICAgY29uc3QgdiA9IHRoaXMuY29udHJvbF9wb2ludHNbYi5zdGFydF0udmVjX3NjYWxlKGIud2VpZ2h0c1swXSkgYXMgVDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBiLndlaWdodHMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB2LnZlY19mbWFFcSh0aGlzLmNvbnRyb2xfcG9pbnRzW2Iuc3RhcnQgKyBpXSwgYi53ZWlnaHRzW2ldKTtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICAgIGJhc2lzKHQ6IG51bWJlcik6IHsgc3RhcnQ6IG51bWJlciwgd2VpZ2h0czogbnVtYmVyW10gfSB7XG4gICAgICAgIGNvbnN0IG8gPSB0aGlzLm9yZGVyO1xuICAgICAgICBsZXQgcmVnaW9uID0gYXNjZW5kaW5nX3NlYXJjaF9yaWdodCh0aGlzLmtub3RfdmVjLCB0KTtcbiAgICAgICAgLy90aGlzIGxvb3AgcHJldmVudHMgdW5wcmVkaWN0YWJsZSByZXR1cm5pbmcgb2Yga3JvbmVja2VyIGRlbHRhcyBpbiB0aGUgY3VydmVcbiAgICAgICAgd2hpbGUgKHJlZ2lvbiA8IHRoaXMua25vdF92ZWMubGVuZ3RoICYmIGZsb2F0X25lYXIodGhpcy5rbm90X3ZlY1tyZWdpb25dLCB0LCBCX1NwbGluZS5FUFNJTE9OKSkge1xuICAgICAgICAgICAgcmVnaW9uKys7XG4gICAgICAgIH0vL2N1cnZlIHJlZ2lvbnMgYXJlIFtsb3csaGlnaClcblxuICAgICAgICAvL28gaXMgaG93IG1hbnkgY29udHJvbCBwb2ludHMgYXJlIG5lZWRlZCB0byBjYWxjdWxhdGVcblxuICAgICAgICBjb25zdCBrID0gTWF0aC5tYXgobywgTWF0aC5taW4odGhpcy5rbm90X3ZlYy5sZW5ndGggLSBvLCByZWdpb24pKTtcbiAgICAgICAgY29uc3QgYndlaWdodHMgPSB0aGlzLmJhc2lzX0lUUyhrIC0gMSwgbyAtIDEsIHQpO1xuICAgICAgICAvL3JldHVybiB7IHN0YXJ0OiByZWdpb24gLSBwLCB3ZWlnaHRzOiBid2VpZ2h0cyB9O1xuXG5cbiAgICAgICAgcmV0dXJuIHsgc3RhcnQ6IGsgLSBvLCB3ZWlnaHRzOiBid2VpZ2h0cyB9O1xuICAgIH1cbiAgICBiYXNpc19JVFMoazogbnVtYmVyLCBwOiBudW1iZXIsIHU6IG51bWJlcik6IG51bWJlcltdIHtcbiAgICAgICAgLy9pbnZlcnRlZCB0cmlhbmd1bGFyIHNjaGVtZSBmcm9tIGhlcmU6XG4gICAgICAgIC8vIGh0dHBzOi8vd3d3LnJlc2VhcmNoZ2F0ZS5uZXQvcHVibGljYXRpb24vMjI4NDExNzIxX1RpbWUtRWZmaWNpZW50X05VUkJTX0N1cnZlX0V2YWx1YXRpb25fQWxnb3JpdGhtc1xuICAgICAgICAvL1xuICAgICAgICAvLyBCYXNpc19JVFMxKGssIHAsIHUpXG4gICAgICAgIGNvbnN0IE46IG51bWJlcltdID0gQXJyYXk8bnVtYmVyPihwICsgMSkuZmlsbCgwKTtcbiAgICAgICAgLy8gMS4gTlswXSA9IDFcbiAgICAgICAgTltwXSA9IDE7XG4gICAgICAgIC8vIDIuIGZvciAoaSA9IDE7IGkgPD0gcDsgaSsrKVxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBwOyBpKyspIHtcbiAgICAgICAgICAgIC8vIDIuMS4gZm9yIGogPSBpIC0gMTsgaiA+PSAwOyBqLS0pXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgICAgICAgICAgLy8gMi4xLjEuIEEgPSAodSAtIGtub3RzW2sgLSBqXSkgLyAgIFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAoa25vdHNbayArIGkgLSBqXSAtIGtub3RzW2sgLSBqXSlcbiAgICAgICAgICAgICAgICBjb25zdCBhbiA9ICh1IC0gdGhpcy5rbm90X3ZlY1trIC0gal0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFkID0gKHRoaXMua25vdF92ZWNbayArIGkgLSBqXSAtIHRoaXMua25vdF92ZWNbayAtIGpdKTtcbiAgICAgICAgICAgICAgICBjb25zdCBBID0gKGFkICE9IDApID8gYW4gLyBhZCA6IDA7XG4gICAgICAgICAgICAgICAgLy8gMi4xLjIuIHRtcCA9IE5bal0gKiBBXG4gICAgICAgICAgICAgICAgY29uc3QgdG1wID0gTltwIC0gal0gKiBBO1xuICAgICAgICAgICAgICAgIC8vMi4xLjMuIE5baiArIDFdICs9IE5bal0gLSB0bXBcbiAgICAgICAgICAgICAgICBOW3AgLSAoaiArIDEpXSArPSBOW3AgLSBqXSAtIHRtcDtcbiAgICAgICAgICAgICAgICAvLzIuMS40LiBOW2pdID0gdG1wXG4gICAgICAgICAgICAgICAgTltwIC0gal0gPSB0bXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4gcmV0dXJuIE5cbiAgICAgICAgcmV0dXJuIE47XG4gICAgfVxuICAgIC8vIGh0dHBzOi8vcGFnZXMubXR1LmVkdS9+c2hlbmUvQ09VUlNFUy9jczM2MjEvTk9URVMvc3BsaW5lL0Itc3BsaW5lL2RlLUJvb3IuaHRtbFxuICAgIC8qRGVCb29yX2NvZWZfdHJpYW5nbGUoazogbnVtYmVyLCBwOiBudW1iZXIsIHQ6IG51bWJlciwgaDogbnVtYmVyKTogTkRWZWN0b3JbXVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBORFZlY3RvcltdW10gPSBbQXJyYXk8TkRWZWN0b3I+KHAgKyAxKS5maWxsKG5ldyBORFZlY3RvcihbMV0pKV07XG4gICAgICAgIC8vIFBfaSwwIGlzIHJlc1swXVtpLWtdXG4gICAgICAgIGZvciAobGV0IHIgPSAxOyByIDw9IGg7IHIrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGsgLSBwICsgcjsgaSA8PSBrLyotcyogLzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYW4gPSAodCAtIHRoaXMua25vdF92ZWNbaV0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFkID0gKHRoaXMua25vdF92ZWNbaSArIHAgLSByICsgMV0gLSB0aGlzLmtub3RfdmVjW2ldKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhaXIgPSAoYWQgIT0gMCkgPyBhbiAvIGFkIDogKGFuID49IDAgPyAxIDogMCk7XG4gICAgICAgICAgICAgICAgLy9QX2lyID0gdGhpbmdcbiAgICAgICAgICAgICAgICByZXNbcl1baV0gPSByZXNbciAtIDFdW2kgLSAxXS52ZWNfbGVycChyZXNbciAtIDFdW2ldLnNoaWZ0KDEpLCBhaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSovXG4gICAgLy8gaHR0cHM6Ly9wYWdlcy5tdHUuZWR1L35zaGVuZS9DT1VSU0VTL2NzMzYyMS9OT1RFUy9zcGxpbmUvQi1zcGxpbmUvbXVsdGlwbGUtdGltZS5odG1sXG4gICAgX2luc2VydF9rbm90X3Jlc19hbmRfaW5kKHQ6IG51bWJlciwgdGltZXM6IG51bWJlciA9IDEpIHtcbiAgICAgICAgY29uc3QgcmVnaW9uID0gYXNjZW5kaW5nX3NlYXJjaF9yaWdodCh0aGlzLmtub3RfdmVjLCB0KTtcbiAgICAgICAgY29uc3QgbyA9IHRoaXMub3JkZXI7XG4gICAgICAgIGNvbnN0IGsgPSBNYXRoLm1heChvLCBNYXRoLm1pbih0aGlzLmtub3RfdmVjLmxlbmd0aCAtIG8sIHJlZ2lvbikpO1xuICAgICAgICAvL2NhbiB1c2UgYmFzaXNfSVRTIGZvciB0aGlzXG4gICAgICAgIC8vIGJ1dCB0aGF0J3MgbGVzcyBlZmZpY2llbnRcbiAgICAgICAgLy8gc28gSSBtYWtlIGEgc2VwZXJhdGUgZnVuY1xuICAgICAgICAvL2NvbnN0IHRyaSA9IHRoaXMuRGVCb29yX2NvZWZfdHJpYW5nbGUoayAtIDEsIG8gLSAxLCB0LCBNYXRoLm1pbihvIC0gMSwgdGltZXMpKTtcbiAgICAgICAgY29uc3QgdHJpID0gdGhpcy5zdXBwb3J0X25ldCh0LCB0aW1lcyk7XG4gICAgICAgIGNvbnN0IHJlczogVFtdID0gQXJyYXk8VD4odGltZXMgKyBvIC0gMik7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdHJpLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgcmVzW2kgLSAxXSA9IHRyaVtpXVswXTtcbiAgICAgICAgICAgIHJlc1tyZXMubGVuZ3RoIC0gaV0gPSB0cmlbaV1bdHJpW2ldLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmlbdHJpLmxlbmd0aCAtIDFdLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3QgcCA9IHRyaVt0cmkubGVuZ3RoIC0gMV1bMF07XG4gICAgICAgICAgICByZXNbdHJpLmxlbmd0aCAtIDJdID0gcDtcbiAgICAgICAgICAgIHJlc1tyZXMubGVuZ3RoIC0gdHJpLmxlbmd0aCArIDFdID0gcDtcbiAgICAgICAgICAgIGNvbnN0IHogPSBwLnZlY196ZXJvKCk7Ly9kb250IHB1dCBrcm9uZWNrZXIgZGVsdGFzIHdoZXJlIHRoZXJlIHNob3VsZG4ndCBiZVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRyaS5sZW5ndGggLSAxOyBpIDwgcmVzLmxlbmd0aCAtIHRyaS5sZW5ndGggKyAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZXNbaV0gPSB6O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmlbdHJpLmxlbmd0aCAtIDFdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVzW2kgKyB0cmkubGVuZ3RoIC0gMl0gPSB0cmlbdHJpLmxlbmd0aCAtIDFdW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGtyZXMgPSBBcnJheTxudW1iZXI+KHRpbWVzKS5maWxsKHQpO1xuICAgICAgICByZXR1cm4geyByZXM6IHsgYTogcmVzLCBzOiBrIC0gbyArIDEsIGQ6IG8gLSAyIH0sIGtyZXM6IHsgYToga3JlcywgczogcmVnaW9uLCBkOiAwIH0gfTtcblxuICAgIH1cbiAgICBpbnNlcnRfa25vdCh0OiBudW1iZXIsIHRpbWVzOiBudW1iZXIgPSAxKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMuX2luc2VydF9rbm90X3Jlc19hbmRfaW5kKHQsIHRpbWVzKTtcbiAgICAgICAgdGhpcy5jb250cm9sX3BvaW50cy5zcGxpY2Uoci5yZXMucywgci5yZXMuZCwgLi4uci5yZXMuYSk7XG4gICAgICAgIHRoaXMua25vdF92ZWMuc3BsaWNlKHIua3Jlcy5zLCByLmtyZXMuZCwgLi4uci5rcmVzLmEpO1xuICAgICAgICByZXR1cm4gci5rcmVzLnM7XG4gICAgfVxuXG4gICAgQ0RCX3RyaWFuZ2xlKGs6IG51bWJlciwgcDogbnVtYmVyLCB0OiBudW1iZXIsIGggPSBJbmZpbml0eSk6IFRbXVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBUW11bXSA9IFtdO1xuICAgICAgICByZXNbMF0gPSBBcnJheTxUPihwICsgMSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzWzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXNbMF1baV0gPSB0aGlzLmNvbnRyb2xfcG9pbnRzW2sgKyBpXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCByID0gMTsgciA8PSBwICYmIHIgPD0gaDsgcisrKSB7XG4gICAgICAgICAgICByZXNbcl0gPSBBcnJheTxUPihwICsgMSAtIHIpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXNbcl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBiaSA9IGsgKyBpICsgcjtcbiAgICAgICAgICAgICAgICBjb25zdCBzID0gcCAtIHIgKyAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuID0gKHQgLSB0aGlzLmtub3RfdmVjW2JpXSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWQgPSAodGhpcy5rbm90X3ZlY1tiaSArIHNdIC0gdGhpcy5rbm90X3ZlY1tiaV0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoYWQgIT0gMCkgPyBhbiAvIGFkIDogMDtcbiAgICAgICAgICAgICAgICByZXNbcl1baV0gPSByZXNbciAtIDFdW2ldLnZlY19sZXJwKHJlc1tyIC0gMV1baSArIDFdLCBhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBzdXBwb3J0X25ldCh0OiBudW1iZXIsIGggPSBJbmZpbml0eSk6IFRbXVtdIHtcbiAgICAgICAgY29uc3QgbyA9IHRoaXMub3JkZXI7XG4gICAgICAgIGNvbnN0IHJlZ2lvbiA9IGFzY2VuZGluZ19zZWFyY2hfcmlnaHQodGhpcy5rbm90X3ZlYywgdCk7XG4gICAgICAgIGNvbnN0IGsgPSBNYXRoLm1heChvLCBNYXRoLm1pbih0aGlzLmtub3RfdmVjLmxlbmd0aCAtIG8sIHJlZ2lvbikpO1xuICAgICAgICByZXR1cm4gdGhpcy5DREJfdHJpYW5nbGUoayAtIG8sIG8gLSAxLCB0LCBoKTtcbiAgICB9XG4gICAgZWZmZWN0ZWRfcmVnaW9uKGs6IG51bWJlcik6IHsgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIgfSB7XG4gICAgICAgIGNvbnN0IHAgPSB0aGlzLm9yZGVyIC0gMTtcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQ6IHRoaXMua25vdF92ZWNbTWF0aC5tYXgoMCwgayAtIHApXSwgZW5kOiB0aGlzLmtub3RfdmVjW01hdGgubWluKHRoaXMua25vdF92ZWMubGVuZ3RoLCBrICsgcCArIDEpXSB9O1xuICAgIH1cblxuICAgIGJpc2VjdCh0OiBudW1iZXIpOiB7IGxvdzogQl9TcGxpbmU8VD4sIGhpZ2g6IEJfU3BsaW5lPFQ+IH0ge1xuICAgICAgICBjb25zdCBwID0gdGhpcy5vcmRlciAtIDE7XG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLnZlY19jb3B5KCk7XG4gICAgICAgIGNvbnN0IHIgPSBjLmluc2VydF9rbm90KHQsIHApO1xuICAgICAgICBjb25zdCBsID0gYy5jb250cm9sX3BvaW50cy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGxvdyA9IG5ldyBCX1NwbGluZTxUPihjLmNvbnRyb2xfcG9pbnRzLnNsaWNlKDAsIE1hdGgubWF4KHAsIHIpKSwgYy5rbm90X3ZlYy5zbGljZSgwLCBNYXRoLm1heChwLCByICsgcCArIDEpKSk7XG4gICAgICAgIGNvbnN0IGhpZ2ggPSBuZXcgQl9TcGxpbmU8VD4oYy5jb250cm9sX3BvaW50cy5zbGljZShNYXRoLm1pbihyIC0gMSwgbCAtIHAgLSAxKSksIGMua25vdF92ZWMuc2xpY2UoTWF0aC5taW4ociArIHAsIGwpKSk7XG4gICAgICAgIHJldHVybiB7IGxvdzogbG93LCBoaWdoOiBoaWdoIH07XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly93d3cuY3MudXRleGFzLmVkdS9+aHVhbmdxeC9jYWdkMjAwNV9kZWdyZWUucGRmXG4gICAgLy8gIF4gY291bGQgYmUgdXNlZnVsXG4gICAgcmxlX2tub3RfdmVjKCk6IHsgdTogbnVtYmVyW10sIHo6IG51bWJlcltdIH0ge1xuICAgICAgICBjb25zdCB1OiBudW1iZXJbXSA9IFt0aGlzLmtub3RfdmVjWzBdXTtcbiAgICAgICAgY29uc3QgejogbnVtYmVyW10gPSBbMV07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmtub3RfdmVjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZmxvYXRfbmVhcih1W3UubGVuZ3RoIC0gMV0sIHRoaXMua25vdF92ZWNbaV0sIEJfU3BsaW5lLkVQU0lMT04pKSB7XG4gICAgICAgICAgICAgICAgelt6Lmxlbmd0aCAtIDFdKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHUucHVzaCh0aGlzLmtub3RfdmVjW2ldKTtcbiAgICAgICAgICAgICAgICB6LnB1c2goMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdTogdSwgejogeiB9O1xuICAgIH1cblxuICAgIGRlZ3JlZV9lbGV2YXRlX2FuZF9pbnNlcnRfa25vdHMobTogbnVtYmVyLCB0OiBudW1iZXJbXSwgdGltZXM6IG51bWJlcltdKTogQl9TcGxpbmU8VD4ge1xuICAgICAgICBjb25zdCBrb25zdHMgPSBBcnJheTx7IGw6IG51bWJlciwgaDogbnVtYmVyLCBjOiBUIH0+KHRoaXMub3JkZXIgLSAxKTtcbiAgICAgICAgbGV0IGN1cnY6IEJfU3BsaW5lPFQ+ID0gdGhpcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrb25zdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBjdXJ2LmN1cnZlX2Rlcml2YXRpdmUoKTtcbiAgICAgICAgICAgIGtvbnN0c1tpXSA9IHIudHJpbW1lZF9rbm90cztcbiAgICAgICAgICAgIGN1cnYgPSByLmN1cnZlO1xuICAgICAgICB9XG4gICAgICAgIC8vZGVncmVlIGVsZXZhdGUgdGhlIGNvbnN0YW50IGN1cnZlXG4gICAgICAgIGNvbnN0IGtyZSA9IGN1cnYucmxlX2tub3RfdmVjKCk7XG4gICAgICAgIGNvbnN0IHJwID0gbmV3IEFycmF5PFQ+KGN1cnYuY29udHJvbF9wb2ludHMubGVuZ3RoICsgbSAqIChrcmUudS5sZW5ndGggLSAxKSk7XG4gICAgICAgIGNvbnN0IHJrID0gbmV3IEFycmF5PG51bWJlcj4oY3Vydi5rbm90X3ZlYy5sZW5ndGggKyBtICogKGtyZS51Lmxlbmd0aCkpO1xuICAgICAgICBsZXQgcmkgPSAwLCBzaSA9IDAsIHRpID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrcmUudS5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIC8qd2hpbGUgKHRpIDwgdC5sZW5ndGggJiYgY3Vydi5rbm90X3ZlY1tzaV0gPiB0W3RpXSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGltZXNbdGldICYmIGogPCBtOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcnBbcmldID0gY3Vydi5jb250cm9sX3BvaW50c1tzaV07XG4gICAgICAgICAgICAgICAgICAgIHJrW3JpXSA9IHRbdGldO1xuICAgICAgICAgICAgICAgICAgICByaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobSA8IHRpbWVzW3RpXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB6ID0gY3Vydi5jb250cm9sX3BvaW50c1tzaV0udmVjX3plcm8oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IG07IGogPCB0aW1lc1t0aV07IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcnBbcmldID0gejtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJrW3JpXSA9IHRbdGldO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aSsrO1xuICAgICAgICAgICAgfSovXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtyZS56W2ldOyBqKyspIHtcbiAgICAgICAgICAgICAgICBycFtyaV0gPSBjdXJ2LmNvbnRyb2xfcG9pbnRzW3NpXTtcbiAgICAgICAgICAgICAgICBya1tyaV0gPSBjdXJ2Lmtub3RfdmVjW3NpXTtcbiAgICAgICAgICAgICAgICByaSsrO1xuICAgICAgICAgICAgICAgIHNpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG07IGorKykge1xuICAgICAgICAgICAgICAgIHJwW3JpXSA9IHJwW3JpIC0gMV07XG4gICAgICAgICAgICAgICAgcmtbcmldID0gcmtbcmkgLSAxXTtcbiAgICAgICAgICAgICAgICByaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwga3JlLnpba3JlLnoubGVuZ3RoIC0gMV0gLSAxOyBqKyspIHtcbiAgICAgICAgICAgIHJwW3JpXSA9IGN1cnYuY29udHJvbF9wb2ludHNbc2ldO1xuICAgICAgICAgICAgcmtbcmldID0gY3Vydi5rbm90X3ZlY1tzaV07XG4gICAgICAgICAgICByaSsrO1xuICAgICAgICAgICAgc2krKztcbiAgICAgICAgfVxuICAgICAgICBya1tyaV0gPSBjdXJ2Lmtub3RfdmVjW3NpXTtcbiAgICAgICAgcmkrKztcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtOyBqKyspIHtcbiAgICAgICAgICAgIHJrW3JpXSA9IHJrW3JpIC0gMV07XG4gICAgICAgICAgICByaSsrO1xuICAgICAgICB9XG5cblx0XHQvKmN1cnYua25vdF92ZWMgPSBbLi4ucmtdO1xuXHRcdGN1cnYuY29udHJvbF9wb2ludHMgPSBbLi4ucnBdO1xuXG4gICAgICAgIC8vaW5zZXJ0IHRoZSBrbm90c1xuXHRcdGZvciAobGV0IHRpID0gMDsgdGkgPCB0Lmxlbmd0aDt0aSsrKXtcblx0XHRcdGN1cnYuX2luc2VydF9rbm90X3Jlc19hbmRfaW5kKFxuXHRcdFx0XHRcblx0XHR9Ki9cblxuXG4gICAgICAgIGN1cnYua25vdF92ZWMgPSByaztcbiAgICAgICAgY3Vydi5jb250cm9sX3BvaW50cyA9IHJwO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3Vydi5pbnNlcnRfa25vdCh0W2ldLCB0aW1lc1tpXSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vcmUtaW50ZWdyYXRlIHRoZSBjdXJ2ZVxuICAgICAgICBmb3IgKGxldCBpID0ga29uc3RzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjdXJ2ID0gY3Vydi5jdXJ2ZV9pbnRlZ3JhbChrb25zdHNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnY7XG5cbiAgICAgICAgLyovL2NvbnN0IHAwOiBUW10gPSBcbiAgICAgICAgY29uc3Qga3JsZSA9IHRoaXMucmxlX2tub3RfdmVjKCk7XG4gICAgICAgIGNvbnN0IHU6IG51bWJlcltdID0gW107XG4gICAgICAgIGNvbnN0IHo6IG51bWJlcltdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IGtybGUuei5sZW5ndGggfHwgaiA8IHQubGVuZ3RoOykge1xuICAgICAgICAgICAgaWYgKGkgPCBrcmxlLnoubGVuZ3RoICYmIGogPCB0Lmxlbmd0aCAmJiBmbG9hdF9uZWFyKGtybGUudVtpXSwgdFtqXSwgQl9TcGxpbmUuRVBTSUxPTikpIHtcbiAgICAgICAgICAgICAgICB1LnB1c2goKHRbal0gKyBrcmxlLnVbaV0pIC8gMik7XG4gICAgICAgICAgICAgICAgei5wdXNoKHRpbWVzW2pdICsga3JsZS56W2ldICsgbSk7XG4gICAgICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPj0ga3JsZS56Lmxlbmd0aCB8fCAoaiA8IHQubGVuZ3RoICYmIHRbal0gPCBrcmxlLnVbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHUucHVzaCh0W2pdKTtcbiAgICAgICAgICAgICAgICAgICAgei5wdXNoKHRpbWVzW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHUucHVzaChrcmxlLnVbaV0pO1xuICAgICAgICAgICAgICAgICAgICB6LnB1c2goa3JsZS56W2ldICsgbSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2VxbigxOSlcbiAgICAgICAgLy8gUChpLGopID0gKFAoaSsxLGotMSktUChpLGotMSkpLyh0KGkrayktdChpK2wpKVxuICAgICAgICAvL2VxbigzNylcbiAgICAgICAgLy8gUShqLM6yy5woaCkpID0gUShqLM6yy5woaCkrKGstbS0xLXpfaS1qKWApIFxuICAgICAgICAvL2VxbigyMClcblxuICAgICAgICAvLyAgzrLLnF9sW2ldID0gzrJfaSA9IOKIkShsPTEuLi5pIG9mIHpfbClcblxuICAgICAgICAvL3N0ZXAgMTpcbiAgICAgICAgLy8gIHVzZSBlcW4oMTkpIHRvIGdldCBQKDAsMC4uLmstMSkgYW5kIChQKM6yKHApLGstel9wLi4uay0xKSBmb3IgcCA9IDEuLi5TLTEpXG4gICAgICAgIC8vc3RlcCAyOiBzZXQgVCBieSBlcW4oMzIpIGFuZCBzZXQgbiA9IG4rU20r4oiReV9pXG4gICAgICAgIC8vc3RlcCAzOiB1c2UgdGhtIDMgdG8gZ2V0IFEoMCwwLi4uay0xKSBhbmQgKFEozrIobFtpXSksay16X2kuLi5rLTEpIGZvciBpID0gMS4uLlMtMSlcbiAgICAgICAgLy8gYW5kIG90aGVyIFFcbiAgICAgICAgLy8gdGhlbiB1c2UgZXFucyAyMCBhbmQgMzcgdG8gZ2V0IFEoaSwwKVxuXG5cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcblxuXHRcdCovXG4gICAgfVxuICAgIGRlZ3JlZV9lbGV2YXRlKG06IG51bWJlcik6IEJfU3BsaW5lPFQ+IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5kZWdyZWVfZWxldmF0ZV9hbmRfaW5zZXJ0X2tub3RzKG0sIFtdLCBbXSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlX2tub3QoaTogbnVtYmVyKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuXG4gICAgbXVsdGlwbGljaXR5KGk6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGsgPSB0aGlzLmtub3RfdmVjW2ldO1xuICAgICAgICBsZXQgbiA9IDE7XG4gICAgICAgIGZvciAobGV0IG8gPSBpIC0gMTsgbyA+PSAwICYmIGZsb2F0X25lYXIodGhpcy5rbm90X3ZlY1tvXSwgaywgQl9TcGxpbmUuRVBTSUxPTik7IG8tLSkge1xuICAgICAgICAgICAgbisrO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IG8gPSBpICsgMTsgbyA8IHRoaXMua25vdF92ZWMubGVuZ3RoICYmXG4gICAgICAgICAgICBmbG9hdF9uZWFyKHRoaXMua25vdF92ZWNbb10sIGssIEJfU3BsaW5lLkVQU0lMT04pOyBvKyspIHtcbiAgICAgICAgICAgIG4rKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG5cblxuICAgIC8vIGh0dHBzOi8vcGFnZXMubXR1LmVkdS9+c2hlbmUvQ09VUlNFUy9jczM2MjEvTk9URVMvc3BsaW5lL0Itc3BsaW5lL2JzcGxpbmUtZGVydi5odG1sXG4gICAgY3VydmVfZGVyaXZhdGl2ZSgpOiB7IGN1cnZlOiBCX1NwbGluZTxUPiwgdHJpbW1lZF9rbm90czogeyBsOiBudW1iZXIsIGg6IG51bWJlciwgYzogVCB9IH0ge1xuICAgICAgICBjb25zdCBxOiBUW10gPSBuZXcgQXJyYXk8VD4odGhpcy5jb250cm9sX3BvaW50cy5sZW5ndGggLSAxKTtcbiAgICAgICAgY29uc3Qga246IG51bWJlcltdID0gbmV3IEFycmF5PG51bWJlcj4odGhpcy5rbm90X3ZlYy5sZW5ndGggLSAyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAga25baV0gPSB0aGlzLmtub3RfdmVjW2kgKyAxXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwID0gdGhpcy5vcmRlciAtIDE7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcHQgPSB0aGlzLmNvbnRyb2xfcG9pbnRzW2kgKyAxXS52ZWNfc3ViKHRoaXMuY29udHJvbF9wb2ludHNbaV0pO1xuICAgICAgICAgICAgaWYgKGZsb2F0X25lYXIodGhpcy5rbm90X3ZlY1tpICsgMSArIHBdLCB0aGlzLmtub3RfdmVjW2kgKyAxXSwgQl9TcGxpbmUuRVBTSUxPTikpIHtcbiAgICAgICAgICAgICAgICBxW2ldID0gcHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSB0aGlzLmtub3RfdmVjW2kgKyAxICsgcF0gLSB0aGlzLmtub3RfdmVjW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBxW2ldID0gcHQudmVjX3NjYWxlRXEocCAvIGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGN1cnZlOiBuZXcgQl9TcGxpbmU8VD4ocSwga24pLCB0cmltbWVkX2tub3RzOiB7IGw6IHRoaXMua25vdF92ZWNbMF0sIGg6IHRoaXMua25vdF92ZWNbdGhpcy5rbm90X3ZlYy5sZW5ndGggLSAxXSwgYzogdGhpcy5jb250cm9sX3BvaW50c1swXSB9IH07XG4gICAgfVxuICAgIC8vIHVzZWZ1bHM6XG4gICAgLy8gaHR0cHM6Ly9jZHMuY2Vybi5jaC9yZWNvcmQvNDE3ODE2L2ZpbGVzL0NNZS1QMDAwNjg1MTQucGRmXG4gICAgLy8gaHR0cHM6Ly93d3cucmVzZWFyY2hnYXRlLm5ldC9wdWJsaWNhdGlvbi8yNTA5NTY1NDZfSW50ZWdyYXRpbmdfUHJvZHVjdHNfb2ZfQi1TcGxpbmVzXG4gICAgY3VydmVfaW50ZWdyYWwodHJpbW1lZF9rbm90czogeyBsPzogbnVtYmVyLCBoPzogbnVtYmVyLCBjPzogVCB9ID0ge30pOiBCX1NwbGluZTxUPiB7XG4gICAgICAgIGNvbnN0IHRrID0ge1xuICAgICAgICAgICAgbDogKHRyaW1tZWRfa25vdHMubCA/IHRyaW1tZWRfa25vdHMubCA6IHRoaXMua25vdF92ZWNbMF0pLFxuICAgICAgICAgICAgaDogKHRyaW1tZWRfa25vdHMuaCA/IHRyaW1tZWRfa25vdHMuaCA6IHRoaXMua25vdF92ZWNbdGhpcy5rbm90X3ZlYy5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICBjOiAodHJpbW1lZF9rbm90cy5jID8gdHJpbW1lZF9rbm90cy5jIDogdGhpcy5jb250cm9sX3BvaW50c1swXS52ZWNfemVybygpKVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHE6IFRbXSA9IG5ldyBBcnJheTxUPih0aGlzLmNvbnRyb2xfcG9pbnRzLmxlbmd0aCArIDEpO1xuICAgICAgICBjb25zdCBrbjogbnVtYmVyW10gPSBuZXcgQXJyYXk8bnVtYmVyPih0aGlzLmtub3RfdmVjLmxlbmd0aCArIDIpO1xuICAgICAgICBrblswXSA9IHRrLmw7XG4gICAgICAgIGtuW2tuLmxlbmd0aCAtIDFdID0gdGsuaDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmtub3RfdmVjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBrbltpICsgMV0gPSB0aGlzLmtub3RfdmVjW2ldO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHAgPSB0aGlzLm9yZGVyO1xuICAgICAgICBsZXQgYyA9IHRrLmM7XG4gICAgICAgIHFbMF0gPSBjO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmbG9hdF9uZWFyKGtuW2kgLSAxICsgcCArIDFdLCBrbltpXSwgQl9TcGxpbmUuRVBTSUxPTikpIHtcbiAgICAgICAgICAgICAgICBjID0gdGhpcy5jb250cm9sX3BvaW50c1tpIC0gMV0udmVjX2FkZChjKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZCA9IGtuW2kgLSAxICsgcCArIDFdIC0ga25baV07XG4gICAgICAgICAgICAgICAgYyA9IHRoaXMuY29udHJvbF9wb2ludHNbaSAtIDFdLnZlY19zY2FsZShkIC8gcCkudmVjX2FkZEVxKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcVtpXSA9IGM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBCX1NwbGluZTxUPihxLCBrbik7XG4gICAgfVxuXG5cblxuICAgIHZlY19jb3B5KCk6IEJfU3BsaW5lPFQ+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBCX1NwbGluZTxUPihbLi4udGhpcy5jb250cm9sX3BvaW50c10sIFsuLi50aGlzLmtub3RfdmVjXSk7XG4gICAgfVxuICAgIHZlY19zZXQob3RoZXI6IEJfU3BsaW5lPFQ+KTogQl9TcGxpbmU8VD4ge1xuICAgICAgICB0aGlzLmNvbnRyb2xfcG9pbnRzID0gb3RoZXIuY29udHJvbF9wb2ludHM7XG4gICAgICAgIHRoaXMua25vdF92ZWMgPSBvdGhlci5rbm90X3ZlYztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3BsaW5lX21hdGNoKG90aGVyOiBCX1NwbGluZTxUPik6IHsgdGhpczogQl9TcGxpbmU8VD4sIG90aGVyOiBCX1NwbGluZTxUPiB9IHtcbiAgICAgICAgY29uc3Qgb2RpZiA9IG90aGVyLm9yZGVyIC0gdGhpcy5vcmRlcjtcbiAgICAgICAgaWYgKG9kaWYgPCAwKSB7XG4gICAgICAgICAgICBjb25zdCByID0gb3RoZXIuc3BsaW5lX21hdGNoKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHsgdGhpczogci5vdGhlciwgb3RoZXI6IHIudGhpcyB9O1xuICAgICAgICB9XG4gICAgICAgIGxldCB2ZWMgPSAob2RpZiA+IDApID8gdGhpcy5kZWdyZWVfZWxldmF0ZShvZGlmKSA6IHRoaXMudmVjX2NvcHkoKTtcbiAgICAgICAgLy8qIGtub3RzIHVuaW9uLCBpbnNlcnQga25vdHMgd2hlcmUgbWlzc2luZ1xuICAgICAgICBvdGhlciA9IG90aGVyLnZlY19jb3B5KCk7XG4gICAgICAgIGNvbnN0IGt2MSA9IHZlYy5ybGVfa25vdF92ZWMoKTtcbiAgICAgICAgY29uc3Qga3YyID0gb3RoZXIucmxlX2tub3RfdmVjKCk7XG4gICAgICAgIC8vbWVyZ2Vzb3J0IGxpa2UgdGhpbmd5XG4gICAgICAgIGxldCBpMSA9IDAsIGkyID0gMDtcbiAgICAgICAgbGV0IGtpdjE6IG51bWJlcltdID0gW107XG4gICAgICAgIGxldCBraXYyOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBsZXQga2l0MTogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgbGV0IGtpdDI6IG51bWJlcltdID0gW107XG4gICAgICAgIHdoaWxlIChpMSA8IGt2MS51Lmxlbmd0aCAmJiBpMiA8IGt2Mi51Lmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGZsb2F0X25lYXIoa3YxLnVbaTFdLCBrdjIudVtpMl0sIEJfU3BsaW5lLkVQU0lMT04pKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZCA9IGt2MS56W2kxXSAtIGt2Mi56W2kyXTtcbiAgICAgICAgICAgICAgICBpZiAoZCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy9raXYxLnB1c2goa3YyLnVbaTJdKTtcbiAgICAgICAgICAgICAgICAgICAgLy9raXQxLnB1c2goLWQpO1xuICAgICAgICAgICAgICAgICAgICB2ZWMuaW5zZXJ0X2tub3Qoa3YyLnVbaTJdLCAtZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2tpdjIucHVzaChrdjEudVtpMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9raXQyLnB1c2goZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlci5pbnNlcnRfa25vdChrdjEudVtpMV0sIGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkxKys7XG4gICAgICAgICAgICAgICAgaTIrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGt2Mi51W2kyXSA8IGt2MS51W2kxXSkge1xuICAgICAgICAgICAgICAgICAgICAvL2tpdjEucHVzaChrdjIudVtpMl0pO1xuICAgICAgICAgICAgICAgICAgICAvL2tpdDEucHVzaChrdjIueltpMl0pO1xuICAgICAgICAgICAgICAgICAgICB2ZWMuaW5zZXJ0X2tub3Qoa3YyLnVbaTJdLCBrdjIueltpMl0pO1xuICAgICAgICAgICAgICAgICAgICBpMisrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8va2l2Mi5wdXNoKGt2MS51W2kxXSk7XG4gICAgICAgICAgICAgICAgICAgIC8va2l0Mi5wdXNoKGt2MS56W2kxXSk7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyLmluc2VydF9rbm90KGt2MS51W2kxXSwga3YxLnpbaTFdKTtcbiAgICAgICAgICAgICAgICAgICAgaTErKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGkxIDwga3YxLnUubGVuZ3RoKSB7XG4gICAgICAgICAgICAvL2tpdjIucHVzaChrdjEudVtpMV0pO1xuICAgICAgICAgICAgLy9raXQyLnB1c2goa3YxLnpbaTFdKTtcbiAgICAgICAgICAgIG90aGVyLmluc2VydF9rbm90KGt2MS51W2kxXSwga3YxLnpbaTFdKTtcbiAgICAgICAgICAgIGkxKys7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGkyIDwga3YyLnUubGVuZ3RoKSB7XG4gICAgICAgICAgICAvL2tpdjEucHVzaChrdjIudVtpMl0pO1xuICAgICAgICAgICAgLy9raXQxLnB1c2goa3YyLnpbaTJdKTtcbiAgICAgICAgICAgIHZlYy5pbnNlcnRfa25vdChrdjIudVtpMl0sIGt2Mi56W2kyXSk7XG4gICAgICAgICAgICBpMisrO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIHZlYyA9IHZlYy5kZWdyZWVfZWxldmF0ZV9hbmRfaW5zZXJ0X2tub3RzKDAsIGtpdjEsIGtpdDEpO1xuICAgICAgICBvdGhlciA9IG90aGVyLmRlZ3JlZV9lbGV2YXRlX2FuZF9pbnNlcnRfa25vdHMoMCwga2l2Miwga2l0Mik7XG5cblxuICAgICAgICByZXR1cm4geyB0aGlzOiB2ZWMsIG90aGVyOiBvdGhlciB9O1xuICAgIH1cbiAgICB2ZWNfYWRkKG90aGVyOiBCX1NwbGluZTxUPik6IEJfU3BsaW5lPFQ+IHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMuc3BsaW5lX21hdGNoKG90aGVyKTtcbiAgICAgICAgY29uc3QgdmVjID0gci50aGlzO1xuICAgICAgICBjb25zdCBvID0gci5vdGhlcjtcbiAgICAgICAgY29uc3Qgc3VtID0gbmV3IEFycmF5PFQ+KHZlYy5jb250cm9sX3BvaW50cy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1bS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3VtW2ldID0gdmVjLmNvbnRyb2xfcG9pbnRzW2ldLnZlY19hZGQoby5jb250cm9sX3BvaW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBCX1NwbGluZTxUPihzdW0sIHZlYy5rbm90X3ZlYyk7XG5cbiAgICB9XG4gICAgdmVjX3NjYWxlKHM6IG51bWJlcik6IEJfU3BsaW5lPFQ+IHtcbiAgICAgICAgY29uc3QgcmVzID0gQXJyYXk8VD4odGhpcy5jb250cm9sX3BvaW50cy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29udHJvbF9wb2ludHMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICByZXNbaV0gPSB0aGlzLmNvbnRyb2xfcG9pbnRzW2ldLnZlY19zY2FsZShzKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCX1NwbGluZTxUPihyZXMsIFsuLi50aGlzLmtub3RfdmVjXSk7XG4gICAgfVxuXG5cbn1cbkBTYXZlYWJsZS5yZWdpc3RlclxuZXhwb3J0IGNsYXNzIERfU3BsaW5lPFQgZXh0ZW5kcyBWZWN0b3I8YW55Pj4gZXh0ZW5kcyBWZWN0b3I8RF9TcGxpbmU8VD4+IGltcGxlbWVudHMgQ3VydmU8VD4sIFNhdmVhYmxlIHtcbiAgICBfc2F2ZU5hbWU/OiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IocHVibGljIGNvZWZzOiBUW10pIHsgc3VwZXIoKTsgfVxuICAgIGdldCBvcmRlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2Vmcy5sZW5ndGggLSAxO1xuICAgIH1cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZWZzLmxlbmd0aDtcbiAgICB9XG4gICAgY3VydmVfZXZhbCh0OiBudW1iZXIpOiBUIHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMuY29lZnNbMF0udmVjX2NvcHkoKTtcbiAgICAgICAgbGV0IHRwID0gdDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByLnZlY19mbWFFcSh0aGlzLmNvZWZzW2ldLCB0cCk7XG4gICAgICAgICAgICB0cCAqPSB0IC8gKGkgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG4gICAgY3VydmVfZGVyaXZhdGl2ZSh0OiBudW1iZXIgPSAxKTogRF9TcGxpbmU8VD4ge1xuICAgICAgICBpZiAodCA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERfU3BsaW5lKHRoaXMuY29lZnMuc2xpY2UodCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRF9TcGxpbmUoW3RoaXMuY29lZnNbMF0udmVjX3plcm8oKV0pO1xuICAgIH1cbiAgICBjdXJ2ZV9pbnRlZ3JhbCh0OiBudW1iZXIgPSAxKSB7XG4gICAgICAgIGNvbnN0IHplcm8gPSB0aGlzLmNvZWZzWzBdLnZlY196ZXJvKCk7XG4gICAgICAgIGNvbnN0IHI6IFRbXSA9IEFycmF5PFQ+KHQpLmZpbGwoemVybyk7XG4gICAgICAgIHIucHVzaCguLi50aGlzLmNvZWZzKTtcbiAgICAgICAgcmV0dXJuIG5ldyBEX1NwbGluZShyKTtcbiAgICB9XG5cbiAgICBjb2VmKGk6IG51bWJlcik6IFQge1xuICAgICAgICByZXR1cm4gaSA+PSB0aGlzLmNvZWZzLmxlbmd0aCA/IHRoaXMuY29lZnNbMF0udmVjX3plcm8oKSA6IHRoaXMuY29lZnNbaV07XG4gICAgfVxuICAgIHZlY19hZGQob3RoZXI6IERfU3BsaW5lPFQ+KTogRF9TcGxpbmU8VD4ge1xuICAgICAgICBjb25zdCByZXMgPSBBcnJheTxUPihNYXRoLm1heCh0aGlzLmxlbmd0aCwgb3RoZXIubGVuZ3RoKSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgcmVzW2ldID0gaSA8IHRoaXMubGVuZ3RoID8gKGkgPCBvdGhlci5sZW5ndGggPyB0aGlzLmNvZWZzW2ldLnZlY19hZGQob3RoZXIuY29lZnNbaV0pIDogdGhpcy5jb2Vmc1tpXS52ZWNfY29weSgpKSA6IG90aGVyLmNvZWZzW2ldLnZlY19jb3B5KCk7XG4gICAgICAgIHJldHVybiBuZXcgRF9TcGxpbmU8VD4ocmVzKTtcbiAgICB9XG4gICAgdmVjX3NjYWxlKHM6IG51bWJlcik6IERfU3BsaW5lPFQ+IHtcbiAgICAgICAgY29uc3QgcmVzID0gQXJyYXk8VD4odGhpcy5sZW5ndGgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgcmVzW2ldID0gdGhpcy5jb2Vmc1tpXS52ZWNfc2NhbGUocyk7XG4gICAgICAgIHJldHVybiBuZXcgRF9TcGxpbmU8VD4ocmVzKTtcbiAgICB9XG4gICAgdmVjX2NvcHkoKTogRF9TcGxpbmU8VD4ge1xuICAgICAgICByZXR1cm4gbmV3IERfU3BsaW5lPFQ+KFsuLi50aGlzLmNvZWZzXSk7XG4gICAgfVxuICAgIHZlY19zZXQob3RoZXI6IERfU3BsaW5lPFQ+KTogRF9TcGxpbmU8VD4ge1xuICAgICAgICB0aGlzLmNvZWZzID0gb3RoZXIuY29lZnM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvY3VydmUvYl9zcGxpbmUudHMiLCJpbXBvcnQgKiBhcyBQSVhJIGZyb20gXCJwaXhpLmpzXCI7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcbmV4cG9ydCBmdW5jdGlvbiBwb2ludDJkKHggPSAwLCB5ID0gMCk6IFBvaW50MmQgeyByZXR1cm4gbmV3IFBvaW50MmQobmV3IFBJWEkuUG9pbnQoeCwgeSkpOyB9XG5leHBvcnQgY2xhc3MgUG9pbnQyZCBleHRlbmRzIFZlY3RvcjxQb2ludDJkPntcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcDogUElYSS5Qb2ludCkgeyBzdXBlcigpOyB9XG4gICAgZ2V0IHgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMucC54OyB9XG4gICAgc2V0IHgodjogbnVtYmVyKSB7IHRoaXMucC54ID0gdjsgfVxuICAgIGdldCB5KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnAueTsgfVxuICAgIHNldCB5KHY6IG51bWJlcikgeyB0aGlzLnAueSA9IHY7IH1cbiAgICB2ZWNfYWRkKG90aGVyOiBQb2ludDJkKTogUG9pbnQyZCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQyZChuZXcgUElYSS5Qb2ludCh0aGlzLnggKyBvdGhlci54LCB0aGlzLnkgKyBvdGhlci55KSk7XG4gICAgfVxuICAgIHZlY19zY2FsZShzOiBudW1iZXIpOiBQb2ludDJkIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJkKG5ldyBQSVhJLlBvaW50KHRoaXMueCAqIHMsIHRoaXMueSAqIHMpKTtcbiAgICB9XG4gICAgdmVjX2NvcHkoKTogUG9pbnQyZCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQyZChuZXcgUElYSS5Qb2ludCh0aGlzLngsIHRoaXMueSkpO1xuICAgIH1cbiAgICB2ZWNfc2V0KG90aGVyOiBQb2ludDJkKTogUG9pbnQyZCB7XG4gICAgICAgIHRoaXMucC5jb3B5KG90aGVyLnApOyByZXR1cm4gdGhpcztcbiAgICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC92ZWN0b3IvcG9pbnQyZC50cyIsImltcG9ydCAqIGFzIFBJWEkgZnJvbSBcInBpeGkuanNcIjtcbmltcG9ydCB7IEdyYXBoaWNzIH0gZnJvbSBcInBpeGkuanNcIjtcbmltcG9ydCB7IEJfU3BsaW5lIH0gZnJvbSBcIi4vY3VydmUvYl9zcGxpbmVcIjtcbmltcG9ydCB7IFBvaW50MmQsIHBvaW50MmQgfSBmcm9tIFwiLi92ZWN0b3IvcG9pbnQyZFwiO1xuaW1wb3J0IHsgQ3VydmUgfSBmcm9tIFwiLi9jdXJ2ZS9jdXJ2ZVwiO1xubGV0IHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoKTtcblxuY29uc3QgYXBwOiBQSVhJLkFwcGxpY2F0aW9uID0gbmV3IFBJWEkuQXBwbGljYXRpb24oXG4gICAge1xuICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IDB4MDAwMDAwLFxuICAgICAgICByZXNvbHV0aW9uOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuICAgICAgICBhdXRvUmVzaXplOiB0cnVlXG4gICAgfVxuKTtcblxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhcHAudmlldyk7XG5cbndpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKF9ldmVudDogVUlFdmVudCk6IHZvaWQge1xuICAgIGFwcC5yZW5kZXJlci5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59O1xuXG5cbmZ1bmN0aW9uIGhpbGJlcnRfY29vcmRzKHQ6IG51bWJlciwgbjogbnVtYmVyKTogUG9pbnQyZCB7XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcbiAgICBsZXQgcm90ID0gMDtcbiAgICBsZXQgaW52ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICB0ICo9IDQ7XG4gICAgICAgIGNvbnN0IGluZCA9IE1hdGguZmxvb3IodCkgXiBpbnY7XG4gICAgICAgIHggKj0gMjtcbiAgICAgICAgeSAqPSAyO1xuICAgICAgICB4ICs9IFtbMCwgMCwgMSwgMV0sIFsxLCAwLCAwLCAxXSwgWzEsIDEsIDAsIDBdLCBbMCwgMSwgMSwgMF1dW3JvdF1baW5kXTtcbiAgICAgICAgeSArPSBbWzAsIDEsIDEsIDBdLCBbMCwgMCwgMSwgMV0sIFsxLCAwLCAwLCAxXSwgWzEsIDEsIDAsIDBdXVtyb3RdW2luZF07XG4gICAgICAgIHJvdCA9IChyb3QgKyBbMywgMCwgMCwgMV1baW5kXSkgJSA0O1xuICAgICAgICB0ICU9IDE7XG4gICAgICAgIGlmIChpbmQgPT09IDAgfHwgaW5kID09PSAzKSB7XG4gICAgICAgICAgICBpbnYgXj0gMHgzO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGQgPSAxIDw8IG47XG4gICAgcmV0dXJuIHBvaW50MmQoeCAvIGQsIHkgLyBkKTtcbn1cbmZ1bmN0aW9uIGhpbGJlcnRfY3VydmUobjogbnVtYmVyKTogUG9pbnQyZFtdIHtcbiAgICBjb25zdCByZXMgPSBuZXcgQXJyYXk8UG9pbnQyZD4oKTtcbiAgICBjb25zdCBkID0gMSA8PCAobiAqIDIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZDsgaSsrKSB7XG4gICAgICAgIHJlc1tpXSA9IGhpbGJlcnRfY29vcmRzKGkgLyBkLCBuKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cbmZ1bmN0aW9uIHBhcnJheV9hZGRfc2NhbGUoYTogUG9pbnQyZFtdLCBzOiBudW1iZXIsIHA6IFBvaW50MmQpOiBQb2ludDJkW10ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhW2ldLnZlY19zY2FsZUVxKHMpO1xuICAgICAgICBhW2ldLnZlY19hZGRFcShwKTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5mdW5jdGlvbiB1bmlmb3JtX2tub3RfdmVjKGxlbjogbnVtYmVyLCBvOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgY29uc3QgcmVzID0gQXJyYXk8bnVtYmVyPihsZW4gKyBvKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiArIG87IGkrKykge1xuICAgICAgICByZXNbaV0gPSAoaSAtIG8gKyAxKSAvICgxICsgbGVuIC0gbyk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiB1bmlmb3JtX2VuZGVkX2tub3RfdmVjKGxlbjogbnVtYmVyLCBvOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgY29uc3QgcmVzID0gQXJyYXk8bnVtYmVyPihsZW4gKyBvKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBsZW4gLSBvOyBpKyspIHtcbiAgICAgICAgcmVzW2kgKyBvIC0gMV0gPSBpIC8gKDEgKyBsZW4gLSBvKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvOyBpKyspIHtcbiAgICAgICAgcmVzW2ldID0gMDtcbiAgICAgICAgcmVzW2xlbiArIGldID0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxubGV0IGl0ZXIgPSAzO1xuY29uc3QgdGVzdFNwbGluZSA9IG5ldyBCX1NwbGluZTxQb2ludDJkPihcbiAgICBwYXJyYXlfYWRkX3NjYWxlKGhpbGJlcnRfY3VydmUoaXRlciksIDQwMCwgcG9pbnQyZCgtMjAwLCAtMjAwKSksXG4gICAgdW5pZm9ybV9lbmRlZF9rbm90X3ZlYygxIDw8ICgyICogaXRlciksIDUpXG4pO1xuaXRlciA9IDI7XG5mdW5jdGlvbiBoaWxic3BsaW5lKGl0ZXI6IG51bWJlciwgb3JkZXI6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgQl9TcGxpbmU8UG9pbnQyZD4oXG4gICAgICAgIHBhcnJheV9hZGRfc2NhbGUoaGlsYmVydF9jdXJ2ZShpdGVyKSwgNDAwLCBwb2ludDJkKC0yMDAsIC0yMDApKSxcbiAgICAgICAgdW5pZm9ybV9lbmRlZF9rbm90X3ZlYygxIDw8ICgyICogaXRlciksIG9yZGVyKVxuICAgICk7XG59XG5jb25zdCBzcGE6IEJfU3BsaW5lPFBvaW50MmQ+W10gPSBbXTtcbmZvciAobGV0IGkgPSAxOyBpIDw9IDc7IGkrKykge1xuICAgIHNwYVtzcGEubGVuZ3RoXSA9IGhpbGJzcGxpbmUoaSwgMik7XG59XG5cbmNvbnN0IHRlc3RTcGx1cmYgPSBuZXcgQl9TcGxpbmU8Ql9TcGxpbmU8UG9pbnQyZD4+KFxuICAgIHNwYSxcbiAgICB1bmlmb3JtX2VuZGVkX2tub3RfdmVjKHNwYS5sZW5ndGgsIDIpLFxuKTtcbi8qXG50ZXN0U3BsaW5lLmtub3RfdmVjWzIyXSA9IHRlc3RTcGxpbmUua25vdF92ZWNbMjFdO1xuXG50ZXN0U3BsaW5lLmtub3RfdmVjWzM2XSA9IHRlc3RTcGxpbmUua25vdF92ZWNbMzVdO1xudGVzdFNwbGluZS5rbm90X3ZlY1szN10gPSB0ZXN0U3BsaW5lLmtub3RfdmVjWzM2XTtcblxudGVzdFNwbGluZS5rbm90X3ZlY1s0Nl0gPSB0ZXN0U3BsaW5lLmtub3RfdmVjWzQ1XTtcbnRlc3RTcGxpbmUua25vdF92ZWNbNDddID0gdGVzdFNwbGluZS5rbm90X3ZlY1s0NV07XG50ZXN0U3BsaW5lLmtub3RfdmVjWzQ4XSA9IHRlc3RTcGxpbmUua25vdF92ZWNbNDVdO1xuXG50ZXN0U3BsaW5lLmtub3RfdmVjWzUyXSA9IHRlc3RTcGxpbmUua25vdF92ZWNbNTFdO1xudGVzdFNwbGluZS5rbm90X3ZlY1s1M10gPSB0ZXN0U3BsaW5lLmtub3RfdmVjWzUxXTtcbnRlc3RTcGxpbmUua25vdF92ZWNbNTRdID0gdGVzdFNwbGluZS5rbm90X3ZlY1s1MV07XG50ZXN0U3BsaW5lLmtub3RfdmVjWzU1XSA9IHRlc3RTcGxpbmUua25vdF92ZWNbNTFdOyovXG5cbmZ1bmN0aW9uIHBsb3RDdXJ2ZShjOiBDdXJ2ZTxQb2ludDJkPiwgcmVzOiBudW1iZXIsIGN1cjogUElYSS5HcmFwaGljcyA9IHVuZGVmaW5lZCk6IFBJWEkuR3JhcGhpY3Mge1xuICAgIGlmICghY3VyKSB7XG4gICAgICAgIGN1ciA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgfVxuICAgIGN1ci5saW5lU3R5bGUoMiwgMHhmZjQ0MDApO1xuICAgIGNvbnN0IHAgPSBjLmN1cnZlX2V2YWwoMCkucDtcbiAgICBjdXIubW92ZVRvKHAueCwgcC55KTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSByZXM7IGkrKykge1xuICAgICAgICBjb25zdCBwID0gYy5jdXJ2ZV9ldmFsKGkgLyByZXMpLnA7XG4gICAgICAgIGN1ci5saW5lVG8ocC54LCBwLnkpO1xuICAgIH1cbiAgICByZXR1cm4gY3VyO1xufVxuXG5sZXQgdCA9IC41O1xuY29uc3QgY2lyYyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5jaXJjLmJlZ2luRmlsbCgweGZmZmYwMCkuZHJhd0NpcmNsZSgwLCAwLCAxNikuZW5kRmlsbCgpO1xuY29uc3QgY3VyID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbmZ1bmN0aW9uIGRyYXcodGVzdFNwbGluZTogQl9TcGxpbmU8UG9pbnQyZD4pIHtcbiAgICBjdXIuY2xlYXIoKTtcbiAgICBwbG90Q3VydmUodGVzdFNwbGluZSwgMSA8PCAxMywgY3VyKTtcbiAgICAvKmZvciAobGV0IGkgPSAwOyBpIDwgdGVzdFNwbGluZS5rbm90X3ZlYy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwID0gdGVzdFNwbGluZS5jdXJ2ZV9ldmFsKHRlc3RTcGxpbmUua25vdF92ZWNbaV0pO1xuICAgICAgICBjdXIubW92ZVRvKHAueCwgcC55KTtcbiAgICAgICAgY3VyLmxpbmVTdHlsZSguNSwgMHgwMDg4ZmYgKyAoKGkgXiAoaSA+PiAxKSkgPDwgMTcpKTtcbiAgICAgICAgY3VyLmRyYXdDaXJjbGUocC54LCBwLnksIGkgLyAyKTtcbiAgICB9Ki8gLy9jaXJjbGUga25vdHNcbn1cbmRyYXcodGVzdFNwbGluZSk7XG5hcHAuc3RhZ2UuYWRkQ2hpbGQoY3VyKTtcbmFwcC5zdGFnZS5hZGRDaGlsZChjaXJjKTtcbmN1ci5wb3NpdGlvbi54ID0gMzAwO1xuY3VyLnBvc2l0aW9uLnkgPSAzMDA7XG5jaXJjLnBvc2l0aW9uLnggPSAzMDA7XG5jaXJjLnBvc2l0aW9uLnkgPSAzMDA7XG5mdW5jdGlvbiBwaHlzTG9vcChkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgdCArPSAxIC8gKDEgPDwgOSk7XG4gICAgY29uc3Qgc3BsID0gdGVzdFNwbHVyZi5jdXJ2ZV9ldmFsKHQgJSAxKTtcbiAgICBjb25zdCBwID0gc3BsLmN1cnZlX2V2YWwodCAlIDEpLnA7XG4gICAgZHJhdyhzcGwpO1xuXG4gICAgLy9jaXJjLnggPSBwLng7IGNpcmMueSA9IHAueTtcbiAgICAvL2RyYXcgZGVjb1xuICAgIHtcbiAgICAgICAgLy9kcmF3IHBvaVxuICAgICAgICBjaXJjLmNsZWFyKCk7XG4gICAgICAgIGNpcmMubW92ZVRvKHAueCwgcC55KTtcbiAgICAgICAgY2lyYy5iZWdpbkZpbGwoMHhmZmZmMDApLmRyYXdDaXJjbGUocC54LCBwLnksIDgpLmVuZEZpbGwoKTtcbiAgICAgICAgLy9kcmF3IHN1cHBvcnQgcHlyYW1pZFxuICAgICAgICBpZiAoZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHB5ciA9IHRlc3RTcGxpbmUuc3VwcG9ydF9uZXQodCAlIDEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBweXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xyID0gMHg4MDgwODAgKyAoMHg3ZjdmN2YgJiAoTWF0aC5zaW4oaSArIDEpICogMHhmZmZmZmYpKTtcbiAgICAgICAgICAgICAgICBjaXJjLm1vdmVUbyhweXJbaV1bMF0ueCwgcHlyW2ldWzBdLnkpO1xuICAgICAgICAgICAgICAgIGNpcmMuYmVnaW5GaWxsKGNvbHIpLmRyYXdDaXJjbGUocHlyW2ldWzBdLngsIHB5cltpXVswXS55LCAyKS5lbmRGaWxsKCk7XG4gICAgICAgICAgICAgICAgY2lyYy5tb3ZlVG8ocHlyW2ldWzBdLngsIHB5cltpXVswXS55KTtcbiAgICAgICAgICAgICAgICBjaXJjLmxpbmVTdHlsZSguNSwgY29sciAtIDB4NDA0MDQwKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IHB5cltpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjaXJjLmxpbmVUbyhweXJbaV1bal0ueCwgcHlyW2ldW2pdLnkpO1xuICAgICAgICAgICAgICAgICAgICBjaXJjLmJlZ2luRmlsbChjb2xyKS5kcmF3Q2lyY2xlKHB5cltpXVtqXS54LCBweXJbaV1bal0ueSwgMikuZW5kRmlsbCgpO1xuICAgICAgICAgICAgICAgICAgICBjaXJjLm1vdmVUbyhweXJbaV1bal0ueCwgcHlyW2ldW2pdLnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qZHJhdyBrbm90IGluc2VydGVkIGN1cnZlXG4gICAgICAgIGNvbnN0IGN2ID0gdGVzdFNwbGluZS52ZWNfY29weSgpO1xuICAgICAgICBjdi5pbnNlcnRfa25vdCh0ICUgMSwgNjQpO1xuICAgICAgICBjaXJjLmxpbmVTdHlsZSguNSwgMHg4MDAwZmYpO1xuICAgICAgICBjb25zdCBwMCA9IGN2LmN1cnZlX2V2YWwoMCkucDtcbiAgICAgICAgY2lyYy5tb3ZlVG8ocDAueCwgcDAueSk7XG4gICAgICAgIGZvciAobGV0IHIgPSAxIC8gNTEyOyByIDw9IDE7IHIgKz0gMSAvIDUxMikge1xuICAgICAgICAgICAgY29uc3QgcCA9IGN2LmN1cnZlX2V2YWwocik7XG4gICAgICAgICAgICBjaXJjLmxpbmVUbyhwLngsIHAueSk7XG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcCA9IGN2LmNvbnRyb2xfcG9pbnRzWzBdO1xuICAgICAgICAgICAgY2lyYy5saW5lU3R5bGUoLjUsIDB4YzA0MGZmKTtcbiAgICAgICAgICAgIGNpcmMuYmVnaW5GaWxsKDB4YzA0MGZmKS5kcmF3Q2lyY2xlKHAueCwgcC55LCAxKS5lbmRGaWxsKCk7XG4gICAgICAgICAgICBjaXJjLm1vdmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGN2LmNvbnRyb2xfcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IGN2LmNvbnRyb2xfcG9pbnRzW2ldO1xuICAgICAgICAgICAgICAgIGNpcmMubGluZVRvKHAueCwgcC55KTtcbiAgICAgICAgICAgICAgICBjaXJjLmJlZ2luRmlsbCgweGMwNDBmZikuZHJhd0NpcmNsZShwLngsIHAueSwgMSkuZW5kRmlsbCgpO1xuICAgICAgICAgICAgICAgIGNpcmMubW92ZVRvKHAueCwgcC55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS8qIC9cblxuICAgICAgICAvL2RyYXcgYmlzZWN0ZWQgY3VydmVcbiAgICAgICAgY29uc3QgY2IgPSB0ZXN0U3BsaW5lLmJpc2VjdCh0ICUgMSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN2ID0gW2NiLmxvdywgY2IuaGlnaF1baV1cbiAgICAgICAgICAgIGNpcmMubGluZVN0eWxlKC41LCBbMHg4MDAwZmYsIDB4ZmYwMDgwXVtpXSk7XG4gICAgICAgICAgICBjb25zdCBwMCA9IGN2LmN1cnZlX2V2YWwoMCkucDtcbiAgICAgICAgICAgIGNpcmMubW92ZVRvKHAwLngsIHAwLnkpO1xuICAgICAgICAgICAgZm9yIChsZXQgciA9IDEgLyA1MTI7IHIgPD0gMTsgciArPSAxIC8gNTEyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IGN2LmN1cnZlX2V2YWwocik7XG4gICAgICAgICAgICAgICAgY2lyYy5saW5lVG8ocC54LCBwLnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBjdi5jb250cm9sX3BvaW50c1swXTtcbiAgICAgICAgICAgICAgICBjaXJjLmxpbmVTdHlsZSguNSwgWzB4YzA0MGZmLCAweGZmNDBjMF1baV0pO1xuICAgICAgICAgICAgICAgIGNpcmMuYmVnaW5GaWxsKFsweGMwNDBmZiwgMHhmZjQwYzBdW2ldKS5kcmF3Q2lyY2xlKHAueCwgcC55LCAxKS5lbmRGaWxsKCk7XG4gICAgICAgICAgICAgICAgY2lyYy5tb3ZlVG8ocC54LCBwLnkpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY3YuY29udHJvbF9wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IGN2LmNvbnRyb2xfcG9pbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBjaXJjLmxpbmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICAgICAgICAgIGNpcmMuYmVnaW5GaWxsKFsweGMwNDBmZiwgMHhmZjQwYzBdW2ldKS5kcmF3Q2lyY2xlKHAueCwgcC55LCAxKS5lbmRGaWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIGNpcmMubW92ZVRvKHAueCwgcC55KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblx0XHQqL1xuXG5cbiAgICAgICAgLypkcmF3IGhvZG9ncmFwaFxuICAgICAgICBjb25zdCBkZXIgPSB0ZXN0U3BsaW5lLmN1cnZlX2Rlcml2YXRpdmUoKTtcbiAgICAgICAgY29uc3QgaG9kID0gZGVyLmN1cnZlLnZlY19zY2FsZSguMDEpO1xuXG4gICAgICAgIGNvbnN0IHBjID0gaG9kLmNvbnRyb2xfcG9pbnRzWzBdO1xuICAgICAgICBjaXJjLm1vdmVUbyhob2QuY3VydmVfZXZhbCgwKS54ICsgcC54LCBob2QuY3VydmVfZXZhbCgwKS55ICsgcC55KTtcbiAgICAgICAgY2lyYy5saW5lU3R5bGUoMSwgMHgwMGZmZmYpO1xuICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IDE7IHQgKz0gMSAvICgxIDw8IDEwKSkge1xuICAgICAgICAgICAgY29uc3QgcGMgPSBob2QuY3VydmVfZXZhbCh0KTtcbiAgICAgICAgICAgIGNpcmMubGluZVRvKHBjLnggKyBwLngsIHBjLnkgKyBwLnkpO1xuICAgICAgICB9XG4gICAgICAgIGNpcmMubGluZVN0eWxlKC41LCAweGMwNDBmZik7XG4gICAgICAgIGNpcmMuYmVnaW5GaWxsKDB4YzA0MGZmKS5kcmF3Q2lyY2xlKHBjLnggKyBwLngsIHBjLnkgKyBwLnksIDEpLmVuZEZpbGwoKTtcbiAgICAgICAgY2lyYy5tb3ZlVG8ocGMueCArIHAueCwgcGMueSArIHAueSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgaG9kLmNvbnRyb2xfcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwYyA9IGhvZC5jb250cm9sX3BvaW50c1tpXTtcbiAgICAgICAgICAgIGNpcmMubGluZVRvKHBjLnggKyBwLngsIHBjLnkgKyBwLnkpO1xuICAgICAgICAgICAgY2lyYy5iZWdpbkZpbGwoMHhjMDQwZmYpLmRyYXdDaXJjbGUocGMueCArIHAueCwgcGMueSArIHAueSwgMSkuZW5kRmlsbCgpO1xuICAgICAgICAgICAgY2lyYy5tb3ZlVG8ocGMueCArIHAueCwgcGMueSArIHAueSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGQgPSBob2QuY3VydmVfZXZhbCh0ICUgMSk7XG4gICAgICAgIGNpcmMuYmVnaW5GaWxsKDB4ZmZmZjAwKS5kcmF3Q2lyY2xlKHBkLnggKyBwLngsIHBkLnkgKyBwLnksIDMpLmVuZEZpbGwoKTtcblxuICAgICAgICAvL2ludGVncmF0ZSBob2RvZ3JhcGggXG4gICAgICAgIGNvbnN0IGlnID0gZGVyLmN1cnZlLmN1cnZlX2ludGVncmFsKGRlci50cmltbWVkX2tub3RzKTtcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcCA9IGlnLmN1cnZlX2V2YWwoMCk7XG4gICAgICAgICAgICBjaXJjLm1vdmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICBjaXJjLmxpbmVTdHlsZSgxLjUsIDB4MDBmZjAwKTtcbiAgICAgICAgICAgIGZvciAobGV0IHQgPSAxIC8gKDEgPDwgMTApOyB0IDw9IDE7IHQgKz0gMSAvICgxIDw8IDEwKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBpZy5jdXJ2ZV9ldmFsKHQpO1xuICAgICAgICAgICAgICAgIGNpcmMubGluZVRvKHAueCwgcC55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vaW50ZWdyYXRlIHRlc3RcbiAgICAgICAgY29uc3QgaWcyID0gdGVzdFNwbGluZS5jdXJ2ZV9pbnRlZ3JhbCh7IGw6IDAsIGg6IDAgfSk7XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBpZzIuY3VydmVfZXZhbCgwKTtcbiAgICAgICAgICAgIGNpcmMubW92ZVRvKHAueCwgcC55KTtcbiAgICAgICAgICAgIGNpcmMubGluZVN0eWxlKDEsIDB4ZmZmZjAwKTtcbiAgICAgICAgICAgIGZvciAobGV0IHQgPSAxIC8gKDEgPDwgMTApOyB0IDw9IDE7IHQgKz0gMSAvICgxIDw8IDEwKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBpZzIuY3VydmVfZXZhbCh0KTtcbiAgICAgICAgICAgICAgICBjaXJjLmxpbmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9yZWRlcml2IHRlc3RcbiAgICAgICAgY29uc3QgZGVyMiA9IGlnMi5jdXJ2ZV9kZXJpdmF0aXZlKCk7XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBkZXIyLmN1cnZlLmN1cnZlX2V2YWwoMCk7XG4gICAgICAgICAgICBjaXJjLm1vdmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICBjaXJjLmxpbmVTdHlsZSguNSwgMHhmZjg4MDApO1xuICAgICAgICAgICAgZm9yIChsZXQgdCA9IDEgLyAoMSA8PCAxMCk7IHQgPD0gMTsgdCArPSAxIC8gKDEgPDwgMTApKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IGRlcjIuY3VydmUuY3VydmVfZXZhbCh0KTtcbiAgICAgICAgICAgICAgICBjaXJjLmxpbmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0vLyAqIC9cbiAgICAgICAgLy9kZWdlbHYgdGVzdFxuICAgICAgICBjb25zdCBkZWd1cCA9IHRlc3RTcGxpbmUuZGVncmVlX2VsZXZhdGUoMSk7XG4gICAgICAgIGNpcmMubGluZVN0eWxlKDEsIDB4NDQwMGZmKTtcbiAgICAgICAgY29uc3QgY3AgPSBkZWd1cC5jb250cm9sX3BvaW50c1swXVxuICAgICAgICBjaXJjLmJlZ2luRmlsbCgweDg4MDBmZikuZHJhd0NpcmNsZShjcC54LCBjcC55LCA0KS5lbmRGaWxsKCk7XG4gICAgICAgIGNpcmMubW92ZVRvKGNwLngsIGNwLnkpO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGRlZ3VwLmNvbnRyb2xfcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjcCA9IGRlZ3VwLmNvbnRyb2xfcG9pbnRzW2ldO1xuICAgICAgICAgICAgY2lyYy5saW5lVG8oY3AueCwgY3AueSk7XG4gICAgICAgICAgICBjaXJjLmJlZ2luRmlsbCgweDg4MDBmZikuZHJhd0NpcmNsZShjcC54LCBjcC55LCA0KS5lbmRGaWxsKCk7XG4gICAgICAgICAgICBjaXJjLm1vdmVUbyhjcC54LCBjcC55KTtcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBwID0gZGVndXAuY3VydmVfZXZhbCgwKTtcbiAgICAgICAgICAgIGNpcmMubW92ZVRvKHAueCwgcC55KTtcbiAgICAgICAgICAgIGNpcmMubGluZVN0eWxlKC41LCAweDAwNDRmZik7XG4gICAgICAgICAgICBmb3IgKGxldCB0ID0gMSAvICgxIDw8IDEwKTsgdCA8PSAxOyB0ICs9IDEgLyAoMSA8PCAxMCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gZGVndXAuY3VydmVfZXZhbCh0KTtcbiAgICAgICAgICAgICAgICBjaXJjLmxpbmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0vLyAqL1xuXG4gICAgfVxuICAgIGN1cjtcbn1cbmFwcC50aWNrZXIuYWRkKHBoeXNMb29wKTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2luZGV4LnRzIiwiaW1wb3J0ICogYXMgVVVJRCBmcm9tIFwidXVpZC92NFwiO1xuXG5cbmNvbnN0IHRocmVhZERlbm9taW5hdG9yID0gMTAwO1xudmFyIHRocmVhZGkgPSAwO1xuY29uc3QgdGhyZWFkRnVuYyA9IGZ1bmN0aW9uKGY6IGFueSwgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICBpZiAoKHRocmVhZGkgPSAodGhyZWFkaSArIDEpICUgdGhyZWFkRGVub21pbmF0b3IpID09IDApIHtcbiAgICAgICAgc2V0SW1tZWRpYXRlKGYsIC4uLmFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGYoLi4uYXJncyk7XG4gICAgfVxufVxuXG5cblxuLy9odHRwczovL21hcml1c3NjaHVsei5jb20vYmxvZy90eXBlc2NyaXB0LTItMi1taXhpbi1jbGFzc2VzXG4vKlxudHlwZSBDb25zdHJ1Y3RvcjxUID0ge30+ID0gbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVDtcblxuZnVuY3Rpb24gU2F2ZWFibGU8VEJhc2UgZXh0ZW5kcyBDb25zdHJ1Y3Rvcj4oQmFzZTogVEJhc2UpIHtcbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgICAgICAgdG9KU09OKCk6IHN0cmluZyB7XG5cbiAgICAgICAgICAgIHJldHVybiBcImZvb1wiO1xuICAgICAgICB9XG5cbiAgICB9O1xuXHR9Ki9cblxuY2xhc3MgTmVnYXRlZFNldDxUPiBleHRlbmRzIFNldDxUPntcbiAgICBjb25zdHJ1Y3RvcihhOiBBcnJheTxUPiA9IFtdKSB7XG4gICAgICAgIHN1cGVyKGEpO1xuICAgIH1cbiAgICBhZGQodmFsdWU6IFQpOiB0aGlzIHtcbiAgICAgICAgc3VwZXIuZGVsZXRlKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGhhcyh2YWx1ZTogVCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXN1cGVyLmhhcyh2YWx1ZSk7XG4gICAgfVxuICAgIGZpbGwoKTogdm9pZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jbGVhcigpO1xuICAgIH1cbiAgICBkZWxldGUodmFsdWU6IFQpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgciA9IHN1cGVyLmhhcyh2YWx1ZSk7XG4gICAgICAgIHN1cGVyLmFkZCh2YWx1ZSk7XG4gICAgICAgIHJldHVybiAhcjtcbiAgICB9XG4gICAgZ2V0IHNpemUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIC1zdXBlci5zaXplO1xuICAgIH1cbn1cblxuXG5cblxuXG5pbnRlcmZhY2UgU2F2ZWFibGUge1xuICAgIF9zYXZlSWdub3JlPzogU2V0PHN0cmluZz47XG4gICAgX3NhdmVTcGVjaWFsPzogKG46IEJpTWFwPHN0cmluZywgYW55IHwgU2F2ZWFibGU+KSA9PiBXcmFwcGVkT2JqZWN0O1xuICAgIF9sb2FkU3BlY2lhbD86ICgpID0+IHRoaXM7XG4gICAgX3NhdmVOYW1lPzogc3RyaW5nO1xufVxuXG5cbm5hbWVzcGFjZSBTYXZlYWJsZSB7XG4gICAgLy9odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NzA4MjAyNi90eXBlc2NyaXB0LWdldC1hbGwtaW1wbGVtZW50YXRpb25zLW9mLWludGVyZmFjZVxuICAgIHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7XG4gICAgICAgIG5ldyguLi5hcmdzOiBhbnlbXSk6IFQ7XG4gICAgICAgIHJlYWRvbmx5IHByb3RvdHlwZTogVDtcbiAgICB9XG4gICAgY29uc3QgaW1wbGVtZW50YXRpb25zOiBDb25zdHJ1Y3RvcjxTYXZlYWJsZT5bXSA9IFtdO1xuICAgIGV4cG9ydCBmdW5jdGlvbiBHZXRJbXBsZW1lbnRhdGlvbnMoKTogQ29uc3RydWN0b3I8U2F2ZWFibGU+W10ge1xuICAgICAgICByZXR1cm4gaW1wbGVtZW50YXRpb25zO1xuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXI8VCBleHRlbmRzIENvbnN0cnVjdG9yPFNhdmVhYmxlPj4oY3RvcjogVCkge1xuICAgICAgICBpbXBsZW1lbnRhdGlvbnMucHVzaChjdG9yKTtcbiAgICAgICAgcmV0dXJuIGN0b3I7XG4gICAgfVxuXG59XG5cblxuY2xhc3MgQmlNYXA8QSwgQj57XG4gICAgZjogTWFwPEEsIEI+O1xuICAgIGI6IE1hcDxCLCBBPjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5mID0gbmV3IE1hcDxBLCBCPigpO1xuICAgICAgICB0aGlzLmIgPSBuZXcgTWFwPEIsIEE+KCk7XG4gICAgfVxuXG4gICAgc2V0KGs6IEEsIHY6IEIpOiBCaU1hcDxBLCBCPiB7XG4gICAgICAgIC8vdW5kZWZpbmVkIGJlaGF2aW91ciBpZiB5b3UgbWFwIDIga2V5cyB0byB0aGUgc2FtZSB2YWx1ZVxuICAgICAgICB0aGlzLmYuc2V0KGssIHYpO1xuICAgICAgICB0aGlzLmIuc2V0KHYsIGspO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZ2V0KGs6IEEpOiBCIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZi5nZXQoayk7XG4gICAgfVxuICAgIGdldEtleSh2OiBCKTogQSB7XG4gICAgICAgIHJldHVybiB0aGlzLmIuZ2V0KHYpO1xuICAgIH1cbiAgICBoYXMoazogQSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5mLmhhcyhrKTtcbiAgICB9XG4gICAgaGFzVmFsKHY6IEIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYi5oYXModik7XG4gICAgfVxuICAgIGRlbGV0ZShrOiBBKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhrKSkge1xuICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuZi5nZXQoayk7XG4gICAgICAgICAgICB0aGlzLmYuZGVsZXRlKGspO1xuICAgICAgICAgICAgdGhpcy5iLmRlbGV0ZSh2KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRlbGV0ZVZhbCh2OiBCKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmhhc1ZhbCh2KSkge1xuICAgICAgICAgICAgY29uc3QgayA9IHRoaXMuYi5nZXQodik7XG4gICAgICAgICAgICB0aGlzLmYuZGVsZXRlKGspO1xuICAgICAgICAgICAgdGhpcy5iLmRlbGV0ZSh2KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNpemUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmYuc2l6ZSk7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGlzSWdub3JlZChvOiBhbnkgfCBTYXZlYWJsZSwgazogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKG8uX3NhdmVJZ25vcmUgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gKG8gYXMgU2F2ZWFibGUpLl9zYXZlSWdub3JlLmhhcyhrKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBDb25zdHJ1Y3RvcjxUPihvOiBPYmplY3QpOiBUIHtcbiAgICByZXR1cm4gKG8gYXMgVCk7XG59XG5cbi8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzEwNTQ5MTAvZ2V0LWZ1bmN0aW9ucy1tZXRob2RzLW9mLWEtY2xhc3NcblxuY2xhc3MgV3JhcHBlZE9iamVjdCB7XG4gICAgTy8qYmplY3QqLz86IHsgW2luZGV4OiBzdHJpbmddOiBXcmFwcGVkT2JqZWN0IHwgYW55IH07XG4gICAgVC8qeXBlKi8/OiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IocHVibGljIE4vKmFtZSovOiBzdHJpbmcsIG86IG51bGwgfCB7IFtpbmRleDogc3RyaW5nXTogV3JhcHBlZE9iamVjdCB8IGFueSB9ID0gbnVsbCwgdDogc3RyaW5nID0gbnVsbCkgeyBpZiAobyAhPSBudWxsKSB7IHRoaXMuTy8qYmplY3QqLyA9IG87IH0gaWYgKHQgIT0gbnVsbCkgeyB0aGlzLlQvKnlwZSovID0gdDsgfSB9XG59XG5cbmZ1bmN0aW9uIGdldGxvd0VudHJvcHlVVUlERnVuYygpOiAoKSA9PiBzdHJpbmcge1xuICAgIGxldCBsb3dFbnRyb3B5VVVJRF92YWx1ZSA9IDA7XG4gICAgZnVuY3Rpb24gbG93RW50cm9weVVVSUQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiXCIgKyAobG93RW50cm9weVVVSURfdmFsdWUrKyk7XG4gICAgfVxuICAgIHJldHVybiBsb3dFbnRyb3B5VVVJRDtcbn1cblxudmFyIGxvd0VudHJvcHkgPSB0cnVlO1xudmFyIGNvbmNpc2UgPSB0cnVlO1xuLy9vbiBhIHRlc3QgY2FudmFzIHdpdGggc29tZSBicnVzaGVkIGN1cnZlcywgKGxvd2VyICUgaXMgYmV0dGVyKSBSZXRhaW5lZCBzaXplOiAyNSwzMjggKEkgdGhpbmsgSSBjYW4gYnJpbmcgdGhpcyBkb3duIGJ5IG9wdGlvbmFsaXppbmcgc29tZSBXcmFwcGVkT2JqZWN0IHBhcmFtZXRlcnMpXG4vLyBzaXplczogdW5jb21wJ2R8Y29tcHJlc3NlZCB8IGd6aXAgLS1iZXN0XG4vLyBVVUlEIDogMzUsMDk5ICB8IDgsMDAzICAgICB8IDcsNzU4XG4vLyBsb3dFIDogMjUsOTI1ICB8IDIsMTg5ICAgICB8IDEsOTM4XG4vLyDigKIgcmF3IHNpemUgd2VudCB0byA3NCVcbi8vIOKAoiBzdGFuZGFyZCB6aXAgY29tcHJlc3Npb24gcmF0aW8gd2VudCBmcm9tIDIzJSB0byA4LjQlXG4vLyDigKIgY29tcHJlc3NlZCBzaXplIHdlbnQgdG8gMjclXG4vL1xuLy8gZ3ppcCAtLWJlc3Rcbi8vIOKAoiByYXRpbyB3ZW50IGZyb20gMjIlIHRvIDcuNSVcbi8vIOKAoiBjb21wcmVzc2VkIHNpemUgd2VudCB0byAyNSVcbi8vXG4vL1xuLy8gd2l0aCBzbWFsbGVyIFdyYXBwZWRPYmplY3Q6IDI1LDY4MSAtPiAxLDkyNiBnemlwIC0tYmVzdFxuLy8gd2l0aCB0aGF0IGFuZCBjb25jaXNlVVVJRCA6IDE1LDYwOCAtPiAxLDcyOCBnemlwIC0tYmVzdFxuLy9cbi8vIHdpdGggdGlueSBuYW1lcyBhbmQgY29uY2lzZVVVSUQ6IDEyLDU5MCAtPiAxLDY5MiAoc2F2ZXMgMzIgYnl0ZXMgY29tcHJlc3NlZCwgfjNrYiB1bmNvbXByZXNzZWQpXG4vLyB3aXRoIGlkcyByZXNldCBiZWZvcmUgKHNvIGNvbXByZXNzZWQgc2l6ZSBpcyBhY3R1YWxseSBhY2N1cmF0ZSk6IDEsNjg1IChvdGhlciBlc3RpbWF0ZSB3YXMgNyBieXRlcyBvZmYpXG4vL1xuLy9cbi8vIGxvdyBlbnRyb3B5IGlzIHZlcnkgZ29vZCBmb3IgZmlsZSBzaXplIGFuZCBjb21wcmVzc2lvblxuLy9cbi8vIG1heWJlIEkgc2hvdWxkIG1ha2UgbXkgb3duIGNvbXByZXNzaW9uIGFsZ29yaXRobSBzcGVjaWZpYyB0byB0aGlzIGRhdGFzZXRcbi8vXG4vL1xuLy8gXG5cbmZ1bmN0aW9uIGdldFVVSURmdW5jdGlvbigpOiAobzogYW55IHwgU2F2ZWFibGUpID0+IHN0cmluZyB7XG4gICAgdmFyIHU6ICgpID0+IHN0cmluZyA9IFVVSUQ7XG4gICAgaWYgKGxvd0VudHJvcHkpIHtcbiAgICAgICAgdSA9IGdldGxvd0VudHJvcHlVVUlERnVuYygpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRVVUlEVmVyYm9zZShvOiBhbnkgfCBTYXZlYWJsZSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChvLmNvbnN0cnVjdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBpbnN0YW5jZSBuYW1lZDpcIiArIG8uX3NhdmVOYW1lICsgXCIgaWQ6XCIgKyB1KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ1bmtub3duIGluc3RhbmNlIGlkOlwiICsgdSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VVVJRENvbmNpc2UobzogYW55IHwgU2F2ZWFibGUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdSgpO1xuICAgIH1cblxuICAgIGlmIChjb25jaXNlKSB7XG4gICAgICAgIHJldHVybiBnZXRVVUlEQ29uY2lzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZ2V0VVVJRFZlcmJvc2U7XG4gICAgfVxufVxuXG5cbmNsYXNzIFRyZWVQcm9ncmVzc0JhciB7XG4gICAgbnVtZXJhdG9yczogbnVtYmVyW107XG4gICAgZGVub21pbmF0b3JzOiBudW1iZXJbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHsgdGhpcy5udW1lcmF0b3JzID0gWzBdOyB0aGlzLmRlbm9taW5hdG9ycyA9IFsxXTsgfVxuICAgIGdldFByb2dyZXNzKCk6IG51bWJlciB7XG4gICAgICAgIHZhciBkID0gMTtcbiAgICAgICAgdmFyIHAgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtZXJhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVub21pbmF0b3JzW2ldICE9IDApIHtcbiAgICAgICAgICAgICAgICBkICo9IHRoaXMuZGVub21pbmF0b3JzW2ldO1xuICAgICAgICAgICAgICAgIHAgKz0gdGhpcy5udW1lcmF0b3JzW2ldIC8gZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgYWRkU3ViKGQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLm51bWVyYXRvcnMucHVzaCgwKTtcbiAgICAgICAgdGhpcy5kZW5vbWluYXRvcnMucHVzaChkKTtcbiAgICB9XG4gICAgcmVtU3ViKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm51bWVyYXRvcnMucG9wKCk7XG4gICAgICAgIHRoaXMuZGVub21pbmF0b3JzLnBvcCgpO1xuICAgIH1cbiAgICBnZXQgbnVtZXJhdG9yKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLm51bWVyYXRvcnNbdGhpcy5udW1lcmF0b3JzLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBzZXQgbnVtZXJhdG9yKG46IG51bWJlcikge1xuICAgICAgICB0aGlzLm51bWVyYXRvcnNbdGhpcy5udW1lcmF0b3JzLmxlbmd0aCAtIDFdID0gbjtcbiAgICB9XG4gICAgZ2V0IGRlbm9taW5hdG9yKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbm9taW5hdG9yc1t0aGlzLmRlbm9taW5hdG9ycy5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgc2V0IGRlbm9taW5hdG9yKG46IG51bWJlcikge1xuICAgICAgICB0aGlzLmRlbm9taW5hdG9yc1t0aGlzLmRlbm9taW5hdG9ycy5sZW5ndGggLSAxXSA9IG47XG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gY29udmVydFRvSlNPTmFibGUobzogYW55IHwgU2F2ZWFibGUsXG4gICAgcHJvZ0JhciA9IG5ldyBUcmVlUHJvZ3Jlc3NCYXIoKSxcbiAgICBuYW1lcyA9IG5ldyBCaU1hcDxzdHJpbmcsIGFueSB8IFNhdmVhYmxlPigpLFxuICAgIHR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKSxcbiAgICB1dWlkRnVuYyA9IGdldFVVSURmdW5jdGlvbigpLFxuXG4pOiBXcmFwcGVkT2JqZWN0IHtcbiAgICBpZiAobmFtZXMuaGFzVmFsKG8pKSB7XG4gICAgICAgIHJldHVybiBuZXcgV3JhcHBlZE9iamVjdChuYW1lcy5nZXRLZXkobykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChvIGFzIFNhdmVhYmxlKS5fc2F2ZVNwZWNpYWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIChvIGFzIFNhdmVhYmxlKS5fc2F2ZVNwZWNpYWwobmFtZXMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHV1aWQgPSB1dWlkRnVuYyhvKTtcbiAgICAgICAgbmFtZXMuc2V0KHV1aWQsIG8pO1xuXG5cbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICB2YXIgaXRvID0gbztcbiAgICAgICAgLy9leGNlcHRpb25zOlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvKSkge1xuICAgICAgICAgICAgb2JqID0gW107XG4gICAgICAgIH0gZWxzZSBpZiAobyBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICAgICAgaXRvID0gQXJyYXkuZnJvbShvLmVudHJpZXMoKSk7XG4gICAgICAgICAgICBvYmogPSBbXTtcbiAgICAgICAgfSBlbHNlIGlmIChvIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgICAgICBpdG8gPSBBcnJheS5mcm9tKG8pO1xuICAgICAgICAgICAgb2JqID0gW107XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgdmFyIG5hbWUgPSBcInVua25vd24gdHlwZSBpZDpcIiArIFVVSUQoKTtcbiAgICAgICAgaWYgKG8uY29uc3RydWN0b3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgbmFtZSA9IFwiXCIgKyBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IHdvID0gbmV3IFdyYXBwZWRPYmplY3QodXVpZCwgb2JqLCBuYW1lKTtcbiAgICAgICAgdHlwZXMuc2V0KG5hbWUsIG8uX19wcm90b19fKTtcblxuXG4gICAgICAgIC8vcHJvZ3Jlc3MgYmFyXG4gICAgICAgIHByb2dCYXIuYWRkU3ViKDApO1xuICAgICAgICBmb3IgKHZhciBpIGluIGl0bykge1xuICAgICAgICAgICAgcHJvZ0Jhci5kZW5vbWluYXRvcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBpdG8pIHtcbiAgICAgICAgICAgIGlmICgodHlwZW9mIGl0b1tpXSkgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGlmICghaXNJZ25vcmVkKG8sIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdvLk8vKmJqZWN0Ki9baV0gPSBjb252ZXJ0VG9KU09OYWJsZShpdG9baV0sIHByb2dCYXIsIG5hbWVzLCB0eXBlcywgdXVpZEZ1bmMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd28uTy8qYmplY3QqL1tpXSA9IGl0b1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb2dCYXIubnVtZXJhdG9yKys7XG4gICAgICAgIH1cbiAgICAgICAgcHJvZ0Jhci5yZW1TdWIoKTtcbiAgICAgICAgcmV0dXJuIHdvO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdGhyZWFkRnVuY0hhbHQocDogQXN5bmNIYWx0YWJsZVByb2Nlc3MsIGY6IGFueSwgLi4uYTogYW55W10pOiB2b2lkIHtcbiAgICBpZiAoIXAuaGFsdCkge1xuICAgICAgICB0aHJlYWRGdW5jKGYsIC4uLmEpO1xuICAgIH1cbn1cbi8vdmFyIGRlYnVnT2Zmc2V0ID0gMTtcbmZ1bmN0aW9uIGFzeW5jQ29udmVydFRvSlNPTmFibGUobzogYW55IHwgU2F2ZWFibGUsXG4gICAgcHJvczogQXN5bmNUcmVlUHJvY2VzczxzdHJpbmc+LFxuICAgIG5hbWVzID0gbmV3IEJpTWFwPHN0cmluZywgYW55IHwgU2F2ZWFibGU+KCksXG4gICAgdHlwZXMgPSBuZXcgTWFwPHN0cmluZywgYW55PigpLFxuICAgIHV1aWRGdW5jID0gZ2V0VVVJRGZ1bmN0aW9uKCksXG4gICAgY29udDogKG86IGFueSkgPT4gdm9pZCxcbik6IHZvaWQge1xuICAgIGNvbnN0IHByb2dCYXIgPSBwcm9zLnByb2dyZXNzO1xuICAgIGlmIChuYW1lcy5oYXNWYWwobykpIHtcbiAgICAgICAgdGhyZWFkRnVuY0hhbHQocHJvcywgY29udCwgbmV3IFdyYXBwZWRPYmplY3QobmFtZXMuZ2V0S2V5KG8pKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobyA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJlYWRGdW5jSGFsdChwcm9zLCBjb250LCBvKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgobyBhcyBTYXZlYWJsZSkuX3NhdmVTcGVjaWFsICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocmVhZEZ1bmNIYWx0KHByb3MsIGNvbnQsIChvIGFzIFNhdmVhYmxlKS5fc2F2ZVNwZWNpYWwobmFtZXMpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1dWlkID0gdXVpZEZ1bmMobyk7XG4gICAgICAgIG5hbWVzLnNldCh1dWlkLCBvKTtcblxuXG4gICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgdmFyIGl0byA9IG87XG4gICAgICAgIC8vZXhjZXB0aW9uczpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobykpIHtcbiAgICAgICAgICAgIG9iaiA9IFtdO1xuICAgICAgICB9IGVsc2UgaWYgKG8gaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgIGl0byA9IEFycmF5LmZyb20oby5lbnRyaWVzKCkpO1xuICAgICAgICAgICAgb2JqID0gW107XG4gICAgICAgIH0gZWxzZSBpZiAobyBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICAgICAgaXRvID0gQXJyYXkuZnJvbShvKTtcbiAgICAgICAgICAgIG9iaiA9IFtdO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIHZhciBuYW1lID0gXCJ1bmtub3duIHR5cGUgaWQ6XCIgKyBVVUlEKCk7XG4gICAgICAgIGlmIChvLmNvbnN0cnVjdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgIG5hbWUgPSBcIlwiICsgby5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICB9XG5cblxuICAgICAgICBjb25zdCB3byA9IG5ldyBXcmFwcGVkT2JqZWN0KHV1aWQsIG9iaiwgbmFtZSk7XG4gICAgICAgIHR5cGVzLnNldChuYW1lLCBvLl9fcHJvdG9fXyk7XG5cblxuICAgICAgICAvL3Byb2dyZXNzIGJhclxuICAgICAgICBwcm9nQmFyLmFkZFN1YigwKTtcbiAgICAgICAgY29uc3Qga2V5czogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBpdG8pIHtcbiAgICAgICAgICAgIGtleXMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICBwcm9nQmFyLmRlbm9taW5hdG9yID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIC8qaWYgKHByb2dCYXIuZGVub21pbmF0b3IgPT0gMCkge1xuICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgIH0qL1xuICAgICAgICB2YXIgaW5keCA9IDA7XG4gICAgICAgIGNvbnN0IGl0ZXJzdGVwID0gZnVuY3Rpb24oY29udDogKG86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKGluZHggPCBrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGkgPSBrZXlzW2luZHhdO1xuICAgICAgICAgICAgICAgIGluZHgrKztcbiAgICAgICAgICAgICAgICBwcm9nQmFyLm51bWVyYXRvcisrO1xuICAgICAgICAgICAgICAgIGlmICghaXNJZ25vcmVkKG8sIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIGl0b1tpXSkgPT0gXCJvYmplY3RcIikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXRhbmRjb250ID0gZnVuY3Rpb24ocmVzOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3by5PLypiamVjdCovW2ldID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJzdGVwKGNvbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJlYWRGdW5jSGFsdChwcm9zLCBhc3luY0NvbnZlcnRUb0pTT05hYmxlLCBpdG9baV0sIHByb3MsIG5hbWVzLCB0eXBlcywgdXVpZEZ1bmMsIHNldGFuZGNvbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3by5PLypiamVjdCovW2ldID0gaXRvW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJlYWRGdW5jSGFsdChwcm9zLCBpdGVyc3RlcCwgY29udCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL25leHRcbiAgICAgICAgICAgICAgICAgICAgdGhyZWFkRnVuY0hhbHQocHJvcywgaXRlcnN0ZXAsIGNvbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9nQmFyLnJlbVN1YigpO1xuICAgICAgICAgICAgICAgIC8qaWYgKHByb2dCYXIubnVtZXJhdG9ycy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ0Jhci5udW1lcmF0b3JzWzFdID49IHByb2dCYXIuZGVub21pbmF0b3JzWzFdIC0gZGVidWdPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZGVidWdnZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkID0gXCJlYnVnXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgICAgIHRocmVhZEZ1bmNIYWx0KHByb3MsIGNvbnQsIHdvKTtcblxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocmVhZEZ1bmNIYWx0KHByb3MsIGl0ZXJzdGVwLCBjb250KTtcbiAgICB9XG59XG5cblxuXG5cblxuXG5cbmNsYXNzIFVucmVzb2x2ZWRSZWZlcmVuY2Uge1xuICAgIF9fX19faXNVbnJlc29sdmVkUmVmZXJlbmNlID0gdHJ1ZTtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgbmFtZVNwYWNlOiBNYXA8c3RyaW5nLCBhbnkgfCBTYXZlYWJsZT4sIHB1YmxpYyByZWZlcmVyczogeyBvOiBhbnksIG46IHN0cmluZyB9W10gPSBbXSkgeyB9XG4gICAgYWRkUmVmZXJlcihvOiBhbnksIG46IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlZmVyZXJzLnB1c2goeyBvOiBvLCBuOiBuIH0pO1xuICAgIH1cbiAgICB0cnlSZXNvbHZlKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5uYW1lU3BhY2UuaGFzKHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLm5hbWVTcGFjZS5nZXQodGhpcy5uYW1lKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5yZWZlcmVycykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVmZXJlcnNbaV0ub1t0aGlzLnJlZmVyZXJzW2ldLm5dID0gcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRGcm9tSlNPTmFibGUobzogV3JhcHBlZE9iamVjdCxcbiAgICBwcm9nQmFyID0gbmV3IFRyZWVQcm9ncmVzc0JhcigpLFxuICAgIG5hbWVzID0gbmV3IE1hcDxzdHJpbmcsIGFueSB8IFNhdmVhYmxlPigpLFxuICAgIHR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKSxcbiAgICB1bnJlc29sdmVkUmVmcyA9IG5ldyBTZXQ8VW5yZXNvbHZlZFJlZmVyZW5jZT4oKSxcbiAgICB0aHJvd09uVW5rbm93blR5cGVzID0gZmFsc2UsXG4gICAgbG9jYWxPYmogPSB7fSxcbiAgICBsb2NhbE5hbWUgPSBcIlwiLFxuXG4pOiBhbnkgfCBTYXZlYWJsZSB7XG5cbiAgICBpZiAobyA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBvO1xuICAgIH1cbiAgICBpZiAoby5PLypiamVjdCovID09IG51bGwpIHtcbiAgICAgICAgLy9pdCdzIGEgcmVmZXJlbmNlXG4gICAgICAgIGlmIChuYW1lcy5oYXMoby5OLyphbWUqLykpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBuYW1lcy5nZXQoby5OLyphbWUqLyk7XG4gICAgICAgICAgICBpZiAoKHIgYXMgVW5yZXNvbHZlZFJlZmVyZW5jZSkuX19fX19pc1VucmVzb2x2ZWRSZWZlcmVuY2UgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHIuYWRkUmVmZXJlcihsb2NhbE9iaiwgbG9jYWxOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9kZWxheSB0aGlzIGRlcmVmZXJlbmNlXG4gICAgICAgICAgICBjb25zdCB1ciA9IG5ldyBVbnJlc29sdmVkUmVmZXJlbmNlKG8uTi8qYW1lKi8sIG5hbWVzKTtcbiAgICAgICAgICAgIHVyLmFkZFJlZmVyZXIobG9jYWxPYmosIGxvY2FsTmFtZSk7XG4gICAgICAgICAgICB1bnJlc29sdmVkUmVmcy5hZGQodXIpO1xuICAgICAgICAgICAgbmFtZXMuc2V0KG8uTi8qYW1lKi8sIHVyKTtcbiAgICAgICAgICAgIHJldHVybiB1cjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdHlwZXMuaGFzKG8uVC8qeXBlKi8pKSB7XG4gICAgICAgICAgICBpZiAodGhyb3dPblVua25vd25UeXBlcykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVuY291bnRlcmVkIHVua25vd24gdHlwZTpcIiArIG8uVC8qeXBlKi8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBybzogYW55ID0geyBfX3Byb3RvX186IHR5cGVzLmdldChvLlQvKnlwZSovKSB9O1xuXG4gICAgICAgIC8vZXhjZXB0aW9uc1xuICAgICAgICBpZiAoby5ULyp5cGUqLyA9PSBcIkFycmF5XCIgfHwgby5ULyp5cGUqLyA9PSBcIk1hcFwiIHx8IG8uVC8qeXBlKi8gPT0gXCJTZXRcIikge1xuICAgICAgICAgICAgcm8gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcHJvZ3Jlc3MgYmFyXG4gICAgICAgIHByb2dCYXIuYWRkU3ViKDApO1xuICAgICAgICBmb3IgKHZhciBpIGluIG8uTy8qYmplY3QqLykge1xuICAgICAgICAgICAgcHJvZ0Jhci5kZW5vbWluYXRvcisrO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBvLk8vKmJqZWN0Ki8pIHtcbiAgICAgICAgICAgIGlmICgodHlwZW9mIG8uTy8qYmplY3QqL1tpXSkgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHJvW2ldID0gY29udmVydEZyb21KU09OYWJsZShvLk8vKmJqZWN0Ki9baV0sIHByb2dCYXIsIG5hbWVzLCB0eXBlcywgdW5yZXNvbHZlZFJlZnMsIHRocm93T25Vbmtub3duVHlwZXMsIHJvLCBpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm9baV0gPSBvLk8vKmJqZWN0Ki9baV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9nQmFyLm51bWVyYXRvcisrO1xuICAgICAgICB9XG4gICAgICAgIHByb2dCYXIucmVtU3ViKCk7XG5cbiAgICAgICAgLy9leGNlcHRpb25zXG4gICAgICAgIGlmIChvLlQvKnlwZSovID09IFwiTWFwXCIpIHtcbiAgICAgICAgICAgIHJvID0gbmV3IE1hcChybyk7XG4gICAgICAgIH0gZWxzZSBpZiAoby5ULyp5cGUqLyA9PSBcIlNldFwiKSB7XG4gICAgICAgICAgICBybyA9IG5ldyBTZXQocm8pO1xuICAgICAgICB9XG5cblxuICAgICAgICAvL2ZpbmFsaXplIG9iamVjdFxuICAgICAgICBpZiAoKHJvIGFzIFNhdmVhYmxlKS5fbG9hZFNwZWNpYWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgcm8gPSAocm8gYXMgU2F2ZWFibGUpLl9sb2FkU3BlY2lhbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hbWVzLmhhcyhvLk4vKmFtZSovKSkge1xuICAgICAgICAgICAgY29uc3QgcjogYW55ID0gbmFtZXMuZ2V0KG8uTi8qYW1lKi8pO1xuICAgICAgICAgICAgbmFtZXMuZGVsZXRlKG8uTi8qYW1lKi8pO1xuICAgICAgICAgICAgaWYgKChyIGFzIFVucmVzb2x2ZWRSZWZlcmVuY2UpLl9fX19faXNVbnJlc29sdmVkUmVmZXJlbmNlID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBuYW1lcy5zZXQoby5OLyphbWUqLywgcm8pO1xuICAgICAgICAgICAgICAgIGlmICghKHIgYXMgVW5yZXNvbHZlZFJlZmVyZW5jZSkudHJ5UmVzb2x2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVucmVzb2x2ZWRSZWZlcmVuY2UgaGFkIHdyb25nIG5hbWUgb3IgbmFtZXNwYWNlLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdW5yZXNvbHZlZFJlZnMuZGVsZXRlKChyIGFzIFVucmVzb2x2ZWRSZWZlcmVuY2UpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm87XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmFtZXMuc2V0KG8uTi8qYW1lKi8sIHJvKTtcbiAgICAgICAgcmV0dXJuIHJvO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXN5bmNDb252ZXJ0RnJvbUpTT05hYmxlKG86IFdyYXBwZWRPYmplY3QsXG4gICAgcHJvczogQXN5bmNUcmVlUHJvY2VzczxhbnkgfCBTYXZlYWJsZT4sXG4gICAgbmFtZXMgPSBuZXcgTWFwPHN0cmluZywgYW55IHwgU2F2ZWFibGU+KCksXG4gICAgdHlwZXMgPSBuZXcgTWFwPHN0cmluZywgYW55PigpLFxuICAgIHVucmVzb2x2ZWRSZWZzID0gbmV3IFNldDxVbnJlc29sdmVkUmVmZXJlbmNlPigpLFxuICAgIHRocm93T25Vbmtub3duVHlwZXMgPSBmYWxzZSwgY29udDogKG86IGFueSkgPT4gdm9pZCxcbiAgICBsb2NhbE9iaiA9IHt9LFxuICAgIGxvY2FsTmFtZSA9IFwiXCIsXG5cbik6IHZvaWQge1xuICAgIGNvbnN0IHByb2dCYXIgPSBwcm9zLnByb2dyZXNzO1xuICAgIGlmIChvID09IG51bGwpIHtcbiAgICAgICAgdGhyZWFkRnVuY0hhbHQocHJvcywgY29udCwgbyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG8uTy8qYmplY3QqLyA9PSBudWxsKSB7XG4gICAgICAgIC8vaXQncyBhIHJlZmVyZW5jZVxuICAgICAgICBpZiAobmFtZXMuaGFzKG8uTi8qYW1lKi8pKSB7XG4gICAgICAgICAgICBjb25zdCByID0gbmFtZXMuZ2V0KG8uTi8qYW1lKi8pO1xuICAgICAgICAgICAgaWYgKChyIGFzIFVucmVzb2x2ZWRSZWZlcmVuY2UpLl9fX19faXNVbnJlc29sdmVkUmVmZXJlbmNlID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByLmFkZFJlZmVyZXIobG9jYWxPYmosIGxvY2FsTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJlYWRGdW5jSGFsdChwcm9zLCBjb250LCByKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vZGVsYXkgdGhpcyBkZXJlZmVyZW5jZVxuICAgICAgICAgICAgY29uc3QgdXIgPSBuZXcgVW5yZXNvbHZlZFJlZmVyZW5jZShvLk4vKmFtZSovLCBuYW1lcyk7XG4gICAgICAgICAgICB1ci5hZGRSZWZlcmVyKGxvY2FsT2JqLCBsb2NhbE5hbWUpO1xuICAgICAgICAgICAgdW5yZXNvbHZlZFJlZnMuYWRkKHVyKTtcbiAgICAgICAgICAgIG5hbWVzLnNldChvLk4vKmFtZSovLCB1cik7XG4gICAgICAgICAgICB0aHJlYWRGdW5jSGFsdChwcm9zLCBjb250LCB1cik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXR5cGVzLmhhcyhvLlQvKnlwZSovKSkge1xuICAgICAgICAgICAgaWYgKHRocm93T25Vbmtub3duVHlwZXMpIHtcbiAgICAgICAgICAgICAgICBwcm9zLnRocm93KG5ldyBFcnJvcihcIkVuY291bnRlcmVkIHVua25vd24gdHlwZTpcIiArIG8uVC8qeXBlKi8pKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJvOiBhbnkgPSB7IF9fcHJvdG9fXzogdHlwZXMuZ2V0KG8uVC8qeXBlKi8pIH07XG5cbiAgICAgICAgLy9leGNlcHRpb25zXG4gICAgICAgIGlmIChvLlQvKnlwZSovID09IFwiQXJyYXlcIiB8fCBvLlQvKnlwZSovID09IFwiTWFwXCIgfHwgby5ULyp5cGUqLyA9PSBcIlNldFwiKSB7XG4gICAgICAgICAgICBybyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9wcm9ncmVzcyBiYXJcbiAgICAgICAgcHJvZ0Jhci5hZGRTdWIoMCk7XG4gICAgICAgIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAodmFyIGkgaW4gby5PLypiamVjdCovKSB7XG4gICAgICAgICAgICBwcm9nQmFyLmRlbm9taW5hdG9yKys7XG4gICAgICAgICAgICBrZXlzLnB1c2goaSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5keCA9IDA7XG4gICAgICAgIGNvbnN0IGxvb3BTdGVwID0gZnVuY3Rpb24oY29udDogKG86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKGluZHggPCBrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGkgPSBrZXlzW2luZHhdO1xuICAgICAgICAgICAgICAgIGluZHgrKztcbiAgICAgICAgICAgICAgICBpZiAoKHR5cGVvZiBvLk8vKmJqZWN0Ki9baV0pID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGkgPSBmdW5jdGlvbihvOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvW2ldID0gbztcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dCYXIubnVtZXJhdG9yKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb29wU3RlcChjb250KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRocmVhZEZ1bmNIYWx0KHByb3MsIGFzeW5jQ29udmVydEZyb21KU09OYWJsZSwgby5PLypiamVjdCovW2ldLCBwcm9zLCBuYW1lcywgdHlwZXMsIHVucmVzb2x2ZWRSZWZzLCB0aHJvd09uVW5rbm93blR5cGVzLCBjb250aSwgcm8sIGkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvW2ldID0gby5PLypiamVjdCovW2ldO1xuICAgICAgICAgICAgICAgICAgICBwcm9nQmFyLm51bWVyYXRvcisrO1xuICAgICAgICAgICAgICAgICAgICB0aHJlYWRGdW5jSGFsdChwcm9zLCBsb29wU3RlcCwgY29udCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBwcm9nQmFyLnJlbVN1YigpO1xuXG4gICAgICAgICAgICAgICAgLy9leGNlcHRpb25zXG4gICAgICAgICAgICAgICAgaWYgKG8uVC8qeXBlKi8gPT0gXCJNYXBcIikge1xuICAgICAgICAgICAgICAgICAgICBybyA9IG5ldyBNYXAocm8pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoby5ULyp5cGUqLyA9PSBcIlNldFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvID0gbmV3IFNldChybyk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAvL2ZpbmFsaXplIG9iamVjdFxuICAgICAgICAgICAgICAgIGlmICgocm8gYXMgU2F2ZWFibGUpLl9sb2FkU3BlY2lhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvID0gKHJvIGFzIFNhdmVhYmxlKS5fbG9hZFNwZWNpYWwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobmFtZXMuaGFzKG8uTi8qYW1lKi8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHI6IGFueSA9IG5hbWVzLmdldChvLk4vKmFtZSovKTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZXMuZGVsZXRlKG8uTi8qYW1lKi8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHIgYXMgVW5yZXNvbHZlZFJlZmVyZW5jZSkuX19fX19pc1VucmVzb2x2ZWRSZWZlcmVuY2UgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXMuc2V0KG8uTi8qYW1lKi8sIHJvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHIgYXMgVW5yZXNvbHZlZFJlZmVyZW5jZSkudHJ5UmVzb2x2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5yZXNvbHZlZFJlZmVyZW5jZSBoYWQgd3JvbmcgbmFtZSBvciBuYW1lc3BhY2UuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdW5yZXNvbHZlZFJlZnMuZGVsZXRlKChyIGFzIFVucmVzb2x2ZWRSZWZlcmVuY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocmVhZEZ1bmNIYWx0KHByb3MsIGNvbnQsIHJvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuYW1lcy5zZXQoby5OLyphbWUqLywgcm8pO1xuICAgICAgICAgICAgICAgIHRocmVhZEZ1bmNIYWx0KHByb3MsIGNvbnQsIHJvKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyZWFkRnVuY0hhbHQocHJvcywgbG9vcFN0ZXAsIGNvbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufVxuY2xhc3MgZnVuY3Rpb25XcmFwcGVyIHtcbiAgICAvL2ZvciB3cmFwcGluZyBmdW5jdGlvbnMgZm9yIGhhY2t5IHNhdmVpbmcgb2YgdW5zYXZlYWJsZSB0eXBlc1xuICAgIGNvZGU6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihmOiBhbnkgLyogaXMgZnVuY3Rpb24sIGJ1dCBJJ20gbm90IGRvaW5nIHR5cGVzY3JpcHQtZnJpZW5kbHkgc3R1ZmYgaGVyZSAqLykgeyB0aGlzLmNvZGUgPSBmLnRvU3RyaW5nKCk7IH1cbiAgICB0b0Z1bmN0aW9uKCk6IGFueSB7XG4gICAgICAgIGNvbnN0IGZ1bmMgPSBldmFsKFwiKFwiICsgdGhpcy5jb2RlICsgXCIpXCIpO1xuICAgICAgICByZXR1cm4gZnVuYztcbiAgICB9XG59XG5pbnRlcmZhY2UgQXN5bmNIYWx0YWJsZVByb2Nlc3Mge1xuICAgIGhhbHQ6IGJvb2xlYW47XG59XG5cblxuY2xhc3MgQXN5bmNUcmVlUHJvY2VzczxUPiBpbXBsZW1lbnRzIEFzeW5jSGFsdGFibGVQcm9jZXNzIHtcbiAgICBkb25lID0gZmFsc2U7XG4gICAgZmFpbGVkID0gZmFsc2U7XG4gICAgaGFsdCA9IGZhbHNlO1xuICAgIGVycm9yOiBFcnJvcjtcbiAgICByZXN1bHQ6IFQ7XG4gICAgY29uc3RydWN0b3IocHVibGljIHByb2dyZXNzOiBUcmVlUHJvZ3Jlc3NCYXIpIHsgfVxuICAgIHNldChyOiBUKSB7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gcjtcbiAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhyb3coZTogRXJyb3IpIHtcbiAgICAgICAgdGhpcy5lcnJvciA9IGU7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5oYWx0ID0gdHJ1ZTtcbiAgICAgICAgLy9hbmQgaG9wZSB0aGUgaGFja3kgbXVsdGl0aHJlYWQgcHJvY2VzcyByZXNwZWN0cyBpdFxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2F2ZWFibGVUeXBlcygpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICBjb25zdCBwcmltczogQXJyYXk8YW55PiA9IFtBcnJheSwgTWFwLCBTZXRdO1xuICAgIGNvbnN0IHR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcblxuICAgIGZvciAodmFyIGkgaW4gcHJpbXMpIHtcbiAgICAgICAgdHlwZXMuc2V0KHByaW1zW2ldLm5hbWUsIHByaW1zW2ldLnByb3RvdHlwZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2F2ZWFibGVzID0gU2F2ZWFibGUuR2V0SW1wbGVtZW50YXRpb25zKCk7XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBzYXZlYWJsZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgdHlwZXMuc2V0KHNhdmVhYmxlc1t4XS5uYW1lLCBzYXZlYWJsZXNbeF0ucHJvdG90eXBlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHlwZXM7XG59XG5cblxuZnVuY3Rpb24gc2F2ZShvOiBhbnkgfCBTYXZlYWJsZSwgcGJhciA9IG5ldyBUcmVlUHJvZ3Jlc3NCYXIoKSwgbmFtZXMgPSBuZXcgQmlNYXA8c3RyaW5nLCBhbnkgfCBTYXZlYWJsZT4oKSk6IHN0cmluZyB7XG4gICAgY29uc3QgdHlwZXMgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICAgIGNvbnN0IGpzb25hYmxlID0gY29udmVydFRvSlNPTmFibGUobywgcGJhciwgbmFtZXMsIHR5cGVzKTtcbiAgICAvL2NvbnN0IGpzb25hYmxlVHlwZXMgPSB7fTtcbiAgICAvL2NvbnN0IG91dE9iaiA9IHsgbzoganNvbmFibGUsIHQ6IGpzb25hYmxlVHlwZXMgfTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShqc29uYWJsZSk7XG59XG5mdW5jdGlvbiBub3AoKTogdm9pZCB7IH1cblxuZnVuY3Rpb24gYXN5bmNTYXZlKG86IGFueSB8IFNhdmVhYmxlLCBuYW1lcyA9IG5ldyBCaU1hcDxzdHJpbmcsIGFueSB8IFNhdmVhYmxlPigpLCBjYjogKHA6IEFzeW5jVHJlZVByb2Nlc3M8c3RyaW5nPikgPT4gdm9pZCA9IChwOiBBc3luY1RyZWVQcm9jZXNzPHN0cmluZz4pID0+IG5vcCgpKTogQXN5bmNUcmVlUHJvY2VzczxzdHJpbmc+IHtcbiAgICAvL2RlYnVnT2Zmc2V0Kys7XG4gICAgY29uc3QgcHJvcyA9IG5ldyBBc3luY1RyZWVQcm9jZXNzPHN0cmluZz4obmV3IFRyZWVQcm9ncmVzc0JhcigpKTtcbiAgICBjb25zdCByZXQgPSBmdW5jdGlvbihvOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgcHJvcy5zZXQoSlNPTi5zdHJpbmdpZnkobykpO1xuICAgICAgICBjYihwcm9zKTtcbiAgICB9XG4gICAgY29uc3QgdHlwZXMgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuXG4gICAgdGhyZWFkRnVuYyhhc3luY0NvbnZlcnRUb0pTT05hYmxlLCBvLCBwcm9zLCBuYW1lcywgdHlwZXMsIGdldFVVSURmdW5jdGlvbigpLCByZXQpO1xuICAgIHJldHVybiBwcm9zO1xufVxuXG5cblxuZnVuY3Rpb24gbG9hZChzOiBzdHJpbmcsIHBiYXIgPSBuZXcgVHJlZVByb2dyZXNzQmFyKCksIG5hbWVzID0gbmV3IE1hcDxzdHJpbmcsIGFueSB8IFNhdmVhYmxlPigpLCB0eXBlcyA9IGdldFNhdmVhYmxlVHlwZXMoKSwgdW5yZXNvbHZlZFJlZnMgPSBuZXcgU2V0PFVucmVzb2x2ZWRSZWZlcmVuY2U+KCkpOiBhbnkgfCBTYXZlYWJsZSB7XG4gICAgY29uc3QgaW5PYmogPSBKU09OLnBhcnNlKHMpO1xuXG5cblxuICAgIHJldHVybiBjb252ZXJ0RnJvbUpTT05hYmxlKGluT2JqLCBwYmFyLCBuYW1lcywgdHlwZXMsIHVucmVzb2x2ZWRSZWZzKTtcbn1cblxuZnVuY3Rpb24gYXN5bmNMb2FkKHM6IHN0cmluZywgY2I6IChwOiBBc3luY1RyZWVQcm9jZXNzPGFueSB8IFNhdmVhYmxlPikgPT4gdm9pZCA9IChwOiBBc3luY1RyZWVQcm9jZXNzPGFueSB8IFNhdmVhYmxlPikgPT4gbm9wKClcbiAgICAsIG5hbWVzID0gbmV3IE1hcDxzdHJpbmcsIGFueSB8IFNhdmVhYmxlPigpLCB0eXBlcyA9IGdldFNhdmVhYmxlVHlwZXMoKSwgdW5yZXNvbHZlZFJlZnMgPSBuZXcgU2V0PFVucmVzb2x2ZWRSZWZlcmVuY2U+KClcbik6IEFzeW5jVHJlZVByb2Nlc3M8YW55IHwgU2F2ZWFibGU+IHtcbiAgICBjb25zdCBpbk9iaiA9IEpTT04ucGFyc2Uocyk7XG4gICAgY29uc3QgcHJvcyA9IG5ldyBBc3luY1RyZWVQcm9jZXNzPGFueSB8IFNhdmVhYmxlPihuZXcgVHJlZVByb2dyZXNzQmFyKCkpO1xuICAgIGNvbnN0IHJldCA9IGZ1bmN0aW9uKG86IGFueSk6IHZvaWQge1xuICAgICAgICBwcm9zLnNldChvKTtcbiAgICAgICAgY2IocHJvcyk7XG4gICAgfVxuICAgIHRocmVhZEZ1bmMoYXN5bmNDb252ZXJ0RnJvbUpTT05hYmxlLCBpbk9iaiwgcHJvcywgbmFtZXMsIHR5cGVzLCB1bnJlc29sdmVkUmVmcywgZmFsc2UsIHJldCk7XG5cbiAgICByZXR1cm4gcHJvcztcbn1cblxuXG5pbXBvcnQgeyBkaWFsb2cgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbi8vaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmFpbCB9IGZyb20gXCJhc3NlcnRcIjtcblxuZnVuY3Rpb24gY29weVN0cmluZ1RvQ2xpcGJvYXJkKHN0cjogc3RyaW5nKTogdm9pZCB7XG4gICAgLy9odHRwczovL3RlY2hvdmVyZmxvdy5uZXQvMjAxOC8wMy8zMC9jb3B5aW5nLXN0cmluZ3MtdG8tdGhlLWNsaXBib2FyZC11c2luZy1wdXJlLWphdmFzY3JpcHQvXG4gICAgLy8gQ3JlYXRlIG5ldyBlbGVtZW50XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAvLyBTZXQgdmFsdWUgKHN0cmluZyB0byBiZSBjb3BpZWQpXG4gICAgZWwudmFsdWUgPSBzdHI7XG4gICAgLy8gU2V0IG5vbi1lZGl0YWJsZSB0byBhdm9pZCBmb2N1cyBhbmQgbW92ZSBvdXRzaWRlIG9mIHZpZXdcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JywgJycpO1xuICAgIGVsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBlbC5zdHlsZS5sZWZ0ID0gJy05OTk5cHgnO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG4gICAgLy8gU2VsZWN0IHRleHQgaW5zaWRlIGVsZW1lbnRcbiAgICBlbC5zZWxlY3QoKTtcbiAgICAvLyBDb3B5IHRleHQgdG8gY2xpcGJvYXJkXG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgICAvLyBSZW1vdmUgdGVtcG9yYXJ5IGVsZW1lbnRcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsKTtcbn1cblxuXG5mdW5jdGlvbiBkb3dubG9hZChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcblx0LypcbiAgICBmcy53cml0ZUZpbGUoZmlsZW5hbWUsIHRleHQsIGZ1bmN0aW9uKGVycjogRXJyb3IpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIkZpbGUgY3JlYXRlZCFcIik7XG4gICAgfSk7Ki9cbiAgICAvL2NvcHlTdHJpbmdUb0NsaXBib2FyZCh0ZXh0KTtcbiAgICAvL2FsZXJ0KFwiZmlsZSBjb3BpZWQgdG8gY2xpcGJvYXJkXFxuc2l6ZTpcIiArIHRleHQubGVuZ3RoICsgXCJcXG5cIiArIHRleHQuc3Vic3RyKDAsIDEyKSArIFwiLi4uXCIpO1xuXG4gICAgLyovXG4gICAgZnVuY3Rpb24gY2FsbGJhY2sobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChuYW1lID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMobmFtZSwgdGV4dCwgJ3V0Zi04Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZWRcIik7XG4gICAgfVxuICAgIGRpYWxvZy5zaG93U2F2ZURpYWxvZyh7IHRpdGxlOiBcInNhdmUgZmlsZVwiLCB9LCBjYWxsYmFjayk7XG4gICAgLy8qL1xuXG59XG5cblxuZXhwb3J0IHtcbiAgICBzYXZlLCBsb2FkLFxuICAgIGFzeW5jU2F2ZSxcbiAgICBhc3luY0xvYWQsXG5cblxuICAgIFNhdmVhYmxlXG4gICAgLCBkb3dubG9hZCxcbiAgICBOZWdhdGVkU2V0XG4gICAgLCBUcmVlUHJvZ3Jlc3NCYXJcbiAgICAsIEFzeW5jVHJlZVByb2Nlc3NcbiAgICAsIEJpTWFwXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvc2F2ZS50cyIsIlxuLy9yZXR1cm5zIGFuIGluZGV4IGkgaW50byBhcnIgd2l0aCBhcnJbaV0gPj0gdmFsXG4vLyBhbmQgaWYgPiwgdGhlbiBpIGlzIG1pbmltdW0gc3VjaCBpbmRleFxuZXhwb3J0IGZ1bmN0aW9uIGFzY2VuZGluZ19zZWFyY2hfcmlnaHQoYXJyOiBudW1iZXJbXSwgdmFsOiBudW1iZXIsIGxvdyA9IDAsIGhpZ2ggPSBJbmZpbml0eSk6IG51bWJlciB7XG4gICAgbG93ID0gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihsb3cpKTtcbiAgICBoaWdoID0gTWF0aC5taW4oTWF0aC5mbG9vcihoaWdoKSwgYXJyLmxlbmd0aCAtIDEpO1xuICAgIHdoaWxlIChsb3cgPD0gaGlnaCkge1xuICAgICAgICBjb25zdCBtaWQgPSBNYXRoLmZsb29yKChoaWdoICsgbG93KSAvIDIpOy8vYXZvaWQgYml0IG9wcyBiZWNhdXNlIHRoZXkgY2FzdCB0byBpbnQzMlxuICAgICAgICBjb25zdCB2ID0gYXJyW21pZF07XG4gICAgICAgIGlmICh2IDwgdmFsKVxuICAgICAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgICAgZWxzZSBpZiAodiA9PSB2YWwpXG4gICAgICAgICAgICByZXR1cm4gbWlkO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBoaWdoID0gbWlkIC0gMVxuICAgIH1cbiAgICByZXR1cm4gbG93O1xufVxuLyogaGFuZCBydW5zOlxuICAgIDAgMSAyIDMgNCA1IDYgN1xuICAgIDAgMiAzIDYgNiA3IDggOVxuNiAgIF4gICAgIG0gICAgICAgXiAtPiAzXG42LjEgXiAgICAgbSAgICAgICBeXG4gICAgICAgICAgICBeIG0gICBeXG4gICAgICAgICAgICBeIHIgICAgIC0+IDVcbjUuOSBeICAgICBtICAgICAgIF5cbiAgICBeIG0gXlxuICAgICAgICBeIHIgICAgICAgICAtPiAzXG45ICAgXiAgICAgbSAgICAgICBeXG4gICAgICAgICAgICBeIG0gICBeXG4gICAgICAgICAgICAgICAgXiBeXG4gICAgICAgICAgICAgICAgICBeIC0+IDdcbjkuMSBeICAgICBtICAgICAgIF5cbiAgICAgICAgICAgIF4gbSAgIF5cbiAgICAgICAgICAgICAgICBeIF5cbiAgICAgICAgICAgICAgICAgIF4gciAtPiA4XG4tMSAgXiAgICAgbSAgICAgICBeXG4gICAgXiBtIF5cbiAgICBeXG4gIF4gXiAgICAgICAgICAgICAgICAgLT4gMFxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc2NlbmRpbmdfc2VhcmNoX3JpZ2h0KGFycjogbnVtYmVyW10sIHZhbDogbnVtYmVyLCBsb3cgPSAwLCBoaWdoID0gSW5maW5pdHkpOiBudW1iZXIge1xuICAgIGxvdyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3IobG93KSk7XG4gICAgaGlnaCA9IE1hdGgubWluKE1hdGguZmxvb3IoaGlnaCksIGFyci5sZW5ndGggLSAxKTtcbiAgICB3aGlsZSAobG93IDw9IGhpZ2gpIHtcbiAgICAgICAgY29uc3QgbWlkID0gTWF0aC5mbG9vcigoaGlnaCArIGxvdykgLyAyKTsvL2F2b2lkIGJpdCBvcHMgYmVjYXVzZSB0aGV5IGNhc3QgdG8gaW50MzJcbiAgICAgICAgY29uc3QgdiA9IGFyclttaWRdO1xuICAgICAgICBpZiAodiA+IHZhbClcbiAgICAgICAgICAgIGxvdyA9IG1pZCArIDE7XG4gICAgICAgIGVsc2UgaWYgKHYgPT0gdmFsKVxuICAgICAgICAgICAgcmV0dXJuIG1pZDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgaGlnaCA9IG1pZCAtIDFcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC90b29scy9iaW5hcnlfc2VhcmNoLnRzIiwiXG5cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmbG9hdF9kaWYoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGRpZiA9IGEgLSBiO1xuICAgIGNvbnN0IHByZWMgPSBNYXRoLmFicyhhKSArIE1hdGguYWJzKGIpO1xuICAgIGlmIChwcmVjID09IDApXG4gICAgICAgIC8vdGhlbiBhID09IDAgYW5kIGIgPT0gMFxuICAgICAgICByZXR1cm4gMDtcbiAgICByZXR1cm4gZGlmIC8gcHJlYztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsb2F0X25lYXIoYTogbnVtYmVyLCBiOiBudW1iZXIsIGVwc2lsb246IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBNYXRoLmFicyhmbG9hdF9kaWYoYSwgYikpIDw9IGVwc2lsb247XG59XG5cblxuXG5cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvdG9vbHMvZmxvYXRfZGlmZmVyZW5jZS50cyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWQvdjRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ1dWlkL3Y0XCJcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==