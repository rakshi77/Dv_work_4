const dt = `https://raw.githubusercontent.com/umassdgithub/Fall-2023-DataViz/main/Major-Assignment-4/data/Data_CT.csv`;
let sv = d3.select("svg");
const pt = d3.geoPath();

function plot_contour(fn) {
    d3.csv(fn).then(function (d) {
        let x = 512, y = 512;
        let v = [];
        d.forEach(function (a) {
            v.push(+a[0]);
        });

        const mn = d3.min(v);
        const mx = d3.max(v);

        let cs = d3.scaleLinear()
            .domain(d3.range(mn, mx, parseInt(Math.abs(mx - mn) / 6.5)))
            .range(["#d6616b", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#1f77b4", "#084594"])
            .interpolate(d3.interpolateHcl);

        let cts = d3.contours()
            .size([x, y])
            .thresholds(d3.range(mn, mx, 1000))
            (v);

        sv.append("g").attr("class", "contours")
            .selectAll("path")
            .data(cts)
            .enter()
            .append("path")
            .attr("d", function (c) { return pt(c); })
            .attr("stroke", "black")
            .attr("stroke-width", ".1px")
            .attr("stroke-linejoin", "round")
            .attr("fill", function (c) { return cs(c.value); });

        $("#slider-range").slider({
            range: true,
            min: mn,
            max: mx,
            values: [mn, mx],
            slide: function (e, u) {
                $("#amount").val(u.values[0] + " - " + u.values[1]);
                update(u.values[0], u.values[1]);
            }
        });

        function update(min, max) {
            sv.selectAll(".contours").remove();

            let cts = d3.contours()
                .size([x, y])
                .thresholds(d3.range(min, max, 40))
                (v);

            sv.append("g").attr("class", "contours")
                .selectAll("path")
                .data(cts)
                .enter()
                .append("path")
                .attr("d", function (c) { return pt(c); })
                .attr("stroke", "black")
                .attr("stroke-width", ".1px")
                .attr("stroke-linejoin", "round")
                .attr("fill", function (c) { return cs(c.value); });
        }
    });
}

plot_contour(dt);
