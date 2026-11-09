import {nightGlow} from './nightSky'
import {randomBetween, SceneBuilder, SceneLayer} from './shared'

type FogOptions = {
    rgb: string
    alpha: number
    shadeRgb: string
    shadeAlpha: number
}

const FOG_THICKNESS = 0.8
const FOG_SHADOW_DROP = 0.5

const createFog = (options: FogOptions): SceneLayer => {
    const bands = Array.from({length: 8}, (_, i) => ({
        y: 0.1 + i * 0.12 + randomBetween(-0.04, 0.04),
        speed: randomBetween(0.36, 0.7),
        phase: randomBetween(0, Math.PI * 2),
        strength: randomBetween(0.7, 1),
    }))

    const fillBand = (
        canvasDrawingContext: CanvasRenderingContext2D,
        radius: number,
        rgb: string,
        alpha: number,
    ) => {
        const gradient = canvasDrawingContext.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            radius,
        )
        gradient.addColorStop(0, `rgba(${rgb},${alpha})`)
        gradient.addColorStop(1, `rgba(${rgb},0)`)
        canvasDrawingContext.fillStyle = gradient
        canvasDrawingContext.fillRect(-radius, -radius, radius * 2, radius * 2)
    }

    return {
        resize: () => {},
        draw: (
            canvasDrawingContext,
            width,
            height,
            _secondsSinceLastDrawedFrame,
            time,
        ) => {
            const radius = height * 0.16
            const stretch = (width / radius) * 0.55
            for (const band of bands) {
                const x =
                    width / 2 +
                    Math.sin(time * band.speed + band.phase) * width * 0.25
                canvasDrawingContext.save()
                canvasDrawingContext.translate(x, band.y * height)
                canvasDrawingContext.scale(stretch, FOG_THICKNESS)
                canvasDrawingContext.translate(0, radius * FOG_SHADOW_DROP)
                fillBand(
                    canvasDrawingContext,
                    radius,
                    options.shadeRgb,
                    options.shadeAlpha * band.strength,
                )
                canvasDrawingContext.translate(0, -radius * FOG_SHADOW_DROP)
                fillBand(
                    canvasDrawingContext,
                    radius,
                    options.rgb,
                    options.alpha * band.strength,
                )
                canvasDrawingContext.restore()
            }
        },
    }
}

export const fogScene: SceneBuilder = ({palette, isNight}) => [
    ...nightGlow(isNight, 0.6),
    createFog(palette.fog),
]
