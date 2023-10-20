import { useEffect, useState } from "react";
import PlacesList from "../components/Places/PlacesList";
import { useIsFocused } from "@react-navigation/native";
import { fetchPlaces } from "../util/database";

// list of all places
const AllPlaces = () => {
    const [allLoadedPlaces, setAllLoadedPlaces] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        async function loadPlaces() {
            const places = await fetchPlaces();
            setAllLoadedPlaces(places);
        }
        
        if (isFocused) {
            loadPlaces();
            //setAllLoadedPlaces(currentPlaces => [...currentPlaces, route.params.place]); // .place bacuse in AddPlace we set the 'place' param when navigating
        }

    }, [isFocused]);


    return (
        <PlacesList places={allLoadedPlaces} />
    )
}

export default AllPlaces;