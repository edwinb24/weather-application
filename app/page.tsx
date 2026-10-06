import HomeContent from '@/components/home_content/HomeContent'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import {OPENWEATHER_LINK} from './utils/constants'

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.titleMain}>Welcome to the Weather App</h1>
                <HomeContent />
            </main>
            <div className={styles.attribution}>
                <Image
                    src='./openweather-logo.png'
                    alt='Open Weather Icon'
                    width={75}
                    height={42}
                />
                <p>
                    Weather data provided by{' '}
                    <Link href={OPENWEATHER_LINK}>OpenWeather</Link>{' '}
                </p>
            </div>
        </div>
    )
}
