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

let ABI = '[{"inputs":[{"internalType":"uint256","name":"commonPrice","type":"uint256"},{"internalType":"uint256","name":"rarePrice","type":"uint256"},{"internalType":"uint256","name":"epicPrice","type":"uint256"},{"internalType":"uint256","name":"creatorFee","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"EscrowReturned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plotId","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"OfferCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plotId","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"OfferMade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plotId","type":"uint256"},{"indexed":true,"internalType":"address","name":"seller","type":"address"}],"name":"PlotDelisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plotId","type":"uint256"},{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"PlotListed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plotId","type":"uint256"},{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"PlotPriceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plotId","type":"uint256"},{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"PlotPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plotId","type":"uint256"},{"indexed":false,"internalType":"string","name":"buyer","type":"string"}],"name":"PlotResourceSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plotIds","type":"uint256"},{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"PlotTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[]","name":"plotIds","type":"uint256[]"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":true,"internalType":"bool","name":"boughtWithCredits","type":"bool"}],"name":"PlotsBought","type":"event"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"internalType":"uint256","name":"offerIndex","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"acceptOffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"addAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"addReferrer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"buy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"plotIds","type":"uint256[]"},{"internalType":"uint256[]","name":"singleDiscountIndexes","type":"uint256[]"},{"internalType":"uint256[]","name":"multiDiscountIndexes","type":"uint256[]"},{"internalType":"address","name":"referrer","type":"address"}],"name":"buyPlots","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"plotIds","type":"uint256[]"},{"internalType":"enum LandSaleCore.Rarity","name":"creditRarity","type":"uint8"}],"name":"buyWithCredits","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"internalType":"uint256","name":"offerIndex","type":"uint256"}],"name":"cancelOffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"changePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"delist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getBeneficiary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getClaimableEscrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCreatorFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getCurrentBid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDutchDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDutchMinMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"getDutchPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDutchStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getIsListed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getListedInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getListedPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumPlotsSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getOffers","outputs":[{"components":[{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct LandSaleMarket.Offer[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getOwnedPlotRarities","outputs":[{"components":[{"internalType":"uint32","name":"common","type":"uint32"},{"internalType":"uint32","name":"rare","type":"uint32"},{"internalType":"uint32","name":"epic","type":"uint32"},{"internalType":"uint32","name":"harb","type":"uint32"},{"internalType":"uint32","name":"premium","type":"uint32"}],"internalType":"struct Plots.OwnedPlotRarities","name":"ownedPlotRarities","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getOwnedPlots","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPausedSales","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPausedTransfers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getPlotAvailability","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getPlotData","outputs":[{"components":[{"internalType":"uint8","name":"cyber","type":"uint8"},{"internalType":"uint8","name":"steampunk","type":"uint8"},{"internalType":"uint8","name":"wind","type":"uint8"},{"internalType":"uint8","name":"volcano","type":"uint8"},{"internalType":"uint8","name":"fire","type":"uint8"},{"internalType":"uint8","name":"water","type":"uint8"},{"internalType":"uint8","name":"necro","type":"uint8"},{"internalType":"uint8","name":"mecha","type":"uint8"},{"internalType":"uint8","name":"dragon","type":"uint8"},{"internalType":"uint8","name":"meadow","type":"uint8"},{"internalType":"uint8","name":"isShore","type":"uint8"},{"internalType":"uint8","name":"isIsland","type":"uint8"},{"internalType":"uint8","name":"isMountainFoot","type":"uint8"},{"internalType":"enum LandSaleCore.Rarity","name":"rarity","type":"uint8"},{"internalType":"enum LandSaleCore.Entropy","name":"entropy","type":"uint8"}],"internalType":"struct Plots.PlotData","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPlotDataLock","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getPlotOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"plotIds","type":"uint256[]"}],"name":"getPlotOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"}],"name":"getPlotResource","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"plotIds","type":"uint256[]"}],"name":"getPlotResourceBatch","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPricesPerRarity","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"plotIds","type":"uint256[]"},{"internalType":"uint256[]","name":"singleDiscountIndexes","type":"uint256[]"},{"internalType":"uint256[]","name":"multiDiscountIndexes","type":"uint256[]"}],"name":"getPurchasePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReferralIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReferralMinCommonPlots","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserDataAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWhiteListPhase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getXcRMRK","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"isAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"isReferrer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"list","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"makeOffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"xcRmrkPlotIds","type":"uint256[]"},{"internalType":"uint256[]","name":"singleDiscountIndexes","type":"uint256[]"},{"internalType":"uint256[]","name":"multiDiscountIndexes","type":"uint256[]"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256[]","name":"creditsPlotIds","type":"uint256[]"},{"components":[{"internalType":"uint256","name":"commonCredits","type":"uint256"},{"internalType":"uint256","name":"rareCredits","type":"uint256"},{"internalType":"uint256","name":"epicCredits","type":"uint256"},{"internalType":"uint256","name":"premiumCredits","type":"uint256"}],"internalType":"struct LandSaleCore.UserCredits","name":"userCredits","type":"tuple"}],"name":"mixBuy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"removeReferrer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"returnEscrowed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"revokeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"setBeneficiary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"creatorFee","type":"uint256"}],"name":"setCreatorFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"multiplier","type":"uint256"}],"name":"setDutchConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"paused","type":"bool"}],"name":"setPausedSales","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"paused","type":"bool"}],"name":"setPausedTransfers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"components":[{"internalType":"uint8","name":"cyber","type":"uint8"},{"internalType":"uint8","name":"steampunk","type":"uint8"},{"internalType":"uint8","name":"wind","type":"uint8"},{"internalType":"uint8","name":"volcano","type":"uint8"},{"internalType":"uint8","name":"fire","type":"uint8"},{"internalType":"uint8","name":"water","type":"uint8"},{"internalType":"uint8","name":"necro","type":"uint8"},{"internalType":"uint8","name":"mecha","type":"uint8"},{"internalType":"uint8","name":"dragon","type":"uint8"},{"internalType":"uint8","name":"meadow","type":"uint8"},{"internalType":"uint8","name":"isShore","type":"uint8"},{"internalType":"uint8","name":"isIsland","type":"uint8"},{"internalType":"uint8","name":"isMountainFoot","type":"uint8"},{"internalType":"enum LandSaleCore.Rarity","name":"rarity","type":"uint8"},{"internalType":"enum LandSaleCore.Entropy","name":"entropy","type":"uint8"}],"internalType":"struct Plots.PlotData","name":"plotData","type":"tuple"}],"name":"setPlotData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"state","type":"bool"}],"name":"setPlotDataLock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"plotIds","type":"uint256[]"},{"components":[{"internalType":"uint8","name":"cyber","type":"uint8"},{"internalType":"uint8","name":"steampunk","type":"uint8"},{"internalType":"uint8","name":"wind","type":"uint8"},{"internalType":"uint8","name":"volcano","type":"uint8"},{"internalType":"uint8","name":"fire","type":"uint8"},{"internalType":"uint8","name":"water","type":"uint8"},{"internalType":"uint8","name":"necro","type":"uint8"},{"internalType":"uint8","name":"mecha","type":"uint8"},{"internalType":"uint8","name":"dragon","type":"uint8"},{"internalType":"uint8","name":"meadow","type":"uint8"},{"internalType":"uint8","name":"isShore","type":"uint8"},{"internalType":"uint8","name":"isIsland","type":"uint8"},{"internalType":"uint8","name":"isMountainFoot","type":"uint8"},{"internalType":"enum LandSaleCore.Rarity","name":"rarity","type":"uint8"},{"internalType":"enum LandSaleCore.Entropy","name":"entropy","type":"uint8"}],"internalType":"struct Plots.PlotData[]","name":"plotsData","type":"tuple[]"}],"name":"setPlotDataMulti","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"internalType":"string","name":"imgData","type":"string"}],"name":"setPlotResource","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"isActive","type":"bool"}],"name":"setReferralIsActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"minCommonPlots","type":"uint256"}],"name":"setReferralMinCommonPlots","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"setUserDataAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"phaseId","type":"uint256"}],"name":"setWhitelistPhase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"setxcRMRK","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"plotIds","type":"uint256[]"},{"internalType":"uint256","name":"commonCredits","type":"uint256"},{"internalType":"uint256","name":"rareCredits","type":"uint256"},{"internalType":"uint256","name":"epicCredits","type":"uint256"},{"internalType":"uint256","name":"premiumCredits","type":"uint256"}],"name":"smartBuyWithCredits","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plotId","type":"uint256"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]';

let contractAddress = "0x98af019cdf16990130cba555861046b02e9898cc";
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

function getListingPrice(value, data) {
    if (parseInt(data['entropy']) != 0) {
        if (value != null) {
            return value;
        }
    }
    return "-";
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
            <tr>
                <td>{props.land_id}</td>
                <td>{props.land_id % 256}</td>
                <td>{Math.floor(props.land_id / 256)}</td>
                <td><img width="50" height="50" src={getImagePerRarity(data['rarity'])} /></td>
                <td>{getOwner(owner, data['entropy'])}</td>
                <td>{getBiomes(data)}</td>
                <td>{getEntropy(data['entropy'])}</td>
                <td>{isListed ? "Yes" : "No"}</td>
                <td>{getListingPrice(listedPrice, data)}</td>
                <td>{getBuyButton(isListed)}</td>
            </tr>
        )
    } else {
        return <h4>Loading...</h4>
    }

}

function getBuyButton(isLandListed) {
    if (isLandListed) {
        return <a href="https://skybreach.app/?ref=0x1280c33578a350D8AA1b2beC074f8604baea63Db" button type="button" class="btn btn-primary">Buy</a>
    } else {
        return <a href="https://skybreach.app/?ref=0x1280c33578a350D8AA1b2beC074f8604baea63Db" button type="button" class="btn btn-secondary btn-lg" disabled>Buy</a>

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
        return (<div class="row">
            <div class="column">
                <p>{capitalizeFirstLetter(result_biomes[0]) + " " + land_data[result_biomes[0]] + "%"}</p>
            </div>
        </div>)
    } else if (result_biomes.length == 2) {
        return (<div class="row">
            <div class="column">
                <p>{capitalizeFirstLetter(result_biomes[0]) + " " + result_values[0] + "%"}</p>
                <p>{capitalizeFirstLetter(result_biomes[1]) + " " + result_values[1] + "%"}</p>
            </div>
        </div>)
    } else {
        return (<div class="row">
            <div class="column">
                <p>{capitalizeFirstLetter(result_biomes[0]) + " " + result_values[0] + "%"}</p>
                <p>{capitalizeFirstLetter(result_biomes[1]) + " " + result_values[1] + "%"}</p>
                <p>{capitalizeFirstLetter(result_biomes[2]) + " " + result_values[2] + "%"}</p>
            </div>
        </div>)
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
}

export default Landa;