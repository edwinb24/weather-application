'use client'
import gsap from 'gsap'
import {useEffect, useRef} from 'react'
import styles from './cursorLight.module.css'

const CursorLight = () => {
    const lightRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const light = lightRef.current
        if (!light) return

        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches
        // how often we get the mouse position, basically our framerate
        const followDuration = reduceMotion ? 0 : 0.08

        gsap.set(light, {xPercent: -50, yPercent: -50, opacity: 0})
        const moveX = gsap.quickTo(light, 'x', {
            duration: followDuration,
            ease: 'power2',
        })
        const moveY = gsap.quickTo(light, 'y', {
            duration: followDuration,
            ease: 'power2',
        })

        let isVisible = false
        const show = (visible: boolean) => {
            if (visible === isVisible) return
            isVisible = visible
            gsap.to(light, {
                //prevent jumping of when the light left the screen to the new location
                opacity: visible ? 1 : 0,
                //Quarter of a sec fade for the light when we have it in a new pos
                duration: 0.25,
                //kill the opacity of the other, so we don't see it moving around to new pos
                overwrite: 'auto',
            })
        }

        const handlePointerMove = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return
            if (!isVisible) gsap.set(light, {x: e.clientX, y: e.clientY})
            moveX(e.clientX)
            moveY(e.clientY)
            show(true)
        }
        const handlePointerLeave = () => show(false)

        window.addEventListener('pointermove', handlePointerMove)
        document.documentElement.addEventListener(
            'pointerleave',
            handlePointerLeave,
        )
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            document.documentElement.removeEventListener(
                'pointerleave',
                handlePointerLeave,
            )
            gsap.killTweensOf(light)
        }
    }, [])

    return <div ref={lightRef} className={styles.light} aria-hidden='true' />
}

export default CursorLight
