var oldWidth = 0
function render([state, edu, industry]){

    // console.log(state)
    // console.log(edu)
    // console.log(industry)
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var width = height = d3.select('#graph').node().offsetWidth
  var r = 40


  if (innerWidth <= 925){
    width = innerWidth
    height = innerHeight*.7
  }

  // return console.log(width, height)

  ///////////// START LOLLIPOP CHART ///////////////////////

  var max_salary_pay = d3.max(state, d=> d.median_salary_full)

var t = d3.transition().duration(1000).ease(d3.easeElastic)
var svg = d3.select('svg')
    .append('g').attr("transform", "translate(150,50)")
var margin = {top: 10, right: 30, bottom: 90, left: 40}
   // width = 960 - margin.left - margin.right,
    //height = 600 - margin.top - margin.bottom;

    function update_gender_gap() {
        console.log("gender_gap chart")
        
    
        var gap_line = svg.selectAll("myline")
        .data(state).enter().append("line")
        .sort(function(a, b) {
            return b.salary_gender_gap - a.salary_gender_gap;
          });
        gap_line
        .attr("x1", function(d) { return x(d.median_salary_male); })
        .attr("x2", function(d) { return x(d.median_salary_female); })
        .attr("y1", function(d) { return y(d.state_name); })
        .attr("y2", function(d) { return y(d.state_name); })
        .attr("stroke", "grey")
        .attr("stroke-width", "0px")
        gap_line
        .transition().duration(1000)
        .attr("stroke-width", "2px")
    
    
        // Circle salary female
        var femcircle = svg.selectAll("thecircle")
        .data(state).enter().append('circle')
        .sort(function(a, b) {
            return b.salary_gender_gap - a.salary_gender_gap;
          });
        femcircle.attr("cy", function(d) { return y(d.state_name); })
        .attr("cx", function(d) { return x(d.median_salary_female); })
        .attr("r", 0)
    
        femcircle
        .transition().duration(1000).ease(d3.easeElastic)
        .attr("r","8")
        .style("fill", "#cab2d6");

        svg.selectAll("circle")
        .data(state)
        .sort(function(a, b) {
            return b.salary_gender_gap - a.salary_gender_gap;
          })
        .transition().duration(1000).ease(d3.easeElastic)
        .attr("cy", function(d) { return y(d.state_name); })
        .attr("cx", function(d) { return x(d.median_salary_male); })
        .attr("r", "8")
        .style("fill", "#1f78b4");


        
        svg.selectAll("thecircle")
        .data(state).exit().remove()
        svg.selectAll("myLine")
        .data(state).exit().remove()
    
    }
    
    
    
    // Circle salary full
    
    function median_salary(){
    
        console.log("median chart")
    
        var salary_exit = svg.selectAll('circle').data(state)
        
    
        var salary = salary_exit.enter().append('circle').style("fill", "#33a02c")
        

    
        salary.merge(salary_exit)
        .transition().duration(1000).ease(d3.easeLinear)
        .attr("cy", function(d) { return y(d.state_name); })
        .attr("cx", function(d) { return x(d.median_salary_full); })
        .attr("r", "8")
    
        salary_exit.exit().remove()
        svg.selectAll("line").data(state).exit().remove()
        
    }


  ////////////// END LOLLIPOP CHART //////////////////////////


  ///////////// START 1ST CONTAINER ////////////////////////////

  var svg = d3.select('.container-1 #graph')
    .append('svg')
    .attr('width', width + 'px')
    .attr('height', height + 'px')
    .append('g').attr("transform", "translate(150,0)")
  // Add Y axis
var y = d3.scaleBand()
.range([ (height-50),0 ])
.domain(state.map(function(d) { return d.state_name; }))
.padding(1);

// Add X axis
var x = d3.scaleLinear()
.domain([0, max_salary_pay])
.range([ 0, width-200]);

svg.append("g")
.attr("transform", "translate(0," + (height-50)+")")
.call(d3.axisBottom(x));


svg.append("g")
  .call(d3.axisLeft(y))
  //.attr("transform", "translate(150, 50)")
  .selectAll("text")
  .style("text-anchor", "end");
   // .attr("transform", "translate(-10,0)rotate(-45)")

   svg.selectAll('circle')
    .data(state).enter().append('circle')
    .sort(function(a, b) {
        return b.median_salary_full - a.median_salary_full;
      })
    .transition().duration(1000).ease(d3.easeElastic)
    .attr("cy", function(d) { return y(d.state_name); })
    .attr("cx", function(d) { return x(d.median_salary_full); })
    .attr("r", "4")
    .style("fill", "#33a02c");

  var gs = d3.graphScroll()
      .container(d3.select('.container-1'))
      .graph(d3.selectAll('.container-1 #graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-1 #sections > div'))
      .offset(innerWidth < 900 ? innerHeight - 250 : 500)
      .on('active', function(i){
        console.log(i + 'th section active')
        
        if(i == 0){
            median_salary()

        }
        else if (i == 2){
            update_gender_gap()

        }
          
      })

    
      ///////////// END 1ST CONTAINER ////////////////////////////



    const par_tooltip = d3.select('.container-2 #graph')
    .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")



  var svg2 = d3.select('.container-2 #graph')
    .append('svg')
    .attr("viewBox", [0, 0, width, height])
    .attr('width', width + 'px')
    .attr('height', height + 'px')

    

    //color = d3.scaleOrdinal(["1"], ["#da4f81"]).unknown("#ccc")
    var keys = ['education','field_of_study','salary_range']
    color = d3.scaleOrdinal().domain([1,2,3])
    .range(["#fbb4ae","#b3cde3","#ccebc5","#decbe4"]);
    //"#fbb4ae","#b3cde3","#ccebc5","#decbe4"

    sankey = d3.sankey()
    .nodeSort(undefined)
    .linkSort(null)
    .nodeWidth(4)
    .nodePadding(20)
    .extent([[0, 5], [width, height - 5]])

    function create_graph(){
        let index = -1;
        const nodes = [];
        const nodeByKey = new Map;
        const indexByKey = new Map;
        const links = [];
      
        for (const k of keys) {
          for (const d of edu) {
            const key = JSON.stringify([k, d[k]]);
            if (nodeByKey.has(key)) continue;
            const node = {name: d[k]};
            nodes.push(node);
            nodeByKey.set(key, node);
            indexByKey.set(key, ++index);
          }
        }
      
        for (let i = 1; i < keys.length; ++i) {
          const a = keys[i - 1];
          const b = keys[i];
          const prefix = keys.slice(0, i + 1);
          const linkByKey = new Map;
          for (const d of edu) {
            const names = prefix.map(k => d[k]);
            const key = JSON.stringify(names);
            const value = d.value || 1;
            let link = linkByKey.get(key);
            if (link) { link.value += value; continue; }
            link = {
              source: indexByKey.get(JSON.stringify([a, d[a]])),
              target: indexByKey.get(JSON.stringify([b, d[b]])),
              names,
              value
            };
            links.push(link);
            linkByKey.set(key, link);
          }
        }
      
        return {nodes, links}
    }
    graph =  create_graph();
    console.log(graph)

      
    const showParTooltip = function(event, d) {
        par_tooltip
            .transition()
            .duration(200)
        par_tooltip
            .style("opacity", 1)
            .html(`${d.names.join(" → ")}\n${d.value.toLocaleString()}`)
            .style("left", event.x-300 + "px")
            .style("top", event.y + "px")
        }
    const moveParTooltip = function(event, d) {
        par_tooltip
            .style("opacity", 1)
            .style("left", event.x-300 + "px")
            .style("top", event.y + "px")
        }
    const hideParTooltip = function(event, d) {
        par_tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        }

         



  const {nodes, links} = sankey({
    nodes: graph.nodes.map(d => Object.assign({}, d)),
    links: graph.links.map(d => Object.assign({}, d))
  });

  svg2.append("g")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
    .append("title")
      .text(d => d.name + "<br>" + d.value.toLocaleString());

    links_s = svg2.append("g")
      .attr("fill", "none")
    .selectAll("g")
    .data(links).join("path");
    links_s
    .transition().duration(1000)
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => color(d.names[0]))
      .attr("stroke-width", d => d.width)
      .style("mix-blend-mode", "multiply");
    links_s
    .on("mouseover", showParTooltip )
    .on("mousemove", moveParTooltip )
    .on("mouseleave", hideParTooltip )
    // links_s
    // .append("title")
    //   .text(d => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`);

  svg2.append("g")
      .style("font", "10px sans-serif")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name)
    .append("tspan")
      .attr("fill-opacity", 0.7)
      .text(d => ` ${d.value.toLocaleString()}`);

  //return svg.node();

    ///////////// END PARALLEL SET FUNCTIONS ////////////////////////////


  ///////////// START 2ND CONTAINER ////////////////////////////



  var gs2 = d3.graphScroll()
      .container(d3.select('.container-2'))
      .graph(d3.selectAll('.container-2 #graph'))
      .eventId('uniqueId2')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-2 #sections > div'))
      .offset(innerWidth < 900 ? innerHeight - 70 : 200)
      .on('active', function(i){

      })


      ///////////// END 2ND CONTAINER ////////////////////////////



      /////////////// START BUBBLE CHART FUNCTIONS ////////////////////////


        const centre = { x: width/2, y: height/2 };
      
        // strength to apply to the position forces
        const forceStrength = 0.03;
      
        // these will be set in createNodes and chart functions
        let svg3 = null;
        let bubbles = null;
        let labels = null;
        let nodes_bubble = [];
      
        // charge is dependent on size of the bubble, so bigger towards the middle
        function charge(d) {
          return Math.pow(d.radius, 2.0) * 0.01
        }
      
        // create a force simulation and add forces to it
        const simulation = d3.forceSimulation()
          .force('charge', d3.forceManyBody().strength(charge))
          // .force('center', d3.forceCenter(centre.x, centre.y))
          .force('x', d3.forceX().strength(forceStrength).x(centre.x))
          .force('y', d3.forceY().strength(forceStrength).y(centre.y))
          .force('collision', d3.forceCollide().radius(d => d.radius + 1));
      
        // force simulation starts up automatically, which we don't want as there aren't any nodes yet
        simulation.stop();
      
        // set up colour scale
        const fillColour = d3.scaleOrdinal()
            .domain(["1", "2", "3", "5", "99"])
            //.range(d3.schemePaired)
            .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"])
            //["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
            //.range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#AAAAAA"]);
      
        // data manipulation function takes raw data from csv and converts it into an array of node objects
        // each node will store data and visualisation values to draw a bubble
        // industry is expected to be an array of data objects, read in d3.csv
        // function returns the new node array, with a node for each element in the industry input
        function createNodes(industry) {
          // use max size in the data as the max in the scale's domain
          // note we have to ensure that size is a number
          const maxSize = d3.max(industry, d => +d.count);
      
          // size bubbles based on area
          const radiusScale = d3.scaleSqrt()
            .domain([0, maxSize])
            .range([0, 80])
      
          // use map() to convert raw data into node data
          const myNodes = industry.map(d => ({
            ...d,
            radius: radiusScale(+d.count),
            size: +d.count,
            x: Math.random() * 900,
            y: Math.random() * 800
          }))
      
          return myNodes;
        }
      
    
      nodes_bubble = createNodes(industry);
      
          // create svg element inside provided selector
          svg3 = d3.select('.container-3 #graph').append('svg')
            .attr('width', width)
            .attr('height', height)
         
    
        // Lavel tooltip
    
        const showTooltip = function(event, d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("Median: " + d3.format("($.2f")(d.median) +"<br> Industry: " + d.industry+"<br> Median_Group: " + d.median_group)
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
        }
        const moveTooltip = function(event, d) {
        tooltip
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
        }
        const hideTooltip = function(event, d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        }
         // bind nodes data to circle elements
         var elements = svg3.selectAll('.bubble')
         .data(nodes_bubble, d => d.id)
         .enter()
         .append('g')
         .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )
    
      
        bubbles = elements
        .append('circle')
        .classed('bubble', true)
        .attr('r', d => d.radius)
        .style('fill', d => fillColour(d.median_group))
        
            
            
      
    // // labels
    // labels = elements
    // .append('text')
    // .attr('dy', '.3em')
    // .style('text-anchor', 'middle')
    // .style('font-size', 10)
    // .text(function(d){
    //     return("")
        
    // })
    

    const tooltip = d3.select('.container-3 #graph')
    .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")


    // set simulation's nodes to our newly created nodes array
    // simulation starts running automatically once nodes are set
    simulation.nodes(nodes_bubble)
    .on('tick', ticked)
    .restart();
        
      
        // callback function called after every tick of the force simulation
        // here we do the actual repositioning of the circles based on current x and y value of their bound node data
        // x and y values are modified by the force simulation
        function ticked() {
          bubbles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
      
        }
    /////////// END OF BUBBLE CHART FUNCTIONS /////////////
    
    
    /////////// START 3RD CONTAINER /////////////////////////////
     
  var gs3 = d3.graphScroll()
      .container(d3.select('.container-3'))
      .graph(d3.selectAll('.container-3 #graph'))
      .eventId('uniqueId3')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-3 #sections > div'))
      .offset(innerWidth < 900 ? innerHeight - 70 : 200)
      .on('active', function(i){

        console.log("3: ", i)
        simulation
            .alpha(1) 
           // .on('tick', ticked)
            .restart();

        
        
      })

      ///////////// END 3RD CONTAINER ////////////////////////////

}
var promises = [
    d3.json('./data/state_full.json'),
    d3.json('./data/edu_industry.json'),
    d3.json('./data/industry_full.json')
  ]
  //
  Promise.all(promises).then((render)
  ).catch(function(err) {
    console.log(err)
})

d3.select(window).on('resize', render)
