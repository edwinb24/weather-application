import {createClouds} from './clouds'
import {nightGlow} from './nightSky'
import {createRain} from './rain'
import {SceneBuilder} from './shared'

export const drizzleScene: SceneBuilder = ({palette, isNight}) => [
    ...nightGlow(isNight, 0.6),
    createClouds({
        ...palette.greyClouds,
        count: 8,
        band: [-0.05, 0.4],
        scale: [0.9, 1.5],
        speed: [6, 14],
    }),
    createRain({
        areaPerDrop: 14000,
        length: [8, 14],
        speed: [350, 500],
        lineWidth: 1,
        color: palette.rain(0.24),
        slant: 0.08,
    }),
]
