export class GL {
  private ctx: WebGL2RenderingContext;
  private GLProgram: WebGLProgram | null = null;

  constructor(ctx: WebGL2RenderingContext) {
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
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 3);
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

  public createVertexArray(dataArray: Float32Array[], locations: number[], sizes: number[]){
    // WebGLVertexArrayObjectを生成する
    const vao = this.ctx.createVertexArray()
    // WebGLVertexArrayObjectをバインドする
    this.ctx.bindVertexArray(vao);
    // 配列データからWebGLBufferを作成し、attributeに割り当てる
    for(let i = 0,e = dataArray.length;i < e;++i){
        // WebGLBufferの生成
        let vbo = this.ctx.createBuffer();
        // WebGLBufferのバインド
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, vbo);
        // WebGLBufferにデータを設定する
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, dataArray[i], this.ctx.STATIC_DRAW);
        // locationのattributeを有効にする
        this.ctx.enableVertexAttribArray(locations[i]);
        // locationのattributeにWebGLBufferを割り当てる
        this.ctx.vertexAttribPointer(locations[i], sizes[i], this.ctx.FLOAT, false, 0, 0);
    }
    // WebGLVertexArrayObjectのバインドを解除
    this.ctx.bindVertexArray(null);
    return vao;
}

  get program () {
    return this.GLProgram;
  }
}
