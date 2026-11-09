'use client'
import {MAX_FRAME_SECONDS} from '@/utils/constants'
import gsap from 'gsap'
import {useEffect, useRef} from 'react'
import styles from './weatherBackground.module.css'
import {createScene, getSceneName, getSkyTint} from './weatherScenes'

type WeatherBackgroundProps = {
    weatherMain: string
    weatherIcon: string
}

const WeatherBackground = ({
    weatherMain,
    weatherIcon,
}: WeatherBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sceneName = getSceneName(weatherMain)
    const isNight = sceneName !== 'none' && weatherIcon.endsWith('n')

    useEffect(() => {
        document.documentElement.toggleAttribute('data-night', isNight)
    }, [isNight])

    useEffect(() => {
        const canvas = canvasRef.current
        const canvasDrawingContext = canvas?.getContext('2d')
        if (!canvas || !canvasDrawingContext) return

        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches
        const layers = createScene(sceneName, {isNight})

        let width = 0
        let height = 0
        let elapsed = 0

        const render = (secondsSinceLastDrawedFrame: number) => {
            elapsed += secondsSinceLastDrawedFrame
            canvasDrawingContext.clearRect(0, 0, width, height)
            for (const layer of layers) {
                layer.draw(
                    canvasDrawingContext,
                    width,
                    height,
                    secondsSinceLastDrawedFrame,
                    elapsed,
                )
            }
        }
        const resize = () => {
            const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = Math.round(width * devicePixelRatio)
            canvas.height = Math.round(height * devicePixelRatio)
            canvasDrawingContext.setTransform(
                devicePixelRatio,
                0,
                0,
                devicePixelRatio,
                0,
                0,
            )
            for (const layer of layers) layer.resize(width, height)
            if (reduceMotion) render(0)
        }
        const tick = (_: number, timeSincePreviousFrame: number) =>
            render(Math.min(timeSincePreviousFrame / 1000, MAX_FRAME_SECONDS))

        resize()
        window.addEventListener('resize', resize)
        gsap.fromTo(
            canvas,
            {opacity: 0},
            {opacity: 1, duration: 1.2, ease: 'power1.out'},
        )

        const animate = layers.length > 0 && !reduceMotion
        if (animate) gsap.ticker.add(tick)
        else render(0)

        return () => {
            window.removeEventListener('resize', resize)
            if (animate) gsap.ticker.remove(tick)
            gsap.killTweensOf(canvas)
        }
    }, [sceneName, isNight])

    return (
        <div
            className={styles.layer}
            style={{backgroundColor: getSkyTint(sceneName, isNight)}}
            aria-hidden='true'
        >
            <canvas ref={canvasRef} className={styles.canvas} />
        </div>
    )
}

export default WeatherBackground
