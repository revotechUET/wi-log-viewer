let indexOptions = [
    {
        display: "BACKEND SERVICE",
        value: "backend_log"
    }, {
        display: "BACKEND SERVICE1",
        value: "backend_log2"
    }, {
        display: "BACKEND SERVICE2",
        value: "backend_log3"
    }, {
        display: "BACKEND SERVICE3",
        value: "backend_log4"
    },
    {
        display: "BACKEND SERVICE4",
        value: "backend_log5"
    }, {
        display: "BACKEND SERVICE5",
        value: "backend_log6"
    }, {
        display: "BACKEND SERVICE6",
        value: "backend_log7"
    }, {
        display: "BACKEND SERVICE7",
        value: "backend_log8"
    },
    {
        display: "BACKEND SERVICE8",
        value: "backend_log9"
    }, {
        display: "BACKEND SERVICE9",
        value: "backend_log22"
    }, {
        display: "BACKEND SERVICE10",
        value: "backend_log32"
    }, {
        display: "BACKEND SERVICE11",
        value: "backend_log42"
    }
]


let timeOptions = [
    {
        display: '1 min ago',
        value: '1m'
    },
    {
        display: '5 mins ago',
        value: '5m'
    },
    {
        display: '15 mins ago',
        value: '15m'
    },
    {
        display: '30 mins ago',
        value: '30m'
    },
    {
        display: '1 hour ago',
        value: '1h'
    },
    {
        display: '3 hours ago',
        value: '3h'
    },
    {
        display: '12 hours ago',
        value: '12h'
    },
    {
        display: '1 day ago',
        value: '1d'
    },
    {
        display: '3 days ago',
        value: '3d'
    },
    {
        display: '7 days ago',
        value: '7d'
    },
    {
        display: '15 days ago',
        value: '15d'
    },
    {
        display: '1 month ago',
        value: '30d'
    },
];

let relativeTime = [
    {
        display: "Seconds ago",
        value: "s"
    },
    {
        display: "Minutes ago",
        value: "m"
    },
    {
        display: "Hours ago",
        value: "h"
    },
    {
        display: "Days ago",
        value: "d"
    },
    {
        display: "Weeks ago",
        value: "w"
    },
    {
        display: "Months ago",
        value: "M"
    },
    {
        display: "Years ago",
        value: "y"
    }
];



export default {
    timeOptions: timeOptions,
    indexOptions: indexOptions,
    relativeTime: relativeTime
}