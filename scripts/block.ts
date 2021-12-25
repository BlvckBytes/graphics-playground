import IDrawable from './drawable';
import Matrix from './matrix';
import Vector from './vector';

export default class Block {

  rot: Vector;

  constructor(
    public loc: Vector,
    public sz: Vector,
  ) {
    // Starting off with no rotation
    this.rot = new Vector(0, 0, 0);
  }

  /**
   * Rotate this block around all three of it's axies
   * where the center is used as the origin
   * @param rads Angles in radients
   * @param override Wheter to add to previous stare or override
   */
  rotate(rads: Vector, override = false) {
    if (override)
      this.rot = rads;
    else
      this.rot.add(rads);
  }

  /**
   * Move this block around by the given distances
   * @param steps Steps per axis
   */
  move(steps: Vector) {
    this.loc.add(steps);
  }

  /**
   * Apply all rotations from current state on a list of points
   * @param points List of points to transform
   * @returns New list of points
   */
  private applyRotations(points: Vector[]): Vector[] {
    const res: Vector[] = [];

    for (let i = 0; i < points.length; i += 1) {
      // Matrix which represents the point's location as a
      // vector starting at (0, 0, 0)
      let mat = (points[i]).clone().sub(this.loc).toMatrix();

      // Apply rotations
      mat = Matrix.mul(Matrix.Rx(this.rot.x), mat);
      mat = Matrix.mul(Matrix.Ry(this.rot.y), mat);
      mat = Matrix.mul(Matrix.Rz(this.rot.z), mat);

      // Push resulting matrix as a vector
      // Shift this vector back into the local center
      res.push(new Vector(
        mat[0][0],
        mat[1][0],
        mat[2][0],
      ).add(this.loc));
    }

    return res;
  }

  /**
   * Collapse this block's state down into points and lines
   * @returns Information to be drawn on screen
   */
  draw(): IDrawable {
    const points = this.applyRotations([
      // "Front" face, clockwise, starting top right
      new Vector(this.loc.x - this.sz.x / 2, this.loc.y + this.sz.y / 2, this.loc.z - this.sz.z / 2),
      new Vector(this.loc.x + this.sz.x / 2, this.loc.y + this.sz.y / 2, this.loc.z - this.sz.z / 2),
      new Vector(this.loc.x + this.sz.x / 2, this.loc.y - this.sz.y / 2, this.loc.z - this.sz.z / 2),
      new Vector(this.loc.x - this.sz.x / 2, this.loc.y - this.sz.y / 2, this.loc.z - this.sz.z / 2),
      
      // "Back" face, cszkwise, starting top right
      new Vector(this.loc.x - this.sz.x / 2, this.loc.y + this.sz.y / 2, this.loc.z + this.sz.z / 2),
      new Vector(this.loc.x + this.sz.x / 2, this.loc.y + this.sz.y / 2, this.loc.z + this.sz.z / 2),
      new Vector(this.loc.x + this.sz.x / 2, this.loc.y - this.sz.y / 2, this.loc.z + this.sz.z / 2),
      new Vector(this.loc.x - this.sz.x / 2, this.loc.y - this.sz.y / 2, this.loc.z + this.sz.z / 2),
    ]);

    // Connect up all points with lines
    const lines: [Vector, Vector][] = [];
    for (let i = 0; i < 4; i += 1) {
      lines.push([points[i], points[(i + 1) % 4]]);
      lines.push([points[i + 4], points[(i + 1) % 4 + 4]]);
      lines.push([points[i], points[(i + 4)]]);
    }

    return { points, lines };
  }
}