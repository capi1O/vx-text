import PropTypes from 'prop-types';
import React, { Component } from 'react';
import reduceCSSCalc from 'reduce-css-calc';
import getStringWidth from './util/getStringWidth';

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordsByLines: []
    };
  }

  componentWillMount() {
    this.updateWordsByLines(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    const needCalculate =
      this.props.children !== nextProps.children || this.props.style !== nextProps.style;
    this.updateWordsByLines(nextProps, needCalculate);
  }

  updateWordsByLines(props, needCalculate) {
    // Only perform calculations if using features that require them (multiline, scaleToFit)
    if (props.width || props.scaleToFit) {
      if (needCalculate) {
        const words = props.children ? props.children.toString().split(/\s+/) : [];

        this.wordsWithComputedWidth = words.map(word => ({
          word,
          width: getStringWidth(word, props.style)
        }));
        this.spaceWidth = getStringWidth('\u00A0', props.style);
      }

      const wordsByLines = this.calculateWordsByLines(
        this.wordsWithComputedWidth,
        this.spaceWidth,
        props.width * props.scale
      );
      this.setState({ wordsByLines });
    } else {
      this.updateWordsWithoutCalculate(props);
    }
  }

  updateWordsWithoutCalculate(props) {
    const words = props.children ? props.children.toString().split(/\s+/) : [];
    this.setState({ wordsByLines: [{ words }] });
  }

  calculateWordsByLines(wordsWithComputedWidth, spaceWidth, lineWidth) {
    const { scaleToFit } = this.props;
    return wordsWithComputedWidth.reduce((result, { word, width }) => {
      const currentLine = result[result.length - 1];

      if (
        currentLine &&
        (lineWidth == null || scaleToFit || currentLine.width + width + spaceWidth < lineWidth)
      ) {
        // Word can be added to an existing line
        currentLine.words.push(word);
        currentLine.width += width + spaceWidth;
      } else {
        // Add first word to line or word is too long to scaleToFit on existing line
        const newLine = { words: [word], width };
        result.push(newLine);
      }

      return result;
    }, []);
  }

  leftShift() {
    const { align, width, x } = this.props;

    switch (align) {
      case 'left':
        return x;
      case 'center':
        return width / 2;
      case 'right':
        return width;
      default:
        console.error(`unsupported align value ${align}`);
        return x;
    }
  }

  textAnchor() {
    const { align } = this.props;

    switch (align) {
      case 'left':
        return 'start';
      case 'center':
        return 'middle';
      case 'right':
        return 'end';
      default:
        console.error(`unsupported align value ${align}`);
        return 'start';
    }
  }

  render() {
    const {
      dx,
      dy,
      textAnchor,
      verticalAnchor,
      scale,
      align,
      defs,
      scaleToFit,
      angle,
      lineHeight,
      capHeight,
      lineProps,
      innerRef,
      ...textProps
    } = this.props;
    const { wordsByLines } = this.state;

    const { x, y } = textProps;

    let startDy;
    switch (verticalAnchor) {
      case 'start':
        startDy = reduceCSSCalc(`calc(${capHeight})`);
        break;
      case 'middle':
        startDy = reduceCSSCalc(
          `calc(${(wordsByLines.length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`
        );
        break;
      default:
        startDy = reduceCSSCalc(`calc(${wordsByLines.length - 1} * -${lineHeight})`);
        break;
    }

    const transforms = [];
    if (scaleToFit && wordsByLines.length) {
      const lineWidth = wordsByLines[0].width;
      const sx = (this.props.width * scale) / lineWidth;
      const sy = sx;
      const originX = x - sx * x;
      const originY = y - sy * y;
      transforms.push(`matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`);
    }
    if (angle) {
      transforms.push(`rotate(${angle}, ${x}, ${y})`);
    }
    if (transforms.length) {
      textProps.transform = transforms.join(' ');
    }

    return (
      <svg
        ref={innerRef}
        x={dx}
        y={dy}
        fontSize={textProps.fontSize}
        style={{ overflow: 'visible' }}
      >
        <defs>{defs}</defs>
        <text {...textProps} textAnchor={textAnchor}>
          {wordsByLines.map((line, index) => (
            <tspan
              x={this.leftShift()}
              textAnchor={this.textAnchor()}
              dy={index === 0 ? startDy : lineHeight}
              {...lineProps}
              key={index}
            >
              {line.words.join(' ')}
            </tspan>
          ))}
        </text>
      </svg>
    );
  }
}

Text.defaultProps = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  lineHeight: '1em',
  capHeight: '0.71em', // Magic number from d3
  scaleToFit: false,
  textAnchor: 'start',
  verticalAnchor: 'end', // default SVG behavior
  scale: 1,
  align: 'left',
  defs: null,
  lineProps: {}
};

Text.propTypes = {
  scaleToFit: PropTypes.bool,
  angle: PropTypes.number,
  textAnchor: PropTypes.oneOf(['start', 'middle', 'end', 'inherit']),
  verticalAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
  style: PropTypes.objectOf(PropTypes.string),
  scale: PropTypes.number,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  defs: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lineHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  capHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lineProps: PropTypes.objectOf(PropTypes.string)
};

export default Text;
