export default class Matrix {
  // Rotate around the x-axis
  static Rx = (a: number) => [
    [1, 0, 0],
    [0, Math.cos(a), -Math.sin(a)],
    [0, Math.sin(a), Math.cos(a)],
  ];

  // Rotate around the y-axis
  static Ry = (a: number) => [
    [Math.cos(a), 0, Math.sin(a)],
    [0, 1, 0],
    [-Math.sin(a), 0, Math.cos(a)],
  ];

  // Rotate around the z-axis
  static Rz = (a: number) => [
    [Math.cos(a), -Math.sin(a), 0],
    [Math.sin(a), Math.cos(a), 0],
    [0, 0, 1],
  ];

  /**
   * Multiply two matrices together (cross product)
   * @param a Matrix A
   * @param b Matrix B
   * @returns Resulting matrix
   */
  static mul(a: number[][], b: number[][]): number[][] {
    const aR = a.length;
    const aC = a[0].length;
    const bC = b[0].length;
    const res = new Array(aR);

    // For all rows of A
    for (let r = 0; r < aR; r += 1) {
      res[r] = new Array(bC); // Init array

      // For all columns of B
      for (let c = 0; c < bC; c += 1) {
        res[r][c] = 0; // Init slot

        // For all columns of A
        for (let i = 0; i < aC; i += 1)
          res[r][c] += a[r][i] * b[i][c]; // Multiply and store
      }
    }

    return res;
  }
}