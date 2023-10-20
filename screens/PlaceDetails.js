import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import OutlinedButton from "../components/UI/OutlinedButton"
import { Colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { fetchPlacesDetails } from "../util/database";


const PlaceDetails = ({ route, navigation }) => {
    const [loadedPlace, setLoadedPlace] = useState();

    function showOnMapHandler() {
        navigation.navigate('Map', {
            initialLat : loadedPlace.location.lat,
            initialLng : loadedPlace.location.lng,
        });
    };

    const selectedPlaceId = route.params.placeId;

    useEffect(() => {
        // use selected place id to fetch data for a single place/item
        async function loadPlaceData() {
            console.log(selectedPlaceId)
            const place = await fetchPlacesDetails(selectedPlaceId);
            setLoadedPlace(place);
            // navigation to update title on the top of the screen
            // we get navigation prop by default because PlaceDetails is added as 'Screen'
            navigation.setOptions({
                title : place.title,
            })
        }

        loadPlaceData();

    }, [selectedPlaceId]);

    console.log(loadedPlace)

    if (!loadedPlace || loadedPlace === undefined) {
        return (
            <View style={styles.fallback}>
                <Text>
                    Loading place data...
                </Text>
            </View> 
        )
    }
    
    return (
        <ScrollView>
            <Image source={{ uri : loadedPlace.imageUri}} style={styles.image}/>

            <View style={styles.locationContainer}>
                <View style={styles.addressContainer}>
                    <Text style={styles.address}>
                        {loadedPlace.address}
                    </Text>
                </View>

                <OutlinedButton icon="map" onPress={showOnMapHandler}>
                    View on Map
                </OutlinedButton>
            </View>
        </ScrollView>
    )
}

export default PlaceDetails;

const styles = StyleSheet.create({
    image : {
        height : '35%',
        minHeight : 300,
        width : '100%',
    },
    locationContainer : {
        justifyContent : 'center',
        alignItems : 'center',
    },
    addressContainer : {
        padding : 20,
    },
    address : {
        color : Colors.primary500,
        textAlign : 'center',
        fontWeight : 'bold',
        fontSize : 16,
    },
    fallback : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    }
})