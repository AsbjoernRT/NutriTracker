import index from '../index.js'

import moment from 'moment'

export const trackActivity = async (req, res) => {
    console.log("TIL DB: ", req.body);
    const { activityName, activityHours, activityMinutes, activityKcals, activityID } = req.body

    const totalminutes = activityHours * 60 + activityMinutes
    const kcalsBurned = (totalminutes / 60) * activityKcals;

    console.log("Formateret: ", activityName, kcalsBurned);

    const userID = req.session.user.userID
    // const options = { year: 'numeric', month: 'numeric', day: 'numeric',hour: 'numeric',minute: 'numeric' };
    const date = new Date()

    const mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    console.log(mysqlTimestamp);
    const postActivity = await index.connectedDatabase.postActivity(date, mysqlTimestamp, kcalsBurned, userID, activityID, totalminutes)
    console.log(postActivity);
}
