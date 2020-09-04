import * as React from 'react';
import { GroupedVerticalBarChart } from '@uifabric/charting';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

export class GroupedVerticalBarChartBasicExample extends React.Component<Readonly<{}>, {}> {
  public render(): React.ReactNode {
    const data = [
      {
        name: 'LongLong text here It should Display all',
        series: [
          {
            key: 'series1',
            data: 33000,
            color: DefaultPalette.blueLight,
            legend: 'MetaData1',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '33%',
          },
          {
            key: 'series2',
            data: 44000,
            color: DefaultPalette.blue,
            legend: 'MetaData4',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '44%',
          },
        ],
      },
      {
        name: 'Just Checking',
        series: [
          {
            key: 'series1',
            data: 33000,
            color: DefaultPalette.blueLight,
            legend: 'MetaData1',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '33%',
          },
          {
            key: 'series2',
            data: 3000,
            color: DefaultPalette.blue,
            legend: 'MetaData4',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '3%',
          },
        ],
      },

      {
        name: 'SecondONe IamALLL ',
        series: [
          {
            key: 'series1',
            data: 14000,
            color: DefaultPalette.blueLight,
            legend: 'MetaData1',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '14%',
          },
          {
            key: 'series2',
            data: 50000,
            color: DefaultPalette.blue,
            legend: 'MetaData4',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '50%',
          },
        ],
      },
      {
        name: 'Hello World!!!',
        series: [
          {
            key: 'series1',
            data: 33000,
            color: DefaultPalette.blueLight,
            legend: 'MetaData1',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '33%',
          },
          {
            key: 'series2',
            data: 3000,
            color: DefaultPalette.blue,
            legend: 'MetaData4',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '3%',
          },
        ],
      },
    ];

    const rootStyle = mergeStyles({ width: '650px', height: '400px' });

    return (
      <div className={rootStyle}>
        <GroupedVerticalBarChart data={data} height={400} width={650} showYAxisGridLines wrapXAxisLables />
      </div>
    );
  }
}
