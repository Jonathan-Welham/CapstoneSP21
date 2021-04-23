import React from 'react'
import { Line } from 'react-chartjs-2'

class LineGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "data": [],
            "labels": [],
            "title": "Apps"
        }
    }

    componentDidMount() {
        this.setState({
            "data": this.props.data.data,
            "labels": this.props.data.labels,
            "title": this.props.data.title
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            this.setState({ "data": this.props.data.data, "labels": this.props.data.labels, "title": this.props.data.title });
        }
    }

    render() {
        let options = {
            maintainAspectRatio: true,
            scales: {
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'number of test runs'
                        },
                        ticks: {
                            min: 0,
                            stepSize: 5
                        }
                    }
                ],
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'dates (month/day)'
                    }
                  }]
            }
        }

        let data = {
            labels: this.state.labels,
            datasets: [{
                label: this.state.title ? this.state.title : "Apps",
                fill: false,
                lineTension: 0.5,
                borderWidth: 2,
                data: this.state.data,
                backgroundColor: this.props.color
            }]
        }

        return (
            <>
                <div className='header'>
                    <h1 className='title'>Test Frequency</h1>
                </div>
                <Line data={data} options={options} />
            </>
        );
    }
}

export default LineGraph