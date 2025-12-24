export default function Department(context) {
    // AddressAtWork_Nav/AddressAtWorkComm
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/AddressAtWork_Nav/AddressAtWorkComm`, [], '').then(result => {
        // alert(JSON.stringify(result));

    })
}