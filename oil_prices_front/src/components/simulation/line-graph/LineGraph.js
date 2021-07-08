import React from "react";

import * as d3 from "d3";

const LineGraph = ({ data }) => {
  const canvas = d3.select("#canvas");

  canvas.selectAll("*").remove();

  const graph = function (data) {
    // let processed = [];
    // let temp = {};
    // let n = data.length;
    // let days = Array.from(Array(n).keys());
    // data = d3.transpose(data);

    // data.forEach((d, i) => {
    //   temp.rep = i;
    //   temp.values = d;
    //   processed.push(temp);
    //   temp = {};
    // });

    // const dataFinal = { y: "Oil prices (USD)", series: processed, days: days };

    const widthValue = 700;
    const heightValue = 500;

    const svg = canvas.append("svg");
    svg
      .attr("viewBox", `0 0 ${widthValue} ${heightValue}`)
      .style("overflow", "visible");

    const strokeWidth = 1.5;
    const margin = { top: 10, left: 50, bottom: 40, right: 10 };

    let g = svg.append("g").attr("transform", `translate(${margin.left},0)`);

    const width = 700 - margin.left - margin.right - strokeWidth * 2;
    const height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear().domain([0, data.length]).range([0, width]);

    data = d3.transpose(data);

    var y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d3.min(d)), d3.max(data, (d) => d3.max(d))])
      .range([height, 0]);

    var res = data.map(function (d, i) {
      return i;
    }); // list of group names
    var color = d3
      .scaleOrdinal()
      .domain(res)
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
        "#999999",
      ]);

    const path = g.selectAll("path").data(data);

    path
      .join("path")
      // .style("mix-blend-mode", "multiply")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d);
      })
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", function (d) {
        return d3
          .line()
          .x((d, i) => x(i))
          .y((d) => y(d))(d);
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
      .text("Day of simulation");

    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Oil price (USD)");
  };

  return (
    <div>
      <div id="canvas">{graph(data)}</div>
    </div>
  );
};

export default LineGraph;
