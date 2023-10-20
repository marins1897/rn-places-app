import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import IconButton from '../components/UI/IconButton';

const Map = ({ navigation, route }) => {
    const initialLocation = route.params && { 
        lat : route.params.initialLat, 
        lng : route.params.initialLng,
    };

    const [selectedLocation, setSelectedlocation] = useState(initialLocation);

    const region = {
        latitude: initialLocation ? initialLocation.lat : 37.78,
        longitude: initialLocation ? initialLocation.lng : -122.43,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    function selectLocationHandler(event) {
        if (initialLocation) {
            return;
        }

        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;

        setSelectedlocation({ lat : lat, lng : lng });
    };
    
    const savePickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert('No Location picked!', 'You have to pick a location (by tapping on the map) first!');

            return;
        }

        navigation.navigate('AddPlace', {
            pickedLat : selectedLocation.lat,
            pickedLng : selectedLocation.lng,
        });
    }, [navigation, selectedLocation]);

    useLayoutEffect(() => {
        if (initialLocation) {
            return;
        }
        // add header button
        navigation.setOptions({
            headerRight: ({tintColor}) => <IconButton iconName="save" size={24} color={tintColor} onPress={savePickedLocationHandler}/>
        })
    },[navigation, savePickedLocationHandler, initialLocation]);
    
    return (
        <MapView onPress={selectLocationHandler} initialRegion={region} style={styles.map}>
            {selectedLocation && <Marker coordinate={{ latitude : selectedLocation.lat, longitude : selectedLocation.lng }} title='Picked Location'/>}
        </MapView>
    )
}

export default Map;

const styles = StyleSheet.create({
    map: {
        flex : 1,
    }
})