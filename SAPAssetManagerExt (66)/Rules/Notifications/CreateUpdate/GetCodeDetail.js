import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default async function GetCodeDetail(context) {
  let sCode = "";
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        if(context.binding.Items && context.binding.Items !== "")
        {
            sCode = context.binding.Items[0].DamageCode;
           
        }
       
    }

    return sCode;
}
