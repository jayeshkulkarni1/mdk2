import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
export default function ActivityType(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.MaintenanceActivityType)) {
        return '-';
    } else {
       
       return context.read('/SAPAssetManager/Services/AssetManager.service', 'ActivityTypes', [], `$filter=ActivityType eq '${binding.MaintenanceActivityType}'`, '').then(result => {
            if (result && result.length > 0) {
                return binding.MaintenanceActivityType + ' - ' + result.getItem(0).ActivityTypeDescription;
            }
             return binding.MaintenanceActivityType;
        })
    }
}