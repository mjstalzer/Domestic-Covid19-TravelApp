
function enterdata() {
    event.preventDefault();
    $("#search").addClass("is-loading");
    var startCity = $("#departingCity").val().trim()

    var endCity = $("#arrivalCity").val().trim()

    var arrCity = endCity.toLowerCase();

    var departCity = startCity.toLowerCase();
    console.log(departCity, arrCity)

    if (!arrCity || !departCity) {
        $("#search").removeClass("is-loading");
        var noCities = $("#popUp").text("We did not recognize these cities. Try again.")
        noCities.show();
        setTimeout(function(){
            $("#popUp").fadeOut(1500);
        } , 2000)
        return;
    }


    for (var i = 0; i < masterList.length; i++) {
        var lower = masterList[i].city.toLowerCase();
    
        if (lower === departCity) {
            var departCode = masterList[i].code
        }
        if (lower === arrCity) {
            var arrCode = masterList[i].code
            console.log(arrCode)
            var covidState = masterList[i].state
            localStorage.setItem("covid-state", covidState)
        }
    };
    var flightAPI = {
        "async": true,
        "crossDomain": true,
        "url": "https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v1/prices/cheap?destination=" + arrCode + "&origin=" + departCode + "&currency=USD&page=1",
        "method": "GET",
        "headers": {
            "x-access-token": "3589015d11656c52187d4a9678569191",
            "x-rapidapi-host": "travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com",
            "x-rapidapi-key": "8144acd97dmsh3d8d17d414f0cc6p1178d1jsn267a11f3f771"
        }
    }
    $.ajax(flightAPI).done(function (response) {
        // console.log(response)
        var stringify = JSON.stringify(response.data)

        if (stringify === "{}") {
            $("#search").removeClass("is-loading");
            var popUp1 = $("#popUp").text("We cannot provide flight details between these cities.")
            popUp1.show();
            setTimeout(function(){
                $("#popUp").fadeOut(1500);
            } , 2000)
            return;
        }
        else {
            console.log(response)
            localStorage.setItem("cheapestflight", JSON.stringify(response.data[arrCode][1]));
            var elevenDaysAgo = moment().subtract(11, 'days')
            var date11 = JSON.stringify(elevenDaysAgo._d)
            var month11Slice = date11.slice(6,8)
            var date11Slice = date11.slice(9,11)
            var year11Slice = date11.slice(1,5)
            // ------------------------------------------------------------ \\
            var secondAPIDate = (year11Slice + "-" + month11Slice + "-" + date11Slice)
            console.log(secondAPIDate)
            // ------------------------------------------------------------ \\
            var oneDayAgo = moment().subtract(1, 'days')
            var date1 = JSON.stringify(oneDayAgo._d)
            var month1Slice = date1.slice(6,8)
            var date1Slice = date1.slice(9,11)
            var year1Slice = date1.slice(1,5)
            // ------------------------------------------------------------ \\
            var firstAPIDate = (year1Slice + "-" + month1Slice + "-" +date1Slice)
            console.log(firstAPIDate)
            // ------------------------------------------------------------ \\
            var covidAPI = {
                "async": true,
                "crossDomain": true,
                "url": "https://covid-19-statistics.p.rapidapi.com/reports?region_province=" + covidState + "&date=" + firstAPIDate,
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
                    "x-rapidapi-key": "8144acd97dmsh3d8d17d414f0cc6p1178d1jsn267a11f3f771"
                }
            }

            $.ajax(covidAPI).done(function (response2) {
                console.log(response2);
                localStorage.setItem("Covid-Stats", JSON.stringify(response2.data[0]))
            });
            var covidAPI = {
                "async": true,
                "crossDomain": true,
                "url": "https://covid-19-statistics.p.rapidapi.com/reports?region_province=" + covidState + "&date=" + secondAPIDate,
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
                    "x-rapidapi-key": "8144acd97dmsh3d8d17d414f0cc6p1178d1jsn267a11f3f771"
                }
            }

            $.ajax(covidAPI).done(function (response3) {
                console.log(response3);
                localStorage.setItem("Covid-Stats-2", JSON.stringify(response3.data[0]))
                return window.location.assign("results.html")
            });
        }
    }).catch(function (error) {
        if (error) {
            $("#search").removeClass("is-loading");
            var popUp2 = $("#popUp").text("We did not recognize these cities. Try again.")
            popUp2.show();
            setTimeout(function(){
                $("#popUp").fadeOut(1500);
            } , 2000)
        }
    })
}
