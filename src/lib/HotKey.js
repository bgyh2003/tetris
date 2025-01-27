
export default class HotKey {

    // 构造器
    constructor(element = document) {

        // 监听的元素
        this.element = element

        // 当前按下的键集合
        this.currentKeys = {}

        // 事件集合
        this.eventList = new Map()

        // 键盘按下回调函数，返回当前按下的组合
        this.onKeydownFunction = null

        // 按键不抬起，连续执行次数
        this.loopTimes = 0

        // 监听事件对象
        this.eventObject = {
            handleEvent: (event) => {

                // 记录键按下
                if (event.type === "keydown") {

                    // 记录到键集合
                    this.currentKeys[event.key.toLowerCase()] = new Date().getTime()

                    // 键盘按下回调
                    if (typeof (this.onKeydownFunction) === "function") {
                        const res = this.onKeydownFunction(Object.keys(this.currentKeys))
                        if (res === false) return
                    }

                    // 触发事件
                    this.doEvent(event)
                }

                // 记录键抬起
                if (event.type === "keyup") {
                    // 从键集合中删除
                    if (event.key.toLowerCase() in this.currentKeys) {
                        delete this.currentKeys[event.key.toLowerCase()]
                        this.loopTimes = 0
                    }
                }

                // 窗口失去焦点 ，清空键集合
                if (event.type === "blur") {
                    this.currentKeys = {}
                    this.loopTimes = 0
                }


            }
        }
    }

    // 键盘按下回调
    onKeydown(fn) {
        this.onKeydownFunction = fn
    }

    // 开始监听
    start() {
        this.element.addEventListener("keydown", this.eventObject)
        this.element.addEventListener("keyup", this.eventObject)
        window.addEventListener("blur", this.eventObject)

    }

    // 停止监听
    stop() {
        this.element.removeEventListener("keydown", this.eventObject)
        this.element.removeEventListener("keyup", this.eventObject)
        window.removeEventListener("blur", this.eventObject)
    }

    // 添加事件
    add(keyGroup, fn, loop = true) {
        this.eventList.set(keyGroup, { fn, loop })
    }

    // 移除单个事件
    remove(keyGroup) {

        for (const keys of this.eventList.keys()) {

            // 数量不同 存在差集，返回
            if (keyGroup.length !== keys.length) return

            // 计算差集
            if (keyGroup.every(v => keys.includes(v))) this.eventList.delete(keys)
            else return

        }
    }

    // 移除全部事件
    clear() {
        this.eventList.clear()
    }

    destroy() {
        this.stop()
        this.clear()

        this.element = null
        this.currentKeys = null
        this.eventList = null
        this.onKeydownFunction = null
        this.eventObject = null
        this.loopTimes = null

    }

    // 判断 并 执行事件
    doEvent(event) {

        // 遍历事件列表
        for (const [keyGroup, { fn, loop }] of this.eventList) {

            // 获取当前按下的键数组
            const keys = Object.keys(this.currentKeys)

            // 数量不同 存在差集，返回
            if (keyGroup.length !== keys.length) continue

            // 计算差集
            if (keyGroup.every(v => keys.includes(v))) {

                if (loop || this.loopTimes === 0) {
                    fn(event, keys, this.element)
                    this.loopTimes++
                }

                break
            } else {
                continue
            }
        }

    }

}
