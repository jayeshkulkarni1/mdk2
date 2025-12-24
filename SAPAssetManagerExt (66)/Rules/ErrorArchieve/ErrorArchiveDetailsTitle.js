/**
* Describe this function...
* @param {IClientAPI} context
*/
import libErr from '../../../SAPAssetManager/Rules/ErrorArchive/ErrorArchiveLibrary';

export default function ErrorArchiveDetailsTitle(context) {
    let errorObject = context.getPageProxy().binding.ErrorObject;
    if (errorObject) {
        try {
            let message = JSON.parse(errorObject.Message);
            return libErr.parseErrorTitle(message, message.error.message.value);
        } catch (e) {
             //JK Error Handling PCN ATR_E776
            let overMessage= "time_overlapping_message";    
            if (errorObject.Message.includes("CUSTOM_ERROR_MESSAGE_001")){
                errorObject.Message = context.localizeText(overMessage);
            }
            return libErr.parseErrorTitle(errorObject.Message, errorObject.Message);
        }
    } 
    return '-';
}
