import type {Metadata} from 'next'
import {DM_Sans} from 'next/font/google'
import './globals.css'
import './reset.css'

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-sans',
})

export const metadata: Metadata = {
    title: 'Weather App',
    description: 'App to get the weather in your location of choice',
}

const RootLayout = ({children}: LayoutProps<'/'>) => {
    return (
        <html lang='en' className={dmSans.variable}>
            <body>{children}</body>
        </html>
    )
}

export default RootLayout
