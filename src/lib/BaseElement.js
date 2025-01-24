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

        // 锚点
        this.anchor = [0, 0]

        // 偏移量
        this.offsetX = 0
        this.offsetY = 0

        // 图形索引
        this.boxIndex = 0

        // 图形组
        this.boxes = []

    }

    // 初始化图形
    init(imageData) {

        // 锚点
        this.anchor = imageData.anchor

        // 偏移量
        this.offsetX = -(this.anchor[0] * this.size)
        this.offsetY = -(this.anchor[1] * this.size)

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
            data: { point: point },
            offsetX: this.offsetX,
            offsetY: this.offsetY
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

        // 更新索引
        this.boxIndex = index

        // 显示下一个box
        this.boxes.at(this.boxIndex).visible = true
    }

    // 下一个图片
    nextBox() {
        const index = this.boxIndex + 1
        const nextIndex = index >= this.boxes.length ? 0 : index
        this.switchBox(nextIndex)
    }

    // 上一个图片
    lastBox() {
        const index = this.boxIndex - 1
        const nextIndex = index < 0 ? this.boxes.length - 1 : index
        this.switchBox(nextIndex)
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
    moveLeft(d = 1) {
        const [c, r] = this.position
        this.moveTo(c - d, r)
    }

    // 向右移动
    moveRight(d = 1) {
        const [c, r] = this.position
        this.moveTo(c + d, r)
    }

    // 向下移动
    moveDown(d = 1) {
        const [c, r] = this.position
        this.moveTo(c, r + d)
    }

    // 向上移动
    moveUp(d = 1) {
        const [c, r] = this.position
        this.moveTo(c, r - d)
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
            const anchorC = this.anchor[0]
            const anchorR = this.anchor[1]
            res.push([baseC + c - anchorC, baseR + r - anchorR])
        }

        return res

    }

    // 计算距离
    distance(element, direction = "down") {

        let res = null

        // 获取两个图形的绝对点坐标
        const points0 = this.getAbsolutePoints()
        const points1 = element.getAbsolutePoints()

        for (const point0 of points0) {
            const [c0, r0] = point0
            for (const point1 of points1) {
                const [c1, r1] = point1

                if (direction === "down" && c0 === c1 && r0 <= r1) {
                    const d = r1 - r0 - 1
                    if (res === null || d < res) res = d
                }

                if (direction === "right" && r0 === r1 && c0 <= c1) {
                    const d = c1 - c0 - 1
                    if (res === null || d < res) res = d
                }

                if (direction === "left" && r0 === r1 && c0 >= c1) {
                    const d = c0 - c1 - 1
                    if (res === null || d < res) res = d
                }

                if (direction === "up" && c0 === c1 && r0 >= r1) {
                    const d = r0 - r1 - 1
                    if (res === null || d < res) res = d
                }

            }
        }

        return res
    }

    // 计算边界距离
    distanceEdge(direction = "down") {
        let res = null

        const points = this.getAbsolutePoints()

        for (const point of points) {
            const [c, r] = point

            if (direction === "down") {
                const d = this.rows - r - 1
                if (res === null || d < res) res = d
            }
            if (direction === "right") {
                const d = this.cols - c - 1
                if (res === null || d < res) res = d
            }
            if (direction === "left") {
                const d = c
                if (res === null || d < res) res = d
            }
            if (direction === "up") {
                const d = r
                if (res === null || d < res) res = d
            }

        }

        return res

    }

    // 碰撞检测
    collisionDetection(element) {

        // 获取两个图形的绝对点坐标
        const points0 = this.getAbsolutePoints()
        const points1 = element.getAbsolutePoints()

        // 遍历所有点
        for (const point0 of points0) {
            for (const point1 of points1) {
                if (point0[0] === point1[0] && point0[1] === point1[1]) return true
            }
        }

        return false
    }

    // 边界碰撞检测
    collisionDetectionEdge() {

        // 获取图形的绝对点坐标
        const points = this.getAbsolutePoints()

        // 遍历所有点
        for (const point of points) {
            if (point[0] < 0 || point[0] >= this.cols || point[1] < 0 || point[1] >= this.rows) return true
        }

        return false
    }

    // 合并
    merge(element) {
        const points = element.getAbsolutePoints()
        this.addPoints(points)
    }

    // 注销
    destroy() {
        this.group.destroy()
    }
}