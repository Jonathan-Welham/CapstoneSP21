import React from 'react'
import {Line} from 'react-chartjs-2'

class LineGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            min: 0,
                            max: 100
                        }
                    }
                ]
            }
        }

        this.data = {
            labels: this.props.data.labels,
            datasets: [{
                label: "graph",
                fill: false,
                lineTension: 0.5,
                borderWidth: 2,
                data: this.props.data.data,
                backgroundColor: this.props.color
            }]
        }
    }

    render() {
        return (
            <>
                <div className='header'>
                    <h1 className='title'>Test frequency</h1>
                </div>
                <Line data={this.data} options={this.options} />
            </>
        );
    }
}

export default LineGraph