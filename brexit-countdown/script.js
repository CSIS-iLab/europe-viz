const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

//console.log(endDate);

let endD = new Date("Dec 31, 2020 00:00:00");
let endDate = endD.toLocaleString(undefined, {
  timeZone: "Europe/Brussels"
});

let countDown = new Date(endDate).getTime(),
  x = setInterval(function() {
    let startD = new Date();
    let startDate = startD.toLocaleString(undefined, {
      timeZone: "Europe/Brussels"
    });

    let now = new Date(startDate).getTime(),
      distance = countDown - now;
    let daysOutput = Math.floor(distance / day);
    let hoursOutput = Math.floor((distance % day) / hour);
    let minutesOutput = Math.floor((distance % hour) / minute);

    function checkdigits(test) {
      if (test.toString().length == 1) {
        test = "0" + test;
      } else {
        test = test.toString();
      }
      return test;
    }

    (document
      .getElementById("days")
      .querySelector("span").textContent = checkdigits(daysOutput)),
      (document
        .getElementById("hours")
        .querySelector("span").textContent = checkdigits(hoursOutput)),
      (document
        .getElementById("minutes")
        .querySelector("span").textContent = checkdigits(minutesOutput)); //,

    //document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);
  }, second);
