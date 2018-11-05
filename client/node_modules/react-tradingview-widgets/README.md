# react-tradingview-widgets
React component for rendering the [TradingView Advanced Real-Time Chart Widget](https://www.tradingview.com/widget/advanced-chart/).

# Install
- `npm install --save react-tradingview-widgets`
- `yarn add react-tradingview-widgets`

# Usage
```
  import { RealTimeChartWidget } from 'react-tradingview-widgets';

  <RealTimeChartWidget
    symbol="BITFINEX:BTCUSD"
    locale="en"
    interval="D"
  />
```
