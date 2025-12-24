import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
export default function ErrorArchiveDetailsMessage(context) {
    let errorObject = context.getPageProxy().binding.ErrorObject;

    if (errorObject) {
        try {
            let message = JSON.parse(errorObject.Message);
            return message.error.message.value;
        } catch (e) {
            if (!libVal.evalIsEmpty(errorObject.Message)) {
                //JK Error Handling PCN ATR_E776
            let overMessage= "time_overlapping_message";    
            if (errorObject.Message.includes("CUSTOM_ERROR_MESSAGE_001")){
                errorObject.Message = context.localizeText(overMessage);
            }
                return errorObject.Message;
            } else {
                return '-';
            }
        }
    } 

    return '-';
}
