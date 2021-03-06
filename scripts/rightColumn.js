define(["scripts/libs/only", "scripts/htmlUtils"], function (only, htmlUtils) {
    var html = only.html({div: []});

    function makeProgessBar(value, threshold, precolor, postcolor, myProgress, myBar) {
        var barWidth = 100 * value
        myBar.width = barWidth + '%';
        if (barWidth < threshold) {
            myBar.backgroundColor = precolor;
        }
        else {
            myBar.backgroundColor = postcolor;
        }
        var bar = only.html({div: [{div: [], css: myBar}], css: myProgress});
        return bar
    }

    function rightColumn(state, poln) {
        var data = [];

        var categoryTitle = {
            "text-align" : "center",
            "font-weight" : "bold",
            "margin" : "1vh"
        };

        var myProgress = {
            "width": "100%",
            "background-color": "#ddd"
        };
        var myBar = {
            "width": "1%",
            "height": "1vh",
            "background-color": "#4CAF50"
        };

        var outputs = {energy: "Energy", pollution: "Pollution"};
        var naturalResources = {trees: "Trees", coal: "Coal", ore: "Ore"};
        var resourcesStockpiled = {wood: "Wood", coalreserves: "Coal Reserves", orereserves: "Ore Reserves", metal: "Metal"};
        var resourceCollectors = {lumberJacks: "Lumberjacks", coalmines: "Coal Mines", oremines: "Ore Mines", sawmills: "Saw Mills",miner: "Miners"};
        var outputMachines = {furnaces: "Furnaces", coalplants: "Coal Plants", smelters: "Smelters", solar: "Solar Panels",nasa: "NASA"};

        var all = only.merge(outputs, naturalResources, resourcesStockpiled, resourceCollectors, outputMachines);

        var categoryStrings = [outputs, naturalResources, resourcesStockpiled, resourceCollectors, outputMachines];

        var categories = [[],[],[],[],[]];
        categories[0].push({p : "Outputs", css: categoryTitle});
        categories[1].push({p : "Natural Resources", css: categoryTitle});
        categories[2].push({p : "Resources Stockpiled", css: categoryTitle});
        categories[3].push({p : "Resource Collectors", css: categoryTitle});
        categories[4].push({p : "Output Machines", css: categoryTitle});

        for (var key in state) {
            var col1;
            var col2;
            var dat;

            if (key == "pollution") {
                col1 = only.html({p: all[key] + ": ", css: {margin: "0px"}});
                col2 = only.html({p: new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(poln * 100) + "%" ,
                    css: {margin: "0px"}});
                dat = htmlUtils.spacedColumns([col1,col2],[.5,.5]);
                categories[0].push(dat);
            }
            else if (key == "trees") {
                col1 = only.html({p: all[key] + ": ", css: {margin: "0px"}});
                col2 = only.html({p: new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(state[key]) ,
                    css: {margin: "0px"}});
                dat = htmlUtils.spacedColumns([col1,col2],[.5,.5]);
                categories[1].push(dat);
            } else {
                col1 = only.html({p: all[key] + ": ", css: {margin: "0px" }});
                col2 = only.html({p: new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(state[key]),
                    css: {margin: "0px", paddingBottom: "0px"}});
                dat = htmlUtils.spacedColumns([col1,col2],[.5,.5]);
                for (var i = 0; i < categories.length; ++i) {
                    if (categoryStrings[i][key]) {
                        categories[i].push(dat);
                    }
                }
            }
            var barPercent;
            if (naturalResources[key]) {
                barPercent = key == "trees" ? (state[key]) / 100000000 : (state[key]) / 250000;
                categories[1].push(makeProgessBar(barPercent, 25, "#ff0000", "#4CAF50", myProgress, myBar));
            }
            else if (key == "pollution") {
                barPercent = (poln);
                categories[0].push(makeProgessBar(barPercent, 50, "#4CAF50", "#785027", myProgress, myBar));
            }

        }
        var allDivs = [];
        for (var i = 0; i < categories.length; ++i) {
            allDivs.push(only.html({div: categories[i]}));
        }


        var final = only.html({div: allDivs});
        while (html.hasChildNodes()) {
            html.removeChild(html.firstChild);
        }
        html.appendChild(final);
    }

    return {
        html: html,
        update: rightColumn
    }
})
