import BaseElement from "./BaseElement"

export default class ElementZ extends BaseElement {

    static imageData = {

        anchor: [1, 1],

        points: [
            [
                [0, 0],
                [1, 0],
                [1, 1],
                [2, 1],
            ],
            [
                [1, -1],
                [0, 0],
                [1, 0],
                [0, 1]
            ],

        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(ElementZ.imageData)
    }


}