import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import WatchlistScreen from './screens/WatchlistScreen';
import DetailScreen from './screens/DetailScreen';
import PlayerScreen from './screens/PlayerScreen';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-hmdbd-dark text-white pb-16 md:pb-0 md:pt-16">
        <Navigation />
        <main className="flex-1 w-full max-w-7xl mx-auto overflow-x-hidden min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/watchlist" element={<WatchlistScreen />} />
            <Route path="/:type/:id" element={<DetailScreen />} />
            <Route path="/play/:type/:id" element={<PlayerScreen />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
