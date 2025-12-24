import ComLib from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ValidationLibrary from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import NotificationUpdateSuccess from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationUpdateSuccess';
import IsPhaseModelEnabled from '../../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import GetPlanningPlant from '../../../../SAPAssetManager/Rules/Common/GetPlanningPlant';
import GenerateNotificationID from '../../../../SAPAssetManager/Rules/Notifications/GenerateNotificationID';
import NotificationLibrary from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
import BreakdownSwitchValue from '../../../../SAPAssetManager/Rules/Notifications/BreakdownSwitchValue';
import NotificationCreateUpdateQMCodeGroupValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateQMCodeGroupValue';
import NotificationCreateUpdateQMCodeValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateQMCodeValue';

import NotificationCreateSuccess from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateSuccess';
import GetMalfunctionStartDate from '../../../../SAPAssetManager/Rules/Notifications/MalfunctionStartDate';
import GetMalfunctionStartTime from '../../../../SAPAssetManager/Rules/Notifications/MalfunctionStartTime';
import GetMalfunctionEndDate from '../../../../SAPAssetManager/Rules/Notifications/MalfunctionEndDate';
import GetMalfunctionEndTime from '../../../../SAPAssetManager/Rules/Notifications/MalfunctionEndTime';
import GetCurrentDate from '../../../../SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentDate';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import OffsetODataDate from '../../../../SAPAssetManager/Rules/Common/Date/OffsetODataDate';
import NotificationReferenceNumber from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationReferenceNumber';
import NotificationReferenceType from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationReferenceType';
import IsMinorWorkEnabled from '../../../../SAPAssetManager/Rules/WorkOrders/IsMinorWorkEnabled';
import { isControlPopulated } from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/RequiredFields';
import CreateEMPEntries from '../../../../SAPAssetManager/Rules/Notifications/EMP/CreateEMPEntries';
import IsFromOnlineFlocCreate from '../../../../SAPAssetManager/Rules/Common/IsFromOnlineFlocCreate';
export default function NotificationCreateUpdateOnCommit(clientAPI) {

    //Temporary Workaround for an issue where the hierarchy list picker is wiping out the binding on the page. MDK issue logged MDKBUG-585.
    //Get the binding from the formcellcontainer
    
    let formCellContainer = clientAPI.getControl('FormCellContainer');
    if (ValidationLibrary.evalIsEmpty(clientAPI.binding)) {
        clientAPI._context.binding = formCellContainer.binding;
    }
    
    // let FunctionLocValue = clientAPI.getControls()[0].getControl('FuncLocHierarchyExtensionControl').getValue()[0].ReturnValue;
    // let EquiValue = "";
    
    // if (clientAPI.getControls()[0].getControl('EquipHierarchyExtensionControl').getValue() && clientAPI.getControls()[0].getControl('EquipHierarchyExtensionControl').getValue().length > 0) {
    //     EquiValue = clientAPI.getControls()[0].getControl('EquipHierarchyExtensionControl').getValue()[0].ReturnValue;
    // }
    
    //alert("44");
    var workcenterValue = clientAPI.getControls()[0].getControl('MainWorkCenterListPicker').getValue()[0].ReturnValue;
    var workcenter;
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], "$filter=ExternalWorkCenterId eq '" + workcenterValue + "'")
    .then(function(result) {
          workcenter =  result.getItem(0).WorkCenterId;
   // alert("50" + workcenter);
    let plannergroup = "";
    if (clientAPI.getControls()[0].getControl('PlanningGroupListpicker').getValue() && clientAPI.getControls()[0].getControl('PlanningGroupListpicker').getValue().length > 0) {
        plannergroup = clientAPI.getControls()[0].getControl('PlanningGroupListpicker').getValue()[0].ReturnValue;
    }
    //alert("50");
    // Prevent double-pressing done button
    clientAPI.showActivityIndicator('');

    //Determine if we are on edit vs. create
    let onCreate = ComLib.IsOnCreate(clientAPI);
    let type = ComLib.getListPickerValue(clientAPI.getControls()[0].getControl('TypeLstPkr').getValue());
    ComLib.setStateVariable(clientAPI, 'NotificationType', type); // Saving type to later use for EAMOverallStatusConfigs
    let descr = clientAPI.getControls()[0].getControl('NotificationDescription').getValue();
    let plannerGroup = clientAPI.getControls()[0].getControl('PlanningGroupListpicker').getValue();
    let breakdownStart = ComLib.getControlProxy(clientAPI, 'BreakdownStartSwitch').getValue();
    let breakdownEnd = ComLib.getControlProxy(clientAPI, 'BreakdownEndSwitch').getValue();
    let notifCategoryPromise = NotificationLibrary.getNotificationCategory(clientAPI, type).then(notifCategory => {
        ComLib.setStateVariable(clientAPI, 'NotificationCategory', notifCategory);
        return notifCategory;
    });
    //alert("66");
    if (onCreate) {
      
        // If we're creating a Notification, we will always be doing a ChangeSet
        ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'Notification');
        if (!ValidationLibrary.evalIsEmpty(type) && !ValidationLibrary.evalIsEmpty(descr)) {
            
            let promises = [];
            promises.push(GenerateNotificationID(clientAPI));
            promises.push(NotificationLibrary.NotificationCreateMainWorkCenter(clientAPI));
           // alert("76");
            if (clientAPI.binding.OnlineEquipment) {
                const onlineEquip = ComLib.getControlProxy(clientAPI, 'OnlineEquipControl').getValue();
                promises.push(Promise.resolve(''));
                promises.push(Promise.resolve(onlineEquip ? onlineEquip.split(' - ')[0] : ''));
            } else if (IsFromOnlineFlocCreate(clientAPI)) {
                promises.push(clientAPI.binding.HeaderFunctionLocation);
                promises.push('');
            } else {
                promises.push(NotificationLibrary.NotificationCreateUpdateFunctionalLocationLstPkrValue(clientAPI));
                promises.push(NotificationLibrary.NotificationCreateUpdateEquipmentLstPkrValue(clientAPI));
            }
            promises.push(NotificationReferenceType(clientAPI));
            promises.push(notifCategoryPromise);
         //   alert("90");
            return Promise.all(promises).then(results => {
               // alert("92");
                let [notifNum, workcenter, floc, equip, refObjectType] = results;
               // alert("99");
                let notificationCreateProperties = {
                    //'PlanningGroup': plannerGroup.length ? plannerGroup[0].ReturnValue : '',
                    'PlanningPlant': NotificationLibrary.NotificationCreateDefaultPlant(clientAPI),
                    'NotificationNumber': notifNum,
                    'NotificationDescription': descr,
                    'NotificationType': type,
                    'Priority': NotificationLibrary.NotificationCreateUpdatePrioritySegValue(clientAPI),
                    'HeaderFunctionLocation': floc,
                    'HeaderEquipment': equip,
                    'BreakdownIndicator': BreakdownSwitchValue(clientAPI),
                     //'MainWorkCenter': workcenterValue,
                    'MainWorkCenter': workcenter,
                    'MainWorkCenterPlant': NotificationLibrary.NotificationCreateMainWorkCenterPlant(clientAPI),
                    'ReportedBy': ComLib.getSapUserName(clientAPI),
                    'CreationDate': GetCurrentDate(clientAPI),
                    'ReferenceNumber': NotificationReferenceNumber(clientAPI),
                    'RefObjectKey': NotificationReferenceNumber(clientAPI),
                    'RefObjectType': refObjectType,
                    'PlanningGroup': plannergroup,
                    'QMCodeGroup': (function () { try { return clientAPI.evaluateTargetPath('#Control:AddtionalDamageGroup/#SelectedValue'); } catch (e) { return ''; } })(),
                    'QMCode': (function () { try { return clientAPI.evaluateTargetPath('#Control:AdditionalDamage/#SelectedValue'); } catch (e) { return ''; } })()
                };

                // notificationCreateProperties.QMCodeGroup = NotificationCreateUpdateQMCodeGroupValue(clientAPI);
                // notificationCreateProperties.QMCode = NotificationCreateUpdateQMCodeValue(clientAPI);
                // notificationCreateProperties.QMCatalog = NotificationCreateUpdateCatalogValue(clientAPI);
               // alert("120");
                if (breakdownStart) {
                    notificationCreateProperties.MalfunctionStartDate = GetMalfunctionStartDate(clientAPI);
                    notificationCreateProperties.MalfunctionStartTime = GetMalfunctionStartTime(clientAPI);
                }

                if (breakdownEnd) {
                    notificationCreateProperties.MalfunctionEndDate = GetMalfunctionEndDate(clientAPI);
                    notificationCreateProperties.MalfunctionEndTime = GetMalfunctionEndTime(clientAPI);
                }

                //Update property InspectionLot.
                if (clientAPI.binding && clientAPI.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                    notificationCreateProperties.InspectionLot = clientAPI.binding.InspectionLot;
                }

                if (ComLib.getStateVariable(clientAPI, 'isMinorWork') && IsMinorWorkEnabled(clientAPI)) {
                    const minorWorkValue = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Notifications/MinorWork.global').getValue();
                    notificationCreateProperties.NotifProcessingContext = minorWorkValue;
                }
               // alert("140" +JSON.stringify(notificationCreateProperties));
                return clientAPI.executeAction({
                    'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreate.action',
                    'Properties': {
                        'Properties': notificationCreateProperties,
                        'Headers':
                        {
                            'OfflineOData.RemoveAfterUpload': 'true',
                            'OfflineOData.TransactionID': notifNum,
                        },
                    },
                }).then(actionResult => {
                    clientAPI.redraw();
                    //alert("153")
                    // Store created notification
                    ComLib.setStateVariable(clientAPI, 'CreateNotification', JSON.parse(actionResult.data));
                    return NotificationCreateSuccess(clientAPI, JSON.parse(actionResult.data));
                }).then(() => {
                    clientAPI.redraw();
                        return CreateEMPEntries(clientAPI, clientAPI.getClientData().EMP).catch((error) => {
                            Logger.error('CreateEMPEntries error: ' + error);
                            clientAPI.dismissActivityIndicator();
                            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
                        });
                }).catch(err => {
                    //alert("165")
                    Logger.error('JKNotification2', err);
                    clientAPI.redraw();
                    clientAPI.dismissActivityIndicator();
                    return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
                });
            }).catch(err => {
                Logger.error('JKNotification', err);
                clientAPI.dismissActivityIndicator();
                return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
            });

        } else {
            clientAPI.dismissActivityIndicator();
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'One of the required controls did not return a value OnCreate');
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
        }
    } else {
        /*UAT Fix */
        var date = new Date(clientAPI.getControls()[0].getControl('RequiredEndTimePicker').getValue());
        let endDate = new OffsetODataDate(clientAPI, date);
        var reqEndDate = endDate.toDBDateString(clientAPI);
        /*UAT Fix */
        let promises = [];
        promises.push(NotificationLibrary.NotificationCreateMainWorkCenter(clientAPI));
        promises.push(notifCategoryPromise);

        return Promise.all(promises).then(results => {
            let oworkcenter = results.length >= 2 ? results[0] : '';
            //alert("200"+ JSON.stringify(oworkcenter));
            let notificationUpdateProperties = {
                'NotificationDescription': descr,
                'NotificationType': type,
                'RequiredEndDate': reqEndDate,
                'Priority': NotificationLibrary.NotificationCreateUpdatePrioritySegValue(clientAPI),
                'HeaderFunctionLocation': NotificationLibrary.NotificationCreateUpdateFunctionalLocationLstPkrValue(clientAPI),
                'HeaderEquipment': NotificationLibrary.NotificationCreateUpdateEquipmentLstPkrValue(clientAPI),
                // 'HeaderFunctionLocation': FunctionLocValue,
                // 'HeaderEquipment': EquiValue,
                'BreakdownIndicator': BreakdownSwitchValue(clientAPI),
                'PlanningGroup': plannerGroup.length ? plannerGroup[0].ReturnValue : '',
                'MainWorkCenter': workcenter,
                'MainWorkCenterPlant': NotificationLibrary.NotificationCreateMainWorkCenterPlant(clientAPI),
                'ReportedBy': ComLib.getSapUserName(clientAPI),
                'CreationDate': GetCurrentDate(clientAPI),
                'PlanningGroup': plannergroup,
                'QMCodeGroup': (function () { try { return clientAPI.evaluateTargetPath('#Control:AddtionalDamageGroup/#SelectedValue'); } catch (e) { return ''; } })(),
                'QMCode': (function () { try { return clientAPI.evaluateTargetPath('#Control:AdditionalDamage/#SelectedValue'); } catch (e) { return ''; } })()
            };
           // alert("220"+ JSON.stringify(notificationUpdateProperties));
            if (breakdownStart) {
                notificationUpdateProperties.MalfunctionStartDate = GetMalfunctionStartDate(clientAPI);
                notificationUpdateProperties.MalfunctionStartTime = GetMalfunctionStartTime(clientAPI);
            }

            if (breakdownEnd) {
                notificationUpdateProperties.MalfunctionEndDate = GetMalfunctionEndDate(clientAPI);
                notificationUpdateProperties.MalfunctionEndTime = GetMalfunctionEndTime(clientAPI);
            }

            // notificationUpdateProperties.QMCodeGroup = NotificationCreateUpdateQMCodeGroupValue(clientAPI);
            // notificationUpdateProperties.QMCode = NotificationCreateUpdateQMCodeValue(clientAPI);
            // notificationUpdateProperties.QMCatalog = NotificationCreateUpdateCatalogValue(clientAPI);
            return clientAPI.executeAction({
                'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdate.action',
                'Properties': {
                    'Properties': notificationUpdateProperties,
                    'OnSuccess': '',
                },
            }).then(() => {
              //  alert("241");
                const createItem = isControlPopulated('ItemDescription', formCellContainer) || [['PartGroupLstPkr', 'PartDetailsLstPkr'], ['DamageGroupLstPkr', 'DamageDetailsLstPkr']]
                    .some(([parentName, childName]) => isControlPopulated(parentName, formCellContainer) && isControlPopulated(childName, formCellContainer));
                createItem = false;
                if (createItem) {
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action',
                        'Properties': {
                            'OnSuccess': '',
                        },
                    });
                } else {
                    return Promise.reject(); // Skip item and cause create
                }
            }).then(actionResult => {
              //  alert("256");
                // eslint-disable-next-line brace-style
                const createCause = isControlPopulated('CauseDescription', formCellContainer) || ['CodeLstPkr', 'CauseGroupLstPkr'].every(pickerName => isControlPopulated(pickerName, formCellContainer));
                if (createCause) {
                    let data = JSON.parse(actionResult.data);
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreate.action',
                        'Properties': {
                            'Properties':
                            {
                                'NotificationNumber': data.NotificationNumber,
                                'ItemNumber': data.ItemNumber,
                                'CauseSequenceNumber': '0001',
                                'CauseText': clientAPI.evaluateTargetPath('#Control:CauseDescription/#Value') || '',
                                // eslint-disable-next-line brace-style
                                'CauseCodeGroup': (function() { try { return clientAPI.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue'); } catch (e) { return ''; } })(),
                                // eslint-disable-next-line brace-style
                                'CauseCode': (function() { try { return clientAPI.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue'); } catch (e) { return ''; } })(),
                                'CauseSortNumber': '0001',
                            },
                            'Headers':
                            {
                                'OfflineOData.RemoveAfterUpload': 'true',
                                'OfflineOData.TransactionID': data.NotificationNumber,
                            },
                            'CreateLinks':
                                [{
                                    'Property': 'Item',
                                    'Target':
                                    {
                                        'EntitySet': 'MyNotificationItems',
                                        'ReadLink': data['@odata.readLink'],
                                    },
                                }],
                            'OnSuccess': '',
                        },
                    });
                } else {
                    return Promise.reject(); // Skip cause create
                }
            }).then(() => {
               // alert("297");
                return CreateEMPEntries(clientAPI, clientAPI.getClientData().EMP).catch((error) => {
                    Logger.error('CreateEMPEntries error: ' + error);
                    clientAPI.dismissActivityIndicator();
                    return clientAPI.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
                });
            }).catch(() => {
                return Promise.resolve(); // Continue action chain
            }).then(() => {
                return NotificationUpdateSuccess(clientAPI);
            });
        }).catch(() => {
            clientAPI.dismissActivityIndicator();
            return clientAPI.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        });
    }
});
}

