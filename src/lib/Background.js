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

            // 排序全部方块
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

            // 满行（消除行）排序
            rows.sort()

            // 移动行
            for (const rect of rects) {

                // 当前方块所属行
                const r = rect.data.point[1]

                // 如果是消除行，跳过
                if (rows.includes(r)) continue

                // 比较
                for (const row of rows) {
                    if (r < row) {
                        let i = rows.indexOf(row)
                        rect.$moveDown(rows.length - i, { duration: 0.2, delay: 0.2 })
                        break
                    }
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