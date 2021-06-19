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

  ///////////////   COLORS /////////////////////////////

  

  // Parset Colors

  highschool_color = d3.scaleOrdinal(["No Formal Education"], ["#da4f81"]).unknown("#ccc")
  primary_color = d3.scaleOrdinal(["Primary"], ["#da4f81"]).unknown("#ccc")
  secondary_color = d3.scaleOrdinal(["Secondary"], ["#da4f81"]).unknown("#ccc")
  tertiary_color = d3.scaleOrdinal(["Tertiary"], ["#da4f81"]).unknown("#ccc")
  var keys = ['education','field_of_study','salary_range']
  color = d3.scaleOrdinal().domain([1,2,3])
  .range(["#fbb4ae","#b3cde3","#ccebc5","#decbe4"]);

  // Bubblechart

  fillColour = d3.scaleOrdinal()
  .domain(["1", "2", "3", "4"])
  .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"])


  /////////////// START LEGENDS ////////////////////////

  ///// LOLLIPOP LEGENDS ///////

  ///// END LOLLIPOP LEGENDS ///////

  ///// BUBBLECHART LEGENDS ///////

  // legend
  var valuesToShow = [100, 1000, 3000]

  leg_height = 200
  leg_width = 300
  xCircle = leg_width/3
  xLabel = (leg_width/3) + 100
  leg_padding = 30

  var z = d3.scaleSqrt()
    .domain([0, 5000])
    .range([ 2, 100]);
    
  var legend = d3.select('#bubble_legend').append('svg')
    .attr('class','svg_legend')
    .attr('width',leg_width+'px')
    .attr('height', leg_height + 'px');

  legend
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function(d){ return leg_height - leg_padding - z(d) } )
    .attr("r", function(d){ return z(d) })
    .style("fill", "none")
    .attr("stroke", "black")

// Add legend: segments
  legend
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
    .attr('x1', function(d){ return xCircle + z(d) } )
    .attr('x2', xLabel)
    .attr('y1', function(d){ return leg_height - leg_padding - z(d) } )
    .attr('y2', function(d){ return leg_height - leg_padding - z(d) } )
    .attr('stroke', 'black')
    .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    legend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return leg_height - leg_padding - z(d) } )
        .text( function(d){ return d} )
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    legend.append("text")
      .attr('x', xCircle + 15)
      .attr("y", leg_height - 5 )
      .text("Total Number of Industry Workers")
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
  

    //label

    var bubble_label = d3.select('#bubble_label').append('svg')
    .attr('class','svg_legend')
    .attr('width',leg_width+'px')
    .attr('height', leg_height + 'px');

    var size = 20
    var allgroups = ["0 - 2500", "2500 - 3500", "3500 - 5000", "More than 5000"]
    bubble_label
    .selectAll('bubble_label')
      .data(allgroups)
      .enter()
      .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return fillColour(d)})
        // .on("mouseover", highlight)
        // .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    bubble_label
    .selectAll('bubble_label')
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", 10 + size*.8)
        .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return fillColour(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "16px")
        // .on("mouseover", highlight)
        // .on("mouseleave", noHighlight)


  ///// END BUBBLECHART LEGENDS ///////

  //BUBBLE LEGEND


  //BUBBLE LABEL


  /////////////// END LEGENDS ////////////////////////

  ///////////// START LOLLIPOP CHART ///////////////////////

var max_salary_pay = d3.max(state, d=> d.median_salary_full)
const national_median = 2207.25

var t = d3.transition().duration(1000).ease(d3.easeElastic)
//var svg = d3.select('.svg_main')
//    .append('g').attr("transform", "translate(150,50)")
var margin = {top: 10, right: 30, bottom: 90, left: 40}




//// TOOLTIP /////

const lol_tooltip = d3.select('.container-1 #graph')
.append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

  const showlolTooltip = function(event, d) {
    lol_tooltip
        .transition()
        .duration(200)
        lol_tooltip
        .style("opacity", 1)
        .html("<small>"+d.state_name+ "'s Median Salary: " + d3.format("$,.2f")(d.median_salary_full) +"<br> Gender Gap: " + d3.format("$,.2f")(d.salary_gender_gap)+"<br> Male Median Salary: " + d3.format("$,.2f")(d.median_salary_male)+"<br> Female Median Salary: " + d3.format("$,.2f")(d.median_salary_female)+"</small>")
        .style("left", event.x-550 + "px")
        .style("top", event.y+50 + "px")
    }

    const showlolTooltip_gen = function(event, d) {
      lol_tooltip
          .transition()
          .duration(200)
          lol_tooltip
          .style("opacity", 1)
          .html("<small>"+d.state_name+ "'s Median Salary: " + d3.format("$,.2f")(d.median_salary_full) +"</small>")
          .style("left", event.x-550 + "px")
          .style("top", event.y+50 + "px")
      }
const movelolTooltip = function(event, d) {
  lol_tooltip
        .style("opacity", 1)
        .style("left", event.x-550 + "px")
        .style("top", event.y+50 + "px")
    }
const hidelolTooltip = function(event, d) {
  lol_tooltip
        .transition()
        .duration(200)
       // .html("<small>"+d.state_name+ "'s Median Salary: " + d3.format("$,.2f")(d.median_salary_full) +"</small>")
        .style("opacity", 0)
    }

//// END TOOLTIP /////
   // width = 960 - margin.left - margin.right,
    //height = 600 - margin.top - margin.bottom;

    function update_gender_gap() {
        console.log("gender_gap chart")
        
    
        var gap_line = svg.selectAll(".myLine")
        .data(state).enter().append("line")
        .attr('class', 'myLine')
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
        femcircle.attr("cy", function(d) { return y(d.state_name); })
        .attr("cx", function(d) { return x(d.median_salary_female); })
        .attr("r", 0)
        .on("mouseover", showlolTooltip )
        .on("mousemove", movelolTooltip )
        .on("mouseleave", hidelolTooltip )
    
        femcircle
        .transition().duration(1000).ease(d3.easeElastic)
        .attr("r","8")
        .style("fill", "#cab2d6");

        svg.selectAll("circle")
        .data(state)
        .transition().duration(1000).ease(d3.easeElastic)
        .attr("cy", function(d) { return y(d.state_name); })
        .attr("cx", function(d) { return x(d.median_salary_male); })
        .attr("r", "8")
        .style("fill", "#1f78b4");


        
        svg.selectAll("thecircle")
        .data(state).exit().remove()
        svg.selectAll(".myLine")
        .data(state).exit().remove()
    
    }
    
    
    
    // Circle salary full
    
    function median_salary(){
    
        console.log("median chart")
    
        var salary_exit = svg.selectAll('circle').data(state)
        
    
        var salary = salary_exit.enter().append('circle').style("fill", "#33a02c")
        

    
        salary.merge(salary_exit)
        .transition().duration(1000).ease(d3.easeElastic)
        .attr("cy", function(d) { return y(d.state_name); })
        .attr("cx", function(d) { return x(d.median_salary_full); })
        .attr("r", "8")
        .style("fill", "#33a02c")
    
        salary_exit.exit().remove()
        svg.selectAll(".myLine").data(state).remove()
        
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

svg.append("line")
   .attr("class","refline")
   .attr("x1",  x(national_median))
   .attr("x2", x(national_median))
   .attr("y1", 0)
   .attr("y2",  (height-50))
   .attr("stroke", "grey")
   .attr("stroke-dasharray", "3")

 svg.append("text")
   .attr("y", 20)//magic number here
   .attr("x", function(){ return x(national_median)+10})
   .style("font-size", "12px")
   .attr('text-anchor', 'right')
   .attr("class", "chart_legend")//easy to style with CSS
   .text("National Median Salary "+d3.format("$,.2f")(national_median));

  circles = svg.selectAll('circle')
    .data(state).enter().append('circle')

  circles
    .transition().duration(1000).ease(d3.easeElastic)
    .attr("cy", function(d) { return y(d.state_name); })
    .attr("cx", function(d) { return x(d.median_salary_full); })
    .attr("r", "8")
    .style("fill", "#33a02c")
  circles
    .on("mouseover", showlolTooltip_gen )
    .on("mousemove", movelolTooltip )
    .on("mouseleave", hidelolTooltip )

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

  

    sankey = d3.sankey()
    .nodeSort(undefined)
    .linkSort(null)
    .nodeWidth(4)
    .nodePadding(20)
    .extent([[0, 5], [width, height - 5]])

    function create_graph(data){
        let index = -1;
        const nodes = [];
        const nodeByKey = new Map;
        const indexByKey = new Map;
        const links = [];
      
        for (const k of keys) {
          for (const d of data) {
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
          for (const d of data) {
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
    graph =  create_graph(edu);
    graph_fem =  create_graph(edu);
    graph_male =  create_graph(edu);
    //console.log(graph)

      
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

  function generate_node(graph){
    const {nodes, links} = sankey({
      nodes: graph.nodes.map(d => Object.assign({}, d)),
      links: graph.links.map(d => Object.assign({}, d))
    });
    return {nodes: nodes, links: links}
  }


  const full_par = generate_node(graph)
  const fem_par = generate_node(graph)
  const male_par = generate_node(graph)

  // const {nodes_fem, links_fem} = sankey({
  //   nodes: graph_fem.nodes.map(d => Object.assign({}, d)),
  //   links: graph_fem.links.map(d => Object.assign({}, d))
  // });

  // const {nodes_male, links_male} = sankey({
  //   nodes: graph_male.nodes.map(d => Object.assign({}, d)),
  //   links: graph_male.links.map(d => Object.assign({}, d))
  // });

  function full_parset(){

    svg2.append("g")
    .selectAll(".node")
    .data(full_par.nodes)
    .attr("class","node")
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
    .data(full_par.links).join("path");
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
    .selectAll(".parset_link")
    .data(full_par.nodes)
    .attr('class','parset_link')
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name)
    .append("tspan")
      .attr("fill-opacity", 0.7)
      .text(d => ` ${d.value.toLocaleString()}`);



  }

  function female_parset(){

    svg2
    .selectAll(".node")
    .data(fem_par.nodes)
    .attr('class','node')
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
    .append("title")
      .text(d => d.name + "<br>" + d.value.toLocaleString());

    links_s = svg2
      .attr("fill", "none")
    .selectAll(".parset_link")
    .data(fem_par.links).join("path")
    .attr('class','parset_link');
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
    .data(fem_par.nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name)
    .append("tspan")
      .attr("fill-opacity", 0.7)
      .text(d => ` ${d.value.toLocaleString()}`);




  }

  function male_parset(){


  }

  

  //return svg.node();

    ///////////// END PARALLEL SET FUNCTIONS ////////////////////////////


  ///////////// START 2ND CONTAINER ////////////////////////////

  full_parset()

  var gs2 = d3.graphScroll()
      .container(d3.select('.container-2'))
      .graph(d3.selectAll('.container-2 #graph'))
      .eventId('uniqueId2')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-2 #sections > div'))
      .offset(innerWidth < 900 ? innerHeight - 250 : 500)
      .on('active', function(i){
        console.log("2: ", i)

        if(i==1){
          links_s
          .attr("stroke", d => color(d.names[0]))
        }

        else if(i == 2){
          links_s
          .attr("stroke", d => highschool_color(d.names[0]))
          //female_parset()

        }
        else if (i == 3){
          links_s.attr("stroke", d => primary_color(d.names[0]))

        }
        else if (i == 4){
          links_s.attr("stroke", d => secondary_color(d.names[0]))
        }

        else if (i == 5)
        links_s.attr("stroke", d => tertiary_color(d.names[0]))
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
            .html("<small>Median: " + d3.format("($.2f")(d.median) +"<br> Industry: " + d.industry+"<br> Count: " + d.count+"</small")
            .style("left", (event.x)-450 + "px")
            .style("top", (event.y)-130 + "px")
        }
        const moveTooltip = function(event, d) {
        tooltip
            .style("left", (event.x)-350 + "px")
            .style("top", (event.y)-130 + "px")
        }
        const hideTooltip = function(event, d) {
        tooltip
            .transition()
            .duration(200)
            //.html("")
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
