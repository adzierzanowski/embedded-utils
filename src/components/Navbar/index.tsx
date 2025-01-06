import { Link, useLocation } from "react-router"
import './Navbar.scss'

export const Navbar = () => {
  const location = useLocation()

  const links = [
    { to: '/', text: '⏚' },
    { to: '/fontmaker', text: 'Font Maker' },
    { to: '/timercalc', text: 'Timer Calc' },
    { to: '/segdisp', text: '7-seg Displays' },
    { to: '/hid', text: 'HID' },
  ]

  return (
    <nav id="navbar">
    {links.map(({to, text}) => (
      <Link
        key={to}
        to={to}
        className={location.pathname === to ? 'active' : ''}>
        {text}
      </Link>
    ))}
    </nav>
  )
}
