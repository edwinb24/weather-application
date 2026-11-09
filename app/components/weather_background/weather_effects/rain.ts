import {createClouds} from './clouds'
import {nightGlow} from './nightSky'
import {randomBetween, Range, SceneBuilder, SceneLayer} from './shared'

type RainOptions = {
    areaPerDrop: number
    length: Range
    speed: Range
    lineWidth: number
    color: string
    slant: number
}

export const createRain = (options: RainOptions): SceneLayer => {
    type Drop = {x: number; y: number; length: number; speed: number}
    let drops: Drop[] = []
    let spawnMinX = 0
    let spawnMaxX = 0

    const respawn = (drop: Drop, height: number, anywhere: boolean) => {
        drop.x = randomBetween(spawnMinX, spawnMaxX)
        drop.y = anywhere
            ? randomBetween(-height, height)
            : randomBetween(-120, -drop.length)
    }

    return {
        resize: (width, height) => {
            spawnMinX = Math.min(0, -options.slant * height)
            spawnMaxX = Math.max(width, width - options.slant * height)
            const count = Math.round((width * height) / options.areaPerDrop)
            drops = Array.from({length: count}, () => {
                const drop = {
                    x: 0,
                    y: 0,
                    length: randomBetween(...options.length),
                    speed: randomBetween(...options.speed),
                }
                respawn(drop, height, true)
                return drop
            })
        },
        draw: (
            canvasDrawingContext,
            _width,
            height,
            secondsSinceLastDrawedFrame,
        ) => {
            canvasDrawingContext.strokeStyle = options.color
            canvasDrawingContext.lineWidth = options.lineWidth
            canvasDrawingContext.lineCap = 'round'
            canvasDrawingContext.beginPath()
            for (const drop of drops) {
                drop.y += drop.speed * secondsSinceLastDrawedFrame
                drop.x +=
                    drop.speed * options.slant * secondsSinceLastDrawedFrame
                if (drop.y - drop.length > height) respawn(drop, height, false)
                canvasDrawingContext.moveTo(drop.x, drop.y)
                canvasDrawingContext.lineTo(
                    drop.x - options.slant * drop.length,
                    drop.y - drop.length,
                )
            }
            canvasDrawingContext.stroke()
        },
    }
}

export const rainScene: SceneBuilder = ({palette, isNight}) => [
    ...nightGlow(isNight, 0.45),
    createClouds({
        ...palette.greyClouds,
        count: 9,
        band: [-0.05, 0.4],
        scale: [1, 1.6],
        speed: [8, 16],
    }),
    createRain({
        areaPerDrop: 9000,
        length: [12, 20],
        speed: [600, 800],
        lineWidth: 1,
        color: palette.rain(0.18),
        slant: 0.12,
    }),
    createRain({
        areaPerDrop: 22000,
        length: [20, 32],
        speed: [900, 1200],
        lineWidth: 1.5,
        color: palette.rain(0.32),
        slant: 0.12,
    }),
]
