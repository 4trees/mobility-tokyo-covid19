const flowerChart = (_, alldata) => {

    let node = _;
    let _width = null;
    let _height = null;
    let _highlight = null;
    let _fix = null;
    let _hover = null;
    let _data = alldata;

    const ARCH = 1.2;

    const valueRange = [d3.min(alldata, d => d.min), d3.max(alldata, d => d.max)];
    const valueABMax = Math.max(Math.abs(d3.min(alldata, d => d.min)), d3.max(alldata, d => d.max));


    function updateViz() {

        let [width, height] = [_width || node.node().clientWidth, _height || node.node().clientHeight];
        const [mx, my] = [20, 15];
        const size = Math.min(width, height) - mx;
        const maxR = size / 2 - mx;
        const minR = isSmallScreen ? my : mx;

        slidesContainer.selectAll('h2').style('top', isSmallScreen ? `${Math.min(width, height)}px` : 0);

        let svg = node
            .style('height', `${Math.min(width, height)}px`)
            .selectAll('.canvas').data([0]);
        svg = svg.enter().append('svg').merge(svg)
            .attr('class', 'canvas')
            .attr('width', size)
            .attr('height', size);

        //filter for text bg
        let filter = svg.selectAll('defs').data([0]);
        filter = filter.enter().append('defs')
            .append('filter')
            .attr('x', 0).attr('y', 0).attr('width', 1).attr('height', 1).attr('id', 'bg');
        filter.append('feFlood').attr('flood-color', '#ffffff').attr('flood-opacity', 0.4);
        filter.append('feComposite').attr('in', 'SourceGraphic');

        const x = d3.scaleLinear().domain([0, valueABMax]).range([minR, maxR]);
        const y = d3.scaleBand()
            .domain(TYPES)
            .range([0, Math.PI * 2])
            .align(0);


        const vizData = _data.map(e => {
            e.isHighlighted = e.place === _highlight;
            e.isFixed = e.place === _fix;
            e.isHovering = e.place === _hover;
            e.vizValues = e.values.map(d => {

                d.fillOpacity = e.isFixed ? 0.05 : 0;
                d.strokeOpacity = (e.isHighlighted || e.isHovering) ? 1 : 0.06;
                d.strokeWidth = (e.isHighlighted || e.isFixed || e.isHovering) ? 2 : 1;
                d.color = (e.isHighlighted || e.isFixed) ? '#ef1d20' : '#000';

                d.angle = y(d.type);
                d.angle_m = d.angle + y.bandwidth() * 0.6;

                d.r_o = x(0);
                d.r = x(Math.abs(d.value));
                d.r_m = (d.r_o + d.r) / 2;
                const factor = d.value >= 0 ? 1 : -1;

                d.x = d.r * Math.sin(d.angle);
                d.y = -d.r * Math.cos(d.angle);

                d.x_o = d.r_o * Math.sin(d.angle);
                d.y_o = -d.r_o * Math.cos(d.angle);

                d.x_m = 0.5 * ((d.r + d.r_o) * Math.sin(d.angle) + factor * ARCH * (d.r - d.r_o) * Math.cos(d.angle));
                d.y_m = 0.5 * ((d.r - d.r_o) * Math.sin(d.angle) * factor * ARCH + -(d.r + d.r_o) * Math.cos(d.angle));

                d.path = `M${d.x_o} ${d.y_o} Q ${d.x_m} ${d.y_m}, ${d.x} ${d.y}`;
                return d;
            })
            return e;
        })
        let LabelData = vizData.find(d => d.isHighlighted);
        LabelData = LabelData ? LabelData.vizValues : [];

        const dividerData = TYPES.map(d => {
            let t = {};

            t.color = '#999';
            t.angle = y(d);
            t.r_o = x.range()[0];
            t.r = x.range()[1];
            t.x = t.r * Math.sin(t.angle);
            t.y = -t.r * Math.cos(t.angle);
            t.x_o = t.r_o * Math.sin(t.angle);
            t.y_o = -t.r_o * Math.cos(t.angle);
            t.path = `M${t.x_o} ${t.y_o} L ${t.x} ${t.y}`;

            const factor = ((t.angle > Math.PI * 0.6) & (t.angle < Math.PI * 1.6)) ? -1 : 1;
            t.angle_label = t.angle + Math.PI * (0.5 - 0.5 * factor);
            t.labels = [
                { offset_x: 0, offset_y: 0, name: TYPES_label(d), color: '#666' },
                { offset_x: 20, offset_y: 15 * factor, name: `+${valueABMax}%`, color: '#ccc' },
                { offset_x: -20, offset_y: 15 * factor, name: `-${valueABMax}%`, color: '#ccc' },
            ];

            return t;
        });

        let axis = svg.selectAll('.axis').data([0])
        axis = axis.enter().append('g').attr('class', 'axis')
            .merge(axis)
            .attr('transform', d => `translate(${size/2}, ${size/2})`);

        let base = axis.selectAll('.base').data([0]);
        base = base.enter().append('circle').attr('class', 'base')
            .merge(base)
            .attr('r', x(0))
            .attr('fill', '#f7f7f7')
            .attr('stroke-width', 0);
        const divider = axis.selectAll('.divider').data(dividerData);
        const enterdivider = divider.enter().append('g').attr('class', 'divider');
        enterdivider.append('path')
            .attr('fill', 'none')
            .attr('stroke', d => d.color)
            .attr('stroke-width', 0.2);
        enterdivider.append('text').attr('class', 'typelabel')
            .style('font-size', 12)
            .style('text-anchor', 'middle');


        enterdivider.merge(divider)
            .select('path').attr('d', d => d.path);
        enterdivider.merge(divider)
            .select('text')
            .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${d.angle_label * 360 / (Math.PI * 2)})`)
            .selectAll("tspan")
            .data(d => d.labels)
            .join("tspan")
            .attr('fill', d => d.color)
            .attr("x", d => d.offset_x)
            .attr("y", d => d.offset_y)
            .text(d => d.name);


        let groups = svg.selectAll('.groups').data([0]);
        groups = groups.enter().append('g').attr('class', 'groups')
            .merge(groups)
            .attr('transform', d => `translate(${size/2}, ${size/2})`);

        let update = groups.selectAll(".sub_group")
            .data(vizData, d => d.place);
        update.exit().remove();
        let enter = update.enter().append("g").attr('class', 'sub_group');

        let updatePath = enter.merge(update).selectAll(".arc")
            .data(d => d.vizValues);
        updatePath.exit().remove();
        let enterPath = updatePath.enter().append("path")
            .attr('class', 'arc')
            .style('opacity', 0)
            .transition()
            .duration(2000)
            .tween("tweenDash", function() { return tweenDash(this) })
            .style('opacity', 1);

        updatePath.merge(enterPath)
            .attr('d', d => d.path)
            .attr('fill', d => d.color)
            .attr('fill-opacity', d => d.fillOpacity)
            .attr('stroke-width', d => d.strokeWidth)
            .attr('stroke-opacity', d => d.strokeOpacity)
            .attr('stroke', d => d.color);

        let labelgroup = svg.selectAll('.labelgroup').data([0]);
        labelgroup = labelgroup.enter().append('g').attr('class', 'labelgroup')
            .merge(labelgroup)
            .attr('transform', d => `translate(${size/2}, ${size/2})`);

        let updateLabel = labelgroup.selectAll(".label")
            .data(LabelData);
        updateLabel.exit().remove();
        let enterLabel = updateLabel.enter().append("text")
            .attr('class', 'label')
            .style('text-anchor', 'middle')
            .style('font-size', 12)
            .attr('transform', d => `translate(${d.x_o}, ${d.y_o})`)
            .text('0%').attr('filter', "url(#bg)");

        updateLabel.merge(enterLabel)
            .transition()
            .duration(3000)
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .tween("text", function(d) {
                const i = d3.interpolate(this.textContent.replace('%', ''), d.value);
                return function(t) {
                    d3.select(this).text(`${i(t).toFixed(0)}%`);
                };
            });

        function tweenDash(d) {
            const path = d3.select(d)
            const l = path.node().getTotalLength();
            const interpolate = d3.interpolateString(`0, ${l}`, `${l}, ${l}`);
            return function(t) {
                path
                    .attr('stroke-dasharray', interpolate(t))
            }
        }


    }
    updateViz.data = function(_) {
        if (typeof _ === 'undefined') return _data;
        _data = _;
        return this;
    }
    updateViz.height = function(_) {
        if (typeof _ === 'undefined') return _height;
        _height = _;
        return this;
    }
    updateViz.width = function(_) {
        if (typeof _ === 'undefined') return _width;
        _width = _;
        return this;
    }
    updateViz.hover = function(_) {
        if (typeof _ === 'undefined') return _hover;
        _hover = _;
        return this;
    }
    updateViz.highlight = function(_) {
        if (typeof _ === 'undefined') return _highlight;
        _highlight = _;
        return this;
    }
    updateViz.fix = function(_) {
        if (typeof _ === 'undefined') return _fix;
        _fix = _;
        return this;
    }


    return updateViz;
}