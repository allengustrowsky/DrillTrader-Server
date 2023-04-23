import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
// import { WebSocketClient } from '@finnhub/websocket';
import * as WebSocket from 'ws'; // thanks to ChatGPT from helping me tweak this import so the ws constructor works

// key/value pair typing to fix TS error credit: Jonas Wilms from https://stackoverflow.com/questions/57350092/string-cant-be-used-to-index-type
export interface AssetList {
    [key: string]: {
        name: string,
        currentPrice: number,
        time: number
    }
}

// interface built from data from https://finnhub.io/docs/api/websocket-news
type AssetStats = {
    "s": string; // symbol
    "p": number; // last price
    "t": number; // timestamp UNIX milliseconds
    "v": number; // volume
    "c": string; // list of trade conditions
}

type AssetUpdate = {
    data: Array<Partial<AssetStats>>,
    type: string
}

// any code marked with "TLPU" is almost entirely from finnhub api "Trades - Last Price Updates" https://finnhub.io/docs/api/websocket-trades
@Injectable()
export class LivePriceDataService {
    static livePrices = {
        // 
    }

    // static callableAssets: {[key: string]: string} = {
    //     "Procter & Gamble Co.": "PG",
    //     "Mastercard Inc.": "MA",
    //     "Amazon.com Inc.": "AMZN",
    //     "Microsoft Corporation": "MSFT",
    //     "Berkshire Hathaway Inc.": "BRK.A",
    //     "Alphabet Inc.": "GOOGL",
    //     "Tesla Inc.": "TSLA",
    //     "Coca-Cola Co.": "KO",
    //     "JPMorgan Chase & Co.": "JPM",
    //     "Exxon Mobil Corporation": "XOM",
    //     "Apple Inc.": "AAPL",
    //     "Vanguard Total Stock Market ETF": "VTI",
    //     "SPDR Dow Jones Industrial Average ETF Trust": "DIA",
    //     "SPDR S&P 500 ETF Trust": "SPY",
    //     "Binance BTCUSDT [TEST]": "BINANCE:BTCUSDT"
    // }

    // static callableAssets: {[key: string]: string} = {
    static callableAssets: AssetList = {
        "PG": {
            name: "Procter & Gamble Co.",
            currentPrice: 156.07,
            time: new Date().getTime() // convert date to UNIX timestamp credit to ChatGPT
        },
        "MA": {
            name: "Mastercard Inc.",
            currentPrice: 25.155,
            time: new Date().getTime()
        },
        "AMZN": {
            name: "Amazon.com Inc.",
            currentPrice: 106.96,
            time: new Date().getTime()
        },
        "MSFT": {
            name: "Microsoft Corporation",
            currentPrice: 285.76,
            time: new Date().getTime()
        },
        "BRK.A": {
            name: "Berkshire Hathaway Inc.",
            currentPrice: 496405,
            time: new Date().getTime()
        },
        "GOOGL": {
            name: "Alphabet Inc.",
            currentPrice: 105.41,
            time: new Date().getTime()
        },
        "TSLA": {
            name: "Tesla Inc.",
            currentPrice: 165.08,
            time: new Date().getTime()
        },
        "KO": {
            name: "Coca-Cola Co.",
            currentPrice: 64.05,
            time: new Date().getTime()
        },
        "JPM": {
            name: "JPMorgan Chase & Co.",
            currentPrice: 140.54,
            time: new Date().getTime()
        },
        "XOM": {
            name: "Exxon Mobil Corporation",
            currentPrice: 116.01,
            time: new Date().getTime()
        },
        "AAPL": {
            name: "Apple Inc.",
            currentPrice: 165.02,
            time: new Date().getTime()
        },
        "VTI": {
            name: "Vanguard Total Stock Market ETF",
            currentPrice: 205,
            time: new Date().getTime()
        },
        "DIA": {
            name: "SPDR Dow Jones Industrial Average ETF Trust",
            currentPrice: 338.11,
            time: new Date().getTime()
        },
        "SPY": {
            name: "SPDR S&P 500 ETF Trust",
            currentPrice: 0,
            time: new Date().getTime()
        },
        "BINANCE:BTCUSDT": {
            name: "Binance BTCUSDT",
            currentPrice: 27654,
            time: new Date().getTime()
        },
    }
        
    

    constructor(private readonly em: EntityManager) {
        // TLPU
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.STOCK_API_KEY}`);

        // TLPU
        // Connection opened -> Subscribe
        socket.addEventListener('open', function (event) {
            console.log('Initializing websocket connections...')
            for (let symbolIdx of Object.keys(LivePriceDataService.callableAssets)) {
                // console.log(`${i}: symbol: ${LivePriceDataService.callableAssets[i].name}; currentPrice: ${LivePriceDataService.callableAssets[i].currentPrice}; time: ${LivePriceDataService.callableAssets[i].time}`)                
                // console.log(LivePriceDataService.callableAssets[symbolIdx].name)
                socket.send(JSON.stringify({
                    'type':'subscribe', 
                    'symbol': symbolIdx
                }))
                console.log(`Initialized websocket connection for ${symbolIdx}`)
            }
            
            // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
            // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
            // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
        });

        socket.addEventListener('message', function (event) { // TLPU
            const data: AssetUpdate = JSON.parse(event.data as string)
            // when there's an update, update data storage
            if (data.data) {
                for (let idx in data.data) {
                    const asset = LivePriceDataService.callableAssets[data.data[idx]['s'] as string]
                    asset.currentPrice = data.data[idx]['p'] as number
                    asset.time = data.data[idx]['t'] as number
                    // console.log('updated idx: ')
                    // console.dir(LivePriceDataService.callableAssets[data.data[idx]['s'] as string])
                }
            }
        });

        // TLPU
        // Unsubscribe
        const unsubscribe = (symbol: string) => {
            socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
        }

        // from ChatGPT
        // const websocket = new WebSocketClient('wss://ws.finnhub.io?token=cgio5rhr01qmhsekoj3gcgio5rhr01qmhsekoj40');

        // // Subscribe to the 'AAPL' stock symbol
        // websocket.subscribe('AAPL', (data: any) => {
        //     console.log('AAPL price update:', data);
        // });

        // // Subscribe to the 'BINANCE:BTCUSDT' crypto symbol
        // websocket.subscribe('BINANCE:BTCUSDT', (data) => {
        //     console.log('BTCUSDT price update:', data);
        // });

        // // Subscribe to the 'IC MARKETS:1' forex symbol
        // websocket.subscribe('IC MARKETS:1', (data) => {
        //     console.log('Forex price update:', data);
        // });

        // // Unsubscribe from the 'AAPL' stock symbol
        // websocket.unsubscribe('AAPL');

    }

    // make a static object that has any number of properties to accomodate shift in resources
    
    // const 
    
}

// // any code marked with "TLPU" is almost entirely from finnhub api "Trades - Last Price Updates" https://finnhub.io/docs/api/websocket-trades
// @Injectable()
// export class LivePriceDataService {
//     static livePrices = {
//         // 
//     }

//     constructor(private readonly em: EntityManager) {
//         // TLPU
//         const socket = new WebSocket('wss://ws.finnhub.io?token=cgio5rhr01qmhsekoj3gcgio5rhr01qmhsekoj40');

//         // Connection opened -> Subscribe
//         socket.addEventListener('open', function (event) {
//             socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
//             socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
//             socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
//         });

//         // Listen for messages
//         socket.addEventListener('message', function (event) {
//             console.log('Message from server ', event.data);
//         });

//         // Unsubscribe
//         const unsubscribe = (symbol: string) => {
//             socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
//         }

//     }

//     // make a static object that has any number of properties to accomodate shift in resources
    
//     // const 
    
// }
