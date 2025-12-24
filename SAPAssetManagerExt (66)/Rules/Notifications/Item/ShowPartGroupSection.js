import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function ShowPartGroupSection(context) {
    let bIsVisible = true;
    let onCreate = libCommon.IsOnCreate(context);
    if(!onCreate) {
        var sNotifType = "";
        if(context.binding.Notification && context.binding.Notification !== "")
        {
            sNotifType = context.binding.Notification.NotificationType;
        }
        if(sNotifType == "M2" || sNotifType == "M4") {
            bIsVisible = true;
        }
        else {
            bIsVisible = false;
        }
    }

    return bIsVisible;
    
}
