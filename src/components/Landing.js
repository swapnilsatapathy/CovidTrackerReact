import React, { Component } from 'react'
import '../landing.css'
import Logo from '../images/logo.png'
import Select from 'react-select';
import CountUp from 'react-countup';
import { Bar, HorizontalBar } from 'react-chartjs-2'

class Landing extends Component {
    constructor(props) {
        super(props)

        this.state = {
            countries: [],
            confirmed: 0,
            active: 0,
            recovered: 0,
            deaths: 0,
            selectedOption: {value: "World", label: "World"},
            critical: 0,
            casesToday: 0,
            deathsToday: 0,
            casesPerMillion: 0,
            deathsPerMillion: 0,
            totalTests: 0,
            testsPerMillion: 0
        }
    }

    handleChange = selectedOption => {
        this.setState({
            selectedOption: selectedOption
        })
        fetch(`https://coronavirus-19-api.herokuapp.com/countries/${selectedOption.value}`)
            .then(res => res.json())
            .then((json) => {
                this.setState({
                    confirmed: json.cases,
                    active: json.active,
                    recovered: json.recovered,
                    deaths: json.deaths,
                    critical: json.critical,
                    casesToday: json.todayCases,
                    deathsToday: json.todayDeaths,
                    casesPerMillion: json.casesPerOneMillion,
                    deathsPerMillion: json.deathsPerOneMillion,
                    totalTests: json.totalTests,
                    testsPerMillion: json.testsPerOneMillion
                })
            })
    };

    async componentDidMount() {
        var countriesData = []
        var countries = []
        await fetch('https://coronavirus-19-api.herokuapp.com/countries')
            .then(res => res.json())
            .then((json) => {
                countriesData = json
            })
        await fetch('https://coronavirus-19-api.herokuapp.com/countries/World')
            .then(res => res.json())
            .then((json) => {
                this.setState({
                    confirmed: json.cases,
                    active: json.active,
                    recovered: json.recovered,
                    deaths: json.deaths,
                    critical: json.critical,
                    casesToday: json.todayCases,
                    deathsToday: json.todayDeaths,
                    casesPerMillion: json.casesPerOneMillion,
                    deathsPerMillion: json.deathsPerOneMillion,
                    totalTests: json.totalTests,
                    testsPerMillion: json.testsPerOneMillion
                })
            })
        countriesData.map((obj) => {
            countries.push(obj.country)
        })
        this.setState({
            countries: countries
        })
    }


    render() {
        const { selectedOption, countries, confirmed, active, recovered, deaths, critical, casesToday, deathsToday, casesPerMillion, deathsPerMillion, totalTests, testsPerMillion } = this.state;
        var options = []
        countries.map((country) => {
            var tempObj = {}
            tempObj.value = country
            tempObj.label = country
            options.push(tempObj)
        })
        var activePer = ((active / confirmed) * 100).toFixed(2)
        var recoveredPer = ((recovered / confirmed) * 100).toFixed(2)
        var deathsPer = ((deaths / confirmed) * 100).toFixed(2)
        var countryName = selectedOption.value
        return (
            <div className="body">
                <div className="container">
                    <img src={Logo} className="logo" alt="logo" />
                </div>
                <div className="container mt-4">
                    <div className="col-12">
                        <div class="card" style={{ backgroundColor: "#100e2b" }}>
                            <div class="card-body">
                                < Select
                                    value={selectedOption}
                                    onChange={this.handleChange}
                                    options={options}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="card-deck">
                            <div className="card card-confirmed">
                                <div className="card-body">
                                    <h6 class="card-title card-modified-title">Confirmed</h6>
                                    <h3 style={{ fontWeight: "bolder" }}><CountUp start={0} end={confirmed} duration={2} separator="," /></h3>
                                    <h6 className="card-modified-title">{new Date().toDateString()}</h6>
                                </div>
                            </div>
                            <div className="card card-active">
                                <div className="card-body">
                                    <h6 className="card-title card-modified-title">Active</h6>
                                    <h3 style={{ fontWeight: "bolder" }}><CountUp start={0} end={active} duration={2} separator="," /></h3>
                                    <h6 className="card-modified-title">{new Date().toDateString()}</h6>
                                </div>
                            </div>
                            <div className="card card-recovered">
                                <div className="card-body">
                                    <h6 className="card-title card-modified-title">Recovered</h6>
                                    <h3 style={{ fontWeight: "bolder" }}><CountUp start={0} end={recovered} duration={2} separator="," /></h3>
                                    <h6 className="card-modified-title">{new Date().toDateString()}</h6>
                                </div>
                            </div>
                            <div className="card card-deaths">
                                <div className="card-body">
                                    <h6 className="card-title card-modified-title">Deceased</h6>
                                    <h3 style={{ fontWeight: "bolder" }}><CountUp start={0} end={deaths} duration={2} separator="," /></h3>
                                    <h6 className="card-modified-title">{new Date().toDateString()}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-5">
                        <div className="row">
                            <div className="col-md-7 col-sm-12">
                                {
                                    <HorizontalBar
                                        data={{
                                            labels: ['Active', 'Recovered', 'Deceased'],
                                            datasets: [
                                                {
                                                    label: 'Percentage(%) ',
                                                    backgroundColor: ['rgba(255, 183, 0, 0.6)', 'rgba(0, 255, 0, 0.5)', 'rgba(81, 87, 83, 0.5)'],
                                                    data: [activePer, recoveredPer, deathsPer],
                                                },
                                            ],
                                        }}

                                        options={{
                                            legend: { display: false },
                                            title: { display: true, text: `Current state in ${countryName} (%)`, fontColor: "white" },
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        beginAtZero: true,
                                                        fontColor: 'white'
                                                    },
                                                }],
                                                xAxes: [{
                                                    ticks: {
                                                        fontColor: 'white'
                                                    },
                                                }]
                                            }
                                        }}
                                    />
                                }
                            </div>
                            <div className="col-md-5 col-sm-12" style={{ textAlign: "justify", color: "white" }}>
                                <center>
                                <table className="small-screen">
                                    <tr>
                                        <td>
                                            <strong>Total Confirmed Cases</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={confirmed} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Active Cases</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={active} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Recovered Cases</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={confirmed} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Critical Cases</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={critical} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Confirmed Cases Today</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={casesToday} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Cases/million</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={casesPerMillion} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr class="blank_row">
                                        <td colspan="3"></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Total Deaths</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={deaths} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Deaths Today</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={deathsToday} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Deaths/million</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={deathsPerMillion} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr class="blank_row">
                                        <td colspan="3"></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Total Tests</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={totalTests} duration={2} separator="," />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Tests/million</strong>
                                        </td>
                                        <td>
                                            <strong>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</strong>
                                        </td>
                                        <td>
                                            <CountUp start={0} end={testsPerMillion} duration={2} separator="," />
                                        </td>
                                    </tr>
                                </table>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Landing

