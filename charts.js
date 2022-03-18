function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
   var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
      var result = resultArray[0];
      console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var sampleLables = result.otu_ids;
  var sampleValues = result.sample_values;
  var hoverText = result.otu_lables;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
   var yticks = sampleLables.map(label => "OTU" + label).slice(0,10).reverse();
   var xticks = sampleValues.map(val => parseInt(val)).slice(0,10).reverse();
  
   
    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: xticks,
      y: yticks,
      type: "bar",
      text: sampleLables.slice(0,10).reverse(),
      orientation: "h"
    };
      var barData = [barTrace];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria cultures Found",
     showticklables: true
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // --------------------------------------------------
   
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: sampleLables,
      y: sampleValues,
      text: hoverText,
      mode: "markers",
      marker: {
        size:sampleValues,
        color:sampleLables
      }
    };
    var bubbleData =[bubbleTrace];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
     title: "Bacteria Culture Per Sample",
     xaxis: {title:"OTU ID"},
     hovermode: 'closest',
     hoverlabel: hoverText
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 
  //-----------------------------------------------
  
  // Create a variable that holds the samples array. 

    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
  var metadata = data.metadata;
  var resultArray2 = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
  var result2 = resultArray2[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
  var wash_freq = parseInt(result2.wfreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash_freq,
      title: {text: "Belly Button Washing Frequency<br>Scrubs Per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10], tickwidth: 1, tickcolor: "black"},
        bar: {color: "black"},
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ]
      } 
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600,height:400};
     

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout);
  });
}



