import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export class Font {
  scene: THREE.Scene;
  font: any;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.font = null;
    this.init();
  }
  async init() {
    await this.loadFont();
    // 创建字体几何体
    this.createTextQueue();
  }
  loadFont() {
    return new Promise((resolve, reject) => {
      const loader = new FontLoader();
      loader.load("/font.json", (font) => {
        this.font = font;
        resolve(font);
      });
    });
  }
  createTextQueue() {
    [
      {
        text: "最高的楼",
        size: 20,
        position: {
          x: -10,
          y: 130,
          z: 410,
        },
        rotate: Math.PI / 1.3,
        color: "#ffffff",
      },
      {
        text: "第二高",
        size: 20,
        position: {
          x: 180,
          y: 110,
          z: -70,
        },
        rotate: Math.PI / 2,
        color: "#ffffff",
      },
    ].forEach((item) => {
      this.createText(item);
    });
  }
  createText(data) {
    const geometry = new TextGeometry(data.text, {
      font: this.font,
      size: 20,
      height: 2,
    });
    const material = new THREE.ShaderMaterial({
      vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragmentShader: `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
      `,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(data.position);
    mesh.rotateY(data.rotate);
    this.scene.add(mesh);
  }
}
