import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const inputRef = useRef(null);
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [defaultLocation, setDefaultLocation] = useState("");

  function getLocation() {
    axios
      .get(
        `https://api.geoapify.com/v1/ipinfo?&apiKey=${process.env.REACT_APP_GEO_API_KEY}`
      )
      .then((data) => {
        setDefaultLocation(
          data.data.city.name +
            " " +
            data.data.state.name +
            " " +
            data.data.country.name_native
        );
      })
      .catch((error) => {
        console.log("GeoAPI Fetch Error", error);
      });
  }

  function apiRequest(location) {
    let queryUrl = location === "" ? "q=null" : `q=${location}`;

    axios
      .get(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_API_KEY}&q=${queryUrl}`
      )
      .then((response) => {
        setData(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log("Weather API Fetch Error", error.message);
      });
  }

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    apiRequest(defaultLocation.replace(/[\u0300-\u036f]/g, "").toLowerCase());
  }, [defaultLocation]);

  function handleKeyPress(e) {
    console.log("Ekey", e);
    if (e.key === "Enter") {
      apiRequest(
        inputRef.current.value.replace(/[\u0300-\u036f]/g, "").toLowerCase()
      );
    }
  }

  return (
    <div className="App">
      <div className="container">
        <header className={"header-input"}>
          <div>
            <input
              className={"location-input"}
              placeholder={"Enter the city"}
              onKeyUp={(e) => {
                handleKeyPress(e);
              }}
              ref={inputRef}
            />
          </div>
          {isFetching ? (
            <></>
          ) : (
            <div>
              <h1 className={"location"}>{data.location.name},</h1>
              <p className={"region"}>
                {data.location.region}, {data.location.country}.
              </p>
            </div>
          )}
        </header>
        {isFetching ? (
          <p className={"loading"}>Loading...</p>
        ) : (
          <main className={"main-data"}>
            <div className={"temperature"}>
              <p className={"temp"}>{data.current.temp_c}° C</p>
              <p className={"last-update"}>
                Updated: {data.current.last_updated}
              </p>
            </div>
            <div className={"weather"}>
              <img
                className={"img"}
                src={`https://cdn.weatherapi.com/weather/128x128/${
                  data.current.condition.icon.split("/")[5]
                }/${data.current.condition.icon.split("/")[6]}`}
                alt={"Weather pic"}
                width={150}
                height={150}
              />
              <p className={"weather-label"}>{data.current.condition.text}</p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
