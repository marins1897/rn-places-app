import { Alert, StyleSheet, View, Image, Text } from "react-native";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus  } from 'expo-location';
import { useEffect, useState } from "react";
import { getAddress, getMapPreview } from "../../util/location";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";


const LocationPicker = ({ onPickLocation }) => {
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
    const [ userLocation, setUserLocation ] = useState();
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && route.params) {
        const mapPickedLocation = { 
            lat : route.params.pickedLat, 
            lng : route.params.pickedLng, 
        };

        setUserLocation(mapPickedLocation);
    }

    },[route, isFocused]);

    useEffect(() => {
        async function handleLocation() {
            if (userLocation) {
                const address = await getAddress(userLocation.lat, userLocation.lng);
                // now we return our userLocation (with lat i lng and also human-readable address of picked location to PlacesForm component)
                onPickLocation({ ...userLocation, address : address });
            }
        }
        
        handleLocation();
    },[userLocation, onPickLocation]);

    async function verifyPermissions() {
        if(locationPermissionInformation.status === (PermissionStatus.UNDETERMINED || PermissionStatus.DENIED)) {
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        return true;
    }

    async function getLocationHandler() {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }

        const location = await getCurrentPositionAsync();

        setUserLocation({
            lat : location.coords.latitude,
            lng : location.coords.longitude,
        })
    }

    function pickOnMapHandler() {
        navigation.navigate('Map');
    }

    let locationPreview = <Text> No location picked yet.</Text>

    if (userLocation) {
        locationPreview = <Image source={{ uri : getMapPreview({ lat: userLocation.lat, lng: userLocation.lng })}} style={styles.image} />;
    }

    return (
        <View>
            <View style={styles.mapPreview}>
                { locationPreview }
            </View>

            <View style={styles.actions}>
                <OutlinedButton onPress={getLocationHandler} icon="location">Locate User</OutlinedButton>
                <OutlinedButton onPress={pickOnMapHandler} icon="map">Pick on Map</OutlinedButton>
            </View>
        </View>
    )
}

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview : {
        width : '100%',
        height : 200,
        marginVertical : 8,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.primary100,
        borderRadius : 4,
        overflow : 'hidden',
    },
    actions : {
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    image : {
        width : '100%',
        height : '100%',
        borderRadius : 4,
    }
})