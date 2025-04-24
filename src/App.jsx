import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import About from './components/About';
import './App.css';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
    </>
  );
};

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PokemonList />
      },
      {
        path: 'pokemon/:name',
        element: <PokemonDetail />
      },
      {
        path: 'about',
        element: <About />
      }
    ]
  }
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
