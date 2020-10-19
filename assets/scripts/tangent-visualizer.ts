import { _decorator, Component, ModelComponent, Material, utils, Color, Vec3, GFXPrimitiveMode, GFXAttributeName } from 'cc';
const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

const v3_1 = new Vec3();
const v3_2 = new Vec3();

@ccclass('TangentVisualizer')
@requireComponent(ModelComponent)
@executeInEditMode
export class TangentVisualizer extends Component {

    @property(ModelComponent)
    target = null;

    @property
    scale = 0.1;

    @property
    primitiveIndex = 0;

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
            defines: { USE_VERTEX_COLOR: true },
            states: { primitive: GFXPrimitiveMode.LINE_LIST }
        });
        this.refresh();
    }

    refresh () {
        if (!this.target) { return; }
        const comps = this.node.getComponents(ModelComponent);
        if (comps.length < 3) { console.warn('three model component on this node is needed'); return; }
        const position = this.target.mesh.readAttribute(this.primitiveIndex, GFXAttributeName.ATTR_POSITION);
        const normal = this.target.mesh.readAttribute(this.primitiveIndex, GFXAttributeName.ATTR_NORMAL);
        const tangent = this.target.mesh.readAttribute(this.primitiveIndex, GFXAttributeName.ATTR_TANGENT);
        const bitangent = this._generateBitangent(normal, tangent);
        this._updateModel(comps[0], position, normal, Color.MAGENTA);
        this._updateModel(comps[1], position, tangent, Color.CYAN, 4);
        this._updateModel(comps[2], position, bitangent, Color.YELLOW);
    }

    _updateModel (comp: ModelComponent, pos: Float32Array, data: Float32Array, color: Color, stride = 3) {
        comp.material = this._material;
        comp.mesh = utils.createMesh({
            positions: Array(pos.length / 3 * 2).fill(0).map((_, i) => {
                const ofs = Math.floor(i / 2);
                Vec3.fromArray(v3_1, pos, ofs * 3);
                if (i % 2) Vec3.scaleAndAdd(v3_1, v3_1, Vec3.fromArray(v3_2, data, ofs * stride), this.scale);
                return Vec3.toArray([], v3_1) as number[];
            }).reduce((acc, cur) => (cur.forEach((c) => acc.push(c)), acc), []),
            colors: Array(pos.length / 3 * 2).fill(0).map((_, i) => {
                return Color.toArray([], i % 2 ? color : Color.WHITE) as number[];
            }).reduce((acc, cur) => (cur.forEach((c) => acc.push(c)), acc), []),
            primitiveMode: GFXPrimitiveMode.LINE_LIST,
            minPos: this.target.mesh.minPosition,
            maxPos: this.target.mesh.maxPosition,
        });
    }

    _generateBitangent (normal: Float32Array, tangent: Float32Array) {
        const bitangent = normal.slice();
        const vCount = normal.length / 3;
        for (let i = 0; i < vCount; i++) {
            Vec3.fromArray(v3_1, normal, i * 3);
            Vec3.fromArray(v3_2, tangent, i * 4);
            Vec3.multiplyScalar(v3_1, Vec3.cross(v3_1, v3_1, v3_2), tangent[i * 4 + 3]);
            Vec3.toArray(bitangent, v3_1, i * 3);
        }
        return bitangent;
    }
}
