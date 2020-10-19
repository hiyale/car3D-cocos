import { _decorator, Component, Node, AudioClip, AudioSourceComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    @property({
        type: AudioClip
    })
    coinSound:AudioClip = null;

    @property
    totalTime:number = 0;

    public playCoinSound(){
        const audioSource = this.node.getComponent(AudioSourceComponent);
        audioSource.playOneShot(this.coinSound);
    }
}
