import * as THREE from "three";
import { color } from "../config";

/**
 * 旋转四棱锥
 */
export class Cone {
  time: any;
  top: any;
  scene: any;
  height: any;
  constructor(
    scene: THREE.Scene,
    time: { value: number },
    top: { value: number },
    height: { value: number }
  ) {
    this.scene = scene;
    this.time = time;
    this.top = top;
    this.height = height;
    this.createCone({
      color: color.cone,
      height: 60,
      opacity: 0.6,
      speed: 4.0,
      position: {
        x: 0,
        y: 50,
        z: 0,
      },
    });
  }

  createCone(options: {
    color: any;
    height: any;
    opacity?: number;
    speed?: number;
    position: any;
  }) {
    const geometry = new THREE.ConeGeometry(15, 30, 4);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color),
        },
        u_height: this.height,
        u_top: this.top,
      },
      vertexShader: `
        uniform float u_time;
        uniform float u_height;
        uniform float u_speed;
        uniform float u_top;
        
        void main() {
          // 旋转
          float f_angle = u_height / 10.0;
          float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
          float new_y = position.y;
          float new_z = position.z * cos(f_angle) + position.x * sin(f_angle);
          
          vec4 v_position = vec4(new_x, new_y + u_top, new_z, 1.0);
        
          gl_Position = projectionMatrix * modelViewMatrix * v_position;
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        void main() {
          gl_FragColor = vec4(u_color, 0.6);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide, // 解决只显示一半的问题
      depthTest: false, // 被建筑物遮挡的问题
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(options.position);
    mesh.rotateZ(Math.PI);
    this.scene.add(mesh);
  }
}
