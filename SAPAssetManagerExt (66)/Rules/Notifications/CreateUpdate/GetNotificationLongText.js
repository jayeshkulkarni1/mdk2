import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function GetNotificationLongText(context) {
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
       
        var sLongText = "N/A";
        if(context.binding.HeaderLongText && context.binding.HeaderLongText !== "")
        {
           
            sLongText=context.binding.HeaderLongText[0].TextString;

        }
        return sLongText;
    }
}
