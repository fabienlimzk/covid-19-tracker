import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  // STATE = How to write a variable in REACT

  // https://disease.sh/v3/covid-19/countries

  // useEffect = runs a piece of code based on a given condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    // async -> send a request, wait for it, do something with the input
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // country name
            value: country.countryInfo.iso2, // country code
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log("Country Code is ", countryCode);
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        // All of the data from the country response
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  console.log("Country Info is ", countryInfo);

  return (
    <div className="app">
      <div className="app___left">
        {/* Header */}
        <div className="app___header">
          {/* Title + Select input dropdown field */}
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app___dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              {/* Loop through all the countries and show a dropdown list of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app___stats">
          {/* Info boxes */}
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="New Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          {/* Info boxes */}
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered Cases"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />

          {/* Info boxes */}
          <InfoBox
            isOrange
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Death Cases"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        {/* Map */}
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app___right">
        <CardContent>
          <h3>Live cases by country</h3>
          {/* Table */}
          <Table countries={tableData} />

          <h3 className="app___graphTitle">Worldwide new {casesType}</h3>
          {/* Graph */}
          <LineGraph className="app___graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
