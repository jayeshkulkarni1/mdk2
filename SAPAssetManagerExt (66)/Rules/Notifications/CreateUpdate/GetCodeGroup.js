import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function GetCodeGroup(context) {
    var sCodeGroup = "";
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        if(context.binding.Items && context.binding.Items !== "")
        {
            sCodeGroup = context.binding.Items[0].CodeGroup;
        }
       
    }
    return sCodeGroup;
}
