export default class BaseElement {

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