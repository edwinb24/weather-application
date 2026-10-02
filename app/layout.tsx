import type {Metadata} from 'next'
import './globals.css'
import './reset.css'

export const metadata: Metadata = {
    title: 'Weather App',
    description: 'App to get the weather in your location of choice',
}

export default function RootLayout({children}: LayoutProps<'/'>) {
    return (
        <html lang='en'>
            <body>{children}</body>
        </html>
    )
}
