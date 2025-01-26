import BaseElement from "./BaseElement"

export default class ElementI extends BaseElement {

    static imageData = {

        anchor: [1, 0],

        points: [

            [
                [0, 0],
                [1, 0],
                [2, 0],
                [3, 0],
            ],
            [
                [1, -1],
                [1, 0],
                [1, 1],
                [1, 2],
            ],
        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(ElementI.imageData)
    }


}