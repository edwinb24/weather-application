import {createClouds} from './clouds'
import {nightGlow} from './nightSky'
import {createRain} from './rain'
import {randomBetween, SceneBuilder, SceneLayer} from './shared'

const createLightning = ({maxAlpha}: {maxAlpha: number}): SceneLayer => {
    let nextStrike = randomBetween(2, 5)
    let strikeStart = -Infinity

    return {
        resize: () => {},
        draw: (
            canvasDrawingContext,
            width,
            height,
            _secondsSinceLastDrawedFrame,
            time,
        ) => {
            if (time >= nextStrike) {
                strikeStart = time
                nextStrike = time + randomBetween(5, 11)
            }
            const timeSinceStrike = time - strikeStart
            if (timeSinceStrike > 0.8) return
            let alpha = maxAlpha * Math.exp(-timeSinceStrike / 0.08)
            if (timeSinceStrike > 0.16) {
                alpha +=
                    maxAlpha * 0.7 * Math.exp(-(timeSinceStrike - 0.16) / 0.12)
            }
            canvasDrawingContext.fillStyle = `rgba(255,255,255,${alpha})`
            canvasDrawingContext.fillRect(0, 0, width, height)
        },
    }
}

export const thunderstormScene: SceneBuilder = ({palette, isNight}) => [
    ...nightGlow(isNight, 0.3),
    createClouds({
        ...palette.stormClouds,
        count: 10,
        band: [-0.05, 0.4],
        scale: [1.1, 1.7],
        speed: [14, 26],
    }),
    createLightning({maxAlpha: isNight ? 0.22 : 0.3}),
    createRain({
        areaPerDrop: 6000,
        length: [14, 24],
        speed: [800, 1000],
        lineWidth: 1,
        color: palette.stormRain(0.2),
        slant: 0.22,
    }),
    createRain({
        areaPerDrop: 14000,
        length: [24, 38],
        speed: [1100, 1400],
        lineWidth: 1.5,
        color: palette.stormRain(0.32),
        slant: 0.22,
    }),
]
