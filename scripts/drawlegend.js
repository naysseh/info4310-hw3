  // Flexible legend-drawing function - Jeff Rzeszotarski, 2022
  //   Released under MIT Free license
  //  Takes in an SVG element selector <legendSelector> and a d3 color scale <legendColorScale>
  //
  // Usage example: drawLegend("#legendID", grossIncomeColorScale)



  // All credit given to Prof. Rzeszotarski! Thank you!

  // ***CHANGE***
  // Any changes we've made are marked with a ***CHANGE*** and then explained after that marker. We mainly tweaked small numbers and removed the different cases for scales (as we're only using quantile).


  function drawLegend(legendSelector, legendColorScale) {
    
    // This code should adapt to a variety of different kinds of color scales
    //  Credit Prof. Rz if you are basing a legend on this structure, and note PERFORMANCE CONSIDERATIONS
    
    // ***CHANGE***: changed the width that the bar shrinks in from the SVG from 10 to 30
    // Shrink legend bar by 15 px inwards from sides of SVG
    const offsets = { width: 30,
                      top: 2,
                      bottom: 24 }; 

    // Number of integer 'pixel steps' to draw when showing continuous scales
    //    Warning, not using a canvas element so lots of rect tags will be created for low stepSize, causing issues with performance -- keep this large
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
    
    // In this case the "data" are pixels, and we get numbers to use in colorScale
    // Use this to make axis labels
    let barScale = d3.scaleLinear().domain([legendMinMax[0]-minMaxExtension,
                                              legendMinMax[1]+minMaxExtension])
                                   .range([0,legendBarWidth]);
    let barAxis = d3.axisBottom(barScale);
    
    // Place for bar slices to live
    let bar = legend.append("g")
                    .attr("class", "legend colorbar")
                    .attr("transform", `translate(${offsets.width},${offsets.top})`)
    
    // ***CHANGE***: deleted nominal/continuous scale cases, as we're only using a quantile scale (and therefore we don't need an entire if statement - we can just execute on the case we need, which is a scale with quantiles).

    // if (legendColorScale.hasOwnProperty('thresholds') || legendColorScale.hasOwnProperty('quantiles')) {
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
        
        bar.append("rect")
           .attr("x", pixelStart)
           .attr("y", 0)
           .attr("width", pixelEnd - pixelStart )
           .attr("height", barHeight)
           .style("fill", legendColorScale( (dataStart + dataEnd) / 2.0 ) ); 
      }
    // }

    
    // Finally, draw legend labels
    legend.append("g")
          .attr("class", "legend axis")
          .attr("transform",`translate(${offsets.width},${offsets.top+barHeight+5})`)
          .call(barAxis);
    
  }