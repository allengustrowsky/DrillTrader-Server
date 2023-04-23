import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as WebSocket from 'ws'; // thanks to ChatGPT from helping me tweak this import so the ws constructor works
const finnhub = require('finnhub');

// key/value pair typing to fix TS error credit: Jonas Wilms from https://stackoverflow.com/questions/57350092/string-cant-be-used-to-index-type
export interface AssetList {
    [key: string]: {
        name: string;
        currentPrice: number;
        time: number;
    };
}

// interface built from data from https://finnhub.io/docs/api/websocket-news
type AssetStats = {
    s: string; // symbol
    p: number; // last price
    t: number; // timestamp UNIX milliseconds
    v: number; // volume
    c: string; // list of trade conditions
};

type AssetUpdate = {
    data: Array<Partial<AssetStats>>;
    type: string;
};

// any code marked with "TLPU" is almost entirely from finnhub api "Trades - Last Price Updates" https://finnhub.io/docs/api/websocket-trades
@Injectable()
export class LivePriceDataService {
    // static callableAssets: {[key: string]: string} = {
    static callableAssets: AssetList = {
        PG: {
            name: 'Procter & Gamble Co.',
            currentPrice: 156.07,
            time: new Date().getTime(), // convert date to UNIX timestamp credit to ChatGPT
        },
        MA: {
            name: 'Mastercard Inc.',
            currentPrice: 375.24,
            time: new Date().getTime(),
        },
        AMZN: {
            name: 'Amazon.com Inc.',
            currentPrice: 106.96,
            time: new Date().getTime(),
        },
        MSFT: {
            name: 'Microsoft Corporation',
            currentPrice: 285.76,
            time: new Date().getTime(),
        },
        'BRK.A': {
            name: 'Berkshire Hathaway Inc.',
            currentPrice: 496405,
            time: new Date().getTime(),
        },
        GOOGL: {
            name: 'Alphabet Inc.',
            currentPrice: 105.41,
            time: new Date().getTime(),
        },
        TSLA: {
            name: 'Tesla Inc.',
            currentPrice: 165.08,
            time: new Date().getTime(),
        },
        KO: {
            name: 'Coca-Cola Co.',
            currentPrice: 64.05,
            time: new Date().getTime(),
        },
        JPM: {
            name: 'JPMorgan Chase & Co.',
            currentPrice: 140.54,
            time: new Date().getTime(),
        },
        XOM: {
            name: 'Exxon Mobil Corporation',
            currentPrice: 116.01,
            time: new Date().getTime(),
        },
        AAPL: {
            name: 'Apple Inc.',
            currentPrice: 165.02,
            time: new Date().getTime(),
        },
        VTI: {
            name: 'Vanguard Total Stock Market ETF',
            currentPrice: 205,
            time: new Date().getTime(),
        },
        DIA: {
            name: 'SPDR Dow Jones Industrial Average ETF Trust',
            currentPrice: 338.11,
            time: new Date().getTime(),
        },
        SPY: {
            name: 'SPDR S&P 500 ETF Trust',
            currentPrice: 412.2,
            time: new Date().getTime(),
        },
        'BINANCE:BTCUSDT': {
            name: 'Binance BTCUSDT',
            currentPrice: 27654,
            time: new Date().getTime(),
        },
    };

    constructor(private readonly em: EntityManager) {
        // TLPU
        const socket = new WebSocket(
            `wss://ws.finnhub.io?token=${process.env.STOCK_API_KEY}`,
        );

        // TLPU
        // Connection opened -> Subscribe
        socket.addEventListener('open', function (event) {
            console.log('Initializing websocket connections...');
            for (let symbolIdx of Object.keys(
                LivePriceDataService.callableAssets,
            )) {
                socket.send(
                    JSON.stringify({
                        type: 'subscribe',
                        symbol: symbolIdx,
                    }),
                );
                console.log(
                    `Initialized websocket connection for ${symbolIdx}`,
                );
            }
            console.log('Websocket connections completed.');
        });

        socket.addEventListener('message', function (event) {
            // TLPU
            const data: AssetUpdate = JSON.parse(event.data as string);
            // when there's an update, update data storage
            if (data.data) {
                for (let idx in data.data) {
                    const asset =
                        LivePriceDataService.callableAssets[
                            data.data[idx]['s'] as string
                        ];
                    asset.currentPrice = data.data[idx]['p'] as number;
                    asset.time = data.data[idx]['t'] as number;
                }
            }
        });

        // TLPU
        // Unsubscribe
        const unsubscribe = (symbol: string) => {
            socket.send(
                JSON.stringify({ type: 'unsubscribe', symbol: symbol }),
            );
        };

        this.setData();
    }

    /**
     * Sets the initial data in the live prices object
     */
    async setData() {
        for (let symbolIdx of Object.keys(
            LivePriceDataService.callableAssets,
        )) {
            try {
                const response = await fetch(
                    `https://finnhub.io/api/v1/quote?symbol=${symbolIdx}`,
                    {
                        headers: {
                            'X-Finnhub-Token': process.env
                                .STOCK_API_KEY as string,
                        },
                    },
                );
                const data = await response.json();
                if (!data.error) {
                    // if api minute rate limit not reached
                    const asset =
                        LivePriceDataService.callableAssets[symbolIdx];
                    asset.currentPrice = data.c;
                    asset.time = data.t * 1000; // add in milliseconds to match others (going to be just 0's, so not precise)
                } else {
                    console.log(
                        'Api rate limit reached. Quotes my be inaccurate initially.',
                    );
                }
            } catch (e) {
                console.log(e);
                console.log(
                    'An error occurred while trying to fetch live data to initalize asset prices.',
                );
            }
        }
    }
}
