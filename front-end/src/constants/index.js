export const MY_AVATAR = {
  x: 100,
  y: 120,
  avatarSrcPosition: 0,
};

export const LEFT_POS = 128;
export const RIGHT_POS = 320;
export const UP_POS = 224;
export const DOWN_POS = 32;
export const NEXT_POS = 32;
export const STRIDE = 52;

const makeMapArray = (width, height) => {
  return Array(height)
    .fill(0)
    .map((_, row_idx, row_arr) =>
      Array(width)
        .fill(1)
        .map((_, col_idx, col_arr) => {
          if (
            row_idx === 0 ||
            row_idx === row_arr.length - 1 ||
            col_idx === 0 ||
            col_idx === col_arr.length - 1
          )
            return 1;
          return 0;
        })
    );
};

export const MAP = makeMapArray(2448, 2144);