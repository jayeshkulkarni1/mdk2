import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function GetCauseCode(context) {
    var sCode = "";
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        if(context.binding.ItemCauses && context.binding.ItemCauses !== "")
        {
            sCode = context.binding.ItemCauses[0].CauseCode;
        }
       
    }
    return sCode;
}
