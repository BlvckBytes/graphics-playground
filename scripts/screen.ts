import Block from './block';
import Color from './color';
import Vector from './vector';

export default class Screen {

  // Canvas references
  private ctx: CanvasRenderingContext2D;
  private cvSz = new Vector(0, 0);

  // Canvas appearance
  private bg = Color.BLACK;
  private pointSz = 8;
  private lineSz = 2;

  private blocks: Block[] = [];

  constructor(identifier: string) {
    // Find target context from element-id
    const target = (document.getElementById(identifier) as HTMLCanvasElement)?.getContext('2d');
    if (target === null)
      throw new Error(`Could not find target canvas identified by #${identifier}`);
    this.ctx = target;

    this.resizeCanvas();

    // Create test block
    this.blocks.push(new Block(new Vector(this.cvSz.x / 2, this.cvSz.y / 2, 0), new Vector(100, 200, 100)));
  }

  /**
   * Resize the canvas to be as big as the browser
   * window allows (fullscreen)
   */
  private resizeCanvas() {
    this.cvSz.x = window.innerWidth;
    this.cvSz.y = window.innerHeight;
    this.ctx.canvas.width = this.cvSz.x;
    this.ctx.canvas.height = this.cvSz.y;
  }

  private project(v: Vector): Vector {
    return v;
  }

  /**
   * Draw a point on the screen
   * @param loc Location of the center of the point
   * @param color Color of the point
   * @param fill Whether or not to fill this point
   */
  public drawPoint(loc: Vector, color: Color, fill = true) {
    this.ctx.save();
    this.ctx.fillStyle = fill ? color : '';
    this.ctx.strokeStyle = fill ? '' : color;
    this.ctx.lineWidth = this.lineSz;
    this.ctx.beginPath();
    this.ctx.arc(loc.x, loc.y, this.pointSz, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Draw a line connecting two points on the screen
   * @param a Location of the start of the line
   * @param b Location of the end of the line
   * @param color Color of the line
   */
  public drawLine(a: Vector, b: Vector, color: Color) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = this.lineSz;
    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);
    this.ctx.lineTo(b.x, b.y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Clear the whole canvas
   */
  public clear() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.bg;
    this.ctx.rect(0, 0, this.cvSz.x, this.cvSz.y);
    this.ctx.fill();
  }

  /**
   * Draw next frame
   */
  public update() {
    this.clear();

    // Draw all blocks
    for (let i = 0; i < this.blocks.length; i += 1) {
      const info = this.blocks[i].draw();
      this.blocks[i].rotate(new Vector(0.01, 0.01, 0.01));
      
      // Draw all points of this block
      for (let j = 0; j < info.points.length; j += 1)
        this.drawPoint(this.project(info.points[j]), Color.RED, false);

      // Draw all lines of this block
      for (let j = 0; j < info.lines.length; j += 1) {
        const [a, b] = info.lines[j];
        this.drawLine(this.project(a), this.project(b), Color.WHITE);
      }
    }
  }
}