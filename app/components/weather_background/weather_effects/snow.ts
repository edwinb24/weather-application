import {createClouds} from './clouds'
import {nightGlow} from './nightSky'
import {randomBetween, Range, SceneBuilder, SceneLayer} from './shared'

type SnowOptions = {
    areaPerFlake: number
    radius: Range
    speed: Range
    sway: number
    color: string
}

const createSnow = (options: SnowOptions): SceneLayer => {
    type Flake = {
        x: number
        y: number
        radius: number
        speed: number
        phase: number
        frequency: number
    }
    let flakes: Flake[] = []

    return {
        resize: (width, height) => {
            const count = Math.round((width * height) / options.areaPerFlake)
            flakes = Array.from({length: count}, () => ({
                x: randomBetween(0, width),
                y: randomBetween(-height, height),
                radius: randomBetween(...options.radius),
                speed: randomBetween(...options.speed),
                phase: randomBetween(0, Math.PI * 2),
                frequency: randomBetween(0.4, 1.1),
            }))
        },
        draw: (
            canvasDrawingContext,
            width,
            height,
            secondsSinceLastDrawedFrame,
        ) => {
            canvasDrawingContext.fillStyle = options.color
            canvasDrawingContext.beginPath()
            for (const flake of flakes) {
                flake.y += flake.speed * secondsSinceLastDrawedFrame
                flake.phase += flake.frequency * secondsSinceLastDrawedFrame
                if (flake.y - flake.radius > height) {
                    flake.y = -flake.radius - randomBetween(0, 40)
                    flake.x = randomBetween(0, width)
                }
                const x = flake.x + Math.sin(flake.phase) * options.sway
                canvasDrawingContext.moveTo(x + flake.radius, flake.y)
                canvasDrawingContext.arc(
                    x,
                    flake.y,
                    flake.radius,
                    0,
                    Math.PI * 2,
                )
            }
            canvasDrawingContext.fill()
        },
    }
}

export const snowScene: SceneBuilder = ({palette, isNight}) => [
    ...nightGlow(isNight, 0.7),
    createClouds({
        ...palette.greyClouds,
        count: 8,
        band: [-0.05, 0.4],
        scale: [1, 1.6],
        speed: [5, 10],
    }),
    createSnow({
        areaPerFlake: 9000,
        radius: [1, 2],
        speed: [20, 40],
        sway: 10,
        color: 'rgba(255,255,255,0.75)',
    }),
    createSnow({
        areaPerFlake: 25000,
        radius: [2.5, 4],
        speed: [45, 75],
        sway: 22,
        color: 'rgba(255,255,255,0.95)',
    }),
]
