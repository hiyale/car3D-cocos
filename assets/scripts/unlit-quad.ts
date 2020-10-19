import { _decorator, ModelComponent, Texture2D, SpriteFrame, Material, utils, builtinResMgr, Vec3, renderer } from 'cc';
const { ccclass, property } = _decorator;

let material: Material | null = null;
const enableBlend = {
    blendState: { targets: [ {
        blend: true,
        blendSrc: cc.GFXBlendFactor.SRC_ALPHA,
        blendDst: cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
        blendDstAlpha: cc.GFXBlendFactor.ONE_MINUS_SRC_ALPHA
    } ] }
};

const default_uvs = [
    0, 1,
    1, 1,
    0, 0,
    1, 0,
];
const mesh = utils.createMesh({
    positions: [
        -0.5, -0.5, 0, // bottom-left
         0.5, -0.5, 0, // bottom-right
        -0.5,  0.5, 0, // top-left
         0.5,  0.5, 0, // top-right
    ],
    uvs: default_uvs,
    indices: [ 0, 1, 2, 2, 1, 3 ],
    minPos: new Vec3(-0.5, -0.5, 0),
    maxPos: new Vec3( 0.5,  0.5, 0),
});
const vbInfo = mesh.struct.vertexBundles[0].view;
const vbuffer = mesh.data.buffer.slice(vbInfo.offset, vbInfo.offset + vbInfo.length);

@ccclass('UnlitQuadComponent')
export class UnlitQuadComponent extends ModelComponent {

    @property(SpriteFrame)
    _sprite: SpriteFrame | null = null;

    @property(Texture2D)
    _texture: Texture2D | null = null;

    @property({ override: true, visible: false })
    set sharedMaterials (val) {
        super.sharedMaterials = val;
    }
    get sharedMaterials () {
        return super.sharedMaterials;
    }

    @property({ override: true, visible: false })
    set mesh (val) {
        super.mesh = val;
    }
    get mesh () {
        return super.mesh;
    }

    @property({ type: Texture2D })
    set texture (val) {
        this._texture = val;
        this.updateTexture();
    }
    get texture () {
        return this._texture;
    }

    @property({ type: SpriteFrame })
    set spriteFrame (val) {
        this._sprite = val;
        this.updateTexture();
    }
    get spriteFrame () {
        return this._sprite;
    }

    @property
    _transparent = false;

    @property
    set transparent (val: boolean) {
        this._transparent = val;
        this.material.overridePipelineStates(val ? enableBlend : {});
    }
    get transparent () {
        return this._transparent;
    }

    onLoad () {
        if (!material) {
            material = new Material();
            material.initialize({
                effectName: 'builtin-unlit',
                technique: 0,
                defines: { USE_TEXTURE: true },
                states: { rasterizerState: { cullMode: cc.GFXCullMode.NONE } }
            });
        }
        this.material = material;
        this._mesh = mesh;
        super.onLoad();
        this.updateTexture();
        this.transparent = this._transparent;
    }

    updateTexture () {
        // update pass
        const pass = this.material && this.material.passes[0];
        const binding = pass && pass.getBinding('mainTexture');
        if (typeof binding !== 'number') { return; }
        const target = this._sprite ? this._sprite : this._texture ? this._texture : builtinResMgr.get<Texture2D>('grey-texture');
        pass.bindTextureView(binding, target.getGFXTextureView());
        // update UV (handle atlas)
        const model = this.model && this.model.getSubModel(0);
        const ia = model && model.inputAssembler;
        if (!ia) { return; }
        let uv = default_uvs;
        if (this._sprite) { this._sprite._calculateUV(); uv = this._sprite.uv; }
        ia.updateVertexAttr(vbuffer, cc.GFXAttributeName.ATTR_TEX_COORD, uv);
    }
}
