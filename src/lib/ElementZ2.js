import BaseElement from "./BaseElement"

export default class ElementZ2 extends BaseElement {

    static imageData = {

        anchor: [1, 0],

        points: [

            [
                [1, 0],
                [2, 0],
                [0, 1],
                [1, 1],
            ],

            [
                [1, -1],
                [1, 0],
                [2, 0],
                [2, 1],
            ],
        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(ElementZ2.imageData)
    }


}