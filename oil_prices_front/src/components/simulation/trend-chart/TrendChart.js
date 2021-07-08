import React from "react";

import * as d3 from "d3";

const TrendChart = ({ data }) => {
  const canvas = d3.select("#trendCanvas");

  canvas.selectAll("*").remove();

  const graph = function (data) {
    const widthValue = 700;
    const heightValue = 500;

    const svg = canvas.append("svg");
    svg.attr("viewBox", `0 0 ${widthValue} ${heightValue}`);

    const strokeWidth = 1.5;
    const margin = { top: 10, left: 50, bottom: 30, right: 100 };

    let g = svg.append("g").attr("transform", `translate(${margin.left},0)`);

    const width = 700 - margin.left - margin.right - strokeWidth * 2;
    const height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear().domain([0, data[0].length]).range([0, width]);

    if (data.length > 2) {
      var y = d3
        .scaleLinear()
        .domain([
          d3.min(data[4], (d) => d3.min(d)),
          d3.max(data[4], (d) => d3.max(d)),
        ])
        .range([height, 10]);
    } else {
      y = d3
        .scaleLinear()
        .domain([
          d3.min(data[0], (d) => d3.min(d)),
          d3.max(data[0], (d) => d3.max(d)),
        ])
        .range([height, 0]);
    }

    const color = ["#63CCCA", "#00A5CF", "#256EFF", "#2A4494", "#122C34"];

    for (var j = data.length - 1; j >= 0; j--) {
      g.append("path")
        .datum(data[j])
        .attr("fill", color[j])
        .attr("stroke", "none")
        .attr(
          "d",
          d3
            .area()
            .x(function (d, i) {
              return x(i);
            })
            .y0(function (d) {
              return y(d[0]);
            })
            .y1(function (d) {
              return y(d[1]);
            })
        );
    }

    g.append("g")
      .classed("x--axis", true)
      .call(d3.axisBottom(x))
      .attr("transform", `translate(0, ${height})`);

    g.append("g").classed("y--axis", true).call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 35)
      .text("Day of simulation");

    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 0)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Oil price (USD)");
    svg
      .append("circle")
      .attr("cx", 610)
      .attr("cy", 130)
      .attr("r", 6)
      .style("fill", "#122C34");
    svg
      .append("circle")
      .attr("cx", 610)
      .attr("cy", 160)
      .attr("r", 6)
      .style("fill", "#2A4494");
    svg
      .append("circle")
      .attr("cx", 610)
      .attr("cy", 190)
      .attr("r", 6)
      .style("fill", "#256EFF");
    svg
      .append("circle")
      .attr("cx", 610)
      .attr("cy", 220)
      .attr("r", 6)
      .style("fill", "#00A5CF");
    svg
      .append("circle")
      .attr("cx", 610)
      .attr("cy", 250)
      .attr("r", 6)
      .style("fill", "#63CCCA");
    svg
      .append("text")
      .attr("x", 600)
      .attr("y", 100)
      .text("Certainty bounds")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 620)
      .attr("y", 130)
      .text("95%")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 620)
      .attr("y", 160)
      .text("90%")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 620)
      .attr("y", 190)
      .text("50%")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 620)
      .attr("y", 220)
      .text("25%")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 620)
      .attr("y", 250)
      .text("10%")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  };

  return (
    <div>
      <div id="trendCanvas">{graph(data)}</div>
    </div>
  );
};

export default TrendChart;
