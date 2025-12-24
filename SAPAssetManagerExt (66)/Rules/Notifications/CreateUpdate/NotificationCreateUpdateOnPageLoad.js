import style from '../../../../SAPAssetManager/Rules/Common/Style/StyleFormCellButton';
import hideCancel from '../../../../SAPAssetManager/Rules/ErrorArchive/HideCancelForErrorArchiveFix';
import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Stylizer from '../../../../SAPAssetManager/Rules/Common/Style/Stylizer';
import libNotif from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
import userFeaturesLib from '../../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import ApplicationSettings from '../../../../SAPAssetManager/Rules/Common/Library/ApplicationSettings';
import NotificationLibrary from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
import SetUpAttachmentTypes from '../../../../SAPAssetManager/Rules/Documents/SetUpAttachmentTypes';
import EMPButtonIsVisibleOnLoad from '../../../../SAPAssetManager/Rules/Notifications/EMP/EMPButtonIsVisibleOnLoad';
import NotificationCreateUpdateFromOrder from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateFollowOnNotificationIsVisible';
import { getGeometryData, locationInfoFromObjectType } from '../../../../SAPAssetManager/Rules/Common/GetLocationInformation';
import NotificationCreateUpdateShowFieldsChange from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateShowFieldsChange';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import NotificationItemPartGroupPickerItems from '../../../../SAPAssetManager/Rules/Notifications/Item/CreateUpdate/NotificationItemPartGroupPickerItems';
//import EquipmentQueryOption from '../EquipmentQueryOption';
export default async function NotificationCreateUpdateOnPageLoad(context) {
  //  alert("18");
    var formCellContainer = context.getControl('FormCellContainer');
    // Create empty promise in the event of QM creation. Forces rule to wait until read is completed.
    let QMRead = Promise.resolve();
    hideCancel(context);
    SetUpAttachmentTypes(context);
    let caption;
    const onCreate = common.IsOnCreate(context);
    let container = context.getControls()[0];
    let binding = context.binding;
    
    common.saveInitialValues(context);
    if (NotificationCreateUpdateFromOrder(context)) {
        common.setStateVariable(context, 'isFollowOn', true);
    } else {
        common.setStateVariable(context, 'isFollowOn', false);
    }

    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        caption = context.localizeText('record_defect');
    } else {

        container.getSection('SectionFormCell0').setVisible(false);
        let filterDamageCode = "";
        if (onCreate) {
            filterDamageCode = `$orderby=Code`;
            container.getControl('TypeLstPkr').setValue("");
            caption = context.localizeText('add_notification');

            container.getSection('FormCellSection5').setVisible(true);
            container.getSection('FormCellSection6').setVisible(true);
            container.getControl('ItemDescription').setVisible(true);
            if (binding.NotificationType == "M3") {
                container.getSection('FormCellSection01').setVisible(false);


            } else if (binding.NotificationType == "M4") {
                container.getControl('DepartmentPicker').setVisible(true);
                container.getControl('DepartmentPicker').setEditable(true);
            }
            else {

                container.getSection('FormCellSection01').setVisible(true);
            }

            container.getSection('FormCellSection7').setVisible(false);
           // container.getSection('SectionFormCell13').setVisible(false);
            

        } else {
           // alert(JSON.stringify(context.binding));
            let damageGroup = context.binding.QMCodeGroup;
            filterDamageCode = `$orderby=Code&$filter=CodeGroup eq '${damageGroup}'`;
            // alert(JSON.stringify(binding));
            caption = context.localizeText('edit_notification');

            container.getSection('FormCellSection5').setVisible(false);
            container.getSection('FormCellSection6').setVisible(false);
            container.getSection('FormCellSection7').setVisible(false);
            container.getControl('ItemDescription').setVisible(false);

            // if (!common.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
            //     container.getControl('TypeLstPkr').setEditable(false);
            // }
            ///Notification type can't be edit on local notifications

            container.getControl('TypeLstPkr').setEditable(false);
            container.getControl('PrioritySeg').setEditable(false);
            container.getControl('RequiredStartTimePicker').setEditable(false);
           // alert("97");
            let formCellContainer = context.getPageProxy().getControl('FormCellContainer');
            

            if (binding.NotificationType == "M2") {

                formCellContainer.getControl('DepartmentPicker').setVisible(false);
                container.getSection('FormCellSection01').setVisible(true);
                //container.getSection('SectionFormCell13').setVisible(false);


            }
            if (binding.NotificationType == "M3") {

                formCellContainer.getControl('DepartmentPicker').setVisible(false);
                container.getSection('FormCellSection01').setVisible(false);
                //container.getSection('SectionFormCell13').setVisible(false);

            }
            if (binding.NotificationType == "M4") {
                formCellContainer.getControl('DepartmentPicker').setVisible(true);
                formCellContainer.getControl('DepartmentPicker').setEditable(true);
                container.getControl('PrioritySeg').setEditable(true);
                container.getSection('FormCellSection01').setVisible(true);
                ////container.getSection('SectionFormCell13').setVisible(true);

            }
            let addDamagePicker = context.getControl('FormCellContainer').getControl('AdditionalDamage');
            let specifierDamage = addDamagePicker.getTargetSpecifier();
            specifierDamage.setQueryOptions(filterDamageCode);
           // addDamagePicker.setTargetSpecifier(specifierDamage);   //TBD BUG

            // QM-Specific
            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                    QMRead = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
                        if (result && result.length > 0) {
                            typePkr.setValue(result.getItem(0).QMNotifType, true).setEditable(false);
                        }
                    });
                }
            }
           // alert("141");
            //Malfunction date/time
            let startDate = formCellContainer.getControl('MalfunctionStartDatePicker');
            let startTime = formCellContainer.getControl('MalfunctionStartTimePicker');
            let endDate = formCellContainer.getControl('MalfunctionEndDatePicker');
            let endTime = formCellContainer.getControl('MalfunctionEndTimePicker');
            let startSwitch = formCellContainer.getControl('BreakdownStartSwitch');
            let endSwitch = formCellContainer.getControl('BreakdownEndSwitch');
            let breakdown = formCellContainer.getControl('BreakdownSwitch').getValue();

            if (breakdown) {
                startDate.setVisible(true);
                startTime.setVisible(true);
                endDate.setVisible(true);
                endTime.setVisible(true);
                startSwitch.setVisible(true);
                endSwitch.setVisible(true);
            }

            if (startSwitch.getValue()) {
                startDate.setEditable(true);
                startTime.setEditable(true);
            }

            if (endSwitch.getValue()) {
                endDate.setEditable(true);
                endTime.setEditable(true);
            }

            formCellContainer.getControl('MainWorkCenterListPicker').setValue(context.binding.ExternalWorkCenterId); //Workcenter adjustement
        }



    }

    context.setCaption(caption);

  //  alert("177");
    if (libNotif.getAddFromJobFlag(context)) {
        container.getControl('EquipHierarchyExtensionControl').setEditable(true);
        container.getControl('FuncLocHierarchyExtensionControl').setEditable(true);
    }
   // NotificationCreateUpdateShowFieldsChange(context, false); 

    style(context, 'DiscardButton');
    //Set Failure Group and Detection Group
    libNotif.setFailureAndDetectionGroupQuery(context).then(() => {
        common.saveInitialValues(context);
    });
    //alert("189");
    /* Start- Jay - Default Floc from floc screen*/
    var previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    if (previousPage.getReadLink().includes('FunctionalLocation')) {
        return setDefaultListPickerValue(context, "FuncLocHierarchyExtensionControl");
    }
    if (previousPage.getReadLink().includes('Equipment')) {
        return setDefaultListPickerValue(context, "EquipHierarchyExtensionControl");
    }
    
    /*End - Jay - Default Floc from floc screen*/
    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        let typePicker = context.getControl('FormCellContainer').getControl('TypeLstPkr');
        let specifier = typePicker.getTargetSpecifier();

        specifier.setEntitySet('OrderTypes');
        specifier.setQueryOptions(`$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        specifier.setDisplayValue('{{#Property:EAMNotifType}} - {{#Property:OrderTypeDesc}}');
        specifier.setReturnValue('{EAMNotifType}');

        typePicker.setTargetSpecifier(specifier).then(() => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`).then(function (result) {
                if (result.length === 1) {
                    typePicker.setValue(result.getItem(0).EAMNotifType);
                }
            });
        });
    }

    

    setPartnerPickers(context, container).then(() => {
        return QMRead;
    });

}

export function setPartnerPickers(context, formCellContainer) {
    const partnerType1 = common.getStateVariable(context, 'partnerType1');
    const partnerType2 = common.getStateVariable(context, 'partnerType2');
    let partnerSpecifiers = [];

    if (common.isDefined(partnerType1)) {
        partnerSpecifiers.push(libNotif.setPartnerPickerTarget(partnerType1, formCellContainer.getControl('PartnerPicker1')));
    }

    if (common.isDefined(partnerType2)) {
        partnerSpecifiers.push(libNotif.setPartnerPickerTarget(partnerType2, formCellContainer.getControl('PartnerPicker2')));
    }

    return Promise.all(partnerSpecifiers);
}


function setDefaultListPickerValue(context, name, workOrder = {}) {
    let formCellContainer = context.getControl('FormCellContainer');
    var extension;
    var value;
    if (name === 'FuncLocHierarchyExtensionControl') {
        value = context.evaluateTargetPath('#Control:FuncLocHierarchyExtensionControl/#Value');
        if (!value || value.length === 0) {
            value = context.binding.HeaderFunctionLocation || workOrder.HeaderFunctionLocation;
        }
        if (value) {
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
        }
        if (extension) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], `$filter=FuncLocId eq '${value}'&$top=1`, '').then(result => {
                if (result && result.length > 0) { 
                    extension.setValue(result.getItem(0).FuncLocIdIntern);
                }
            })
        }
    }
    if (name === 'EquipHierarchyExtensionControl') {
        value = context.evaluateTargetPath('#Control:EquipHierarchyExtensionControl/#Value');
        if (value) {
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
        }
        if (extension) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${value[0].ReturnValue}'`, '').then(result => {
                if (result && result.length > 0) {
                     extension.setValue(result.getItem(0).FuncLocIdIntern);
                }
            })
        }
    }
    

}

