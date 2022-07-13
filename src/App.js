import './App.css';
import { contract, getAdjacentPlots } from './components/Land';
import Landa from './components/Landa';
import { useEffect, useRef, useState } from 'react';
import { contractAddress, ABI, provider, ethers } from './components/SkybreachConstants';
import img_hearts from './components/images/heartsNeighbours.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [plotToWatch, setPlotToWatch] = useState(24439);
  const [adjacentPlots, setAdjacentPlots] = useState([]);
  const [ownerAddresses, setOwnerAddresses] = useState([]);
  const [ownerColors, setOwnerColors] = useState([]);
  const [currentBlockTimestamp, setCurrentBlockTimestamp] = useState(-1);
  // Land coordinates
  const [xCoord, setXCoord] = useState(119);
  const [yCoord, setYCoord] = useState(95);
  const inputXRef = useRef(null);
  const inputYRef = useRef(null);
  // Neighbourly Love Campaign
  const [neighbourLoveValue, setNeighbourLoveValue] = useState("Not calculate yet");

  function getIdsFromAdjacents(neighbours) {
    var ids = [];
    for (let i = 0; i < neighbours.length; i++) {
      ids.push(neighbours[i]['id']);
    }
    return ids;
  }


  function handleClick() {
    const temp_x = parseInt(inputXRef.current.value);
    const temp_y = parseInt(inputYRef.current.value);
    var new_plot_id = temp_x + temp_y * 256;
    var differentNeighbours;
    setPlotToWatch(new_plot_id);
    // Smart Contract calls
    let contract = new ethers.Contract(contractAddress, ABI, provider);
    var ids = getIdsFromAdjacents(getAdjacentPlots(new_plot_id));
    const callGetPlotOwners = contract.getPlotOwners(ids);
    const callGetBlockTimestamp = provider.getBlock();
    Promise.all([callGetPlotOwners, callGetBlockTimestamp]).then(responses => {
      console.log("Retrieved neighbour addresses" + responses[0]);
      console.log("Actual block timestamp: " + responses[1]['timestamp']);
      setCurrentBlockTimestamp(responses[1]['timestamp']);
      setOwnerAddresses(responses[0]);
      console.log("TESETEST: + " + Array.from(new Set(responses[0])));
      setOwnerColors(Array.from(new Set(responses[0])));
      differentNeighbours = new Set(responses[0]);
      const rawRollWinningPercentage = differentNeighbours.size + 10;
      const actualRollWinningPercentage = rawRollWinningPercentage * getDutchNeighborLoveMultiplier(responses[1]['timestamp']);
      setNeighbourLoveValue(actualRollWinningPercentage.toFixed(2) + " %");
    }).catch(error => {
      console.log("handleClick error: " + error);
    });
    console.log("plotToWatch= " + new_plot_id + " injected x (" + temp_x + ") injected y (" + temp_y + ")");
  }

  function getDutchNeighborLoveMultiplier(curretTimestamp) {
    const dutchAuctionStart = 1657209600;
    const totalDutchDays = 180;
    const totalPassedDays = (curretTimestamp - dutchAuctionStart) / 60 / 60 / 24;
    const currentDutchMultiplier = (totalDutchDays - totalPassedDays) / totalDutchDays;
    return currentDutchMultiplier;
  }

  useEffect(() => {
    setAdjacentPlots(getAdjacentPlots(plotToWatch));
  }, [plotToWatch]);


  return (
    <div>

      <div className='article-container'>
        <div className='dapp-top-section'>
          <div class="p-3 mb-2 bg-dark text-white">
            <h2 className='myTitle' id='adjacentLands'>Discover my neighbors price</h2>
          </div>
        </div>
        <div className='dapp-top-section'>
          <div class="p-3 mb-2 bg-dark text-white">
            <h2 className='myTitle' id='metamaskSection'>Metamask coming soon...</h2></div>
        </div>
      </div>

      <div className='article-container'>
        <div className='dapp-top-section'>
          <div className='wrapper'>
            <h4>Land owned centered in:</h4>
            <div class="row">
              <div class="col">
                <div className='small_around_margin'>
                  <input ref={inputXRef}
                    type="text"
                    id='messagex'
                    name='messagex'
                    placeholder={'X coordinate: ' + xCoord}
                  /></div>
                <div className='small_around_margin'>
                  <input ref={inputYRef}
                    type="text"
                    id='messagey'
                    name='messagey'
                    placeholder={'Y coordinate: ' + yCoord}
                  /></div>
              </div>
            </div>
            <div className='small_margin'>
              <button class="btn btn-primary mb-2" onClick={handleClick}>Find my neighbours</button>
            </div>
          </div>
        </div>
        <div className='dapp-top-section'>
          <div className='wrapper'>
            <div className='d-flex justify-content-end'>
              <div className='dapp-top-section'><h4>Neighbourly Love Campaign</h4></div>
              <div className='dapp-top-section'><img width="40" height="40" src={img_hearts} /></div></div>
            <div />
            <p>Percentage of win a roll for the central land:</p>
            <textarea value={neighbourLoveValue} readonly className='textarea' />
            <p>**Note: The above result doesn't look at existing Othala Chunkies already on the inspected land.</p>
          </div>


        </div>
      </div>



      <div className='small_around_margin'>
        <table class="table">
          <thead className='thead-dark'>
            <tr>
              <th scope="col">Land ID</th>
              <th scope="col">X</th>
              <th scope="col">Y</th>
              <th scope="col">Rarity</th>
              <th scope='col'>Owned by</th>
              <th scope='col'>Plots Owned</th>
              <th scope='col'>Biomes</th>
              <th scope='col'>Entropy</th>
              <th scope='col'>On sale</th>
              <th scope='col'>Actual price</th>
              <th scope='col'>Highest offer</th>
              <th scope='col'>BUY</th>
            </tr>
          </thead>
          <tbody>
            {
              adjacentPlots.map(land => (
                <Landa
                  land_id={land.id}
                  key={land.id}
                  block_timestamp={currentBlockTimestamp}
                  neighbour_owners={ownerColors}/>
              ))
            }
          </tbody>
        </table>
      </div>
      <div class="mt-5 pt-5 pb-5 footer">
        <div class="box_container_padded">
          <div class="d-flex justify-content-end">
            <div class="wrapper">
              <h2>Skybreach tools

              </h2>
              <p class="pr-5 text-white-50">Skybreach tools is a free dApp that has the aim of helping to explore the Skybreach metaverse.</p>
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

