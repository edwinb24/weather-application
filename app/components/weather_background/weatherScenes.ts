import {clearScene} from './weather_effects/clear'
import {cloudsScene} from './weather_effects/clouds'
import {drizzleScene} from './weather_effects/drizzle'
import {fogScene} from './weather_effects/fog'
import {rainScene} from './weather_effects/rain'
import {PALETTES, SceneBuilder, SceneLayer} from './weather_effects/shared'
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

const DAY_TINTS: Record<SceneName, string> = {
    none: '#DCEBFA',
    clear: '#DCEBFA',
    clouds: '#CFDBE8',
    drizzle: '#CBD7E4',
    rain: '#C3CFDD',
    storm: '#B3BDCD',
    snow: '#CCD8E6',
    fog: '#D6DCE2',
}
const NIGHT_TINTS: Record<SceneName, string> = {
    none: '#0B1630',
    clear: '#0B1630',
    clouds: '#131D33',
    drizzle: '#141E2E',
    rain: '#111A29',
    storm: '#0B111C',
    snow: '#1C283E',
    fog: '#1F2837',
}

export const getSkyTint = (scene: SceneName, isNight: boolean) =>
    (isNight ? NIGHT_TINTS : DAY_TINTS)[scene]

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
): SceneLayer[] =>
    SCENE_BUILDERS[scene]({
        palette: isNight ? PALETTES.night : PALETTES.day,
        isNight,
    })
