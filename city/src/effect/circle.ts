import { color } from "@/config";
import { Cylinder, type IOptions } from "./cylinder";

/**
 * 圆柱体扩散效果
 */
export class Circle {
  scene: any;
  time: any;
  config: IOptions;
  constructor(scene: any, time: any) {
    this.scene = scene;
    this.time = time;
    this.config = {
      radius: 50,
      height: 1,
      open: false,
      color: color.circle,
      opacity: 0.6,
      position: {
        x: 300,
        y: 0,
        z: 300,
      },
      speed: 1.0,
    };
    new Cylinder(scene, time).createCylinder(this.config);
  }
}
