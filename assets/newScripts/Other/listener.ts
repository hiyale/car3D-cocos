import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

interface IEventData {
    func: Function,
    target: any
}
interface IEvent {
    [eventName: string]: IEventData[]
}
@ccclass("customerListener")



//公共事件监听
export class customerListener extends Component {

    public static handle: IEvent = {}

    public static on(eventName: string, cb: Function, target?: any) {   //监听事件
        if (!this.handle[eventName]) {
            this.handle[eventName] = []
        }
        const data: IEventData = { func: cb, target }
        this.handle[eventName].push(data)
    }
    public static off(eventName: string, cb: Function, target?: any) {
        const list = this.handle[eventName]
        if (!list || list.length == 0) {
            return
        }
        for (let index = 0; index < list.length; index++) {
            const event = list[index];
            if (event.func == cb) {
                list.splice(index, 1)
                break
            }
        }
    }
    public static dispatch(eventName: string, ...args: any) {   //分发事件
        const list = this.handle[eventName]
        if (!list || list.length <= 0) {
            return
        }

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            element.func.apply(element.target, args)
        }
    }
    start() {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
