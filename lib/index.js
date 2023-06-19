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
