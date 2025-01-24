import { App, Leafer, Rect, Group, Box } from 'leafer-ui'
import Background from './Background'
import ElementT from './ElementT'
export default class Game {

    constructor(options) {

        // 默认属性
        this.attrs = {
            view: null, // 画布容器
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

        // 创建画布app
        this.app = new App({
            view: this.attrs.view,
            fill: this.attrs.groundFillColor,
            width: this.width,
            height: this.height
        })

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

        // 创建背景
        this.createBackground()

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
    createBackground() {
        this.background = new Background(this.attrs)
        this.app.ground.add(this.background.group)
        this.createInterferenceRow(2)
    }

    // 创建干扰行
    createInterferenceRow(num) {

        const points = []

        // 创建干扰行
        let i = 0
        // for (let r = this.attrs.rows - num; r < this.attrs.rows; r++) {
        //     for (let c = i % 2; c < this.attrs.cols; c += 2)points.push([c, r])
        //     i++
        // }

        for (let r = this.attrs.rows - num; r < this.attrs.rows; r++) {
            for (let c = 0; c < this.attrs.cols-1; c++)points.push([c, r])
            i++
        }

        // 添加干扰行
        this.background.addPoints(points)
    }

    // 创建元素
    createElement(type) {

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
            case 'Z':
                this.element = new ElementZ(this.attrs)
                break
        }

        // 设置位置
        this.element.moveTo(Math.floor(this.attrs.cols / 2), 0)

        // 添加到主画布中
        this.app.tree.add(this.element.group)

    }

    moveDown() {
        // 检测是否到边缘
        if (this.element.distance(this.background, "down") === 0) return
        if (this.element.distanceEdge("down") === 0) return
        // 移动
        this.element.moveDown()
    }

    moveLeft() {
        // 检测是否到边缘
        if (this.element.distance(this.background, "left") === 0) return
        if (this.element.distanceEdge("left") === 0) return
        // 移动
        this.element.moveLeft()
    }

    moveRight() {
        // 检测是否到边缘
        if (this.element.distance(this.background, "right") === 0) return
        if (this.element.distanceEdge("right") === 0) return
        // 移动
        this.element.moveRight()
    }

    moveToBottom() {
        // 计算到底部距离
        let d = this.element.distance(this.background, "down")
        if (d === null) d = this.element.distanceEdge("down")
        // 移动
        this.element.moveDown(d)
    }

    rotate() {

        // 切换图片
        this.element.nextBox()


        // 如果触碰到边缘，恢复上一个图片
        if (
            this.element.collisionDetection(this.background) ||
            this.element.collisionDetectionEdge()
        ) {
            this.element.lastBox()
        }
    }

    merge() {
        this.background.merge(this.element)
        this.element.destroy()
    }

    clearRow() {
        this.background.clearRow()
    }

}