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


    constructor(options) {

        this.attrs = {
            leafer: options.leafer ?? null, // 画布容器
            rows: options.rows ?? 20, // 行数
            cols: options.cols ?? 13, // 列数
            squareSize: options.squareSize ?? 20, // 方块大小
            squareSpace: options.squareSpace ?? 1, // 方块间隔
            squareColor: options.squareColor ?? "#000",// 方块颜色
            r: options.r ?? 0, // 起始位置 行
            c: options.c ?? 0, // 起始位置 列
        }

        // 实例化group
        this.group = new Group()
        this.attrs.leafer.add(this.group)

        // 图形索引
        this.pointIndex = 0

        // 当前位置
        this.position = { r: this.attrs.r, c: this.attrs.c }

        // 图形点数组
        this.rects = []

        // 初始化
        // this.init()

    }




}