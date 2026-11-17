import {clearScene} from './weather_effects/clear'
import {cloudsScene} from './weather_effects/clouds'
import {drizzleScene} from './weather_effects/drizzle'
import {fogScene} from './weather_effects/fog'
import {rainScene} from './weather_effects/rain'
import type {SceneBuilder, SceneLayer} from './weather_effects/shared'
import {PALETTES} from './weather_effects/shared'
import {snowScene} from './weather_effects/snow'
import {thunderstormScene} from './weather_effects/thunderstorm'

export type SceneName =
    | 'none'
    | 'clear'
    | 'clouds'
    | 'drizzle'
    | 'rain'
    | 'storm'
    | 'snow'
    | 'fog'

// OpenWeather "main" condition (lowercased) → the scene that draws it
const SCENE_BY_WEATHER: Record<string, SceneName> = {
    clear: 'clear',
    clouds: 'clouds',
    drizzle: 'drizzle',
    rain: 'rain',
    thunderstorm: 'storm',
    squall: 'storm',
    tornado: 'storm',
    snow: 'snow',
    mist: 'fog',
    smoke: 'fog',
    haze: 'fog',
    dust: 'fog',
    fog: 'fog',
    sand: 'fog',
    ash: 'fog',
}

export const getSceneName = (weatherMain: string): SceneName => {
    const key = weatherMain.toLowerCase()
    // hasOwn ignores inherited keys like "constructor" or "toString"
    return Object.hasOwn(SCENE_BY_WEATHER, key) ? SCENE_BY_WEATHER[key] : 'none'
}

const SCENE_BUILDERS: Record<SceneName, SceneBuilder> = {
    none: () => [],
    clear: clearScene,
    clouds: cloudsScene,
    drizzle: drizzleScene,
    rain: rainScene,
    storm: thunderstormScene,
    snow: snowScene,
    fog: fogScene,
}

export const createScene = (
    scene: SceneName,
    {isNight}: {isNight: boolean},
): Array<SceneLayer> =>
    SCENE_BUILDERS[scene]({
        palette: isNight ? PALETTES.night : PALETTES.day,
        isNight,
    })
