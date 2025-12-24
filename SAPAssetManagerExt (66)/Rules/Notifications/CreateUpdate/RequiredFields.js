import failureModeGroupValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateQMCodeGroupValue';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import IsPhaseModelEnabled from '../../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
export default function RequiredFields(context) {
    let onCreate = libCommon.IsOnCreate(context);
   
    let required1 = ['NotificationDescription', 'TypeLstPkr', 'FuncLocHierarchyExtensionControl', 'MainWorkCenterListPicker', 'Plannergrouplistpicker'];

    if(context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue') == "M2" || context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue') == "M4"){
       
        if(onCreate) {
            required1 = ['NotificationDescription', 'TypeLstPkr', 'FuncLocHierarchyExtensionControl', 'MainWorkCenterListPicker', 'PartDetailsLstPkr','DamageDetailsLstPkr','PartGroupLstPkr','DamageGroupLstPkr',
                           'AdditionalDamage', 'AddtionalDamageGroup', 'LongTextNote', 'PrioritySeg'];
        } else {
            required1 = ['NotificationDescription', 'TypeLstPkr', 'FuncLocHierarchyExtensionControl', 'MainWorkCenterListPicker', 'AdditionalDamage', 'AddtionalDamageGroup', 'LongTextNote', 'PrioritySeg'];
        }

        if(context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue') == "M4") {
            required1.push("DepartmentPicker");
        }
        return required1;
    }

    if(context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue') == "M3"){
        required1 = ['NotificationDescription', 'TypeLstPkr', 'FuncLocHierarchyExtensionControl', 'MainWorkCenterListPicker', 'LongTextNote', 'PrioritySeg'];
        return required1;
    }
}
