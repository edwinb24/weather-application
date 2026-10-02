import HomeContent from '@/components/home_content/HomeContent'
import styles from './page.module.css'

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.titleMain}>Welcome to the Weather App</h1>
                <HomeContent />
            </main>
        </div>
    )
}
