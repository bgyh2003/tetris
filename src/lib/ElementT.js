import BaseElement from "./BaseElement"

export default class ElementT extends BaseElement {

    static imageData = {

        anchor: [1, 0],

        points: [
            [
                [1, 0],
                [0, 1],
                [1, 1],
                [2, 1],
            ],
            [
                [1, 0],
                [1, 1],
                [2, 1],
                [1, 2],
            ],
            [
                [0, 1],
                [1, 1],
                [2, 1],
                [1, 2],
            ],
            [
                [1, 0],
                [0, 1],
                [1, 1],
                [1, 2],
            ],
        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(ElementT.imageData)
    }


}