import { Alert, View, Text, Image, StyleSheet } from "react-native";
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";


const ImagePicker = ({ onTakeImage }) => {
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [imagePicked, setImagePicked] = useState();

    async function verifyPermissions() {
        if(cameraPermissionInformation.status === (PermissionStatus.UNDETERMINED || PermissionStatus.DENIED)) {
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        return true;
    }

    async function takeImageHandler() {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }

        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16,9],
            quality : 0.5,
        });

        setImagePicked(image.assets[0].uri);
        onTakeImage(image.assets[0].uri);
    }

    let imagePreview = <Text> No image taken yet.</Text>

    if (imagePicked) {
        imagePreview = <Image source={{ uri : imagePicked }}  style={styles.image} />;
    }

    return (
        <View>
            <View style={styles.imagePreview}>
                { imagePreview }
            </View>
            
            <OutlinedButton onPress={takeImageHandler} icon="camera">
                Take Image
            </OutlinedButton>
        </View>
    )
};

export default ImagePicker;

const styles = StyleSheet.create({
    imagePreview : {
        width : '100%',
        height : 200,
        marginVertical : 8,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.primary100,
        borderRadius : 4,
        overflow : 'hidden',
    },
    image : {
        width : '100%',
        height : '100%',
        borderRadius : 4,
    }
})