function StageRenderer(elementID) {
    this.stage = null
    this.renderStage = new createjs.Stage(elementID)
    this.renderStage.canvas.width = document.getElementById(elementID).offsetWidth
    this.renderStage.canvas.height = document.getElementById(elementID).offsetHeight
    var testShape = new createjs.Shape()
    testShape.graphics.beginFill('black').drawCircle(20, 20, 20)
    this.renderStage.addChild()

    this.stageContainer = new createjs.Container()
    this.stateContainer = new createjs.Container()
    this.markerContainer = new createjs.Container()

    this.renderStage.addChild(this.stageContainer)
    this.renderStage.addChild(this.stateContainer)
    this.renderStage.addChild(this.markerContainer)

    var canvasWidth = () => {
        return this.renderStage.canvas.width
    }
    var canvasHeight = () => {
        return this.renderStage.canvas.height
    }
    var boxWidth = () => {
        return this.renderStage.canvas.width / this.stage.dimensions.cols
    }
    var boxHeight = () => {
        return this.renderStage.canvas.height / this.stage.dimensions.rows
    }
    var playerColors = ['red', 'green', 'blue']

    this.resize = () => {
    }

    this.clearState = () => {
        this.stateContainer.removeAllChildren()
    }
    this.clearStage = () => {
        this.clearState()
        this.stageContainer.removeAllChildren()
    }
    this.clearMarkers = () => {
        this.markerContainer.removeAllChildren()
    }
    this.drawStage = () => {
        this.drawGrid()
        this.stage.wallPositions.forEach(wall => {
            this.drawWall(wall.row, wall.col)
        })
        this.renderStage.update()
    }
    this.drawState = (state) => {
        state.playerPositions.forEach((player, index) => {
            this.drawPlayer(player.row, player.col, player.rotation, index)
        })
        state.coinPositions.forEach(coin => {
            this.drawCoin(coin.row, coin.col)
        })
        this.renderStage.update()
    }

    this.drawGridLine = (x1, y1, x2, y2) => {
        let line = new createjs.Shape()
        line.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)")
        line.graphics.moveTo(x1, y1)
        line.graphics.lineTo(x2, y2)
        line.graphics.endStroke()
        this.stageContainer.addChild(line)
    }

    this.drawGrid = () => {
        for (let i = 1; i < this.stage.dimensions.rows; i++) {
            this.drawGridLine(0, boxHeight() * i,
                canvasWidth(), boxHeight() * i)
        }
        for (let i = 1; i < this.stage.dimensions.cols; i++) {
            this.drawGridLine(boxWidth() * i, 0,
                boxWidth() * i, canvasHeight())
        }
    }

    this.drawWall = (row, col) => {
        let wall = new createjs.Shape()
        wall.graphics.beginFill("#444444").drawRect(
            col * boxWidth(), row * boxHeight(), boxWidth(), boxHeight())
        this.stageContainer.addChild(wall)
    }

    this.drawPlayer = (row, col, rotation, playerNumber) => {
        let player = new createjs.Shape()
        player.graphics
            .beginFill(playerColors[playerNumber])
            .beginStroke('black')
            .drawCircle(
                col * boxWidth() + boxWidth() / 2,
                row * boxHeight() + boxHeight() / 2,
                Math.min(boxWidth() / 2.5, boxHeight() / 2.5))
        this.stateContainer.addChild(player)
    }

    this.drawCoin = (row, col) => {
        let coin = new createjs.Shape()
        coin.graphics.beginFill("yellow").beginStroke('black').drawCircle(
            col * boxWidth() + boxWidth() / 2,
            row * boxHeight() + boxHeight() / 2,
            Math.min(boxWidth() / 5, boxHeight() / 5))
        this.stateContainer.addChild(coin)
    }

    this.drawMarker = (row, col, playerNumber) => {
        let marker = new createjs.Shape()
        let rectSize = Math.min(boxWidth() * (1/3), boxHeight() * (1/3))
        marker.graphics
            .beginFill(playerColors[playerNumber])
            .beginStroke('black')
            .drawRect(
                col * boxWidth() +
                    (boxWidth() / 2) -
                    (rectSize / 2),
                row * boxHeight() +
                (boxHeight() / 2) -
                (rectSize / 2),
                rectSize, rectSize)
        this.markerContainer.addChild(marker)
    }

    this.setStage = (stage) => {
        this.clearStage()
        this.stage = stage
        this.drawStage()
    }

    this.updateState = (state) => {
        this.clearState()
        this.drawState(state)
    }
    
    this.updateMarkers = (searchMarkers, playerIndex) => {
        if (this.stage === null) return
        this.clearMarkers()
        searchMarkers.forEach((marker) => {
            this.drawMarker(marker.row, marker.col, playerIndex)
        })
        this.renderStage.update()
    }
}

function init() {
    var renderer = new StageRenderer('render-canvas')
    var consoleElement = document.getElementById('console')

    var socket = io('http://localhost:3010')
    socket.on('setStage', (stage) => {
        renderer.setStage(stage)
        console.log(stage)
    })
    socket.on('updateState', (state) => {
        renderer.updateState(state)
        console.log(state)
    })
    socket.on('updateSearchMarkers', (data) => {
        renderer.updateMarkers(data.markers, data.playerIndex)
        console.log(data)
    })
    socket.on('consoleMessage', (message) => {
        consoleElement.innerText = message + '\n' + consoleElement.innerText
    })
}