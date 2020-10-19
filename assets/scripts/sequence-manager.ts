import { _decorator, Component, AudioSourceComponent, SkeletalAnimationComponent, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SequenceManager')
export class SequenceManager extends Component {

    @property(AudioSourceComponent)
    audioSource = null;

    @property(SkeletalAnimationComponent)
    animationComp = null;

    start () {
        this.audioSource.stop();
        this.animationComp.stop();
        setTimeout(() => {
            this.audioSource.play();
            this.audioSource.volume = 1;
            this.audioSource.clip.on('started', () => {
                this.animationComp.play();
                this.animationComp.node.setPosition(0, 0, 0);
            });
        }, 2000);
        // document.createElement('canvas').getContext('2d').fillText('some string', 0, 0);
    }
}
