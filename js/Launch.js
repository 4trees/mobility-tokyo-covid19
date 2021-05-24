container.append('section')
    .attr('class', 'row flex-column justify-content-center align-items-center mb-5')
    .html(`
        <div class="col-12 col-md-8 col-lg-6 col-xxl-4 pb-5">
        <h1 class="my-5 serif">Mobility impact of coping with COVID-19 in Tokyo</h1>
        <p>In the history of the modern Olympics, both the 1940 Summer and Winter Olympics that were to be hosted by Japan were canceled due to the onset of World War II. Tokyo and Sapporo eventually hosted the 1952 Summer and 1972 Winter Olympics respectively. Due to COVID-19, there have been mounting calls in Japan to cancel the 2020 Tokyo Summer Olympics which has already been postponed by a year.</p>
        <p>As global communities combat COVID-19 with movement restrictions, each city shows different levels of changes in total mobility. In this landscape, it is interesting to focus on Japan and Tokyo and see the impact of coping with COVID-19 so far among growing anxiety and controversy about the upcoming Olympics.</p>
        <div class="tip-divider d-flex align-items-center mb-3 mt-5">
            <div class="divider flex-grow-1 border-top"></div>
            <div class="px-2">scroll down</div>
            <div class="divider flex-grow-1 border-top"></div>
        </div>
        </div>
        `);


const sectionContainer = container.append('section')
    .attr('class', 'row d-flex position-relative flex-column flex-lg-row align-items-center');

const graphContainer = sectionContainer.append('div')
    .attr('class', 'graph col-12 col-md-10 col-lg-7 sticky-top align-self-lg-start d-flex justify-content-center');

const slidesContainer = sectionContainer.append('div').attr('class', 'slides col-12 col-md-8 col-lg-5');

container.append('section')
    .attr('class', 'row flex-column justify-content-center align-items-center my-5')
    .html(`
        <div class="col-12 col-md-8 col-lg-6 col-xxl-4">
        <p>According to the terms of the contract between the International Olympic Committee(ICO) and the host city Tokyo, only the ICO has the option to cancel if there were “reasonable grounds” for the IOC to believe that “the safety of participants in the Games would be seriously threatened or jeopardized”. Cancellation of the games by Japan would mean breaking the contract and taking responsibility for all related losses and risks.</p>
        <p>Although the epidemic has a huge impact worldwide, the mobility data shows that Japan is not one of the most severely affected countries. In addition, vaccination is rapidly carried out globally. This may make the ICO and the organizers feel that it is feasible for the Olympic Games to take place and at the same time ensure the safety and health of participants.</p>
        <p>However, the specific anti-epidemic measures to take are currently unclear. There is little historical experience to refer to whether these measures are effective or not. The controversy and worries about personal and public safety and health may continue to revolve around the Tokyo Olympics.</p>
        </div>
        `);

container.append('section')
    .attr('class', 'methods row flex-column justify-content-center align-items-center mb-5')
    .html(`
        <div class="col-12 col-md-8 col-lg-6 col-xxl-4 border-top">
        <h5 class="mt-5 mb-3 serif">Method</h5>
        <p>The data is from Google Community Mobility Reports that show how visits and length of stay at different places change compared to a baseline. “Changes for each day are compared to a baseline value for that day of the week” and “the baseline is the median value, for the corresponding day of the week, during the five week period 3 Jan – 6 Feb 2020”. </p>
        <p>In order to better compare, I took the median value from 3 Jan – 6 Feb 2021 for each country and city. </p>
        <p>I also left out countries that have missing values for any place categories. On the city level, “London” is presented by “Greater London” instead of “City of London” for this reason.</p>
        <p>Because the data is only available for regions with a certain size, cities such as “Sapporo”, "Yokohama” or “Nagoya” are represented by their prefectures respectively, which are “Hokkaido”, “Kanagawa” and “Aichi”. The city of “Munich” is represented by “Bavaria” for the same reason.</p>
        </div>
        `);

Promise.all([Data_row, JData_row, summerData_row])
    .then(([DATA, JDATA, SUMMERDATA]) => {

        const nestedDataByCountry = DATA
            .map(x => {
                let t = {};
                t.place = x.country_region;
                t.values = TYPES.map(n => ({ type: n, value: x[n] }));
                t.min = d3.min(t.values, e => e.value);
                t.max = d3.max(t.values, e => e.value);
                return t;
            });
        const nestedDataByJapan = nestedDataByCountry.filter(d => d.place === 'Japan');

        const nestedDataByJapanCity = JDATA
            .map(x => {
                let t = {};
                t.place = x.sub_region_1;
                t.values = TYPES.map(n => ({ type: n, value: x[n] }));
                t.min = d3.min(t.values, e => e.value);
                t.max = d3.max(t.values, e => e.value);
                return t;
            }).concat(nestedDataByJapan);

        const nestedDataByTokyo = nestedDataByJapanCity.filter(d => d.place === 'Tokyo').concat(nestedDataByJapan);

        const nestedDataBySummerCity = SUMMERDATA
            .map(x => {
                let t = {};
                t.place = x.city;
                t.values = TYPES.map(n => ({ type: n, value: x[n] }));
                t.min = d3.min(t.values, e => e.value);
                t.max = d3.max(t.values, e => e.value);
                return t;
            });


        const chart = flowerChart(graphContainer, nestedDataByCountry);
        const SlidesData = [{
                title: 'The mobility changes in Japan',
                slides: [{

                        html: '<p>Compared with pre-pandemic norms, visits dropped by 23% to places like restaurants, cafes, shopping centers, theme parks, museums, libraries, and movie theaters, 24% to national parks, public beaches, marinas, dog parks, plazas, and public gardens.</p>',
                        action: () => {
                            chart.highlight('Japan').fix(null).data(nestedDataByJapan)()
                        }
                    },
                    {
                        html: '<p>The movement impact in Japan are similar to most other countries in the world. The extent of changes are even under the average. </p>',
                        tips: tipCountries,
                        action: () => {
                            chart.highlight('Japan').fix(null).data(nestedDataByCountry)()
                        }
                    },
                ]
            },

            {
                title: 'The mobility changes in Tokyo',
                slides: [{

                        html: `<p>However, mobility in Tokyo is more restricted compared to the nationwide average. This densely populated capital has confronted a significant drop of movements in all the aspects. People spend more time at home, with much fewer visits in retail, recreation, workplaces and transportation. </p>`,
                        action: () => {
                            chart.highlight('Tokyo').fix('Japan').data(nestedDataByTokyo)()
                        }
                    },
                    {
                        html: '<p>Compared with other places in Japan, Tokyo has been affected the most. This can also explain the domestic opposition to the Olympics. </p>',
                        tips: tipJCities,
                        action: () => {
                            chart.highlight('Tokyo').fix('Japan').data(nestedDataByJapanCity)()
                        }
                    },
                    {
                        html: `<p>However, when compared to previous Olympics host cities around the world, people in Tokyo still live in ways closer to their pre-pandemic lives. But this also indicates that the Japanese government's anti-epidemic measures are not as strong and effective as other cities.</p>`,
                        tips: tipOlyCities,
                        action: () => {
                            chart.highlight('Tokyo').fix(null).data(nestedDataBySummerCity)()
                        }
                    },
                ]
            },

        ]

        const SlidesData_slideonly = SlidesData.reduce((a, val) => a.concat(val.slides), []);


        const slideContent = slidesContainer.selectAll('.slide-section').data(SlidesData)
            .join('div').attr('class', 'slide-section row d-flex flex-column align-items-center');
        slideContent.append('h2').attr('class', 'serif sticky-top col-12')
            .html(d => d.title);
        slideContent.selectAll('.slide').data(d => d.slides)
            .join('div').attr('class', 'slide col-12 col-md-10 col-xl-9')
            .html(d => d.html)
            .filter(d => d.hasOwnProperty('tips'))
            .each(function(d) {
                d3.select(this).call(g => {
                    createHoverEvent(g, d.tips)
                })
            });


        //make hover events
        function createHoverEvent(dom, data) {
            const tips = dom.selectAll('.tips').data([0])
                .join('div').attr('class', 'tips');
            tips.append('div').attr('class', 'tip-divider d-flex align-items-center mb-3 mt-5')
                .html(`
                        <div class="pe-2">highlight on hover</div>
                        <div class="divider flex-grow-1 border-top"></div>
                    `);
            tips.selectAll('.tip').data(data)
                .join('div').attr('class', 'tip border')
                .html(d => d)
                .on('mouseenter', (d) => {
                    chart.hover(tipCities_dataname(d))()
                })
                .on('mouseout', () => {
                    chart.hover(null)()
                });
        }

        //make scrolly
        document.addEventListener('scroll', detectScroll);
        const slidesNodes = document.querySelectorAll('.slide');
        const [top, bottom] = [h * .15, h * .95];
        let currentSlideId = null;
        const triggerY = isLandscape ? 0.4 : 0.2;

        function detectScroll() {
            window.requestAnimationFrame(() => {
                slidesNodes.forEach((slide, i) => {
                    const pageBox = slide.getBoundingClientRect()
                    const trigger = (pageBox.bottom - pageBox.top) * triggerY + pageBox.top;

                    if (trigger > top && trigger < bottom) {

                        if (i !== currentSlideId) {
                            currentSlideId = i;
                            SlidesData_slideonly[currentSlideId].action();
                        }

                    }

                })

            });
        }

        window.addEventListener("resize", () => {
            const _tempW = window.innerWidth;
            if (_tempW === w && isSmallScreen) return;

            getSizes();
            chart.height(h)();

        });
    })