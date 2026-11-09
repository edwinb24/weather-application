import {createClouds} from './clouds'
import {createMoon, createStars} from './nightSky'
import {SceneBuilder, SceneLayer} from './shared'

const createSun = (): SceneLayer => ({
    resize: () => {},
    draw: (
        canvasDrawingContext,
        width,
        height,
        _secondsSinceLastDrawedFrame,
        time,
    ) => {
        const centerX = width * 0.82
        const centerY = height * 0.14
        const pulse = 1 + 0.04 * Math.sin(time * 0.6)
        const radius = Math.min(width, height) * 0.55 * pulse

        const glow = canvasDrawingContext.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius,
        )
        glow.addColorStop(0, 'rgba(255,226,140,0.6)')
        glow.addColorStop(0.35, 'rgba(255,236,179,0.25)')
        glow.addColorStop(1, 'rgba(255,236,179,0)')
        canvasDrawingContext.fillStyle = glow
        canvasDrawingContext.fillRect(0, 0, width, height)

        const rayLength = radius * 1.5
        const rays = canvasDrawingContext.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            rayLength,
        )
        rays.addColorStop(0, 'rgba(255,236,179,0.22)')
        rays.addColorStop(1, 'rgba(255,236,179,0)')
        canvasDrawingContext.save()
        canvasDrawingContext.translate(centerX, centerY)
        canvasDrawingContext.rotate(time * 0.03)
        canvasDrawingContext.translate(-centerX, -centerY)
        canvasDrawingContext.fillStyle = rays
        canvasDrawingContext.beginPath()
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12
            canvasDrawingContext.moveTo(centerX, centerY)
            canvasDrawingContext.arc(
                centerX,
                centerY,
                rayLength,
                angle - 0.035,
                angle + 0.035,
            )
        }
        canvasDrawingContext.fill()
        canvasDrawingContext.restore()
    },
})

export const clearScene: SceneBuilder = ({palette, isNight}) => [
    ...(isNight
        ? [
              createStars({density: 5000}),
              createMoon({showDisc: true, glow: 1}),
          ]
        : [createSun()]),
    createClouds({
        ...palette.lightClouds,
        count: 4,
        band: [0.15, 0.55],
        scale: [0.5, 0.8],
        speed: [6, 12],
    }),
]
