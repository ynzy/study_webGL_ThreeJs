import { loadImage } from "@/utils";
import * as THREE from "three";

export class Rain {
  scene: THREE.Scene;
  range: number;
  count: number;
  geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes> | undefined;
  material: THREE.PointsMaterial | undefined;
  pointList: any[];
  points:
    | THREE.Points<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.PointsMaterial
      >
    | undefined;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    // 雨范围
    this.range = 1000;
    // 个数
    this.count = 600;
    this.pointList = [];
    this.init();
  }
  init() {
    // 使用粒子和粒子系统实现
    this.material = new THREE.PointsMaterial({
      size: 30,
      map: new THREE.TextureLoader().load(loadImage("@/assets/rain.png")),
      transparent: true,
      opacity: 0.8,
      // 消除图片的黑色背景
      depthTest: false,
    });
    this.geometry = new THREE.BufferGeometry();

    for (let i = 0; i < this.count; i++) {
      // 这样随机坐标有正负数
      const x = Math.random() * this.range - this.range / 2;
      const y = Math.random() * this.range;
      const z = Math.random() * this.range - this.range / 2;
      const position = new THREE.Vector3(x, y, z);
      // 每个粒子创建一个移动速度
      position.speedY = 10; // 下落速度最低为0.4，这里不考虑其他因素影响向上运动
      this.pointList.push(position);
    }
    this.geometry.setFromPoints(this.pointList);
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }
  animation() {
    this.pointList.forEach((position) => {
      position.y -= position.speedY;

      // 设定阈值，雪花落到地上，就回到原来位置
      if (position.y <= 0) {
        position.y = this.range / 2;
      }

      this.points.geometry.setFromPoints(this.pointList);
    });
  }
  destroy() {
    this.scene.remove(this.points);
  }
}
