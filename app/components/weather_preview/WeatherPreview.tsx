'use client'
import LiveIcon from '@/components/svgs/LiveIcon'
import NightIcon from '@/components/svgs/NightIcon'
import WeatherIcon from '@/components/weather_icon/WeatherIcon'
import {ReactNode, useEffect, useId, useRef, useState} from 'react'
import styles from './weatherPreview.module.css'

export type PreviewWeather = {weatherMain: string; weatherIcon: string}

const OPTIONS = [
    'Clear',
    'Clouds',
    'Drizzle',
    'Rain',
    'Thunderstorm',
    'Snow',
    'Fog',
] as const

const ICON_SIZE = 26

const iconCode = (isNight: boolean) => (isNight ? '01n' : '01d')

type OptionButtonProps = {
    label: string
    isPressed: boolean
    onClick: () => void
    children: ReactNode
}

const OptionButton = ({label, isPressed, onClick, children}: OptionButtonProps) => (
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
    value: PreviewWeather | null
    onChange: (weather: PreviewWeather | null) => void
}

const WeatherPreview = ({value, onChange}: WeatherPreviewProps) => {
    const [isNight, setIsNight] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const toggleRef = useRef<HTMLButtonElement>(null)
    const panelId = useId()
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
        const night = !isNight
        setIsNight(night)
        if (selected) {
            onChange({weatherMain: selected, weatherIcon: iconCode(night)})
        }
    }

    return (
        <div ref={rootRef} className={styles.preview}>
            <button
                ref={toggleRef}
                type='button'
                className={styles.drawerToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label={`Weather preview: ${selected ?? 'Live'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected ? (
                    <WeatherIcon
                        weatherMain={selected}
                        weatherIcon={iconCode(isNight)}
                        size={ICON_SIZE}
                    />
                ) : (
                    <LiveIcon />
                )}
            </button>
            <div
                id={panelId}
                className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
                role='group'
                aria-label='Weather preview'
            >
                <span className={styles.label}>Preview</span>
                <OptionButton
                    label='Live'
                    isPressed={selected === null}
                    onClick={() => select(null)}
                >
                    <LiveIcon />
                </OptionButton>
                {OPTIONS.map(option => (
                    <OptionButton
                        key={option}
                        label={option}
                        isPressed={selected === option}
                        onClick={() => select(option)}
                    >
                        <WeatherIcon
                            weatherMain={option}
                            weatherIcon={iconCode(isNight)}
                            size={ICON_SIZE}
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
