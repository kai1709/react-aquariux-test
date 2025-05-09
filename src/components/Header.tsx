import { Link } from '@tanstack/react-router'
import { MapPin, Search } from 'lucide-react'
import { useWeatherStore } from 'store'
import { State } from 'types'

const Header = () => {
  const location = useWeatherStore((state: State) => state.location)
  return (
    <div className="header flex items-center justify-center py-3">
      <div className="flex w-[350px]">
        <MapPin />
        <div className="flex-1 px-2">
          {location?.name}
          {location?.state ? `, ${location.state}` : ''}
        </div>
        <Link to="/search">
          <Search />
        </Link>
      </div>
    </div>
  )
}

export default Header
