import { useEffect } from "react";

const drawMap = () => {
  const mapCanvas = document.getElementById("map-canvas");
  const ctx = mapCanvas.getContext("2d");

  const img = new Image();
  img.onload = function () {
    mapCanvas.width = img.naturalWidth;
    mapCanvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  img.src = "/images/map/map.png";
};

const Map = () => {
  useEffect(() => {
    drawMap();
  }, []);

  return (
    <>
      <canvas id="map-canvas"></canvas>
    </>
  )
}

export default Map;