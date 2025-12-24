import EnableNotificationCreateEdit from '../../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationCreateEdit';
export default function ShowHideSectionsByType(context) {
    let binding = context.getPageProxy().getBindingObject();
   // alert(binding.NotificationType);
    if(EnableNotificationCreateEdit()) {
        let sNotificationType = binding.NotificationType;
        if(sNotificationType == "M2" || sNotificationType == "M4") {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
   
}