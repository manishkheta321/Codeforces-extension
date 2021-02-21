var div = document.getElementById("pageContent");
var div1 = document.createElement("div");
div1.className = "roundbox";
div.appendChild(div1);

var url = window.location.href.toString();

var splitText = url.split("/");
var username = splitText[splitText.length - 1];
console.log(username);

var f = fetch(
  `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000#`
)
  .then((res) => {
    return res.json();
  })
  .then((datas) => {
    var result = datas.result;
    var label = {};
    var tagsObjects = {};
    var questionsSolved = {};

    for (var i = 0; i < result.length; i++) {
      var item = result[i];
      var { contestId, index } = item.problem;
      var questionId = contestId + index;

      var tags = item.problem.tags;
      var correct = item.verdict === "OK" ? 1 : 0;
      if (questionsSolved[questionId] != undefined && correct == 1) {
        continue;
      } else {
        if (correct == 1) {
          questionsSolved[questionId] = 1;
        }
      }
      for (var ind = 0; ind < tags.length; ind++) {
        var tag = tags[ind];

        if (label[tag] != undefined) {
          label[tag] = label[tag] + 1;
          tagsObjects[tag].count++;
          tagsObjects[tag].correct += correct;
        } else {
          tagsObjects[tag] = { count: 1, correct: correct };
          label[tag] = 1;
        }
      }
    }
    console.log(label);
    console.log(tagsObjects);
    var count = [],
      labels = [],
      accuracy = [],
      correctSub = [];
    for (var prop in tagsObjects) {
      if (tagsObjects.hasOwnProperty(prop)) {
        var corrects = tagsObjects[prop].correct;
        var counts = tagsObjects[prop].count;
        count.push(corrects);
        labels.push(prop);
        correctSub.push(counts - corrects);
        accuracy.push(
          `accuracy : ${((corrects / counts) * 100).toFixed(1).toString()}`
        );
      }
    }

    // var data = [
    //   {
    //     type: "pie",
    //     title: { text: `Tags of ${username}`,font:{
    //       size:30
    //     }, position: "top left" },
    //     values: values,
    //     labels: labels,
    //     textinfo: "none",
    //     insidetextorientation: "radial",
    //     automargin: true,
    //     hole: 0.4,
    //     marker: {
    //       line: {
    //         color: "#fff",
    //         width: 0.5,
    //       },
    //     },
    //     hoverlabel: {
    //       bgcolor: "#fff",
    //       bordercolor: "#000",
    //       font: {
    //         color: "000",
    //       },
    //     },
    //   },
    // ];

    // var layout = [
    //   {
    //     title: "HELLO",
    //     height: 700,
    //     width: 700,

    //     margin: { t: 0, b: 0, l: 0, r: 0 },
    //   },
    // ];

    // Plotly.newPlot(div1, data, layout);

    var trace1 = {
      x: labels,
      y: count,
      name: "Solved",
      type: "bar",
      text: accuracy,
      marker: {
        color: "rgb(64,196,99)",
      },
    };
    var trace2 = {
      x: labels,
      y: correctSub,
      name: "Wrong-Sub",
      type: "bar",
      marker: {
        color: "rgb(193,0,0)",
      },
    };
    var data = [trace1, trace2];
    var layout = {
      barmode: "stack",
      yaxis: {
        automargin: true,
      },
      xaxis: {
        automargin: true,
      },
      title: `Tags for ${username}`,
    };
    Plotly.newPlot(div1, data, layout);
  });
