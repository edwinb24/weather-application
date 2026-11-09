'use client'
import LiveIcon from '@/assets/svgs/LiveIcon'
import NightIcon from '@/assets/svgs/NightIcon'
import WeatherIcon from '@/components/weather_icon/WeatherIcon'
import {
    PREVIEW_WEATHER_ICONS_SIZE,
    PREVIEW_WEATHER_OPTIONS,
} from '@/utils/constants'
import {ReactNode, useEffect, useRef, useState} from 'react'
import styles from './weatherPreview.module.css'

const iconCode = (isNight: boolean) => (isNight ? '01n' : '01d')

type OptionButtonProps = {
    label: string
    isPressed: boolean
    onClick: () => void
    children: ReactNode
}

const OptionButton = ({
    label,
    isPressed,
    onClick,
    children,
}: OptionButtonProps) => (
    <button
        type='button'
        className={styles.option}
        aria-pressed={isPressed}
        aria-label={label}
        title={label}
        onClick={onClick}
    >
        {children}
    </button>
)

type WeatherPreviewProps = {
    value: {weatherMain: string; weatherIcon: string} | null
    onChange: (weather: {weatherMain: string; weatherIcon: string} | null) => void
}

const WeatherPreview = ({value, onChange}: WeatherPreviewProps) => {
    const [isNight, setIsNight] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const toggleRef = useRef<HTMLButtonElement>(null)
    const selected = value?.weatherMain ?? null

    useEffect(() => {
        if (!isOpen) return
        const handlePointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false)
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            setIsOpen(false)
            toggleRef.current?.focus()
        }
        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen])

    const select = (weatherMain: string | null) => {
        onChange(
            weatherMain ? {weatherMain, weatherIcon: iconCode(isNight)} : null,
        )
        setIsOpen(false)
    }

    const toggleNight = () => {
        setIsNight(!isNight)
        if (selected) {
            onChange({weatherMain: selected, weatherIcon: iconCode(!isNight)})
        }
    }

    return (
        <div ref={rootRef} className={styles.preview}>
            <button
                ref={toggleRef}
                type='button'
                className={styles.drawerToggle}
                aria-expanded={isOpen}
                aria-label={`Weather preview: ${selected ?? 'Live'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected ? (
                    <WeatherIcon
                        weatherMain={selected}
                        weatherIcon={iconCode(isNight)}
                        size={PREVIEW_WEATHER_ICONS_SIZE}
                    />
                ) : (
                    <LiveIcon />
                )}
            </button>
            <div
                className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
                role='group'
                aria-label='Weather preview'
            >
                <OptionButton
                    label='Live'
                    isPressed={selected === null}
                    onClick={() => select(null)}
                >
                    <LiveIcon />
                </OptionButton>
                {Object.values(PREVIEW_WEATHER_OPTIONS).map(option => (
                    <OptionButton
                        key={option}
                        label={option}
                        isPressed={selected === option}
                        onClick={() => select(option)}
                    >
                        <WeatherIcon
                            weatherMain={option}
                            weatherIcon={iconCode(isNight)}
                            size={PREVIEW_WEATHER_ICONS_SIZE}
                        />
                    </OptionButton>
                ))}
                <span className={styles.divider} aria-hidden='true' />
                <OptionButton
                    label='Night'
                    isPressed={isNight}
                    onClick={toggleNight}
                >
                    <NightIcon />
                </OptionButton>
            </div>
        </div>
    )
}

export default WeatherPreview
