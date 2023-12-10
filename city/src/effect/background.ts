import { loadImage } from "@/utils";
import * as THREE from "three";
import type { Scene } from "three";

export class Background {
  private url: string;
  private scene: Scene;
  constructor(scene: Scene) {
    this.url = loadImage("@/assets/white-bg.png");
    this.scene = scene;
    this.init();
  }
  // 创建天空盒
  init() {
    //  创建一个纹理加载器
    const textureLoader = new THREE.TextureLoader();
    //     创建一个 球体
    const geometry = new THREE.SphereGeometry(5000, 32, 32);
    //     创建基础材质
    const material = new THREE.MeshBasicMaterial({
      map: textureLoader.load(this.url),
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy({
      x: 0,
      y: 0,
      z: 0,
    });

    this.scene.add(sphere);
  }
}
