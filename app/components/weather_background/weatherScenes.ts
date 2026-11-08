export type SceneName =
    | 'none'
    | 'clear'
    | 'clouds'
    | 'drizzle'
    | 'rain'
    | 'storm'
    | 'snow'
    | 'fog'

export interface SceneLayer {
    resize(width: number, height: number): void
    draw(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        dt: number,
        time: number,
    ): void
}

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

const rand = (min: number, max: number) => min + Math.random() * (max - min)
type Range = [number, number]

type RainOptions = {
    areaPerDrop: number
    length: Range
    speed: Range
    lineWidth: number
    color: string
    slant: number
}

const createRain = (o: RainOptions): SceneLayer => {
    type Drop = {x: number; y: number; length: number; speed: number}
    let drops: Drop[] = []
    let spawnMinX = 0
    let spawnMaxX = 0

    const respawn = (drop: Drop, height: number, anywhere: boolean) => {
        drop.x = rand(spawnMinX, spawnMaxX)
        drop.y = anywhere ? rand(-height, height) : rand(-120, -drop.length)
    }

    return {
        resize: (width, height) => {
            spawnMinX = Math.min(0, -o.slant * height)
            spawnMaxX = Math.max(width, width - o.slant * height)
            const count = Math.round((width * height) / o.areaPerDrop)
            drops = Array.from({length: count}, () => {
                const drop = {
                    x: 0,
                    y: 0,
                    length: rand(...o.length),
                    speed: rand(...o.speed),
                }
                respawn(drop, height, true)
                return drop
            })
        },
        draw: (ctx, _width, height, dt) => {
            ctx.strokeStyle = o.color
            ctx.lineWidth = o.lineWidth
            ctx.lineCap = 'round'
            ctx.beginPath()
            for (const d of drops) {
                d.y += d.speed * dt
                d.x += d.speed * o.slant * dt
                if (d.y - d.length > height) respawn(d, height, false)
                ctx.moveTo(d.x, d.y)
                ctx.lineTo(d.x - o.slant * d.length, d.y - d.length)
            }
            ctx.stroke()
        },
    }
}

type SnowOptions = {
    areaPerFlake: number
    radius: Range
    speed: Range
    sway: number
    color: string
}

const createSnow = (o: SnowOptions): SceneLayer => {
    type Flake = {
        x: number
        y: number
        r: number
        speed: number
        phase: number
        frequency: number
    }
    let flakes: Flake[] = []

    return {
        resize: (width, height) => {
            const count = Math.round((width * height) / o.areaPerFlake)
            flakes = Array.from({length: count}, () => ({
                x: rand(0, width),
                y: rand(-height, height),
                r: rand(...o.radius),
                speed: rand(...o.speed),
                phase: rand(0, Math.PI * 2),
                frequency: rand(0.4, 1.1),
            }))
        },
        draw: (ctx, width, height, dt) => {
            ctx.fillStyle = o.color
            ctx.beginPath()
            for (const f of flakes) {
                f.y += f.speed * dt
                f.phase += f.frequency * dt
                if (f.y - f.r > height) {
                    f.y = -f.r - rand(0, 40)
                    f.x = rand(0, width)
                }
                const x = f.x + Math.sin(f.phase) * o.sway
                ctx.moveTo(x + f.r, f.y)
                ctx.arc(x, f.y, f.r, 0, Math.PI * 2)
            }
            ctx.fill()
        },
    }
}

type CloudPalette = {
    rgb: string
    alpha: number
    shadeRgb: string
    shadeAlpha: number
}

type CloudOptions = CloudPalette & {
    count: number
    band: Range
    scale: Range
    speed: Range
}

const createClouds = (o: CloudOptions): SceneLayer => {
    type Puff = {dx: number; dy: number; r: number}
    type Cloud = {
        x: number
        y: number
        speed: number
        sprite: HTMLCanvasElement
        offsetX: number
        offsetY: number
    }
    let clouds: Cloud[] = []

    const makePuffs = (): Puff[] => {
        const count = Math.round(rand(6, 9))
        return Array.from({length: count}, (_, i) => ({
            dx: ((i / (count - 1)) * 2 - 1) * 95 + rand(-15, 15),
            dy: -Math.abs(rand(-30, 30)) + 10,
            r: rand(44, 76),
        }))
    }

    const fillPuff = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        r: number,
        rgb: string,
        alpha: number,
    ) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, `rgba(${rgb},${alpha})`)
        gradient.addColorStop(0.6, `rgba(${rgb},${alpha * 0.75})`)
        gradient.addColorStop(1, `rgba(${rgb},0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
    }

    const makeCloud = (width: number, height: number): Cloud => {
        const scale = rand(...o.scale)
        const puffs = makePuffs()
        const shadeDrop = 0.3
        const minX = Math.min(...puffs.map(p => p.dx - p.r)) * scale
        const maxX = Math.max(...puffs.map(p => p.dx + p.r)) * scale
        const minY = Math.min(...puffs.map(p => p.dy - p.r)) * scale
        const maxY =
            Math.max(...puffs.map(p => p.dy + p.r * (1 + shadeDrop))) * scale

        const sprite = document.createElement('canvas')
        sprite.width = Math.ceil(maxX - minX)
        sprite.height = Math.ceil(maxY - minY)
        const sctx = sprite.getContext('2d')
        if (sctx) {
            sctx.translate(-minX, -minY)
            for (const p of puffs) {
                fillPuff(
                    sctx,
                    p.dx * scale,
                    (p.dy + p.r * shadeDrop) * scale,
                    p.r * scale,
                    o.shadeRgb,
                    o.shadeAlpha,
                )
            }
            for (const p of puffs) {
                fillPuff(
                    sctx,
                    p.dx * scale,
                    p.dy * scale,
                    p.r * scale,
                    o.rgb,
                    o.alpha,
                )
            }
        }
        return {
            x: rand(-maxX, width - minX),
            y: rand(...o.band) * height,
            speed: rand(...o.speed),
            sprite,
            offsetX: minX,
            offsetY: minY,
        }
    }

    return {
        resize: (width, height) => {
            clouds = Array.from({length: o.count}, () =>
                makeCloud(width, height),
            )
        },
        draw: (ctx, width, _height, dt) => {
            for (const c of clouds) {
                c.x += c.speed * dt
                if (c.x + c.offsetX > width) c.x = -(c.offsetX + c.sprite.width)
                ctx.drawImage(c.sprite, c.x + c.offsetX, c.y + c.offsetY)
            }
        },
    }
}

const createSun = (): SceneLayer => ({
    resize: () => {},
    draw: (ctx, width, height, _dt, time) => {
        const cx = width * 0.82
        const cy = height * 0.14
        const pulse = 1 + 0.04 * Math.sin(time * 0.6)
        const radius = Math.min(width, height) * 0.55 * pulse

        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        glow.addColorStop(0, 'rgba(255,226,140,0.6)')
        glow.addColorStop(0.35, 'rgba(255,236,179,0.25)')
        glow.addColorStop(1, 'rgba(255,236,179,0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, width, height)

        const rayLength = radius * 1.5
        const rays = ctx.createRadialGradient(cx, cy, 0, cx, cy, rayLength)
        rays.addColorStop(0, 'rgba(255,236,179,0.22)')
        rays.addColorStop(1, 'rgba(255,236,179,0)')
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(time * 0.03)
        ctx.translate(-cx, -cy)
        ctx.fillStyle = rays
        ctx.beginPath()
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12
            ctx.moveTo(cx, cy)
            ctx.arc(cx, cy, rayLength, angle - 0.035, angle + 0.035)
        }
        ctx.fill()
        ctx.restore()
    },
})

type MoonOptions = {
    showDisc: boolean
    glow: number
}

const createMoon = (o: MoonOptions): SceneLayer => {
    const craters = [
        {x: -0.3, y: -0.2, r: 0.22},
        {x: 0.25, y: 0.15, r: 0.16},
        {x: -0.05, y: 0.4, r: 0.12},
        {x: 0.35, y: -0.35, r: 0.09},
    ]
    return {
        resize: () => {},
        draw: (ctx, width, height, _dt, time) => {
            const cx = width * 0.8
            const cy = height * 0.17
            const moonR = Math.max(22, Math.min(44, Math.min(width, height) * 0.045))

            const reach = Math.min(width, height) * 0.75 * (1 + 0.03 * Math.sin(time * 0.5))
            const light = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach)
            light.addColorStop(0, `rgba(226,232,255,${0.32 * o.glow})`)
            light.addColorStop(0.25, `rgba(191,205,240,${0.14 * o.glow})`)
            light.addColorStop(1, 'rgba(191,205,240,0)')
            ctx.fillStyle = light
            ctx.fillRect(0, 0, width, height)
            if (!o.showDisc) return

            const halo = ctx.createRadialGradient(cx, cy, moonR * 0.8, cx, cy, moonR * 3.2)
            halo.addColorStop(0, 'rgba(241,245,255,0.45)')
            halo.addColorStop(1, 'rgba(241,245,255,0)')
            ctx.fillStyle = halo
            ctx.beginPath()
            ctx.arc(cx, cy, moonR * 3.2, 0, Math.PI * 2)
            ctx.fill()

            const disc = ctx.createRadialGradient(
                cx - moonR * 0.35, cy - moonR * 0.35, moonR * 0.1,
                cx, cy, moonR,
            )
            disc.addColorStop(0, '#FDFDF8')
            disc.addColorStop(1, '#DCE3EE')
            ctx.fillStyle = disc
            ctx.beginPath()
            ctx.arc(cx, cy, moonR, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = 'rgba(148,163,184,0.22)'
            ctx.beginPath()
            for (const c of craters) {
                const x = cx + c.x * moonR
                const y = cy + c.y * moonR
                ctx.moveTo(x + c.r * moonR, y)
                ctx.arc(x, y, c.r * moonR, 0, Math.PI * 2)
            }
            ctx.fill()
        },
    }
}

const createStars = ({density}: {density: number}): SceneLayer => {
    type Star = {x: number; y: number; r: number; phase: number; speed: number}
    let stars: Star[] = []
    return {
        resize: (width, height) => {
            const count = Math.round((width * height) / density)
            stars = Array.from({length: count}, () => ({
                x: rand(0, width),
                y: Math.pow(Math.random(), 1.6) * height * 0.85,
                r: rand(0.5, 1.4),
                phase: rand(0, Math.PI * 2),
                speed: rand(0.6, 1.8),
            }))
        },
        draw: (ctx, _width, _height, _dt, time) => {
            ctx.fillStyle = '#F8FAFC'
            for (const s of stars) {
                ctx.globalAlpha = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase))
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.globalAlpha = 1
        },
    }
}

type FogOptions = {
    rgb: string
    alpha: number
    shadeRgb: string
    shadeAlpha: number
}

const FOG_THICKNESS = 0.8
const FOG_SHADOW_DROP = 0.5

const createFog = (o: FogOptions): SceneLayer => {
    const bands = Array.from({length: 8}, (_, i) => ({
        y: 0.1 + i * 0.12 + rand(-0.04, 0.04),
        speed: rand(0.36, 0.7),
        phase: rand(0, Math.PI * 2),
        strength: rand(0.7, 1),
    }))

    const fillBand = (
        ctx: CanvasRenderingContext2D,
        radius: number,
        rgb: string,
        alpha: number,
    ) => {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
        gradient.addColorStop(0, `rgba(${rgb},${alpha})`)
        gradient.addColorStop(1, `rgba(${rgb},0)`)
        ctx.fillStyle = gradient
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2)
    }

    return {
        resize: () => {},
        draw: (ctx, width, height, _dt, time) => {
            const radius = height * 0.16
            const stretch = (width / radius) * 0.55
            for (const b of bands) {
                const x =
                    width / 2 +
                    Math.sin(time * b.speed + b.phase) * width * 0.25
                ctx.save()
                ctx.translate(x, b.y * height)
                ctx.scale(stretch, FOG_THICKNESS)
                ctx.translate(0, radius * FOG_SHADOW_DROP)
                fillBand(ctx, radius, o.shadeRgb, o.shadeAlpha * b.strength)
                ctx.translate(0, -radius * FOG_SHADOW_DROP)
                fillBand(ctx, radius, o.rgb, o.alpha * b.strength)
                ctx.restore()
            }
        },
    }
}

const createLightning = ({maxAlpha}: {maxAlpha: number}): SceneLayer => {
    let nextStrike = rand(2, 5)
    let strikeStart = -Infinity

    return {
        resize: () => {},
        draw: (ctx, width, height, _dt, time) => {
            if (time >= nextStrike) {
                strikeStart = time
                nextStrike = time + rand(5, 11)
            }
            const t = time - strikeStart
            if (t > 0.8) return
            let alpha = maxAlpha * Math.exp(-t / 0.08)
            if (t > 0.16) alpha += maxAlpha * 0.7 * Math.exp(-(t - 0.16) / 0.12)
            ctx.fillStyle = `rgba(255,255,255,${alpha})`
            ctx.fillRect(0, 0, width, height)
        },
    }
}

const PALETTES = {
    day: {
        lightClouds: {rgb: '255,255,255', alpha: 0.92, shadeRgb: '100,116,139', shadeAlpha: 0.0275},
        greyClouds: {rgb: '241,245,249', alpha: 0.9, shadeRgb: '71,85,105', shadeAlpha: 0.0375},
        stormClouds: {rgb: '148,163,184', alpha: 0.75, shadeRgb: '51,65,85', shadeAlpha: 0.044},
        rain: (alpha: number) => `rgba(30,58,138,${alpha})`,
        stormRain: (alpha: number) => `rgba(30,41,59,${alpha})`,
        fog: {rgb: '255,255,255', alpha: 0.5, shadeRgb: '100,116,139', shadeAlpha: 0.264},
    },
    night: {
        lightClouds: {rgb: '100,116,139', alpha: 0.35, shadeRgb: '2,6,23', shadeAlpha: 0.044},
        greyClouds: {rgb: '71,85,105', alpha: 0.42, shadeRgb: '2,6,23', shadeAlpha: 0.05},
        stormClouds: {rgb: '51,65,85', alpha: 0.5, shadeRgb: '2,6,23', shadeAlpha: 0.056},
        rain: (alpha: number) => `rgba(203,213,225,${alpha})`,
        stormRain: (alpha: number) => `rgba(203,213,225,${alpha})`,
        fog: {rgb: '148,163,184', alpha: 0.3, shadeRgb: '2,6,23', shadeAlpha: 0.2},
    },
}

type Palette = (typeof PALETTES)[keyof typeof PALETTES]

type SceneBuilder = (options: {p: Palette; isNight: boolean}) => SceneLayer[]

// A faint moon glow behind the clouds, only at night
const nightGlow = (isNight: boolean, glow: number): SceneLayer[] =>
    isNight ? [createMoon({showDisc: false, glow})] : []

const SCENE_BUILDERS: Record<SceneName, SceneBuilder> = {
    none: () => [],
    clear: ({p, isNight}) => [
        ...(isNight
            ? [createStars({density: 5000}), createMoon({showDisc: true, glow: 1})]
            : [createSun()]),
        createClouds({
            ...p.lightClouds,
            count: 4,
            band: [0.15, 0.55],
            scale: [0.5, 0.8],
            speed: [6, 12],
        }),
    ],
    clouds: ({p, isNight}) => [
        ...(isNight
            ? [createStars({density: 14000}), createMoon({showDisc: true, glow: 0.8})]
            : []),
        createClouds({
            ...p.lightClouds,
            count: 14,
            band: [0, 0.8],
            scale: [0.7, 1.4],
            speed: [8, 20],
        }),
    ],
    drizzle: ({p, isNight}) => [
        ...nightGlow(isNight, 0.6),
        createClouds({
            ...p.greyClouds,
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
            color: p.rain(0.24),
            slant: 0.08,
        }),
    ],
    rain: ({p, isNight}) => [
        ...nightGlow(isNight, 0.45),
        createClouds({
            ...p.greyClouds,
            count: 9,
            band: [-0.05, 0.4],
            scale: [1, 1.6],
            speed: [8, 16],
        }),
        createRain({
            areaPerDrop: 9000,
            length: [12, 20],
            speed: [600, 800],
            lineWidth: 1,
            color: p.rain(0.18),
            slant: 0.12,
        }),
        createRain({
            areaPerDrop: 22000,
            length: [20, 32],
            speed: [900, 1200],
            lineWidth: 1.5,
            color: p.rain(0.32),
            slant: 0.12,
        }),
    ],
    storm: ({p, isNight}) => [
        ...nightGlow(isNight, 0.3),
        createClouds({
            ...p.stormClouds,
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
            color: p.stormRain(0.2),
            slant: 0.22,
        }),
        createRain({
            areaPerDrop: 14000,
            length: [24, 38],
            speed: [1100, 1400],
            lineWidth: 1.5,
            color: p.stormRain(0.32),
            slant: 0.22,
        }),
    ],
    snow: ({p, isNight}) => [
        ...nightGlow(isNight, 0.7),
        createClouds({
            ...p.greyClouds,
            count: 8,
            band: [-0.05, 0.4],
            scale: [1, 1.6],
            speed: [5, 10],
        }),
        createSnow({
            areaPerFlake: 9000,
            radius: [1, 2],
            speed: [20, 40],
            sway: 10,
            color: 'rgba(255,255,255,0.75)',
        }),
        createSnow({
            areaPerFlake: 25000,
            radius: [2.5, 4],
            speed: [45, 75],
            sway: 22,
            color: 'rgba(255,255,255,0.95)',
        }),
    ],
    fog: ({p, isNight}) => [...nightGlow(isNight, 0.6), createFog(p.fog)],
}

export const createScene = (
    scene: SceneName,
    {isNight}: {isNight: boolean},
): SceneLayer[] =>
    SCENE_BUILDERS[scene]({
        p: isNight ? PALETTES.night : PALETTES.day,
        isNight,
    })
