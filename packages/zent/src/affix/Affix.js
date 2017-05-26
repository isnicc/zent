import React, { Component } from 'react';
import cx from 'classnames';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import getElementViewTop from 'utils/dom/getElementViewTop';
import getElementViewBottom from 'utils/dom/getElementViewBottom';

class Affix extends Component {
  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    zIndex: PropTypes.number,
    offsetTop: PropTypes.number,
    offsetBottom: PropTypes.number,
    onFixed: PropTypes.func,
    outFixed: PropTypes.func
  };

  static defaultProps = {
    offsetTop: 0,
    prefix: 'zent',
    zIndex: 10
  };

  constructor(props) {
    super(props);
    this.state = {
      position: 'static',
      width: null,
      placeHoldStyle: {}
    };
  }

  affix = false;

  setFixed = () => {
    const { onFixed } = this.props;
    this.affix = true;
    this.setState({ position: 'fixed' });
    onFixed && onFixed();
  };

  setOutFixed = () => {
    const { outFixed } = this.props;
    this.affix = false;
    this.setState({ position: 'static' });
    outFixed && outFixed();
  };

  handleScroll = () => {
    const affix = this.affix;
    const props = this.props;
    const element = ReactDOM.findDOMNode(this);
    if (this.state.width === null) {
      this.setState({
        width: element.offsetWidth,
        placeHoldStyle: {
          width: element.offsetWidth,
          height: element.offsetHeight
        }
      });
    }
    let reallyNum, propsNum;
    if (props.offsetBottom !== undefined) {
      reallyNum = getElementViewBottom(element);
      propsNum = props.offsetBottom;
    } else {
      reallyNum = getElementViewTop(element);
      propsNum = props.offsetTop;
    }

    if (affix && reallyNum > propsNum) {
      this.setOutFixed();
    }
    if (!affix && reallyNum < propsNum) {
      this.setFixed();
    }
  };

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getStyleObj = () => {
    const { zIndex, offsetBottom, offsetTop } = this.props;
    const { position, width } = this.state;
    let styleObj = {};
    if (position === 'fixed') {
      styleObj = { position, zIndex, width };
      offsetBottom !== undefined
        ? (styleObj.bottom = offsetBottom)
        : (styleObj.top = offsetTop);
    } else {
      styleObj = { position };
    }
    return styleObj;
  };

  render() {
    const { prefix, className } = this.props;
    const wrapClass = cx(`${prefix}-affix`, className);
    return (
      <div style={this.state.placeHoldStyle}>
        <div className={wrapClass} style={{ ...this.getStyleObj() }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Affix;
