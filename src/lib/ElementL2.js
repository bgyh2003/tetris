import BaseElement from "./BaseElement"

export default class ElementL2 extends BaseElement {

    static imageData = {

        anchor: [1, 1],

        points: [
            [
                [0, 0],
                [0, 1],
                [1, 1],
                [2, 1],
            ],

            [
                [1, 0],
                [2, 0],
                [1, 1],
                [1, 2],
            ],

            [
                [0, 1],
                [1, 1],
                [2, 1],
                [2, 2],
            ],
            [
                [1, 0],
                [1, 1],
                [1, 2],
                [0, 2],
            ],

            
        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(ElementL2.imageData)
    }


}