const GOOGLE_API_KEY = 'AIzaSyCghibULBZ9xQcgVOGghP5GL_cKUPpLkWY';

export function getMapPreview({ lat, lng }) {
    console.log('Lat:', lat);
    console.log('Lng:', lng);

    const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
    
    console.log('Image URL:', imagePreviewUrl);
    
    return imagePreviewUrl;
}  

export async function getAddress(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch address.');
    }

    const data = await response.json();
    // I know this by official docs ( there will be my human-readable address )
    const address = data.results[0].formatted_address;

    return address;
}