import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
  BoltIcon,
  ComputerDesktopIcon,
  InboxStackIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon, MicrophoneIcon } from '@heroicons/react/24/solid';
import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import Icon from '../components/atoms/Icon';

export const meta: MetaFunction = () => {
  return [
    { title: 'Youtube' },
    {
      name: 'Youtube',
      content: 'This will try to replicate some stuff from Youtube!',
    },
  ];
};

export default function Index() {
  return (
    <main className="bg-dark-950 h-screen w-screen">
      <header className="px-6 flex justify-between items-center pr-3">
        <div className="flex items-center py-2">
          <div className="mr-6">
            <Bars3Icon className="h-10 w-6 text-white" />
          </div>
          <Link to="/">
            <Icon name="youtube" className="w-24 h-6" />
          </Link>
        </div>
        <div>
          <form action="" className="flex ">
            <input
              type="text"
              name="search"
              id="search"
              role="searchbox"
              className="rounded-s-3xl px-3 py-1 bg-dark-900 border-dark-850 border placeholder:text-dark-800/50 text-dark-800/90"
              placeholder="Buscar"
            />
            <button type="submit" className="rounded-e-lg p-4 py-2 bg-dark-800" aria-label="Buscar">
              <MagnifyingGlassIcon className="w-5 h-5 text-white " />
            </button>
            <button type="button" className="ml-5 rounded-full p-3 bg-dark-800 hover:bg-dark-800/20">
              <MicrophoneIcon className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>
        <div className="text-white flex gap-4">
          <div>
            <Icon name="verticalDots" className="fill-current  w-6 h-8 cursor-pointer" />
          </div>
          <Link
            to="/login"
            className="flex gap-2 border border-dark-850 rounded-lg px-4 pl-2 py-1 text-blue-400 hover:bg-blue-400/30"
          >
            <UserCircleIcon className="h-6 w-6 " />
            Iniciar sesión
          </Link>
        </div>
      </header>
      <div>
        <aside className="max-w-20">
          <ul className="text-white text-[0.65rem] w-18 px-5">
            <li className="text-center flex flex-col items-center justify-center rounded-lg my-6">
              <HomeIcon className="w-6 h-6 mb-1" />
              Inicio
            </li>
            <li className="text-center flex flex-col items-center justify-center rounded-lg my-6">
              <BoltIcon className="w-6 h-6 mb-1" />
              Shorts
            </li>
            <li className="text-center flex flex-col items-center justify-center rounded-lg my-6">
              <ComputerDesktopIcon className="w-6 h-6 mb-1" />
              Suscripciones
            </li>
            <li className="text-center flex flex-col items-center justify-center rounded-lg my-6">
              <InboxStackIcon className="w-6 h-6 mb-1" />
              Tú
            </li>
            <li className="text-center flex flex-col items-center justify-center rounded-lg my-6">
              <ArrowUturnLeftIcon className="w-6 h-6 mb-1" />
              Historial
            </li>
          </ul>
        </aside>
        <section></section>
      </div>
    </main>
  );
}
