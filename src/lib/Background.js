import { Group, Rect } from "leafer-ui"
import BaseElement from "./BaseElement"

export default class Background {

    static points = [
        [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 1]
        ]

    ]


    constructor(attrs) {

        // 基础属性
        this.rows = attrs.rows // 行数
        this.cols = attrs.cols // 列数
        this.squareSize = attrs.squareSize // 方块大小
        this.squareSpace = attrs.squareSpace // 方块间隔
        this.squareColor = attrs.squareColor // 方块颜色


        // 实例化group
        this.group = new Group()

        // 图形索引
        this.pointIndex = 0

        // 当前位置
        this.position = [0, 0]

        // 图形点数组
        this.rects = []

    }


    // 渲染图形
    render(pointIndex = 0, r = 0, c = 0) {

        // 图形索引
        this.pointIndex = pointIndex

        // 设置图形位置
        this.position = [r, c]

        // 创建图形
        for (const point of Background.points[pointIndex]) this.createRect(point)

    }

    // 创建图形点
    createRect(point) {
        const rect = new Rect({
            width: this.squareSize,
            height: this.squareSize,
            fill: this.squareColor,
            x: point[1] * (this.squareSize + this.squareSpace),
            y: point[0] * (this.squareSize + this.squareSpace)
        })
        this.group.add(rect)
        this.rects.push(rect)

    }

    moveTo(r, c) {

        // 移动图形
        this.group.moveTo(c * (this.squareSize + this.squareSpace), r * (this.squareSize + this.squareSpace))

        // 更新位置
        this.position = [r, c]
        
    }


}