import { Group, Rect, Box } from "leafer-ui"
export default class BaseElement {

    constructor(attrs) {

        // 基础属性
        this.rows = attrs.rows // 行数
        this.cols = attrs.cols // 列数
        this.squareSize = attrs.squareSize // 方块大小
        this.squareSpace = attrs.squareSpace // 方块间隔
        this.squareColor = attrs.squareColor // 方块颜色

        // 单个方块尺寸
        this.size = this.squareSize + this.squareSpace

        // 实例化group
        this.group = new Group()

        // 当前位置
        this.position = [0, 0]

        // 图形索引
        this.boxIndex = 0

        // 图形组
        this.boxes = []

    }

    // 初始化图形
    init(imageData) {

        // 创建图形
        for (const points of imageData.points) {
            const box = this.createBox(points)
            this.boxes.push(box)
            this.group.add(box)
        }

        // 显示第一个图形
        this.switchBox(0)
    }

    // 创建图形
    createBox(points) {

        // 创建box
        const box = new Box({ visible: false })

        // 遍历点集合
        for (const point of points) {
            const rect = this.createRect(point)
            box.add(rect)
        }

        return box
    }

    // 创建点
    createRect(point) {

        // 提取颜色
        const color = point[2]

        // 获取坐标
        const { x, y } = this.pointToPosition(point)

        // 创建rect
        const rect = new Rect({
            width: this.squareSize,
            height: this.squareSize,
            fill: color ?? this.squareColor,
            x: x + this.squareSpace,
            y: y + this.squareSpace,
            data: { point: point }
        })

        return rect
    }

    // 添加点组
    addPoints(points) {

        // 提取当前box
        const box = this.boxes.at(this.boxIndex)
        for (const point of points) {
            const rect = this.createRect(point)
            box.add(rect)
        }

    }

    // 点坐标转换为位置
    pointToPosition(point) {
        return {
            x: point[0] * this.size,
            y: point[1] * this.size
        }
    }

    // 切换图片
    switchBox(index) {

        // 获取当前box
        const box = this.boxes.at(this.boxIndex)
        if (!box) return

        // 隐藏当前box
        box.visible = false

        // 计算新的索引
        index = index === undefined ? this.boxIndex + 1 : index
        this.boxIndex = index % this.boxes.length

        // 显示下一个box
        this.boxes.at(this.boxIndex).visible = true
    }

    // 移动到指定位置
    moveTo(c, r) {

        const { x, y } = this.pointToPosition([c, r])

        // 移动图形
        this.group.x = x
        this.group.y = y

        // 更新位置
        this.position = [c, r]

    }

    // 向左移动
    moveLeft() {
        const [c, r] = this.position
        this.moveTo(c - 1, r)
    }

    // 向右移动
    moveRight() {
        const [c, r] = this.position
        this.moveTo(c + 1, r)
    }

    // 向下移动
    moveDown() {
        const [c, r] = this.position
        this.moveTo(c, r + 1)
    }

    // 向上移动
    moveUp() {
        const [c, r] = this.position
        this.moveTo(c, r - 1)
    }

    // 获取当前图形绝对点坐标
    getAbsolutePoints() {

        // 存储结果
        const res = []

        // 获取当前图形的相对点坐标
        const [baseC, baseR] = this.position

        // 获取当前图形box
        const box = this.boxes[this.boxIndex]

        // 遍历所有Rect
        for (const rect of box.find("Rect")) {
            const [c, r] = rect.data.point
            res.push([baseC + c, baseR + r])
        }

        return res

    }


}