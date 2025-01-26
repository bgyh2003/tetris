import BaseElement from "./BaseElement"

export default class ElementZ extends BaseElement {

    static imageData = {

        anchor: [1, 0],

        points: [

            [
                [2, 0],
                [0, 1],
                [1, 1],
                [2, 1],
            ],
            [
                [1, 0],
                [1, 1],
                [1, 2],
                [2, 2],
            ],
            [
                [0, 1],
                [1, 1],
                [2, 1],
                [0, 2],
            ],
            [
                [0, 0],
                [1, 0],
                [1, 1],
                [1, 2],
            ]

        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(ElementZ.imageData)
    }


}