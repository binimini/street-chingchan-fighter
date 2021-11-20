export const drawAvatar = (ctx, img, src_x_pos, width, height) => {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(
    img,
    src_x_pos,
    0,
    img.naturalWidth / 16,
    img.naturalHeight,
    0,
    0,
    width,
    height
  );
};