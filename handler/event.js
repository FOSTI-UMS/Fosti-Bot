const fs = require('fs')

const getEvents = () => {
    const fileEvent = fs.readFileSync('./events.json')
    const events = JSON.parse(fileEvent)
    return events
}
const getClosestEvent = (events) => {
    const today = new Date();
    const closest = events.reduce((a, b) => new Date(a.timestamp) - today < new Date(b.timestamp) - today ? a : b);
   
    return closest
}

module.exports = {
    getClosestEvent,
    getEvents
}