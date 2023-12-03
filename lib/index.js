// 导出模块
export function myFunction() {
  // 模块功能实现
  console.log("111");
}

/**
 * @param {WebGLRenderingContextBase} gl
 * @param {string} VERTEX_SHADER_SOURCE
 * @param {string} FRAGMENT_SHADER_SOURCE
 */
export function initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE) {
  // 创建着色器
  const vertexShader = gl.createShader(gl.VERTEX_SHADER); // 顶点着色器
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // 片元着色器

  gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE); // 指定顶点着色器的源码
  gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE); // 指定片元着色器的源码

  // 编译着色器
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  // 创建一个程序对象
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 将JavaScript和webGL进行关联
  gl.linkProgram(program);
  // 使用程序对象
  gl.useProgram(program);
  return program;
}


// 平移矩阵
export function getTranslateMatrix(x = 0,y = 0,z = 0) {
  return new Float32Array([
    1.0,0.0,0.0,0.0,
    0.0,1.0,0.0,0.0,
    0.0,0.0,1.0,0.0,
    x  ,y  ,z  , 1,
  ])
}
// 缩放矩阵
export function getScaleMatrix(x = 1,y = 1,z = 1) {
  return new Float32Array([
    x  ,0.0,0.0,0.0,
    0.0,y  ,0.0,0.0,
    0.0,0.0,z  ,0.0,
    0.0,0.0,0.0, 1,
  ])
}

// 绕x轴旋转的旋转矩阵
export function getRotateXMatrix(deg) {
  return new Float32Array([
    1.0,0.0,0.0,0.0,
    0.0,Math.cos(deg),-Math.sin(deg),0.0,
    0.0,Math.sin(deg),Math.cos(deg),0.0,
    0.0,0.0,0.0, 1,
  ])
}

// 绕y轴旋转的旋转矩阵
export function getRotateYMatrix(deg) {
  return new Float32Array([
    Math.cos(deg) ,0.0,Math.sin(deg),0.0,
    0.0,            1.0,0.0,0.0,
    -Math.sin(deg) ,0.0,Math.cos(deg),0.0,
    0.0,            0.0,            0.0, 1
  ])
}

// 绕z轴旋转的旋转矩阵
export function getRotateZMatrix(deg) {
  return new Float32Array([
    Math.cos(deg)  ,Math.sin(deg) ,0.0,0.0,
    -Math.sin(deg)  ,Math.cos(deg) ,0.0,0.0,
    0.0,            0.0,            1.0,0.0,
    0.0,            0.0,            0.0, 1,
  ])
}

// 矩阵复合函数
export function mixMatrix(A, B) {
  const result = new Float32Array(16);

  for (let i = 0; i < 4; i++) {
    result[i] = A[i] * B[0] + A[i + 4] * B[1] + A[i + 8] * B[2] + A[i + 12] * B[3]
    result[i + 4] = A[i] * B[4] + A[i + 4] * B[5] + A[i + 8] * B[6] + A[i + 12] * B[7]
    result[i + 8] = A[i] * B[8] + A[i + 4] * B[9] + A[i + 8] * B[10] + A[i + 12] * B[11]
    result[i + 12] = A[i] * B[12] + A[i + 4] * B[13] + A[i + 8] * B[14] + A[i + 12] * B[15]
  }

  return result;
}


// 归一化函数
export function normalized(arr) {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i] * arr[i]
  }

  const middle = Math.sqrt(sum);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] / middle;
  }
}

// 叉积函数 获取法向量
export function cross(a,b) {
  return new Float32Array([
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ])
}

// 点积函数 获取投影长度
export function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

// 向量差
export function minus(a, b) {
  return new Float32Array([
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ])
}


// 视图矩阵获取
export function getViewMatrix(eyex, eyey, eyez, lookAtx, lookAty, lookAtz, upx, upy, upz) {

  // 视点
  const eye = new Float32Array([eyex, eyey, eyez])
  // 目标点
  const lookAt = new Float32Array([lookAtx, lookAty, lookAtz])
  // 上方向
  const up = new Float32Array([upx, upy, upz])

  // 确定z轴 视点和目标点的向量差
  const z = minus(eye, lookAt);

  normalized(z);
  normalized(up);

  // 确定x轴
  const x = cross(z, up);

  normalized(x);
  // 确定y轴
  const y = cross(x, z);

  return new Float32Array([
    x[0],       y[0],       z[0],       0,
    x[1],       y[1],       z[1],       0,
    x[2],       y[2],       z[2],       0,
    -dot(x,eye),-dot(y,eye),-dot(z,eye),1
  ])
}
