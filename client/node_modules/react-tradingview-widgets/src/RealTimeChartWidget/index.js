/* global TradingView */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_SCRIPT_ID = 'tradingview_widget_script';
const DEFAULT_CONTAINER_ID = 'tradingview_widget';

class RealTimeChartWidget extends PureComponent {
  constructor(props) {
    super(props);

    this.scriptId = DEFAULT_SCRIPT_ID;
    this.containerId = `${DEFAULT_CONTAINER_ID}_${Math.random()}`;
  }

  componentDidMount()  {
    this.appendScript(this.initWidget);
  }

  componentDidUpdate() {
    this.cleanWidget();
    this.initWidget();
  };

  canUseDOM = () => !!(
    typeof window !== 'undefined' &&
      window.document &&
        window.document.createElement
  );

  appendScript = (onload) => {
    if (!this.canUseDOM()) {
      onload();
      return;
    }

    if (this.scriptExists()) {
      if (typeof TradingView === 'undefined') {
        this.updateOnloadListener(onload);
        return;
      }
      onload();
      return;
    }
    const script = document.createElement('script');
    script.id = this.scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.onload = onload;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  getScriptElement = () => {
    return document.getElementById(this.scriptId);
  }

  scriptExists = () => {
    return this.getScriptElement() !== null;
  }

  updateOnloadListener = (onload) => {
    const script = this.getScriptElement();
    const oldOnload = script.onload;
    return script.onload = () => {
      oldOnload();
      onload();
    };
  };

  initWidget = () => {
    if (typeof TradingView === 'undefined') return;

    const { widgetType, ...widgetConfig } = this.props;
    const config = { ...widgetConfig, container_id: this.containerId };

    if (config.autosize) {
      delete config.width;
      delete config.height;
    }

    if (typeof config.interval === 'number') {
      config.interval = config.interval.toString();
    }

    if (config.popup_width && typeof config.popup_width === 'number') {
      config.popup_width = config.popup_width.toString();
    }

    if (config.popup_height && typeof config.popup_height === 'number') {
      config.popup_height = config.popup_height.toString();
    }

    new TradingView[widgetType](config);
  };

  cleanWidget = () => {
    if (!this.canUseDOM()) return;
    document.getElementById(this.containerId).innerHTML = '';
  };

  getStyle = () => {
    if (!this.props.autosize) return {};

    return {
      width: '100%',
      height: '100%'
    };
  };

  render() {
    return (
      <div
        id={this.containerId}
        style={this.getStyle()}
      />
    )
  }
}

RealTimeChartWidget.propTypes = {
  widgetType: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  autosize: PropTypes.bool,
  symbol: PropTypes.string.isRequired,
  interval: PropTypes.string,
  timezone: PropTypes.string,
  theme: PropTypes.string,
  style: PropTypes.string,
  locale: PropTypes.string,
  toolbar_bg: PropTypes.string,
  enable_publishing: PropTypes.bool,
  allow_symbol_change: PropTypes.bool,
  withdateranges: PropTypes.bool,
  hide_side_toolbar: PropTypes.bool,
  hideideas: PropTypes.bool,
  watchlist: PropTypes.arrayOf(PropTypes.string),
  details: PropTypes.bool,
  hotlist: PropTypes.bool,
  calendar: PropTypes.bool,
  news: PropTypes.arrayOf(PropTypes.string),
  studies: PropTypes.arrayOf(PropTypes.string),
  show_popup_button: PropTypes.bool,
  popup_width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  popup_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  no_referral_id: PropTypes.bool,
  referral_id: PropTypes.string,
}

RealTimeChartWidget.defaultProps = {
  widgetType: 'widget',
  width: 980,
  height: 610,
  autosize: false,
  interval: 'D',
  timezone: 'Etc/UTC',
  theme: 'Light',
  style: '1',
  locale: 'en',
  toolbar_bg: '#f1f3f6',
  enable_publishing: false,
  allow_symbol_change: true,
  hideideas: true,
}

export default RealTimeChartWidget;
