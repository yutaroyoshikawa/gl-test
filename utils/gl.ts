export class GL {
  private ctx: WebGLRenderingContext;
  private GLProgram: WebGLProgram | null = null;

  constructor(ctx: WebGLRenderingContext) {
    this.ctx = ctx;
  }

  private createShader = (sorce: string, type: number) => (
    new Promise<WebGLShader>((resolve, reject) => {
      const shader = this.ctx.createShader(type);
      if (!shader) return reject();
      this.ctx.shaderSource(shader, sorce);
      this.ctx.compileShader(shader);
      if(this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)){
        return resolve(shader);
      }else{
        return reject(this.ctx.getShaderInfoLog(shader));
      }
    })
  );

  private createProgram = (
    vertex: WebGLShader,
    fragment: WebGLSampler
  ) => new Promise((resolve, reject) => {
    const program = this.ctx.createProgram();
    if (!program) return reject();
  
    this.ctx.attachShader(program, vertex);
    this.ctx.attachShader(program, fragment);
  
    this.ctx.linkProgram(program);

    if(this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS)){
      this.ctx.useProgram(program);
      this.GLProgram = program;
      return resolve(program);
    }else{
      return reject(this.ctx.getProgramInfoLog(program));
    }
  });

  public renderGl = () => {
    this.ctx.flush();
  };

  public initGl = async (vert: string, frag: string) => {
    try {
      const VertexShader = await this.createShader(vert, this.ctx.VERTEX_SHADER);
      const FragmentShader = await this.createShader(frag, this.ctx.FRAGMENT_SHADER);
  
      await this.createProgram(VertexShader, FragmentShader);
    } catch (error) {
      console.error(error);
    }
  }

  public createBuffer = (positions: Iterable<number>) => {
    const vbo = this.ctx.createBuffer();
    if (!vbo) return null;
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, vbo);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(positions), this.ctx.STATIC_DRAW);
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);

    return vbo;
  };

  get program () {
    return this.GLProgram;
  }
}
