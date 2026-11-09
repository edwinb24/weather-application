import {createMoon, createStars} from './nightSky'
import {randomBetween, Range, SceneBuilder, SceneLayer} from './shared'

type CloudPalette = {
    rgb: string
    alpha: number
    shadeRgb: string
    shadeAlpha: number
}

type CloudOptions = CloudPalette & {
    count: number
    band: Range
    scale: Range
    speed: Range
}

export const createClouds = (options: CloudOptions): SceneLayer => {
    type Puff = {offsetX: number; offsetY: number; radius: number}
    type Cloud = {
        x: number
        y: number
        speed: number
        sprite: HTMLCanvasElement
        offsetX: number
        offsetY: number
    }
    let clouds: Cloud[] = []

    const makePuffs = (): Puff[] => {
        const count = Math.round(randomBetween(6, 9))
        return Array.from({length: count}, (_, i) => ({
            offsetX: ((i / (count - 1)) * 2 - 1) * 95 + randomBetween(-15, 15),
            offsetY: -Math.abs(randomBetween(-30, 30)) + 10,
            radius: randomBetween(44, 76),
        }))
    }

    const fillPuff = (
        canvasDrawingContext: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
        rgb: string,
        alpha: number,
    ) => {
        const gradient = canvasDrawingContext.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius,
        )
        gradient.addColorStop(0, `rgba(${rgb},${alpha})`)
        gradient.addColorStop(0.6, `rgba(${rgb},${alpha * 0.75})`)
        gradient.addColorStop(1, `rgba(${rgb},0)`)
        canvasDrawingContext.fillStyle = gradient
        canvasDrawingContext.beginPath()
        canvasDrawingContext.arc(x, y, radius, 0, Math.PI * 2)
        canvasDrawingContext.fill()
    }

    const makeCloud = (width: number, height: number): Cloud => {
        const scale = randomBetween(...options.scale)
        const puffs = makePuffs()
        const shadeDrop = 0.3
        const minX =
            Math.min(...puffs.map(puff => puff.offsetX - puff.radius)) * scale
        const maxX =
            Math.max(...puffs.map(puff => puff.offsetX + puff.radius)) * scale
        const minY =
            Math.min(...puffs.map(puff => puff.offsetY - puff.radius)) * scale
        const maxY =
            Math.max(
                ...puffs.map(
                    puff => puff.offsetY + puff.radius * (1 + shadeDrop),
                ),
            ) * scale

        const sprite = document.createElement('canvas')
        sprite.width = Math.ceil(maxX - minX)
        sprite.height = Math.ceil(maxY - minY)
        const spriteDrawingContext = sprite.getContext('2d')
        if (spriteDrawingContext) {
            spriteDrawingContext.translate(-minX, -minY)
            for (const puff of puffs) {
                fillPuff(
                    spriteDrawingContext,
                    puff.offsetX * scale,
                    (puff.offsetY + puff.radius * shadeDrop) * scale,
                    puff.radius * scale,
                    options.shadeRgb,
                    options.shadeAlpha,
                )
            }
            for (const puff of puffs) {
                fillPuff(
                    spriteDrawingContext,
                    puff.offsetX * scale,
                    puff.offsetY * scale,
                    puff.radius * scale,
                    options.rgb,
                    options.alpha,
                )
            }
        }
        return {
            x: randomBetween(-maxX, width - minX),
            y: randomBetween(...options.band) * height,
            speed: randomBetween(...options.speed),
            sprite,
            offsetX: minX,
            offsetY: minY,
        }
    }

    return {
        resize: (width, height) => {
            clouds = Array.from({length: options.count}, () =>
                makeCloud(width, height),
            )
        },
        draw: (
            canvasDrawingContext,
            width,
            _height,
            secondsSinceLastDrawedFrame,
        ) => {
            for (const cloud of clouds) {
                cloud.x += cloud.speed * secondsSinceLastDrawedFrame
                if (cloud.x + cloud.offsetX > width) {
                    cloud.x = -(cloud.offsetX + cloud.sprite.width)
                }
                canvasDrawingContext.drawImage(
                    cloud.sprite,
                    cloud.x + cloud.offsetX,
                    cloud.y + cloud.offsetY,
                )
            }
        },
    }
}

export const cloudsScene: SceneBuilder = ({palette, isNight}) => [
    ...(isNight
        ? [
              createStars({density: 14000}),
              createMoon({showDisc: true, glow: 0.8}),
          ]
        : []),
    createClouds({
        ...palette.lightClouds,
        count: 14,
        band: [0, 0.8],
        scale: [0.7, 1.4],
        speed: [8, 20],
    }),
]
