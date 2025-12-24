import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function GetCauseText(context) {
    var sCode = "";
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        if(context.binding.Items && context.binding.Items.length > 0 && context.binding.Items[0].ItemCauses && context.binding.Items[0].ItemCauses !== "")
        {
            sCode = context.binding.Items[0].ItemCauses[0].CauseText;
        }
       
    }
    return sCode;
}
