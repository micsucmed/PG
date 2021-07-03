import React from "react";
import * as d3 from "d3";
var { jStat } = require("jstat");

const Histogram = ({ data, p }) => {
  const canvas = d3.select("#histogramCanvas");

  const sdev = jStat(data).stdev();
  const mean = jStat(data).mean();
  var alpha = parseFloat(p) + parseFloat((1 - p) / 2);
  const z = jStat.normal.inv(alpha, 0, 1);
  const ic_l = mean - z * sdev;
  const ic_r = mean + z * sdev;

  canvas.selectAll("*").remove();

  const graph = function (data) {
    const processed = data;

    const widthValue = 700;
    const heightValue = 500;

    const svg = canvas.append("svg");
    svg.attr("viewBox", `0 0 ${widthValue} ${heightValue}`);

    const strokeWidth = 1.5;
    const margin = { top: 10, left: 50, bottom: 30, right: 10 };

    let g = svg.append("g").attr("transform", `translate(${margin.left},0)`);

    const width = 700 - margin.left - margin.right - strokeWidth * 2;
    const height = 500 - margin.top - margin.bottom;

    var bins = d3.bin().thresholds(30)(processed);

    var x = d3
      .scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([0, width]);

    var y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .range([height, 5]);

    const bars = g.selectAll("rect").data(bins);
    console.log(bars.enter());

    bars
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0);
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", function (d) {
        if (d.x1 > ic_l && d.x0 < ic_l) {
          g.append("rect")
            .attr("transform", "translate(" + x(d.x0) + "," + y(d.length) + ")")
            .attr("width", x(ic_l) - x(d.x0))
            .attr("height", height - y(d.length))
            .style("fill", "#69b3a2");

          g.append("rect")
            .attr("transform", "translate(" + x(ic_l) + "," + y(d.length) + ")")
            .attr("width", x(d.x1) - x(ic_l))
            .attr("height", height - y(d.length))
            .style("fill", "orange");
          return "transparent";
        }
        if (d.x0 < ic_r && d.x1 > ic_r) {
          g.append("rect")
            .attr("transform", "translate(" + x(d.x0) + "," + y(d.length) + ")")
            .attr("width", x(ic_r) - x(d.x0))
            .attr("height", height - y(d.length))
            .style("fill", "orange");

          g.append("rect")
            .attr("transform", "translate(" + x(ic_r) + "," + y(d.length) + ")")
            .attr("width", x(d.x1) - x(ic_r))
            .attr("height", height - y(d.length))
            .style("fill", "#69b3a2");
          return "transparent";
        }
        if (d.x0 > ic_l && d.x0 < ic_r) {
          return "orange";
        } else {
          return "#69b3a2";
        }
      });

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
      .text("Oil price (USD)");

    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 0)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Frequency");

    g.append("line")
      .attr("x1", x(ic_l))
      .attr("x2", x(ic_l))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "4");

    g.append("line")
      .attr("x1", x(ic_r))
      .attr("x2", x(ic_r))
      .attr("y1", y(0))
      .attr("y2", 0)
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "4");

    g.append("text")
      .attr("x", x(ic_l) - 42)
      .attr("y", 20)
      .text(`${parseFloat(ic_l.toFixed(5))}`)
      .style("font-size", "10px");

    g.append("text")
      .attr("x", x(ic_r) + 2)
      .attr("y", 20)
      .text(`${parseFloat(ic_r.toFixed(5))}`)
      .style("font-size", "10px");
  };

  return (
    <div>
      <div id="histogramCanvas">{graph(data)}</div>
    </div>
  );
};

export default Histogram;
