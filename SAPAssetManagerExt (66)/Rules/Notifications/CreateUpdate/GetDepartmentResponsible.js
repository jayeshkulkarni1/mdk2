import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function GetNotificationLongText(context) {
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
    
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders(\'' + context.binding.NotificationNumber + '\')/Partners', [], '').then(function (result) {
                    
        var sResult = "";
        result.forEach(function(element) {
            if(element.PartnerFunction === "AB") {
                sResult = element.PartnerNum;
            }
        });
        return sResult;

     })
    }
}
