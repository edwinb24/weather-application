import LocationPinIcon from '@/assets/svgs/LocationPinIcon'
import WeatherIcon from '@/components/weather_icon/WeatherIcon'
import {DisplayWeatherResult} from '@/sharedTypes'
import styles from './weatherResult.module.css'

const WeatherResult = ({
    weatherMain,
    weatherDescription,
    temperature,
    weatherIcon,
    location,
}: DisplayWeatherResult) => {
    return (
        <article className={styles.weatherCard}>
            <div className={styles.weatherDetails}>
                <p className={styles.location}>
                    <LocationPinIcon size={16} />
                    {location}
                </p>
                <p className={styles.temperature}>
                    {temperature}°<span className={styles.unit}>F</span>
                </p>
                <p className={styles.condition}>
                    <span className={styles.weatherMain}>{weatherMain}</span>
                    <span className={styles.description}>
                        {weatherDescription} right now
                    </span>
                </p>
            </div>
            <div className={styles.iconCircle}>
                <WeatherIcon
                    weatherMain={weatherMain}
                    weatherIcon={weatherIcon}
                />
            </div>
        </article>
    )
}

export default WeatherResult
