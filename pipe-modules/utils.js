const format = require('date-fns-tz/format');
const utcToZonedTime = require('date-fns-tz/utcToZonedTime');

const brusselsTimeZone = 'Europe/Berlin';
const nyTimeZone = 'America/New_York';
const hongKongTimeZone = 'Asia/Hong_Kong';

module.exports = {
    sortMembers: (queryResults) => {
        const originalData = queryResults.data[0];
        const memberList = originalData.members;
        if(memberList) {
            const memberRoles = ["Chair", "Vice Chair", "Science communications manager", "STSM Coordinator", "WG1 Lead", "WG2 Lead", "WG3 Lead", "WG4 Lead"];
            memberList.sort((a, b) => (memberRoles.indexOf(a.role) > memberRoles.indexOf(b.role)) ? 1 : -1);
            queryResults.data[0].members = memberList;
            return queryResults;
        }
        return queryResults;
    },
    formatEventDatesKeepOnlyUpcoming: (queryResults) => {
        const originalData = queryResults.data[0];
        let events = originalData.organises || [];

        events.sort((a, b) => {
            const aDate = a.start ? (new Date(a.start)).getTime() : undefined;
            const bDate = b.start ? (new Date(b.start)).getTime() : undefined;

            if (!aDate) {
                return 1;
            } else if (!bDate) {
                return -1;
            } else if (aDate < bDate) {
                return -1;
            } else if (aDate > bDate) {
                return 1;
            } else {
                return 0;
            }
        });

        events = events.filter(event => new Date() < new Date(event.start));
        formatEventDates(events);

        originalData.organises = events;
        return queryResults;
    },
    formatEventDates: (queryResults) => {
        const compareFn = (a,b) => {
            if ((new Date(a.start)) < (new Date(b.start))) {
                return 1;
            } else if ((new Date(a.start)) > (new Date(b.start))) {
                return -1;
            } else {
                return 0;
            }
        };

        const originalData = queryResults.data[0];
        let events = originalData.organises || [];
        events.sort(compareFn);
        formatEventDates(events, true);
        originalData.organises = events;

        events = originalData.endorses || [];
        events = events.map(a => a.object);
        events.sort(compareFn);
        formatEventDates(events, true);
        originalData.endorses = events;

        return queryResults;
    },
    formatStartDateTalksAndPanel: (data) => {
        if (data.data.length > 0) {
            data.data.sort((a, b) => {
                const aDate = a.start ? (new Date(a.start)).getTime() : undefined;
                const bDate = b.start ? (new Date(b.start)).getTime() : undefined;

                if (!aDate) {
                    return -1;
                } else if (!bDate) {
                    return 1;
                } else if (aDate < bDate) {
                    return 1;
                } else if (aDate > bDate) {
                    return -1;
                } else {
                    return 0;
                }
            });

            data.data.forEach(event => {
                console.log(event);
                function formatDate(date) {
                    const nyDate = utcToZonedTime(date, nyTimeZone);
                    const brusselsDate = utcToZonedTime(date, brusselsTimeZone);
                    const hongKongDate = utcToZonedTime(date, hongKongTimeZone);

                    return getStart(brusselsDate, brusselsTimeZone ) + ' / ' + getStart(nyDate, nyTimeZone) + ' / ' + getStart(hongKongDate, hongKongTimeZone);
                }

                if (event.start) {
                    event.start = formatDate(new Date(event.start));
                }

                if (event.end) {
                    event.end = formatDate(new Date(event.end));
                }
            });
        }

        return data;
    }
};

function getStart(date, timeZone) {
    const result = format(date, 'E MMM do R', { timeZone }) + ' at ' + format(date, 'H:mm (z)', { timeZone });
    return tryCET(result);
}

function tryCET(str) {
    return str
      .replace(/GMT\+2/g, 'CEST')
      .replace(/GMT\+1/g, 'CET')
      .replace(/GMT\+8/g, 'CST');
}

function formatEventDates(events, showYear) {
    events.forEach(event => {
        const brusselsDate = utcToZonedTime(new Date(event.start), brusselsTimeZone);

        let formatStr = 'E, MMM do ha (z)';

        if (showYear) {
            formatStr = 'E, MMM do yyyy ha (z)';
        }

        event.start = tryCET(format(brusselsDate, formatStr, { brusselsTimeZone }));

        if (event.end) {
            event.endHour = format(new Date(event.end), 'ha');
        }
    });
}
