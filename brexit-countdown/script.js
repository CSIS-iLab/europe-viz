const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;



//console.log(endDate);

      let endD = new Date('Nov 1, 2019 00:00:00');
      let endDate = endD.toLocaleString(undefined, { timeZone: 'Europe/Brussels' });

let countDown = new Date(endDate).getTime(),
    x = setInterval(function() {

      let startD = new Date();
      let startDate = startD.toLocaleString(undefined, { timeZone: 'Europe/Brussels' });


      let now = new Date(startDate).getTime(),
          distance = countDown - now;

      document.getElementById('days').innerText = Math.floor(distance / (day)),
        document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)),
        document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute))//,
        //document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

      //do something later when date is reached
      //if (distance < 0) {
      //  clearInterval(x);
      //  'IT'S MY BIRTHDAY!;
      //}

    }, second)
