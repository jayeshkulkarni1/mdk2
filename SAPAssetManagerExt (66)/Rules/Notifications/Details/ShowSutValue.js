export default function ShowSutValue(context) {
    var binding = context.binding;
    var sNotifType = binding.NotificationType;
    if(sNotifType == "M4") {
        return true;
    } else {
        return false;
    }
   
}