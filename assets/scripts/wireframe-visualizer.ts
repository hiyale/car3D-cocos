import { _decorator, Component, ModelComponent, GFXPrimitiveMode, Material, GFXAttributeName, utils, Color, Vec3 } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

const v3_1 = new Vec3();
const v3_2 = new Vec3();

@ccclass('WireframeVisualizer')
@requireComponent(ModelComponent)
@executeInEditMode
export class WireframeVisualizer extends Component {

    @property(ModelComponent)
    target = null;

    @property
    extrude = 0.001;

    @property
    primitiveIndex = 0;

    @property
    color = Color.WHITE.clone();

    _material = new Material();

    @property
    set apply (val) {
        this.refresh();
    }
    get apply () {
        return false;
    }

    start () {
        this._material.initialize({
            effectName: 'builtin-unlit',
            defines: { USE_COLOR: true },
            states: { primitive: GFXPrimitiveMode.LINE_LIST }
        });
        this.refresh();
    }

    refresh () {
        const comp = this.node.getComponent(ModelComponent);
        if (!this.target || !comp) { return; }
        const positions = this.target.mesh.readAttribute(this.primitiveIndex, GFXAttributeName.ATTR_POSITION);
        const normals = this.target.mesh.readAttribute(this.primitiveIndex, GFXAttributeName.ATTR_NORMAL);
        const indices = this.target.mesh.readIndices(this.primitiveIndex);
        comp.material = this._material;
        comp.material.setProperty('color', this.color);
        comp.mesh = utils.createMesh({
            positions: this._generateWireframeVB(positions, normals),
            indices: this._generateWireframeIB(indices),
            primitiveMode: cc.GFXPrimitiveMode.LINE_LIST,
            minPos: this.target.mesh.minPosition,
            maxPos: this.target.mesh.maxPosition,
        });
    }

    _generateWireframeVB (positions: Float32Array, normals: Float32Array) {
        const len = positions.length / 3;
        const res: number[] = [];
        for (let i = 0; i < len; i++) {
            Vec3.fromArray(v3_1, positions, i * 3);
            Vec3.fromArray(v3_2, normals, i * 3);
            Vec3.scaleAndAdd(v3_1, v3_1, Vec3.normalize(v3_2, v3_2), this.extrude);
            Vec3.toArray(res, v3_1, i * 3);
        }
        return res;
    }

    _generateWireframeIB (src: number[]) {
        const res: number[] = [];
        const len = src.length / 3;
        for (let i = 0; i < len; i++) {
            const a = src[i * 3 + 0];
            const b = src[i * 3 + 1];
            const c = src[i * 3 + 2];
            res.push(a, b, b, c, c, a);
        }
        return res;
    }
}
