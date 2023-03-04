// Flexible legend-drawing function - Jeff Rzeszotarski, 2022
  //   Released under MIT Free license
  //  Takes in an SVG element selector <legendSelector> and a d3 color scale <legendColorScale>
  //


  // *******
  // Credit for this JS script file goes to Professor Rzeszotarski. This code was found in the github repository for INFO 3300 F22 under lecture October 3. Thank you!
  // *******


  // ***CHANGE***: Note that changes made to this example code by our group are marked with the marker (***CHANGE***) that precedes this notice. The biggest way we changed this code was that it only functions in one case (on a quantize scale), and that the legend will now be vertical rather than horizontal. We didn't alter any of the stepSize variables so there was no noticable issue with performance.

  function drawLegend(legendSelector, legendColorScale) {

    const offsets = { width: 10,
                      top: 2,
                      bottom: 24 };
    // Number of integer 'pixel steps' to draw when showing continuous scales
    const stepSize = 4;
    // Extend the minmax by 0% in either direction to expose more features by default
    const minMaxExtendPercent = 0;

    const legend = d3.select(legendSelector);
    const legendHeight = legend.attr("height");
    const legendBarWidth = legend.attr("width") - (offsets.width * 2);
    const legendMinMax = d3.extent(legendColorScale.domain());
                // recover the min and max values from most kinds of numeric scales
    const minMaxExtension = (legendMinMax[1] - legendMinMax[0]) * minMaxExtendPercent;
    const barHeight = legendHeight - offsets.top - offsets.bottom;

    // ***CHANGE***: Created a variable called bar width in order to keep track of how big the colors should be, because our bar is vertical.
    const barWidth = legendBarWidth - offsets.width;

    // ***CHANGE***: Changed range of the barScale to be in relation to the legend's height (instead of width), because our legend is now vertical.
    let barScale = d3.scaleLinear().domain([legendMinMax[0]-minMaxExtension,
                                              legendMinMax[1]+minMaxExtension])
                                   .range([10,legendHeight-5]);

    // ***CHANGE***: Added in .tickFormat to the axis scale to allow us to add a percentage sign. Changed from axisBottom to axisLeft because our legend is vertical, and we want the axis on the left.
    let barAxis = d3.axisLeft(barScale).tickFormat(d => d);

    // ***CHANGE***: Changed the transform attribute to only move the bar chunks area on the x axis, with no vertical transform.
    let bar = legend.append("g")
                    .attr("class", "colorbar")
                    .attr("transform", `translate(${offsets.width+30})`);

    // Check if we're using a binning scale - if so, we make blocks of color
    if (legendColorScale.hasOwnProperty('thresholds') || legendColorScale.hasOwnProperty('quantiles')) {
      // Get the thresholds
      let thresholds = [];
      if (legendColorScale.hasOwnProperty('thresholds')) { thresholds = legendColorScale.thresholds() }
      else { thresholds = legendColorScale.quantiles() }

      const barThresholds = [legendMinMax[0], ...thresholds, legendMinMax[1]];

      // Use the quantile breakpoints plus the min and max of the scale as tick values
      barAxis.tickValues(barThresholds);

      // Draw rectangles between the threshold segments
      for (let i=0; i<barThresholds.length-1; i++) {
        let dataStart = barThresholds[i];
        let dataEnd = barThresholds[i+1];
        let pixelStart = barAxis.scale()(dataStart);
        let pixelEnd = barAxis.scale()(dataEnd);

        // ***CHANGE***: Changed the positioning of the rectangle by swapping out the x and y positions, and swapping the width and height (so that our bar can be vertical).
        bar.append("rect")
           .attr("x", 0)
           .attr("y", pixelStart)
           .attr("width", barWidth)
           .attr("height", pixelEnd - pixelStart)
           .style("fill", legendColorScale( (dataStart + dataEnd) / 2.0 ) );
      }
    }

    // ***CHANGE***: Again we are not transforming the legend vertically anymore (because it is vertical), so we changed this to only translate by the width offset + some extra pixels.
    legend.append("g")
          .attr("class", "axis")
          .attr("transform",`translate(${offsets.width+25})`)
          .call(barAxis);

  }
  // ***CHANGE***: Deleted the other cases originally included in this function, as mentioned in the first comment. We tailored it to only apply to our one case (in which we use scale quantize).
