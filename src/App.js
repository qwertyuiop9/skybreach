import './App.css';
import { getAdjacentPlots } from './components/Land';
import Landa from './components/Landa';
import { useEffect, useId, useRef, useState } from 'react';

// Deployment stuff
/*const path = require('path');
//const express = require('express');
//const app = express();
//const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
*/
// end deployment stuff

function App() {

  const [plotToWatch, setPlotToWatch] = useState(null);
  const [adjacentPlots, setAdjacentPlots] = useState([]);
  const inputXRef = useRef(95);
  const inputYRef = useRef(16);

  function handleClick() {
    console.log("X:" + inputXRef.current.value + " Y: " + inputYRef.current.value);
    const temp_x = parseInt(inputXRef.current.value);
    const temp_y = parseInt(inputYRef.current.value);
    const new_plot_id = temp_x + temp_y * 256;
    console.log("Plot to watch " + new_plot_id);
    setPlotToWatch(new_plot_id);
    console.log("Plot to watch " + plotToWatch);
  }

  useEffect(() => {

    if (inputXRef != null || inputYRef != null) {
      if (inputXRef.current.value != null && inputYRef.current.value != null) {
        setAdjacentPlots(getAdjacentPlots(plotToWatch));
      }
    }
  }, [plotToWatch]);


  return (
    <div className='container'>

      <h1 className='myTitle' id='adjacentLands'>Discover my neighbors price</h1>

      <div className='wrapper'>
        <h4>Land owned centered in:</h4>
        <div class="row">
          <div class="col">
            <div className='small_around_margin'>
              <input ref={inputXRef}
                type="text"
                id='messagex'
                name='messagex'
                placeholder='X coordinate:'
              /></div>
            <div className='small_around_margin'>
              <input ref={inputYRef}
                type="text"
                id='messagey'
                name='messagey'
                placeholder='Y coordinate:'
              /></div>
          </div>
        </div>
        <div className='small_margin'>
          <button class="btn btn-primary mb-2" onClick={handleClick}>Find my neighbours</button>
        </div>
      </div>
      <table class="table">
        <thead className='thead-dark'>
          <tr>
            <th scope="col">Land ID</th>
            <th scope="col">X</th>
            <th scope="col">Y</th>
            <th scope="col">Rarity</th>
            <th scope='col'>Owned by</th>
            <th scope='col'>Entropy</th>
            <th scope='col'>On sale</th>
            <th scope='col'>Actual price (RMRK)</th>
            <th scope='col'>BUY</th>
          </tr>
        </thead>
        <tbody>
          {
            adjacentPlots.map(land => (
              <Landa land_id={land.id} key={land.id} />
            ))
          }
        </tbody>
      </table>
    </div>
  );
}


export default App;