import notification from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
export default function GetCauseGroupDetails(context) {
    try	{
        if(context.binding.ItemCauses.length > 0) {
        var codeGroup = context.binding.ItemCauses[0].CauseCodeGroup;
        return notification.NotificationCodeGroupStr(context, 'CatTypeCauses', codeGroup);
        } else {
            return "-";
        }
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
