import React, { useState, useEffect, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Button } from "@material-ui/core";

let autoComplete: any;
const loadScript = (url: any, callback: any) => {
  let script: any = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

const useStyles = makeStyles((theme) => ({
  root: {},
  autoCompleteInput: {
    width: "100%",
    border: 0,
    borderBottom: "1px solid gray",
    height: "1.1876em",
    marginTop: "8px",
    display: "block",
    padding: "6px 0 7px",
    minWidth: 0,
    background: "none",
    boxSizing: "content-box",
    WebkitTapHighlightColor: "transparent",
  },
}));

function SearchLocationInput() {
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const [address, setAddress] = useState({
    name: "",
    state: "",
    country: "",
    postalcode: "",
    city: "",
  });

  function handleScriptLoad(updateQuery: any, autoCompleteRef: any) {
    autoComplete = new (window as any).google.maps.places.Autocomplete(
      autoCompleteRef.current,
      {}
      // { types: ["(cities)"], componentRestrictions: { country: "us" } }
    );
    autoComplete.setFields(["address_components", "formatted_address", "name"]);
    autoComplete.addListener("place_changed", () =>
      handlePlaceSelect(updateQuery)
    );
  }
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setAddress({ [name]: value, ...address });
  //   console.log(address);
  // };
  async function handlePlaceSelect(updateQuery: any) {
    const addressObject = autoComplete.getPlace();
    const query = addressObject.formatted_address;
    updateQuery(query);
    const name = addressObject.name;
    ///setAddress({ ...address, name: name });
    const addressComponent: Array<any> = addressObject["address_components"];
    let postalCode = "",
      City = "",
      State = "",
      Country = "";
    addressComponent.forEach((x, i) => {
      if (x.types.includes("locality")) {
        // setAddress({ ...address, city: x.long_name });
        City = x.long_name;
      } else if (x.types.includes("administrative_area_level_1")) {
        State = x.long_name;
        // setAddress({ ...address, state: x.long_name });
      } else if (x.types.includes("country")) {
        Country = x.long_name;
        // setAddress({ ...address, country: x.long_name });
      } else if (x.types.includes("postal_code")) {
        // setAddress({ ...address, postalcode: x.long_name });
        postalCode = x.long_name;
      }
    });
    setAddress({
      name: name,
      postalcode: postalCode,
      state: State,
      city: City,
      country: Country,
    });
  }
  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyCVcY1_j6RG8Sqg6DqpBv7zyNkB8zJZzis&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  const handleSubmit = (e: any) => {
    console.log("LOL");
    e.preventDefault();
    console.log(address);
  };

  return (
    <>
      <div className="search-location-input">
        <input
          ref={autoCompleteRef}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Address"
          value={query}
          className={classes.autoCompleteInput}
        />
        <TextField
          autoComplete="address"
          margin="dense"
          fullWidth
          onChange={(e) => {
            setAddress({
              name: address.name,
              postalcode: e.target.value,
              state: address.state,
              city: address.city,
              country: address.country,
            });
          }}
          placeholder="Postal Code"
          value={address.postalcode}
          name="postalcode"
        />
        <TextField
          autoComplete="address"
          margin="dense"
          fullWidth
          onChange={(e) => {
            setAddress({
              name: address.name,
              postalcode: address.postalcode,
              state: address.state,
              city: e.target.value,
              country: address.country,
            });
          }}
          placeholder="City"
          value={address.city}
          name="city"
        />
        <TextField
          autoComplete="address"
          margin="dense"
          fullWidth
          onChange={(e) => {
            setAddress({
              name: address.name,
              postalcode: address.postalcode,
              state: e.target.value,
              city: address.city,
              country: address.country,
            });
          }}
          placeholder="State"
          value={address.state}
          name="state"
        />
        <TextField
          autoComplete="address"
          margin="dense"
          fullWidth
          onChange={(e) => {
            // setAddress({ country: e.target.value, ...address });
            setAddress({
              name: address.name,
              postalcode: address.postalcode,
              state: address.state,
              city: address.city,
              country: e.target.value,
            });
          }}
          placeholder="Country"
          value={address.country}
          name="country"
        />
      </div>
      <Button type="submit" onClick={handleSubmit}>
        {" "}
        Save{" "}
      </Button>
    </>
  );
}

export default SearchLocationInput;
