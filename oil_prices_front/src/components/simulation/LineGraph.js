import React from "react";

import * as d3 from "d3";
import * as d3Collection from "d3-collection";

const LineGraph = ({ data }) => {
  const canvas = d3.select("#canvas");

  canvas.selectAll("*").remove();

  const graph = function (data) {
    let processed = [];
    let temp = {};

    data.forEach((d, i) => {
      d.forEach((t, j) => {
        temp.day = i;
        temp.rep = j.toString();
        temp.price = t;
        processed.push(temp);
        temp = {};
      });
    });

    const widthValue = 700;
    const heightValue = 500;

    const svg = canvas.append("svg");
    svg.attr("viewBox", `0 0 ${widthValue} ${heightValue}`);

    const strokeWidth = 1.5;
    const margin = { top: 10, left: 50, bottom: 40, right: 10 };

    let g = svg.append("g").attr("transform", `translate(${margin.left},0)`);

    const width = 700 - margin.left - margin.right - strokeWidth * 2;
    const height = 500 - margin.top - margin.bottom;

    const sumstat = d3Collection
      .nest()
      .key(function (d) {
        return d.rep;
      })
      .entries(processed);

    var x = d3
      .scaleLinear()
      .domain(
        d3.extent(processed, function (d) {
          return d.day;
        })
      )
      .range([0, width]);

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(processed, function (d) {
          return +d.price;
        }),
      ])
      .range([height, 0]);

    var res = sumstat.map(function (d) {
      return d.key;
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

    const lines = g.selectAll(".line").data(sumstat);

    lines
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d.key);
      })
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return x(d.day);
          })
          .y(function (d) {
            return y(+d.price);
          })(d.values);
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
