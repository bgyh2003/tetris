import BaseElement from "./BaseElement"

export default class Background extends BaseElement {

    static imageData = {

        center: [0, 0],

        points: [
            []
        ]

    }

    constructor(attrs) {
        super(attrs)
        this.init(Background.imageData)
    }


}