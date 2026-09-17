import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import WatchlistScreen from './screens/WatchlistScreen';
import DetailScreen from './screens/DetailScreen';
import PlayerScreen from './screens/PlayerScreen';
import ExploreScreen from './screens/ExploreScreen';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-hmdbd-dark text-white pb-16 md:pb-0 pt-[116px] md:pt-[116px]">
        <Navigation />
        <main className="flex-1 w-full max-w-7xl mx-auto overflow-x-hidden min-h-[calc(100vh-116px)]">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/explore/:category" element={<ExploreScreen />} />
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
