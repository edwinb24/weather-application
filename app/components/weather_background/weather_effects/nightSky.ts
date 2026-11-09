// Moon and stars, shared by every scene that can be shown at night
import {randomBetween, SceneLayer} from './shared'

type MoonOptions = {
    showDisc: boolean
    glow: number
}

export const createMoon = (options: MoonOptions): SceneLayer => {
    const craters = [
        {x: -0.3, y: -0.2, radius: 0.22},
        {x: 0.25, y: 0.15, radius: 0.16},
        {x: -0.05, y: 0.4, radius: 0.12},
        {x: 0.35, y: -0.35, radius: 0.09},
    ]
    return {
        resize: () => {},
        draw: (
            canvasDrawingContext,
            width,
            height,
            _secondsSinceLastDrawedFrame,
            time,
        ) => {
            const centerX = width * 0.8
            const centerY = height * 0.17
            const moonRadius = Math.max(
                22,
                Math.min(44, Math.min(width, height) * 0.045),
            )

            const reach =
                Math.min(width, height) *
                0.75 *
                (1 + 0.03 * Math.sin(time * 0.5))
            const light = canvasDrawingContext.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                reach,
            )
            light.addColorStop(0, `rgba(226,232,255,${0.32 * options.glow})`)
            light.addColorStop(
                0.25,
                `rgba(191,205,240,${0.14 * options.glow})`,
            )
            light.addColorStop(1, 'rgba(191,205,240,0)')
            canvasDrawingContext.fillStyle = light
            canvasDrawingContext.fillRect(0, 0, width, height)
            if (!options.showDisc) return

            const halo = canvasDrawingContext.createRadialGradient(
                centerX,
                centerY,
                moonRadius * 0.8,
                centerX,
                centerY,
                moonRadius * 3.2,
            )
            halo.addColorStop(0, 'rgba(241,245,255,0.45)')
            halo.addColorStop(1, 'rgba(241,245,255,0)')
            canvasDrawingContext.fillStyle = halo
            canvasDrawingContext.beginPath()
            canvasDrawingContext.arc(
                centerX,
                centerY,
                moonRadius * 3.2,
                0,
                Math.PI * 2,
            )
            canvasDrawingContext.fill()

            const disc = canvasDrawingContext.createRadialGradient(
                centerX - moonRadius * 0.35,
                centerY - moonRadius * 0.35,
                moonRadius * 0.1,
                centerX,
                centerY,
                moonRadius,
            )
            disc.addColorStop(0, '#FDFDF8')
            disc.addColorStop(1, '#DCE3EE')
            canvasDrawingContext.fillStyle = disc
            canvasDrawingContext.beginPath()
            canvasDrawingContext.arc(
                centerX,
                centerY,
                moonRadius,
                0,
                Math.PI * 2,
            )
            canvasDrawingContext.fill()

            canvasDrawingContext.fillStyle = 'rgba(148,163,184,0.22)'
            canvasDrawingContext.beginPath()
            for (const crater of craters) {
                const x = centerX + crater.x * moonRadius
                const y = centerY + crater.y * moonRadius
                canvasDrawingContext.moveTo(x + crater.radius * moonRadius, y)
                canvasDrawingContext.arc(
                    x,
                    y,
                    crater.radius * moonRadius,
                    0,
                    Math.PI * 2,
                )
            }
            canvasDrawingContext.fill()
        },
    }
}

export const createStars = ({density}: {density: number}): SceneLayer => {
    type Star = {
        x: number
        y: number
        radius: number
        phase: number
        speed: number
    }
    let stars: Star[] = []
    return {
        resize: (width, height) => {
            const count = Math.round((width * height) / density)
            stars = Array.from({length: count}, () => ({
                x: randomBetween(0, width),
                y: Math.pow(Math.random(), 1.6) * height * 0.85,
                radius: randomBetween(0.5, 1.4),
                phase: randomBetween(0, Math.PI * 2),
                speed: randomBetween(0.6, 1.8),
            }))
        },
        draw: (
            canvasDrawingContext,
            _width,
            _height,
            _secondsSinceLastDrawedFrame,
            time,
        ) => {
            canvasDrawingContext.fillStyle = '#F8FAFC'
            for (const star of stars) {
                canvasDrawingContext.globalAlpha =
                    0.35 +
                    0.45 * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase))
                canvasDrawingContext.beginPath()
                canvasDrawingContext.arc(
                    star.x,
                    star.y,
                    star.radius,
                    0,
                    Math.PI * 2,
                )
                canvasDrawingContext.fill()
            }
            canvasDrawingContext.globalAlpha = 1
        },
    }
}

// A faint moon glow behind the clouds, only at night
export const nightGlow = (isNight: boolean, glow: number): SceneLayer[] =>
    isNight ? [createMoon({showDisc: false, glow})] : []
