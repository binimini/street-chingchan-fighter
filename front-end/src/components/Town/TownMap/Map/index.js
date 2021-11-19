import { useEffect } from "react";

import './style.scss';

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
      <div className={'map-container'}>
        <canvas id="map-canvas"></canvas>
      </div>
    </>
  )
}

export default Map;