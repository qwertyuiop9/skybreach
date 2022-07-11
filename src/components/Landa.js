import React from "react";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
// Images
import logo from './logo.png';
import img_rarity_common from './images/rarityCommon.png';
import img_rarity_rare from './images/rarityRare.png';
import img_rarity_epic from './images/rarityEpic.png';
import img_rarity_harb from './images/rarityHarb.png';
import img_rarity_premium from './images/rarityPremium.png';
// Colors for different addresses
import { colorMap } from "./SkybreachConstants";
// Constants
import { ABI, contractAddress, DEFAULT_OWNER_ADDRESS, DUTCH_AUCTION_START_TIMESTAMP, COMMON_PRICE, RARE_PRICE, EPIC_PRICE } from "./SkybreachConstants";

// Entropy levels
const entropy_values = [0.0001, 0.0005, 0.001, 0.005, 0.01, 100];
// Biomes names
const biome_key_values = ["cyber", "steampunk", "wind", "volcano", "fire", "water", "necro", "mecha", "dragon", "meadow"];

// 1. Import ethers
const ethers = require('ethers');

// 2. Define RPC provider
const providerRPC = {
    moonriver: {
        name: 'moonriver',
        rpc: 'https://moonriver.blastapi.io/f230c280-5db0-4158-9b41-a782c19a1954',
        chainId: 1285,
    }
};
// 3. Create ethers provider
const provider = new ethers.providers.StaticJsonRpcProvider(
    providerRPC.moonriver.rpc,
    {
        chainId: providerRPC.moonriver.chainId,
        name: providerRPC.moonriver.name,
    }
);


let contract = new ethers.Contract(contractAddress, ABI, provider);

// Function to get right images for land rarities
function getImagePerRarity(rarity) {
    if (rarity == 1) {
        return img_rarity_common;
    } else if (rarity == 2) {
        return img_rarity_rare;
    } else if (rarity == 3) {
        return img_rarity_epic;
    } else if (rarity == 5) {
        return img_rarity_premium;
    } else {
        return img_rarity_harb;
    }
}


function Landa(props) {

    // State
    const [data, setData] = useState(null);
    const [owner, setOwner] = useState();
    const [isListed, setIsListed] = useState();
    const [listedPrice, setListedPrice] = useState();

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isOwnerLoaded, setIsOwnerLoaded] = useState(false);

    useEffect(() => {

        const promise_land_data = contract.getPlotData(props.land_id);
        const promise_land_owner = contract.getPlotOwner(props.land_id);
        const promise_land_is_listed = contract.getIsListed(props.land_id);

        Promise.all(
            [promise_land_data,
                promise_land_owner,
                promise_land_is_listed])
            .then(all_responses => {
                setData(all_responses[0]);
                console.log("Risposta land:" + all_responses[0]);
                setOwner(all_responses[1]);
                setIsListed(all_responses[2]);
                console.log("La land è listata: " + all_responses[2]);
                // Update loading states
                setIsDataLoaded(true);
                setIsOwnerLoaded(true);
            }).catch(all_responses => {
                console.error(all_responses);
                setIsDataLoaded(false);
                setIsOwnerLoaded(false);
            });


        if (isListed) {
            console.log("Dato 'isListed' " + isListed);
            const promise_listed_price = contract.getListedPrice(props.land_id);
            promise_listed_price.then(response => {
                if (isListed) {
                    setListedPrice(response);
                } else {
                    setListedPrice("-_-");
                }
            }).catch(error => {
                console.error("Errore sulla chiamata 'contract.getListedPrice'" + error);
                setListedPrice('---');
            });
        } else {
            setListedPrice(null);
        }

    }, [props.land_id]);

    if (isDataLoaded && isOwnerLoaded) {
        return (
            <tr >
                <td>{props.land_id}</td>
                <td>{props.land_id % 256}</td>
                <td>{Math.floor(props.land_id / 256)}</td>
                <td><img width="50" height="50" src={getImagePerRarity(data['rarity'])} /></td>
                <td>{getOwner(owner, data['entropy'])}</td>
                <td>{getBiomes(data)}</td>
                <td>{getEntropy(data['entropy'])}</td>
                <td>{isListed ? "Yes" : "No"}</td>
                <td>{getLandPrice(owner, props.block_timestamp, isListed, data)}</td>
                <td>{getBuyButton(getLandPrice(owner, props.block_timestamp, isListed, data) != "-")}</td>
            </tr>
        )
    } else {
        return <p>Loading...</p>
    }

}

function getLandPrice(_owner, _actualTimestamp, _isListed, _data) {
    if (_isListed) {
        console.log("Function to implement -> secondary sales");
        return "-";
    } else {
        const landEntropy = _data['entropy'];
        const landRarity = _data['rarity'];
        if (parseInt(landEntropy) != 0 ) {
            // Land disponibile
            if (_owner == DEFAULT_OWNER_ADDRESS) {
                // Primary sale
                var daysPassedFromStart = (_actualTimestamp- DUTCH_AUCTION_START_TIMESTAMP) / 60 / 60 / 24;
                var tempDiscount = (daysPassedFromStart+0.333) / 180;
                console.log("Days passed from start: " + daysPassedFromStart);
                const DISCOUNT = 1 - tempDiscount * 0.9;
                const landPrice = getPrimaryMarketPrice(landRarity, DISCOUNT).toFixed(2);
                if (landPrice != (-1)) {
                    landPrice + " RMRK";
                } else {
                    return "Not available yet";
                }
            } else {
                return "-";
            }
        }
    }
}


function getPrimaryMarketPrice(_rarity, _discountedPrice) {
    // Get land price based on dutch auction and rarity
    switch (_rarity) {
        case 1:
            // Common land
            return COMMON_PRICE * _discountedPrice;
        case 2:
            // Rare land
            return RARE_PRICE * _discountedPrice;
        case 3:
            // Epic land
            return EPIC_PRICE * _discountedPrice;
    }
    return -1; // Price non available or error
}


function getBuyButton(isLandListed) {
    if (isLandListed) {
        return <a href="https://skybreach.app/?ref=0x1280c33578a350D8AA1b2beC074f8604baea63Db" button type="button" class="btn btn-primary">Buy</a>
    } else {
        return <a href="https://skybreach.app/?ref=0x1280c33578a350D8AA1b2beC074f8604baea63Db" button type="button" class="btn btn-secondary" disabled>Buy</a>

    }
}

function getColoredOwner(_landId, _owner, _color) {

    switch (_color) {
        case 0:
            return (<p class="text-primary">{_owner}</p>);
        case 1:
            return (<p class="text-secondary">{_owner}</p>);
        case 2:
            return (<p class="text-success">{_owner}</p>);
        case 3:
            return (<p class="text-danger">{_owner}</p>);
        case 4:
            return (<p class="text-warning">{_owner}</p>);
        case 5:
            return (<p class="text-info">{_owner}</p>);
        case 6:
            return (<p class="text-dark">{_owner}</p>);
        case 7:
            return (<p class="text-muted">{_owner}</p>);
    }

}

function getEntropy(response_value) {
    const entropyCategory = parseInt(response_value) - 1;
    if (entropyCategory == -1) {
        return "-"
    }
    return entropy_values[entropyCategory] + " %";
}

function getOwner(owner, entropy) {
    if (entropy != 0) {
        return owner;
    } else {
        return "LAND NOT AVAILABLE";
    }
}

function getBiomes(land_data) {

    var result_biomes = [];
    var result_values = [];

    for (let i = 0; i < biome_key_values.length; i++) {
        if (land_data[biome_key_values[i]] != 0) {
            result_biomes.push(biome_key_values[i]);
            result_values.push(land_data[biome_key_values[i]]);
        }
    }

    if (result_biomes.length == 1) {
        return (
            <div class="row">
                <div class="column">
                    <p>{capitalizeFirstLetter(result_biomes[0]) + " " + land_data[result_biomes[0]] + "%"}</p>
                </div>
            </div>)
    } else if (result_biomes.length == 2) {
        return (
            <div class="row">
                <div class="column">
                    <p>{capitalizeFirstLetter(result_biomes[0]) + " " + result_values[0] + "%"}</p>
                    <p>{capitalizeFirstLetter(result_biomes[1]) + " " + result_values[1] + "%"}</p>
                </div>
            </div>)
    } else if (result_biomes.length == 3) {
        return (
            <div class="row">
                <div class="column">
                    <p>{capitalizeFirstLetter(result_biomes[0]) + " " + result_values[0] + "%"}</p>
                    <p>{capitalizeFirstLetter(result_biomes[1]) + " " + result_values[1] + "%"}</p>
                    <p>{capitalizeFirstLetter(result_biomes[2]) + " " + result_values[2] + "%"}</p>
                </div>
            </div>)
    } else {
        return (<div class="column">
            <p>Not available</p>
        </div>)
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


}

export default Landa;