import notification from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
export default function GetCauseCodeDetails(context) {
    try	{
        if(context.binding.ItemCauses !== "") {
            var code = context.binding.ItemCauses[0].CauseCode;
            var codeGroup = context.binding.ItemCauses[0].CauseCodeGroup;
            return notification.NotificationCodeStr(context, 'CatTypeCauses', codeGroup, code);
            
        } else {
            return "-";
        }
       
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
