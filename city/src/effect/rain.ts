import { loadImage } from "@/utils";
import * as THREE from "three";
import { Points } from "./points";

export class Rain {
  scene: THREE.Scene;
  geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes> | undefined;
  material: THREE.PointsMaterial | undefined;
  points: Points;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.points = new Points(scene, {
      size: 10,
      opacity: 0.4,
      range: 1000,
      count: 600,
      url: loadImage("@/assets/rain.png"),
      setPosition(position) {
        position.speedY = 10;
      },
      setAnimation(position) {
        position.y -= position.speedY;

        // 设定阈值，雪花落到地上，就回到原来位置
        if (position.y <= 0) {
          position.y = this.range / 2;
        }
      },
    });
  }
}
