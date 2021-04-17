import React from 'react'
import {Line} from 'react-chartjs-2'

class LineGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "data": [],
            "labels": []
        }
    }

    componentDidMount() {
        this.setState({
            "data": this.props.data.data,
            "labels": this.props.data.labels
        });
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.data !== this.props.data){
            this.setState({"data": this.props.data.data, "labels": this.props.data.labels});
        }
    }

    render() {
        let options = {
            maintainAspectRatio: true,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            min: 0,
                            max: 10
                        }
                    }
                ]
            }
        }

        let data = {
            labels: this.state.labels,
            datasets: [{
                label: '',
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
                    <h1 className='title'>Test frequency</h1>
                </div>
                <Line data={data} options={options} />
            </>
        );
    }
}

export default LineGraph