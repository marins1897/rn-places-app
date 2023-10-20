import { FlatList, View, Text, StyleSheet } from "react-native";
import PlaceItem from "./PlaceItem";
import { Colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";


const PlacesList = ({ places }) => {
    const navigation = useNavigation();

    function selectPlaceHandler(id) {
        navigation.navigate('PlaceDetails', {
            placeId : id,
        });
    }

    if (!places || places.length === 0) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}> No Places Added Yet! </Text>
            </View>
        )
    }

    return (
        <FlatList data={places}
                style={styles.list}
                keyExtractor={(item) => item.id}
                renderItem={(itemData) => <PlaceItem place={itemData.item} onSelect={selectPlaceHandler}/>}
        />
    )
}

export default PlacesList;

const styles = StyleSheet.create({
    list : {
        marginVertical : 12,
        marginHorizontal : 8,
    },  
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackText: {
        fontSize: 16,
        color: Colors.primary200,
    }
})