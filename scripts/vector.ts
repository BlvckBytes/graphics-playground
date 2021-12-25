export default class Vector {

  constructor(
    public x: number,
    public y: number,
    public z = 0,
  ) {}

  /**
   * Add another vector in place
   * @param v Vector to add
   * @returns Self
   */
  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  /**
   * Subtract another vector in place
   * @param v Vector to subtract
   * @returns Self
   */
  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  /**
   * Multiply another vector in place
   * @param v Vector to multiply
   * @returns Self
   */
  mult(v: Vector) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
  }

  /**
   * Get the matrix representation of this vector
   */
  toMatrix() {
    return [[this.x], [this.y], [this.z]];
  }

  /**
   * Create a carbon copy of this vector
   */
  clone() {
    return new Vector(this.x, this.y, this.z);
  }

  /**
   * Get the string representation of this vector's coordinates
   */
  stringify() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}