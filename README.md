# Google Timeline Extractor

Extract your location timeline from Google.

## Steps

Before you start, don't forget to install dependencies with `npm install`

1. Go to https://www.google.com/maps/timeline?pb
2. Make sure you're logged in and can see your timeline graph
3. Open your browser developer tools and open the network monitoring
4. Select a day from the graph to request some data.
5. Inspect the network request, you'll be grabbing 3 pieces of data:
   - `SID` in the `Cookie` header
   - `HSID` in the `Cookie` header
   - `SSID` in the `Cookie` header
6. Create a `.env` file with those three values, under the variable names `SID`, `HSID` and `SSID` respectively
7. Time to get some data - use `npm start` to kick off the script; this will get the data for the previous day.
   - If you want more historical data, you can provide an initial date with `npm start -- <date>`
      - eg. `npm start -- 2018-01-01`
8. If it's all working, you'll get an `output` directory created with the raw responses and the viewing activity sliced by day.
