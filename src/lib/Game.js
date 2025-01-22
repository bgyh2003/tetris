import { App, Leafer, Rect } from 'leafer-ui'
import Background from './Background'

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

        this.background = new Background({
            leafer: this.app.ground,
            rows: this.attrs.rows,
            cols: this.attrs.cols,
            squareSize: this.attrs.squareSize,
            squareSpace: this.attrs.squareSpace,
            squareColor: this.attrs.squareColor,
        })


    }


}