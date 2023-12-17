import { loadImage } from "@/utils";
import * as THREE from "three";

export interface IPoints {
  url: string;
  range: number;
  count: number;
  size: number;
  opacity: number;
  setPosition: any;
  setAnimation: any;
}

/**
 * 天气粒子效果
 */
export class Points {
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
  setPosition: any;
  setAnimation: any;
  url: any;
  size: number;
  opacity: number;

  constructor(
    scene: THREE.Scene,
    { url, range, count, setAnimation, setPosition, size, opacity }: IPoints
  ) {
    this.scene = scene;
    // 范围
    this.range = range;
    // 个数
    this.count = count;
    this.pointList = [];
    this.size = size;
    this.opacity = opacity;
    this.setPosition = setPosition;
    this.setAnimation = setAnimation;
    this.url = url;
    this.init();
  }
  init() {
    // 使用粒子和粒子系统实现
    this.material = new THREE.PointsMaterial({
      size: this.size,
      map: new THREE.TextureLoader().load(this.url),
      transparent: true,
      opacity: this.opacity,
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

      this.setPosition(position);
      this.pointList.push(position);
    }
    this.geometry.setFromPoints(this.pointList);
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }
  animation() {
    this.pointList.forEach((position) => {
      this.setAnimation(position);
    });

    this.points?.geometry.setFromPoints(this.pointList);
  }
  destroy() {
    this.scene.remove(this.points);
  }
}
