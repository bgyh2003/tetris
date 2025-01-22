import { App, Leafer, Box, Rect } from 'leafer-ui'

class Tetris {

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
            groundFillColor: "#ccc",// 背景颜色
            lineColor: "#f0f0f0",// 线条颜色
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

        // 主画布box
        this.stageBox = new SquareBox({
            leafer: this.app.tree,
            rows: this.attrs.rows,
            cols: this.attrs.cols,
            squareSize: this.attrs.squareSize,
            squareSpace: this.attrs.squareSpace,
            squareColor: this.attrs.squareColor
        })

        this.stageBox.loadPointsGroup({

        })


        setTimeout(() => {
            this.stageBox.clear()
        }, 1000)

        // 活动box
        // this.activeBox = new SquareBox({
        //     rows: this.attrs.rows,
        //     cols: this.attrs.cols,
        //     squareSize: this.attrs.squareSize,
        //     squareSpace: this.attrs.squareSpace,
        //     squareColor: this.attrs.activeSquareColor
        // })
        // this.app.tree.add(this.activeBox.box)

    }

    // 创建背景网格线条
    createGrid() {

        // 横线
        for (let i = 0; i <= this.attrs.rows; i++) {
            const y = i * (this.attrs.squareSize + this.attrs.squareSpace)
            const line = new Rect({
                x: 0,
                y: y,
                width: this.width,
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
                height: this.height,
                fill: this.attrs.lineColor
            })
            this.app.ground.add(line)
        }

    }
}

class SquareBox {

    constructor(options) {

        // 默认属性
        this.attrs = {
            leafer: null, // 画布容器
            rows: 20, // 行数
            cols: 13, // 列数
            squareSize: 20, // 方块大小
            squareSpace: 1, // 方块间隔
            squareColor: "#fff",// 背景颜色
            ...options
        }

        // 当前偏移位置
        this.offset = { r: 0, c: 0 }

        // 实例化box
        this.box = new Box()
        this.attrs.leafer.add(this.box)

        // 图形点数组
        this.points = []
    }

    // 创建point对象
    createPoint(row, col) {

        // point真实位置（偏移后位置）
        const realRow = this.offset.r + row
        const realCol = this.offset.c + col

        // point对象
        const point = {
            row: row,
            col: col,
            realRow: realRow,
            realCol: realCol,
            rect: new Rect({
                x: realCol * (this.attrs.squareSize + this.attrs.squareSpace) + this.attrs.squareSpace,
                y: realRow * (this.attrs.squareSize + this.attrs.squareSpace) + this.attrs.squareSpace,
                width: this.attrs.squareSize,
                height: this.attrs.squareSize,
                fill: this.attrs.squareColor
            })
        }
        this.box.add(point.rect)
        this.points.push(point)

    }

    // 载入points组
    loadPointsGroup(pointsGroup) {
        pointsGroup
    }

    // 载入point
    loadPoints(points) {
        this.clear()
        points.forEach(point => this.createPoint(point[0], point[1]))
    }


    // 移动到指定
    moveTo(r, c) {
        this.offset.r = r
        this.offset.c = c
        this.points.forEach(point => {
            point.realRow = this.offset.r + point.row
            point.realCol = this.offset.c + point.col
            point.rect.x = point.realCol * (this.attrs.squareSize + this.attrs.squareSpace) + this.attrs.squareSpace
            point.rect.y = point.realRow * (this.attrs.squareSize + this.attrs.squareSpace) + this.attrs.squareSpace

        })
    }

    // 清空
    clear() {
        this.points.forEach(point => point.rect.destroy())
        this.points = []
    }



}

export default Tetris