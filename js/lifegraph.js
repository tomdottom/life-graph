function createRoutes() {

    var date = {};

    var router = Grapnel.listen({
        'birthdate/:day/:month/:year': function(req, event){
            if(this.processed) { return; }
            event.preventDefault();
            date.day = req.params.day;
            date.month = req.params.month;
            date.year = req.params.year;

            if(_.all(date)){
                var birthDate = new Date(date.year, (date.month - 1), date.day);
                drawLifeGraph(birthDate);
            } else {
                return;
            }
            this.processed = true;
        },
        '*': function(req, event){
            if(this.processed) { return; }
            this.anchor.set('birthdate/01/01/1970');
            this.processed = true;
        }
    });

    // called after routes processed
    router.on('hashchange', function(event) {
        this.processed = false;
    });
    // needed for fresh page load
    router.processed =  false;
}

function drawLifeGraph(birthDate) {
    var averageAgeInDays = 29219,
        today = Date.today(),
        endDate = birthDate.clone().addDays(averageAgeInDays),
        birthMonth = birthDate.getMonth(),
        birthYear = birthDate.getYear(),
        endMonth = endDate.getMonth(),
        endYear = endDate.getYear(),
        daysLived = birthDate.getDaysBetween(today);

    var rows = endDate.getYear() - birthDate.getYear();

    var lifeDays = _.template([
        
    ]);
    var lifeClock = _.template([
        '<div class="month-clock-wrapper">',
            '<div class="month-clock">',
            '<div class="date">',
            '<% _.forEach(days, function(day) {%>',
                '<div><%- day %></div>',
            '<% }); %>',
            '</div>',
            '<div class="message">days lived to the full</div>',
            '</div>',
        '</div>',
    ].join('\n'));

    var headerRow = _.template([
        '<tr class="header-row">',
            '<td class="year-col"></td>',
            '<td class="data-col">J<span class="xs-hidden">an</span></td>',
            '<td class="data-col">F<span class="xs-hidden">eb</span></td>',
            '<td class="data-col">M<span class="xs-hidden">ar</span></td>',
            '<td class="data-col">A<span class="xs-hidden">pr</span></td>',
            '<td class="data-col">M<span class="xs-hidden">ay</span></td>',
            '<td class="data-col">J<span class="xs-hidden">une</span></td>',
            '<td class="data-col">J<span class="xs-hidden">uly</td>',
            '<td class="data-col">A<span class="xs-hidden">ug</span></td>',
            '<td class="data-col">S<span class="xs-hidden">ep</span></td>',
            '<td class="data-col">O<span class="xs-hidden">ct</span></td>',
            '<td class="data-col">N<span class="xs-hidden">ov</span></td>',
            '<td class="data-col">D<span class="xs-hidden">ec</span></td>',
            '<td class="age-col">Age</td>',
        '</tr>'
    ].join('\n'));

    var dateRow =  _.template([
        '<tr class="data-row">',
            '<td class="year-col"><%- year %></td>',
            '<% _.forEach (months, function(m) {',
                'if (m.isBefore(today)) { %>',
                    '<td class="data-col month-lived"></td>',
                    '<% } else { %>',
                    '<td class="data-col month-to-live"></td>',
                    '<% }',
            '}) %>',
            '<td class="age-col"><%- yearCnt %></td>',
        '</tr>',
    ].join('\n'));

    var content = [];

    content.push(lifeClock({
        days: _.map(('' + daysLived).split(''), function(d) {return +d;})
    }));
    content.push(headerRow());

    for(var i = 0; i < rows; i++) {
        var jan1st = birthDate.clone();
        jan1st.setMonth(0);
        jan1st.setDate(1);
        jan1st.addYears(i);

        var months = _.map(
            _.range(12),
            function(m) { var tmp = jan1st.clone(); tmp.setMonth(m); return tmp; }
        );

        content.push( dateRow({
            yearCnt: i,
            year: jan1st.getFullYear(),
            months: months,
            today: today
        }));
    }

    var lg = document.getElementsByClassName('life-graph')[0];
    lg.innerHTML = content.join('\n');
}

function main() {
    createRoutes();
}

domready(function () {
    main();  
});