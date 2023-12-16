import * as THREE from "three";
import { color } from "@/config";

export interface IOptions {
  /* 半径 */
  radius: number;
  /* 高度 */
  height: number;
  /* 是否打开顶部和底部 */
  open: boolean;
  /* 颜色 */
  color: string;
  /* 透明度 */
  opacity: number;
  /* 世界坐标 */
  position: { x: number; y: number; z: number };
  /* 扩散速度 */
  speed: number;
}

/**
 * 圆柱体扩散效果
 */
export class Cylinder {
  scene: any;
  time: any;
  options: IOptions;
  constructor(scene: any, time: any) {
    this.scene = scene;
    this.time = time;

    this.options = {
      radius: 50,
      height: 50,
      open: true, // 是否打开顶部和底部
      color: color.wall,
      opacity: 0.6,
      position: { x: 0, y: 0, z: 0 },
      speed: 1.0,
    };
  }

  // 创建
  createCylinder(options: IOptions = this.options) {
    // 圆柱体
    const geometry = new THREE.CylinderGeometry(
      options.radius,
      options.radius,
      options.height,
      32,
      1,
      options.open
    );
    // 让圆柱体向上移动高度的一半，解决圆柱体有一半在地面以下的问题
    geometry.translate(0, options.height / 2, 0);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color),
        },
        u_time: this.time,
        u_height: {
          value: options.height,
        },
        u_opacity: {
          value: options.opacity,
        },
        u_speed: {
          value: options.speed,
        },
      },

      vertexShader: `
        uniform float u_time;
        uniform float u_height;
        uniform float u_speed;

        varying float v_opacity;
        void main() {
          vec3 v_position =  position * mod(u_time / u_speed,1.0);
          // 根据高度变化透明度,从底部向顶部渐变
          v_opacity = mix(1.0,0.0,position.y / u_height);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        uniform float u_opacity;
        varying float v_opacity;
        void main() {
          gl_FragColor = vec4(u_color, u_opacity * v_opacity);
        }
      `,
      transparent: true,
      // 解决圆柱体显示一半的问题
      side: THREE.DoubleSide,
      // 解决被建筑物遮挡问题
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(options.position as THREE.Vector3);

    this.scene.add(mesh);
  }
}
