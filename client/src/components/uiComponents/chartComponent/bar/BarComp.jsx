import { useEffect } from "react";
import { Chart } from "react-google-charts";
// export const data = [
//   ["Task", "Hours per Day"],
//   ["Work", 11],
//   ["Eat", 2],
//   ["Commute", 2],
//   ["Watch TV", 2],
//   ["Sleep", 7],
// ];
export const options = {
  title: "Task Reports",
  colors : ['darkgrey', '#007bff', '#000', 'darkviolet']
};
export function BarComp({taskData}) {
  
  console.log('inside chart  ',taskData)
  const data = [
    ["Task Type" , "Number of Tasks" ],
    ["To Do" , taskData[0].length],
    ["In Progress" , taskData[1].length],
    ["Done" , taskData[2].length],  
    ["Today's Picks" , taskData[3].length],  
  ]
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  )
}
