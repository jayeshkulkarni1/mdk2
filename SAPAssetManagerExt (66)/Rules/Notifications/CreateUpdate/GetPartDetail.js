import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function GetPartDetail(context) {
    var sPart = "";
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        if(context.binding.Items && context.binding.Items !== "")
        {
            sPart = context.binding.Items[0].ObjectPart;
        }
       
    }
    return sPart;
}
