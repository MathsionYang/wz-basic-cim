export const buildCharOption = {
  color: ["#F52424", "#EC8221", "#2883F5", "#127B49"],
  tooltip: {
    formatter: "{b}: {d}%"
  },
  series: [{
    type: "pie",
    radius: ["30%", "60%"],
    center: ["50%", "54%"],
    label: {
      normal: {
        show: true,
        position: "outside",
        formatter: "{b}",
        // formatter: function (params) {
        //   // console.log("params", params)
        //   return `${params.name.substring(0,4)}: ${params.value}%`
        // },
        color: "#FFF",
        textStyle: {
          fontSize: 14
        }
      }
    },
    data: []
  }]
};