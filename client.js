function StageRenderer(elementID) {
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
    var playerColors = ['red','green','blue']


    this.clearState = () => {
        this.stateContainer.removeAllChildren()
    }
    this.clearStage = () => {
        this.clearState()
        this.stageContainer.removeAllChildren()
    }
    this.drawStage = () => {
        this.drawGrid()
        this.stage.walls.forEach(wall => {
            this.drawWall(wall.row, wall.col)
        })
        this.renderStage.update()
    }
    this.drawState = (state) => {
        state.players.forEach((player, index) => {
            this.drawPlayer(player.row, player.col, index)
        })
        state.coins.forEach(coin => {
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
        wall.graphics.beginFill("#444444").drawRect(row * boxWidth(), col * boxHeight(), boxWidth(), boxHeight())
        this.stageContainer.addChild(wall)
    }

    this.drawPlayer = (row, col, playerNumber) => {
        let player = new createjs.Shape()
        player.graphics
            .beginFill(playerColors[playerNumber])
            .beginStroke('black')
            .drawCircle(
                row * boxWidth() + boxWidth() / 2,
                col * boxHeight() + boxHeight() / 2,
                Math.min(boxWidth() / 2.5, boxHeight() / 2.5))
        this.stateContainer.addChild(player)
    }

    this.drawCoin = (row, col) => {
        let coin = new createjs.Shape()
        coin.graphics.beginFill("yellow").beginStroke('black').drawCircle(
            row * boxWidth() + boxWidth() / 2,
            col * boxHeight() + boxHeight() / 2,
            Math.min(boxWidth() / 3, boxHeight() / 3))
        this.stateContainer.addChild(coin)
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
}

function init() {
    var renderer = new StageRenderer('render-canvas')

    let testStage = {
        rows: 8,
        cols: 11,
        walls: [
            {row: 0, col: 0 },
            {row: 6, col: 2 }
        ]
    }
    let testState = {
        players: [
            {row:2,col:5},
            {row:7,col:1}
        ],
        coins: [
            {row:1,col:3},
            {row:7,col:6}
        ]
    }

    renderer.setStage(testStage)
    renderer.updateState(testState)

    var socket = io('http://localhost:3010')
    socket.on('setStage', (stage) => {
        console.log(stage)
        renderer.setStage(stage)
    })
    socket.on('updateState', (state) => {
        console.log(state)
        renderer.updateState(state)
    })
}