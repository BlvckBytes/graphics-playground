import Vector from './vector';

export default interface IDrawable {
  points: Vector[]
  lines: [Vector, Vector][]
}