import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function GetNotifItemDescription(context) {
    var sItemText = "";
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        if(context.binding.Items && context.binding.Items !== "")
        {
            sItemText = context.binding.Items[0].ItemText;
        }
       
    }
    return sItemText;
}
