import notification from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
import updateGroupPickers from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/UpdateGroupPickers';
import userFeaturesLib from '../../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import prioritySelector from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdatePrioritySelector';
import EMPButtonIsVisible from '../../../../SAPAssetManager/Rules/Notifications/EMP/EMPButtonIsVisible';
import ResetValidationOnInput from '../../../../SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput';

export default function NotificationCreateUpdateTypeOnValueChange(context) {
    //alert("9");
    let formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    context.redraw();
   // alert("12");
    if(context.getValue()[0].ReturnValue === "M2"){
        formCellContainer.getControl('DepartmentPicker').setVisible(false);
        formCellContainer.getSection('FormCellSection6').setVisible(true);
        formCellContainer.getSection('FormCellSection5').setVisible(true);
        //formCellContainer.getControl('QMCodeListPicker').setVisible(false);
        formCellContainer.getSection('FormCellSection01').setVisible(true);
        formCellContainer.getControl('ItemDescription').setVisible(true);
        
    }
    if(context.getValue()[0].ReturnValue == "M3"){
        formCellContainer.getControl('DepartmentPicker').setVisible(false);
        formCellContainer.getSection('FormCellSection5').setVisible(false);
        //formCellContainer.getControl('QMCodeListPicker').setVisible(false);
        formCellContainer.getSection('FormCellSection6').setVisible(false);
        formCellContainer.getSection('FormCellSection7').setVisible(false);
        formCellContainer.getControl('CauseDescription').setVisible(false);
        formCellContainer.getControl('ItemDescription').setVisible(false);
        formCellContainer.getSection('FormCellSection01').setVisible(false);
    }
    if(context.getValue()[0].ReturnValue == "M4"){
        //alert("M4");
        formCellContainer.getControl('DepartmentPicker').setVisible(true);
        formCellContainer.getSection('FormCellSection6').setVisible(true);
        formCellContainer.getSection('FormCellSection5').setVisible(true);
       // formCellContainer.getControl('QMCodeListPicker').setVisible(false);
        formCellContainer.getSection('FormCellSection01').setVisible(true);
        formCellContainer.getControl('ItemDescription').setVisible(true);
    }
    //alert("41");
    formCellContainer.getControl('DamageDetailsLstPkr').setEditable(true);
    formCellContainer.getControl('CodeLstPkr').setEditable(true);
    formCellContainer.getControl('PartDetailsLstPkr').setEditable(true);
    //alert("45");
    ResetValidationOnInput(context);
    //alert("47");
    return EMPButtonIsVisible(context).then(() => {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
            //alert("50");
            return prioritySelector(context).then(() => updateGroupPickers(context.getPageProxy())).finally(() => {
                return notification.setFailureAndDetectionGroupQuery(context);
            });
        } else {
            //alert("54");
            return notification.NotificationCreateUpdatePrioritySelector(context).then(() => updateGroupPickers(context.getPageProxy())).finally(() => {
                return notification.setFailureAndDetectionGroupQuery(context);
            });
        }
    });
}
