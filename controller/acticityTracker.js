import index from '../index.js'

import moment from 'moment'

// Eksporterer en asynkron funktion kaldet trackActivity, der håndterer anmodninger og svar
export const trackActivity = async (req, res) => {
    console.log("Modtaget til DB: ", req.body);
    // Udpakker de relevante oplysninger fra anmodningens krop
    const { activityName, activityHours, activityMinutes, activityKcals, activityID } = req.body

      // Beregner den samlede tid i minutter baseret på timer og minutter fra aktiviteten
    const totalminutes = activityHours * 60 + activityMinutes
    // Beregner antallet af kalorier forbrændt baseret på den samlede tid og kalorier pr. time
    const kcalsBurned = (totalminutes / 60) * activityKcals;

    console.log("Formateret: ", activityName, kcalsBurned);

    // Henter brugerens ID fra sessionsoplysningerne
    const userID = req.session.user.userID
     // Opretter en ny datoobjekt til at repræsentere det aktuelle tidspunkt
    const date = new Date()

        // Konverterer det aktuelle tidspunkt til et MySQL-tidsstempel
    const mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

     // Sender aktivitetsoplysningerne til databasen og venter på svar
    console.log(mysqlTimestamp);
    const postActivity = await index.connectedDatabase.postActivity(date, mysqlTimestamp, kcalsBurned, userID, activityID, totalminutes)
}
