import { loadImage } from "@/utils";
import * as THREE from "three";

export class Snow {
  scene: THREE.Scene;
  range: number;
  count: number;
  geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes> | undefined;
  material: THREE.PointsMaterial | undefined;
  pointList: any[];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    // 雪花范围
    this.range = 1000;
    // 雪花的个数
    this.count = 600;
    this.pointList = [];
    this.init();
  }
  init() {
    // 使用粒子和粒子系统实现雪花效果
    this.material = new THREE.PointsMaterial({
      size: 30,
      map: new THREE.TextureLoader().load(loadImage("@/assets/snow.png")),
      transparent: true,
      opacity: 0.8,
      // 消除图片的黑色背景
      depthTest: false,
    });
    this.geometry = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i < this.count; i++) {
      // 这样随机坐标有正负数
      const x = Math.random() * this.range - this.range / 2;
      const y = Math.random() * this.range;
      const z = Math.random() * this.range - this.range / 2;
      const position = new THREE.Vector3(x, y, z);
      // 每个粒子创建一个移动速度
      position.speedX = Math.random() - 0.5;
      position.speedY = Math.random() + 0.4; // 下落速度最低为0.4，这里不考虑其他因素影响向上运动
      position.speedZ = Math.random() - 0.5;
      this.pointList.push(position);
    }
    this.geometry.setFromPoints(this.pointList);
    const point = new THREE.Points(this.geometry, this.material);
    this.scene.add(point);
  }
  animation() {
    this.pointList.forEach((position) => {
      position.x -= position.speedX;
      position.y -= position.speedY;
      position.z -= position.speedZ;
      this.geometry.setFromPoints(this.pointList);
      const point = new THREE.Points(this.geometry, this.material);
      this.scene.add(point);
    });
  }
}
