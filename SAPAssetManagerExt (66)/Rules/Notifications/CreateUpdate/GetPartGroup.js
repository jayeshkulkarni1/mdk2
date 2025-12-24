import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function GetPartGroup(context) {
    var sPartGroup = "";
   // alert(JSON.stringify(context.binding));
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        if(context.binding.Items && context.binding.Items !== "")
        {
            sPartGroup = context.binding.Items[0].ObjectPartCodeGroup;
        }
       
    }
    return sPartGroup;
}
