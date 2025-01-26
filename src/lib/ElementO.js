import BaseElement from "./BaseElement"

export default class ElementO extends BaseElement {

    static imageData = {

        anchor: [1, 0],

        points: [
            [
                [0, 0],
                [1, 0],
                [0, 1],
                [1, 1]
            ],

        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(ElementO.imageData)
    }


}