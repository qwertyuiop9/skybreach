import './App.css';
import { getAdjacentPlots } from './components/Land';
import Landa from './components/Landa';
import { useEffect, useRef, useState } from 'react';

function App() {

  const [plotToWatch, setPlotToWatch] = useState(24439);
  const [adjacentPlots, setAdjacentPlots] = useState([]);
  const inputXRef = useRef(null);
  const inputYRef = useRef(null);

  function handleClick() {
    const temp_x = parseInt(inputXRef.current.value);
    const temp_y = parseInt(inputYRef.current.value);
    var new_plot_id = temp_x + temp_y * 256;
    setPlotToWatch(new_plot_id);
    console.log("plotToWatch= " + plotToWatch);
  }

  useEffect(() => {

    if (inputXRef != null || inputYRef != null) {
      if (inputXRef.current.value != null && inputYRef.current.value != null) {
        setAdjacentPlots(getAdjacentPlots(plotToWatch));
        console.log("Entrato in useEffectc()");
      }
    }
  }, [plotToWatch]);


  return (
    <div className='container'>
      <div class="p-3 mb-2 bg-dark text-white">
        <h1 className='myTitle' id='adjacentLands'>Discover my neighbors price</h1>
      </div>

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
      <div class="mt-5 pt-5 pb-5 footer">
        <div class="box_container_padded">
          <div class="row">
            <div class="col-lg-5 col-xs-12 about-company">
              <h2>Skybreach tools

              </h2>
              <p class="pr-5 text-white-50">Skybreach tools is a free dApp that has the aim of exploring the Skybreach metaverse.</p>
              <p><a href="#"><i class="fa fa-facebook-square mr-1"></i></a><a href="#"><i class="fa fa-linkedin-square"></i></a></p>
            </div>
            <div class="col-lg-3 col-xs-12 links">
              <h4 class="mt-lg-0 mt-sm-3">Links</h4>
              <ul class="m-0 p-0">
                <li>- <a href="https://github.com/qwertyuiop9/skybreach">Github repository</a></li>
                <li>- <a href="https://twitter.com/vendrame_and">Twitter</a></li>
                <li>- <a href="https://www.superrisknft.com/">Website</a></li>
                <li>- <a href="https://www.instagram.com/superrisk_voxelart/">Instagram</a></li>
              </ul>
            </div>
            <div class="col-lg-4 col-xs-12 location">
              <h4 class="mt-lg-0 mt-sm-4">Contacts</h4>
              <p>Mail - superrisknft@gmail.com</p>
              <p>Discord - superrisk#5988</p>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col copyright">
              <p class=""><small class="text-white-50">© 2022. All Rights Reserved.</small></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;