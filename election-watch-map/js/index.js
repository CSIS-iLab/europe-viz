// Data Object
var data = {};
var electionTypes = [];

// Load in JSON for Country Data
const spreadsheetID = "1Dh3d3sPbaN976ASb2r9jM_epzZB2gAxrohcGeZDYlS8";
const spreadsheetTabName = "2023";
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${spreadsheetTabName}?key=AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4&majorDimension=ROWS`;
fetch(URL)
  .then(function (resp) {
    return resp.json();
  })
  .then(function (json) {
    data = {};
    const columnNames = json.values.shift();
    const lowerCaseColumnNames = columnNames.map((name) => name.toLowerCase());
    json.values.forEach(function (r) {
      var row = r;
      var rowData = {};

      row.forEach((ele, i) => {
        rowData[lowerCaseColumnNames[i]] = ele;
        if (
          lowerCaseColumnNames[i] === "category" &&
          electionTypes.indexOf(rowData[lowerCaseColumnNames[i]]) < 0
        ) {
          electionTypes.push(rowData[lowerCaseColumnNames[i]]);
        }
      });
      data[rowData["iso-3"]] = rowData;
    });

    drawSVG();
  });

function drawSVG() {
  //Width and height
  var width = 750;
  var height = 600;

  // Color Scales
  var color = d3.scale
    .ordinal()
    .domain(
      electionTypes.sort(
        (a, b) =>
          a.toLowerCase().split("election")[0].length -
          b.toLowerCase().split("election")[0].length
      )
    )
    .range(["#005f50", "#0faa91", "#115175"]);

  //Define map projection
  var projection = d3.geo
    .mercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
    .center([12, 52]) //comment centrer la carte, longitude, latitude
    .translate([width / 2, height / 2]) // centrer l'image obtenue dans le svg
    .scale([width / 1.2]); // zoom, plus la valeur est petit plus le zoom est gros

  //Define path generator
  var path = d3.geo.path().projection(projection);

  //Create SVG
  var svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "map");

  //Load in GeoJSON data
  d3.json("world.json", function (json) {
    // Draw individual country paths
    svg
      .append("g")
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function (d) {
        return d.properties.iso_a3;
      })
      .attr("class", function (d) {
        if (data[d.properties.iso_a3] != undefined) {
          return "hasData";
        }
      })
      .attr("stroke", "#cebe98")
      .attr("fill", function (d) {
        if (data[d.properties.iso_a3] != undefined) {
          return color(data[d.properties.iso_a3].category);
        } else {
          return "#fdf6df";
        }
      })
      .on("mouseover", function (d) {
        if (data[d.properties.iso_a3] != undefined) {
          var path = d3.select(this);
          path.transition().duration(300);
          d3.select(".tooltip")
            .html(
              "<span class='title'>" +
                d.properties.name +
                "</span><strong>Type:</strong> " +
                data[d.properties.iso_a3].category +
                "<br /><strong>Date:</strong> " +
                data[d.properties.iso_a3].date
            )
            .style("display", "block")
            .style("left", function (d) {
              if (d3.mouse(path.node())[0] >= width - 150) {
                return d3.event.pageX - 100 + "px";
              } else {
                return d3.event.pageX + "px";
              }
            })
            .style("top", d3.event.pageY - 28 + "px");
        }
      })
      .on("mouseout", function (d) {
        if (data[d.properties.iso_a3] != undefined) {
          d3.select(this).transition().duration(300);
          d3.select(".tooltip").style("display", "none");
        }
      })
      .on("click", function (d) {
        if (data[d.properties.iso_a3] != undefined) {
          window.parent.location.href = data[d.properties.iso_a3]["pageurl"];
        }
      });

    // Legend
    svg
      .append("rect")
      .attr("class", "legend-container")
      .style(
        "transform",
        "translate(" + width / 2.25 + "px, " + (height - 30) + "px)"
      );

    var legendSpacing = 15;
    var legendWidth = 2.35;
    var legend = svg
      .append("g")
      .attr("id", "legendContainer")
      .selectAll("g")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        if (d == "Election") {
          var xPos = 32;
        } else {
          var xPos = 0;
        }
        var x = i * 125 + width / legendWidth + xPos;
        var y = height - 15;
        return "translate(" + x + "," + y + ")";
      });

    // Draw rects, and color them by original_index
    legend
      .append("circle")
      .classed("scaleCircle", true)
      .attr("r", 5)
      .style("fill", color);

    legend
      .append("text")
      .classed("scaleCircleLabel", true)
      .attr("x", 12)
      .attr("y", 20 - legendSpacing)
      .text(function (d) {
        return d;
      });
  });
}
