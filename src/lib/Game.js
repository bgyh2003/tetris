import { App, Leafer, Rect, } from 'leafer-ui'
import HotKey from './HotKey'
import Background from './Background'
import ElementT from './ElementT'
import ElementZ from './ElementZ'
import ElementZ2 from './ElementZ2'
import ElementO from './ElementO'
import ElementL from './ElementL'
import ElementL2 from './ElementL2'
import ElementI from './ElementI'

export default class Game {

    constructor(options) {

        // 默认属性
        this.attrs = {
            viewWidth: null,  // 画布显示宽度(留空自动计算)
            viewHeight: null, // 画布显示高度(留空自动计算)
            rows: 20, // 行数
            cols: 13, // 列数
            squareSize: 20, // 方块大小
            squareSpace: 1, // 方块间隔
            groundFillColor: "#d1d5db",// 背景颜色
            lineColor: "#e5e7eb",// 线条颜色
            squareColor: "#555",// 方块亮色
            ...options
        }


        // 计算画布实际宽高
        this.realWidth = this.attrs.cols * (this.attrs.squareSize + this.attrs.squareSpace) + this.attrs.squareSpace
        this.realHeight = this.attrs.rows * (this.attrs.squareSize + this.attrs.squareSpace) + this.attrs.squareSpace

        // 画布显示宽高
        this.width = this.attrs.viewWidth === null ? this.realWidth : this.attrs.viewWidth
        this.height = this.attrs.viewHeight === null ? this.realHeight : this.attrs.viewHeight

        // 画布缩放
        this.scaleX = this.attrs.viewWidth === null ? 1 : this.attrs.viewWidth / this.realWidth
        this.scaleY = this.attrs.viewHeight === null ? 1 : this.attrs.viewHeight / this.realHeight

        this.view = document.createElement("div")
        this.view.style.width = this.width + "px"
        this.view.style.height = this.height + "px"

        this.container = options.container


        // 创建画布app
        this.app = new App({
            view: this.view,
            fill: this.attrs.groundFillColor,
            width: this.width,
            height: this.height
        })

        this.container.appendChild(this.view)

        // 创建ground
        this.app.ground = new Leafer()
        this.app.ground.scale = { x: this.scaleX, y: this.scaleY }
        this.app.add(this.app.ground)

        // 创建tree
        this.app.tree = new Leafer()
        this.app.tree.scale = { x: this.scaleX, y: this.scaleY }
        this.app.add(this.app.tree)

        // 创建背景网格
        this.createGrid()

        // 背景对象
        this.background = null

        // 元素对象
        this.element = null

        // 循环对象
        this.loop = null

        // 速度
        this.speed = 1000

        // 状态 0:停止 1:运行 2:暂停 3:游戏结束
        this.status = 0

        // 下一个元素类型
        this.nextType = this.getRandomType()

        // 总共消除的行数
        this.clearNum = 0

        // 行消除回调
        this.onClearRow = options.onClearRow ?? function () { }

        // 游戏结束回调
        this.onGameOver = options.onGameOver ?? function () { }

        // 键盘事件
        this.hotkey = new HotKey()
        this.hotkey.add(["arrowup"], () => this.rotate())
        this.hotkey.add(["arrowdown"], () => this.moveDown())
        this.hotkey.add(["arrowleft"], () => this.moveLeft())
        this.hotkey.add(["arrowright"], () => this.moveRight())
        this.hotkey.add([" "], () => this.moveToBottom())
        this.hotkey.start()

    }

    // 创建背景网格线条
    createGrid() {

        // 横线
        for (let i = 0; i <= this.attrs.rows; i++) {
            const y = i * (this.attrs.squareSize + this.attrs.squareSpace)
            const line = new Rect({
                x: 0,
                y: y,
                width: this.realWidth,
                height: this.attrs.squareSpace,
                fill: this.attrs.lineColor
            })
            this.app.ground.add(line)
        }

        // 竖线
        for (let i = 0; i <= this.attrs.cols; i++) {
            const x = i * (this.attrs.squareSize + this.attrs.squareSpace)
            const line = new Rect({
                x: x,
                y: 0,
                width: this.attrs.squareSpace,
                height: this.realHeight,
                fill: this.attrs.lineColor
            })
            this.app.ground.add(line)
        }

    }

    // 创建背景元素
    createBackground(n = 0) {
        this.background = new Background(this.attrs)
        this.app.ground.add(this.background.group)
        this.createInterferenceRow(n)
    }

    // 创建干扰行
    createInterferenceRow(num) {

        const points = []

        // 创建干扰行
        let i = 0
        for (let r = this.attrs.rows - num; r < this.attrs.rows; r++) {
            for (let c = i % 2; c < this.attrs.cols; c += 2)points.push([c, r])
            i++
        }

        // 添加干扰行
        this.background.addPoints(points)
    }

    // 创建元素
    createElement() {

        const type = this.nextType

        switch (type) {
            case 'T':
                this.element = new ElementT(this.attrs)
                break
            case 'I':
                this.element = new ElementI(this.attrs)
                break
            case 'O':
                this.element = new ElementO(this.attrs)
                break
            case 'L':
                this.element = new ElementL(this.attrs)
                break
            case 'L2':
                this.element = new ElementL2(this.attrs)
                break
            case 'Z':
                this.element = new ElementZ(this.attrs)
                break
            case 'Z2':
                this.element = new ElementZ2(this.attrs)
                break
        }

        // 设置位置
        this.element.moveTo(Math.floor(this.attrs.cols / 2), 0)

        // 添加到主画布中
        this.app.tree.add(this.element.group)

        // 下一个元素
        this.nextType = this.getRandomType()

        // 检测是否与背景元素重叠
        if (this.element.collisionDetection(this.background)) this.gameOver()

    }

    // 向下移动
    moveDown() {

        if (this.status !== 1) return

        // 检测是否到边缘
        if (this.element.distance(this.background, "down") === 0) return
        if (this.element.distanceEdge("down") === 0) return
        // 移动
        this.element.moveDown()
    }

    // 向左移动
    moveLeft() {

        if (this.status !== 1) return

        // 检测是否到边缘
        if (this.element.distance(this.background, "left") === 0) return
        if (this.element.distanceEdge("left") === 0) return
        // 移动
        this.element.moveLeft()
    }

    // 向右移动
    moveRight() {

        if (this.status !== 1) return

        // 检测是否到边缘
        if (this.element.distance(this.background, "right") === 0) return
        if (this.element.distanceEdge("right") === 0) return
        // 移动
        this.element.moveRight()
    }

    // 向下移动到底部
    moveToBottom() {

        if (this.status !== 1) return

        // 计算到底部距离
        let d = this.element.distance(this.background, "down")
        if (d === null) d = this.element.distanceEdge("down")

        // 移动
        this.element.moveDown(d)

        // 合并
        this.merge()

        // 创建新的元素
        this.createElement(this.getRandomType())

        // 清除行 
        this.clearRow()

    }

    // 旋转
    rotate() {

        if (this.status !== 1) return

        // 切换图片
        this.element.nextBox()

        // 如果触碰到边缘，恢复上一个图片
        if (
            this.element.collisionDetection(this.background) ||
            this.element.collisionDetectionEdge(["right", "left", "down"])
        ) {
            this.element.lastBox()
        }
    }

    // 合并
    merge() {
        this.background.merge(this.element)
        this.element.destroy()
    }

    // 清除行
    clearRow() {
        const { num } = this.background.clearRow()
        this.clearNum += num
        num > 0 && this.onClearRow(num, this.clearNum)
    }

    // 随机选择一个type
    getRandomType() {
        const types = ['T', 'I', 'O', 'L', 'L2', 'Z', 'Z2']
        return types[Math.floor(Math.random() * types.length)]
    }

    loopFunction() {
        // 如果当前是停止状态，退出循环
        if (this.status === 0) return

        if (
            this.element.distance(this.background, "down") === 0 ||
            this.element.distanceEdge("down") === 0
        ) {
            this.merge()
            this.createElement()
            this.clearRow()
        } else {
            this.moveDown()
        }

    }

    // 开始
    start() {

        // 当前为运行状态 直接退出
        if (this.status === 1) return

        // 设置状态
        this.status = 1

        // 创建背景和元素
        this.createBackground()
        this.createElement()

        // 进入循环
        this.loop = setInterval(() => {
            this.loopFunction()
        }, this.speed)

    }

    // 停止
    stop() {

        if (this.status === 0) return

        clearInterval(this.loop)
        this.status = 0
        this.background.destroy()
        this.background = null
        this.element.destroy()
        this.element = null
        this.clearNum = 0
    }

    // 暂停
    pause() {
        if (this.status === 1) {
            this.status = 2
            clearInterval(this.loop)
        }
        else if (this.status === 2) {
            this.status = 1
            this.loop = setInterval(() => {
                this.loopFunction()
            }, this.speed)
        }
    }

    // 游戏结束
    gameOver() {
        this.status = 3
        clearInterval(this.loop)
        this.onGameOver()
    }

    destroy() {
        this.stop()
        this.app.destroy()
        this.hotkey.destroy()
    }

}