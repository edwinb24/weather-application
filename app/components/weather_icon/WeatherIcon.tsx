import {
    Cloud,
    DrizzleDrops,
    FogLines,
    LightningBolt,
    Moon,
    PeekingSky,
    RainDrops,
    Snowflakes,
    Sun,
} from '@/components/svgs/weatherIconParts'
import {
    getSceneName,
    SceneName,
} from '@/components/weather_background/weatherScenes'
import {ReactNode} from 'react'

type WeatherIconProps = {
    weatherMain: string
    weatherIcon: string
    size?: number
}

type IconArtOptions = {
    isNight: boolean
    isPartlyCloudy: boolean
}

const ICON_ART: Record<SceneName, (options: IconArtOptions) => ReactNode> = {
    none: () => <Cloud />,
    clear: ({isNight}) => (isNight ? <Moon /> : <Sun />),
    clouds: ({isNight, isPartlyCloudy}) => (
        <>
            {isPartlyCloudy && <PeekingSky isNight={isNight} />}
            <Cloud />
        </>
    ),
    drizzle: () => (
        <>
            <Cloud />
            <DrizzleDrops />
        </>
    ),
    rain: () => (
        <>
            <Cloud />
            <RainDrops />
        </>
    ),
    storm: () => (
        <>
            <Cloud stroke='#64748B' />
            <LightningBolt />
        </>
    ),
    snow: () => (
        <>
            <Cloud stroke='#93C5FD' />
            <Snowflakes />
        </>
    ),
    fog: () => <FogLines />,
}

const WeatherIcon = ({weatherMain, weatherIcon, size = 112}: WeatherIconProps) => {
    const scene = getSceneName(weatherMain)
    const isNight = weatherIcon.endsWith('n')
    const isPartlyCloudy = weatherIcon.startsWith('02')

    return (
        <svg
            width={size}
            height={size}
            viewBox='0 0 64 64'
            fill='none'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            role='img'
            aria-label={weatherMain || 'Weather'}
        >
            {ICON_ART[scene]({isNight, isPartlyCloudy})}
        </svg>
    )
}

export default WeatherIcon
