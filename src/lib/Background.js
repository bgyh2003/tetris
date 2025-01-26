import BaseElement from "./BaseElement"

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

        let minR = 0

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

        // 存在满行
        if (rows.length > 0) {

            const rects = this.boxes[this.boxIndex].find("Rect").sort((a, b) => b.data.point[1] - a.data.point[1])

            // 消除行
            for (const rect of rects) {
                if (rows.includes(rect.data.point[1])) {
                    rect.$moveLeft(this.cols, {
                        duration: 0.2,
                        event: { completed() { rect.destroy() } }
                    })
                }
            }

            // 获取消除的最小行号
            minR = Math.min(...rows)

            // 移动行
            for (const rect of rects) {
                if (rect.data.point[1] < minR) {
                    rect.$moveDown(rows.length, { duration: 0.2, delay: 0.2 })
                }
            }


        }


        // 返回消除的行数和行号
        return {
            num: rows.length,
            rows
        }

    }

}