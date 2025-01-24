import BaseElement from "./BaseElement"
import { Animate } from '@leafer-in/animate' // 加载动画插件

export default class Background extends BaseElement {

    static imageData = {

        anchor: [0, 0],

        points: [
            [

            ]
        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(Background.imageData)
    }


    // 消除行
    clearRow() {

        // 满行列表
        const rows = []

        // 行对象
        const rowMap = {}

        // 获取所有点坐标
        const points = this.getAbsolutePoints()

        // 遍历所有点 并记录到行对象中
        for (const point of points) {
            const [c, r] = point
            if (rowMap[r] === undefined) rowMap[r] = []
            rowMap[r].push(c)
        }

        // 获取满行列表
        for (const r in rowMap) if (rowMap[r].length === this.cols) rows.push(+r)

        // 消除行
        for (const rect of this.boxes[this.boxIndex].find("Rect")) {
            if (rows.includes(rect.data.point[1])) {

                new Animate(
                    rect,
                    { x: 0 },
                    {
                        duration: 1,
                    }
                )
            }
        }


    }

}