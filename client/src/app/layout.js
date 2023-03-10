import './globals.css'
import Header from "../components/Header"
import localFont from 'next/font/local'

const montserrat = localFont({
  src: [
    {
      path: '../../public/fonts/Montserrat-Black.ttf',
      weight: '400',
      style: 'Black',
    },
    {
      path: '../../public/fonts/Montserrat-Bold.ttf',
      weight: '700',
      style: 'Bold',
    },
    {
      path: '../../public/fonts/Montserrat-ExtraLight.ttf',
      weight: '200',
      style: 'ExtraLight',
    },
    {
      path: '../../public/fonts/Montserrat-Medium.ttf',
      weight: '400',
      style: 'Medium',
    },
    {
      path: '../../public/fonts/Montserrat-Regular.ttf',
      weight: '400',
      style: 'Regular',
    },
  ],
})


export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <header className="bg-white/30 fixed top-0 z-10 w-full"><Header/></header>
        {children}
        <footer>Footer</footer>
        </body>
    </html>
  )
}
