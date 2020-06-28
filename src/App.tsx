// import React from "react";
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import LocationOnIcon from "@material-ui/icons/LocationOn";
// import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
// import { makeStyles } from "@material-ui/core/styles";
// import parse from "autosuggest-highlight/parse";
// import throttle from "lodash/throttle";
// import { Console } from "console";

// function loadScript(src: string, position: HTMLElement | null, id: string) {
//   if (!position) {
//     return;
//   }

//   const script = document.createElement("script");
//   script.setAttribute("async", "");
//   script.setAttribute("id", id);
//   script.src = src;
//   position.appendChild(script);
// }

// const autocompleteService = { current: null };

// const useStyles = makeStyles((theme) => ({
//   icon: {
//     color: theme.palette.text.secondary,
//     marginRight: theme.spacing(2),
//   },
// }));

// interface PlaceType {
//   description: string;
//   structured_formatting: {
//     main_text: string;
//     secondary_text: string;
//     main_text_matched_substrings: [
//       {
//         offset: number;
//         length: number;
//       }
//     ];
//   };
// }

// export default function GoogleMaps() {
//   const classes = useStyles();
//   const [value, setValue] = React.useState<PlaceType | null>(null);
//   const [inputValue, setInputValue] = React.useState("");
//   const [options, setOptions] = React.useState<PlaceType[]>([]);
//   const loaded = React.useRef(false);

//   if (typeof window !== "undefined" && !loaded.current) {
//     if (!document.querySelector("#google-maps")) {
//       loadScript(
//         "https://maps.googleapis.com/maps/api/js?key=AIzaSyCVcY1_j6RG8Sqg6DqpBv7zyNkB8zJZzis&libraries=places",
//         document.querySelector("head"),
//         "google-maps"
//       );
//     }

//     loaded.current = true;
//   }

//   const fetch = React.useMemo(
//     () =>
//       throttle(
//         (
//           request: { input: string },
//           callback: (results?: PlaceType[]) => void
//         ) => {
//           (autocompleteService.current as any).getPlacePredictions(
//             request,
//             callback
//           );
//         },
//         200
//       ),
//     []
//   );

//   const Abrar = () => {
//     console.log("LOL");
//   };

//   React.useEffect(() => {
//     let active = true;
//     let autocomplete = null;
//     if (!autocompleteService.current && (window as any).google) {
//       autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
//       autocomplete = new (window as any).google.maps.places.Autocomplete(
//         document.getElementById("google-map-demo"),
//         {}
//       );
//       console.log(autocomplete);
//       // autocomplete.addListener("place_changed", Abrar);
//     }
//     if (!autocompleteService.current) {
//       return undefined;
//     }

//     if (inputValue === "") {
//       setOptions(value ? [value] : []);
//       return undefined;
//     }
//     // let addressObject = autocomplete.getPlace();
//     // console.log(addressObject);
//     fetch({ input: inputValue }, (results?: PlaceType[]) => {
//       if (active) {
//         let newOptions = [] as PlaceType[];

//         if (value) {
//           newOptions = [value];
//         }

//         if (results) {
//           newOptions = [...newOptions, ...results];
//         }

//         setOptions(newOptions);
//       }
//     });

//     return () => {
//       active = false;
//     };
//   }, [value, inputValue, fetch]);

//   return (
//     <Autocomplete
//       id="google-map-demo"
//       style={{ width: 300 }}
//       getOptionLabel={(option) =>
//         typeof option === "string" ? option : option.description
//       }
//       filterOptions={(x) => x}
//       options={options}
//       autoComplete
//       includeInputInList
//       filterSelectedOptions
//       value={value}
//       onChange={(event: any, newValue: PlaceType | null) => {
//         setOptions(newValue ? [newValue, ...options] : options);
//         setValue(newValue);
//       }}
//       onInputChange={(event, newInputValue) => {
//         setInputValue(newInputValue);
//       }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label="Add a location"
//           variant="outlined"
//           fullWidth
//         />
//       )}
//       renderOption={(option) => {
//         const matches =
//           option.structured_formatting.main_text_matched_substrings;
//         const parts = parse(
//           option.structured_formatting.main_text,
//           matches.map((match: any) => [
//             match.offset,
//             match.offset + match.length,
//           ])
//         );

//         return (
//           <Grid container alignItems="center">
//             <Grid item>
//               <LocationOnIcon className={classes.icon} />
//             </Grid>
//             <Grid item xs>
//               {parts.map((part, index) => (
//                 <span
//                   key={index}
//                   style={{ fontWeight: part.highlight ? 700 : 400 }}
//                 >
//                   {part.text}
//                 </span>
//               ))}
//               <Typography variant="body2" color="textSecondary">
//                 {option.structured_formatting.secondary_text}
//               </Typography>
//             </Grid>
//           </Grid>
//         );
//       }}
//     />
//   );
// }

import React, { useState, useEffect, useRef } from "react";

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

// function handleScriptLoad(updateQuery: any, autoCompleteRef: any) {
//   autoComplete = new (window as any).google.maps.places.Autocomplete(
//     autoCompleteRef.current,
//     {}
//     // { types: ["(cities)"], componentRestrictions: { country: "us" } }
//   );
//   autoComplete.setFields(["address_components", "formatted_address"]);
//   autoComplete.addListener("place_changed", () =>
//     handlePlaceSelect(updateQuery)
//   );
// }

// async function handlePlaceSelect(updateQuery: any) {
//   const addressObject = autoComplete.getPlace();
//   const query = addressObject.formatted_address;
//   updateQuery(query);
//   const addressComponent: Array<any> = addressObject["address_components"];
//        addressComponent.forEach( x => {
//           const city = x.types.includes("locality") ? x.long_name : ""
//           const state = x.types.includes("administrative_area_level_1") ? x.long_name : ""
//           const country = x.types.includes("country") ? x.long_name : ""
//           const postalCode = x.types.includes("postal_code") ? x.long_name : ""
//        })
//   console.log(addressComponent);
// }

function SearchLocationInput() {
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
    autoComplete.setFields(["address_components", "formatted_address"]);
    autoComplete.addListener("place_changed", () =>
      handlePlaceSelect(updateQuery)
    );
  }

  async function handlePlaceSelect(updateQuery: any) {
    const addressObject = autoComplete.getPlace();
    const query = addressObject.formatted_address;
    updateQuery(query);

    const addressComponent: Array<any> = addressObject["address_components"];
    console.log(addressComponent);
    const getValue = {};
    addressComponent.forEach((x, i) => {
      if (x.types.includes("locality")) {
        setAddress({ ...address, city: x.long_name });
      } else if (x.types.includes("administrative_area_level_1")) {
        setAddress({ ...address, state: x.long_name });
      } else if (x.types.includes("country")) {
        setAddress({ ...address, country: x.long_name });
      } else if (x.types.includes("postal_code")) {
        setAddress({ ...address, postalcode: x.long_name });
      }
    });
  }
  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyCVcY1_j6RG8Sqg6DqpBv7zyNkB8zJZzis&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  return (
    <div className="search-location-input">
      <input
        ref={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Address"
        value={query}
      />
      <br />
      <input
        onChange={(event) =>
          setAddress({ ...address, city: event.target.value })
        }
        placeholder="Enter a City"
        value={address.city}
      />
      <br />
      <input
        onChange={(event) =>
          setAddress({ ...address, postalcode: event.target.value })
        }
        placeholder="Enter a postalcode"
        value={address.postalcode}
      />
      <br />
      <input
        onChange={(event) =>
          setAddress({ ...address, country: event.target.value })
        }
        placeholder="Enter a country"
        value={address.country}
      />
      <br />
      <input
        onChange={(event) =>
          setAddress({ ...address, state: event.target.value })
        }
        placeholder="Enter a state"
        value={address.state}
      />
    </div>
  );
}

export default SearchLocationInput;
