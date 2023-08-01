import '../styles/App.sass';
import Header from '../components/header';
import MainPage from '../components/main';
/*
 * This is gonig to be a single page app to start with, and will essentially be just an  
 * MVP to see if this idea works.
 * 
 * I will use multiple components:
 *    First is an initial video input (Will turn into a carosel for multiple videos to    
 *    choose from)
 *    Second will be an input video option (With option later to use Webcam)
 *    Thrid is a comparison score output generator
 * */ 

function App() {
  return (
    <div className="App">
      <Header/>
      <MainPage/>
    </div>
  );
}

export default App;
