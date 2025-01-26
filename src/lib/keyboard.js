
export default class Keyboard {

    // 构造器
    constructor(element = document) {

        // 监听的元素
        this.element = element

        // 是否禁用
        this.disabled = false

        // 当前按下的键集合
        this.currentKey = {}

        // 事件集合
        this.eventList = new Map()

        // 键盘按下回调函数，返回当前按下的组合
        this.onKeydownFunction = null

        // 按键不抬起，连续执行次数
        this.continuouslyTimes = 0

        // 监听事件对象
        this.eventObject = {
            that: this,
            handleEvent(event) {

                const that = this.that

                // 记录键按下
                if (event.type === "keydown") {

                    // 记录到键集合
                    that.currentKey[event.key.toLowerCase()] = new Date().getTime()

                    // 键盘按下回调
                    if (typeof (that.onKeydownFunction) === "function") {
                        const res = that.onKeydownFunction(Object.keys(that.currentKey))
                        if (res === false) return
                    }

                    // 触发事件
                    that.doEvent(event)
                }

                // 记录键抬起
                if (event.type === "keyup") {
                    // 从键集合中删除
                    if (event.key.toLowerCase() in that.currentKey) {
                        delete that.currentKey[event.key.toLowerCase()]
                        that.continuouslyTimes = 0
                    }
                }
            }
        }

        // 主窗口失去焦点 ，清空键集合
        window.addEventListener("blur", () => this.currentKey = {})

    }

    // 键盘按下回调
    onKeydown(fn) {
        this.onKeydownFunction = fn
    }

    // 开始监听
    start() {
        this.element.addEventListener("keydown", this.eventObject)
        this.element.addEventListener("keyup", this.eventObject)
    }

    // 停止监听
    stop() {
        this.element.removeEventListener("keydown", this.eventObject)
        this.element.removeEventListener("keyup", this.eventObject)
    }

    // 添加事件
    add(key_group, fn, continuously = true) {
        this.eventList.set(key_group, { fn, continuously })
    }

    // 移除单个事件
    remove(key_group) {

        for (const keys of this.eventList.keys()) {

            // 数量不同 存在差集，返回
            if (key_group.length !== keys.length) return

            // 计算差集
            if (key_group.every(v => keys.includes(v))) this.eventList.delete(keys)
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
    }

    // 判断 并 执行事件
    doEvent(event) {

        // 遍历事件列表
        for (const [key_group, { fn, continuously }] of this.eventList) {

            // 获取当前按下的键数组
            const keys = Object.keys(this.currentKey)

            // 数量不同 存在差集，返回
            if (key_group.length !== keys.length) continue

            // 计算差集
            if (key_group.every(v => keys.includes(v))) {
                const sort_keys = keys.sort((a, b) => this.currentKey[a] - this.currentKey[b])

                // 判断禁用
                if (this.disabled === false) {

                    if (continuously || this.continuouslyTimes === 0) {
                        fn(event, sort_keys.join("_"), this.ele)
                        this.continuouslyTimes++
                    }
                }

                break
            } else {
                continue
            }
        }

    }

}
