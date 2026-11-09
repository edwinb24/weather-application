export interface SceneLayer {
    resize(width: number, height: number): void
    draw(
        canvasDrawingContext: CanvasRenderingContext2D,
        width: number,
        height: number,
        secondsSinceLastDrawedFrame: number,
        time: number,
    ): void
}

export type Range = [number, number]

export const randomBetween = (min: number, max: number) =>
    min + Math.random() * (max - min)

export const PALETTES = {
    day: {
        lightClouds: {
            rgb: '255,255,255',
            alpha: 0.92,
            shadeRgb: '100,116,139',
            shadeAlpha: 0.0275,
        },
        greyClouds: {
            rgb: '241,245,249',
            alpha: 0.9,
            shadeRgb: '71,85,105',
            shadeAlpha: 0.0375,
        },
        stormClouds: {
            rgb: '148,163,184',
            alpha: 0.75,
            shadeRgb: '51,65,85',
            shadeAlpha: 0.044,
        },
        rain: (alpha: number) => `rgba(30,58,138,${alpha})`,
        stormRain: (alpha: number) => `rgba(30,41,59,${alpha})`,
        fog: {
            rgb: '255,255,255',
            alpha: 0.5,
            shadeRgb: '100,116,139',
            shadeAlpha: 0.264,
        },
    },
    night: {
        lightClouds: {
            rgb: '100,116,139',
            alpha: 0.35,
            shadeRgb: '2,6,23',
            shadeAlpha: 0.044,
        },
        greyClouds: {
            rgb: '71,85,105',
            alpha: 0.42,
            shadeRgb: '2,6,23',
            shadeAlpha: 0.05,
        },
        stormClouds: {
            rgb: '51,65,85',
            alpha: 0.5,
            shadeRgb: '2,6,23',
            shadeAlpha: 0.056,
        },
        rain: (alpha: number) => `rgba(203,213,225,${alpha})`,
        stormRain: (alpha: number) => `rgba(203,213,225,${alpha})`,
        fog: {
            rgb: '148,163,184',
            alpha: 0.3,
            shadeRgb: '2,6,23',
            shadeAlpha: 0.2,
        },
    },
}

export type Palette = (typeof PALETTES)[keyof typeof PALETTES]

export type SceneBuilder = (options: {
    palette: Palette
    isNight: boolean
}) => SceneLayer[]
