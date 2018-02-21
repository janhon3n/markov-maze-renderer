function StageRenderer(elementID) {
    this.stage = {
        rows: 6,
        cols: 5,
    }

    this.renderStage = new createjs.Stage(elementID)

    this.stageContainer = new createjs.Container()
    this.stateContainer = new createjs.Container()

    this.renderStage.addChild(this.stageContainer)
    this.renderStage.addChild(this.stateContainer)

    var canvasWidth = () => {
        return this.renderStage.canvas.width
    }
    var canvasHeight = () => {
        return this.renderStage.canvas.height
    }
    var boxWidth = () => {
        return this.renderStage.canvas.width / this.stage.cols
    }
    var boxHeight = () => {
        return this.renderStage.canvas.height / this.stage.rows
    }

    this.drawGridLine = (x1,y1,x2,y2) => {
        let line = new createjs.Shape()
        line.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)")
        line.graphics.moveTo(x1, y1)
        line.graphics.lineTo(x2, y2)
        line.graphics.endStroke()
        this.stageContainer.addChild(line)
    }

    this.drawGrid = () => {
        for (let i = 1; i < this.stage.rows; i++) {
            this.drawGridLine(0, boxHeight() * i,
                canvasWidth(), boxHeight() * i)
        }
        for (let i = 1; i < this.stage.cols; i++) {
            this.drawGridLine(boxWidth() * i, 0,
                boxWidth() * i, canvasHeight())
        }
    }

    this.drawWall = (row, col) => {
        let wall = new createjs.Shape()
        wall.graphics.beginFill("#444444").drawRect(row*boxWidth(), col*boxHeight(), boxWidth(), boxHeight())
        this.stageContainer.addChild(wall)
    }

    this.setStage = (stage) => {
        this.stage = stage
    }

    this.update = (state) => {
        element
    }


    this.drawGrid()
    this.drawWall(1,1)
    this.renderStage.update()
}

function init() {
    var renderer = StageRenderer('render-canvas')

    var socket = io()
    socket.on('setStage', (stage) => {

    })
    socket.on('updateState', (state) => {
        StageRenderer.update(data)
    })
}