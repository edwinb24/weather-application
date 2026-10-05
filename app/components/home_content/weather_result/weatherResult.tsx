import {DisplayWeatherResult} from '@/sharedTypes'
import {WEATHER_ICON_URL} from '@/utils/constants'
import Image from 'next/image'
import styles from './weatherResult.module.css'

export default function WeatherResult({
    weatherMain,
    weatherDescription,
    temperature,
    weatherIcon,
    location,
}: DisplayWeatherResult) {
    return (
        <div className={styles.weatherInfoWrapper}>
            <p>{`${weatherDescription} at ${location} right now.`}</p>
            <div className={styles.weatherInfo}>
                <div className={styles.weatherDetails}>
                    <p className={styles.weatherMain}>{weatherMain}</p>
                    <p className={styles.temperature}>{temperature}°F</p>
                </div>
                <Image
                    src={`${WEATHER_ICON_URL}${weatherIcon}.png`}
                    alt={`icon of ${weatherMain}`}
                    className={styles.weatherIconImage}
                    width={200}
                    height={200}
                />
            </div>
        </div>
    )
}
