/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const RandomKeywordBubbles = ({
  width,
  height,
  data,
  overflow,
  graph,
  padding,
  labelFont,
  valueFont,
  bubbleClickFunc,
}) => {
  const svg = useRef();
  const renderBubbles = useCallback((width, nodes, color) => {
    const bubbleChart = d3.select(svg.current).append('g')
      .attr('class', 'bubble-chart')
      .attr('transform', () => `translate(${width * graph.offsetX},${width * graph.offsetY})`);

    const node = bubbleChart.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
        bubbleClickFunc(d.label);
      });

    node.append('circle')
      .attr('id', (d) => d.id)
      .attr('r', (d) => d.r - (d.r * 0.2))
      .style('fill', (d) => (d.data.color ? d.data.color : color(nodes.indexOf(d))))
      .style('z-index', 1)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).transition()
          .ease(d3.easeElastic)
          .duration(1000)
          .attr('r', d.r * 1.04);
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget).transition()
        .ease(d3.easeElastic)
        .duration(1000)
        .attr('r', d.r - (d.r * 0.2));
      });

    node.append('clipPath')
      .attr('id', (d) => `clip-${d.id}`)
      .append('use')
      .attr('xlink:href', (d) => `#${d.id}`);

    // node.append('text')
    //   .attr('class', 'value-text')
    //   .style('font-size', `${valueFont.size}px`)
    //   .attr('clip-path', (d) => `url(#clip-${d.id})`)
    //   .style('font-weight', () => (valueFont.weight ? valueFont.weight : 600))
    //   .style('font-family', valueFont.family)
    //   .style('fill', () => (valueFont.color ? valueFont.color : '#000'))
    //   .style('stroke', () => (valueFont.lineColor ? valueFont.lineColor : '#000'))
    //   .style('stroke-width', () => (valueFont.lineWeight ? valueFont.lineWeight : 0))
    //   .text((d) => d.value);

    node.append('text')
      .attr('class', 'label-text')
      .style('font-size', `${labelFont.size}px`)
      .attr('clip-path', (d) => `url(#clip-${d.id})`)
      .style('font-weight', () => (labelFont.weight ? labelFont.weight : 600))
      .style('font-family', labelFont.family)
      .style('fill', () => (labelFont.color ? labelFont.color : '#000'))
      .style('stroke', () => (labelFont.lineColor ? labelFont.lineColor : '#000'))
      .style('stroke-width', () => (labelFont.lineWeight ? labelFont.lineWeight : 0))
      .text((d) => d.label)
      .on('mouseover', (event, d) => {
        d3.select(`#${d.id}`).transition()
        .ease(d3.easeElastic)
        .duration(1000)
        .attr('r', d.r * 1.04);;
      })

    // Center the texts inside the circles.
    d3.selectAll('.label-text')
      // .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .style('opacity', (d) => {
        const textWidth = d.label.length * 10;
        d.hideLabel = textWidth * 1.05 > (d.r * 2);
        return d.hideLabel ? 0 : 1;
      })
      .attr('y', () => labelFont.size / 2);

    // Center the texts inside the circles.
    // d3.selectAll('.value-text')
    //   .attr('text-anchor', 'middle')
    //   .attr('y', (d) => {
    //     if (d.hideLabel) {
    //       return valueFont.size / 3;
    //     }
    //     return -valueFont.size * 0.5;
    //   });

    node.append('title')
      .text((d) => d.label);
  }, [bubbleClickFunc, graph.offsetX, graph.offsetY, labelFont, valueFont]);

  const renderChart = useCallback(() => {
    svg.current.innerHTML = '';
    // Allow bubbles overflowing its SVG container in visual aspect if props(overflow) is true.
    if (overflow) {
      svg.current.style.overflow = 'visible';
    }

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pack = d3.pack()
      .size([width * graph.zoom, width * graph.zoom])
      .padding(padding);

    // Process the data to have a hierarchy structure;
    const root = d3.hierarchy({ children: data })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
      .each((d) => {
        if (d.data.label) {
          d.label = d.data.label;
          d.id = d.data.label.toLowerCase().replace(/ |\//g, '-');
        }
      });

    // Pass the data to the pack layout to calculate the distribution.
    const nodes = pack(root).leaves();

    // Call to the function that draw the bubbles.
    renderBubbles(width, nodes, color);
  }, [overflow, width, graph, padding, data, renderBubbles]);

  useEffect(() => {
    if (width !== 0 && height !== 0) {
      renderChart();
    }
  }, [width, height, data, graph, renderChart]);

  return (
    <svg width={width} height={height} ref={svg} />
  );
};

RandomKeywordBubbles.propTypes = {
  overflow: PropTypes.bool,
  graph: PropTypes.shape({
    zoom: PropTypes.number,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })),
  padding: PropTypes.number,
  valueFont: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    weight: PropTypes.string,
    lineColor: PropTypes.string,
    lineWeight: PropTypes.number,
  }),
  labelFont: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    weight: PropTypes.string,
    lineColor: PropTypes.string,
    lineWeight: PropTypes.number,
  }),
  bubbleClickFunc: PropTypes.func,
};

RandomKeywordBubbles.defaultProps = {
  overflow: false,
  graph: {
    zoom: 1.1,
    offsetX: -0.05,
    offsetY: -0.01,
  },
  width: 1000,
  height: 800,
  data: [],
  padding: 0,
  valueFont: {
    family: 'Arial',
    size: 16,
    color: '#fff',
    weight: 'bold',
    lineColor: '#000',
    lineWeight: 0,
  },
  labelFont: {
    family: 'Arial',
    size: 11,
    color: '#fff',
    weight: 'normal',
    lineColor: '#000',
    lineWeight: 0,
  },
  bubbleClickFunc: (label) => { console.log(`Bubble ${label} is clicked ...`); },
};

export default RandomKeywordBubbles;
