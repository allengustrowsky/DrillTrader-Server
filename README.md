# Drill Trader
Drill Trader simulates trading on a real-time platform for trading stocks, index funds, and crypto. The purpose of this is to enable individuals to "paper trade", or practice investing without actually risking real money (a series of self-guided “drills” you could say).  A user can see a few top stocks / index funds on the main page.  These stocks will be sourced from a publicly-available API.  Users can “deposit” money and use that money to buy more assets.  

## Allowed assets (aside from cash): 
- Procter & Gamble Co. (PG)
- Mastercard Inc. (MA)
- Amazon.com Inc. (AMZN)
- Microsoft Corporation (MSFT)
- Berkshire Hathaway Inc. (BRK.A)
- Alphabet Inc. (GOOGL)
- Tesla Inc. (TSLA)
- Coca-Cola Co. (KO)
- JPMorgan Chase & Co. (JPM)
- Exxon Mobil Corporation (XOM)
- Apple Inc. (AAPL)
- Vanguard Total Stock Market ETF (VTI)
- SPDR Dow Jones Industrial Average ETF Trust (DIA)
- SPDR S&P 500 ETF Trust (SPY)
- Binance BTCUSDT (BINANCE:BTCUSDT)

## Setup
- Need to sign up at [Finnhub Stock Api](https://finnhub.io/) to get an apiKey
    - Put "STOCK_API_KEY=yourApiKey" in the .env files
- Setup/run docker container (`docker compose up`)
- Pull in dependencies: `npm install` 
- Make sure docker container is running (e.g., use docker desktop)
- Make sure schema is good by running 
    1. `npm run schema:drop`
    2. `npm run schema:create`
- Start the server: `npm run start` (server is not completely set up until console says "Websocket connections completed").
- Populate sample data: hit the `/setup` endpoint, which should add sample data for two users and return a valid admin and non-admin api key.
    - Most routes require an api key (some also require the key to be an admin key). To get all routes to work, just put the admin api key into the `Authorization` header.
- To see database data, apps like MySQLWorkbench work great. Just make a new connection to port 3308 and use the database password in the dev.env file to set it up.
    

## Limitations
- Avoid buying many units of stock (e.g., millions) in a single transaction.
- Don't trade too quickly in order to avoid hitting finnhub api rate limits.

## Credits:
- Some credits may be mentioned in a single location and are duplicated elsewhere without citation, but they are cited at least once. Others are cited everywhere they are used. My apologies for the inconsistency.
