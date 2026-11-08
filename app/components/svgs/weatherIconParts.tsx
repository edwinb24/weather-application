// SVG pieces that WeatherIcon combines inside its 64×64 <svg> frame.

const CLOUD_PATH =
    'M20 40h26a10 10 0 0 0 0-20 14 14 0 0 0-27-2A11 11 0 0 0 20 40z'

const SUN_RAYS = Array.from({length: 8}, (_, i) => {
    const angle = (i * Math.PI) / 4
    const point = (r: number) => [
        (32 + r * Math.cos(angle)).toFixed(2),
        (32 + r * Math.sin(angle)).toFixed(2),
    ]
    const [x1, y1] = point(18)
    const [x2, y2] = point(24)
    return `M${x1} ${y1}L${x2} ${y2}`
}).join('')

export const Sun = () => (
    <>
        <circle cx='32' cy='32' r='12' fill='#FDE68A' stroke='#F59E0B' />
        <path d={SUN_RAYS} stroke='#F59E0B' />
    </>
)

export const Moon = () => (
    <path
        d='M44 38a16 16 0 1 1-16-24 12.5 12.5 0 0 0 16 24z'
        fill='#E0E7FF'
        stroke='#6366F1'
    />
)

export const Cloud = ({stroke = '#60A5FA'}: {stroke?: string}) => (
    <path d={CLOUD_PATH} fill='#FFFFFF' stroke={stroke} />
)

export const PeekingSky = ({isNight}: {isNight: boolean}) =>
    isNight ? (
        <g transform='translate(26 -8) scale(0.55)'>
            <Moon />
        </g>
    ) : (
        <circle cx='42' cy='20' r='8' fill='#FDE68A' stroke='#F59E0B' />
    )

export const DrizzleDrops = () => (
    <path d='M26 48l-1.5 4M38 48l-1.5 4' stroke='#3B82F6' />
)

export const RainDrops = () => (
    <path d='M24 48l-3 7M34 48l-3 7M44 48l-3 7' stroke='#3B82F6' />
)

export const LightningBolt = () => (
    <path
        d='M34 42l-6 10h6l-4 9 10-13h-6l4-6z'
        fill='#FACC15'
        stroke='#CA8A04'
        strokeWidth='1.5'
    />
)

export const Snowflakes = () => (
    <g fill='#93C5FD' stroke='none'>
        <circle cx='24' cy='50' r='2.2' />
        <circle cx='34' cy='54' r='2.2' />
        <circle cx='44' cy='50' r='2.2' />
        <circle cx='29' cy='60' r='2.2' />
        <circle cx='39' cy='60' r='2.2' />
    </g>
)

export const FogLines = () => (
    <path d='M12 22h40M16 32h32M10 42h44M18 52h28' stroke='#94A3B8' />
)
