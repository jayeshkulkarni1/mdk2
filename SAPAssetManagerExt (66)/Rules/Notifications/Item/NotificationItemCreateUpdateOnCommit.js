import ComLib from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import NotificationLib from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
import lamCopy from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationItemCreateLAMCopy';


export default function NotificationItemCreateUpdateOnCommit(clientAPI) {

    return NotificationLib.NotificationItemCreateUpdateValidation(clientAPI).then((isValid) => {
        if (isValid) {
            if (ComLib.IsOnCreate(clientAPI)) {
                if (ComLib.isOnChangeset(clientAPI)) {
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action',
                        'Properties': {
                            'OnSuccess' : '',
                        },
                    }).then(() => {
                        return lamCopy(clientAPI);
                    }).then(() => {
                        clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
                    });
                } else {
                    // If this is not already a change set, we want to make it one
                    ComLib.setOnChangesetFlag(clientAPI, true);
                    ComLib.resetChangeSetActionCounter(clientAPI);
                    ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'NotificationItem');
                    let notificationItemCreateChangeSet = '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreateChangeSet.action';
                    return clientAPI.executeAction(notificationItemCreateChangeSet).then(() => {
                        return lamCopy(clientAPI);
                    }).then(() => {
                        clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
                    });
                }
            } else {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemUpdate.action').then(actionResult => {
                    // eslint-disable-next-line brace-style
                   /*
                    if(clientAPI.binding.ItemCauses && clientAPI.binding.ItemCauses.length > 0)
                    {
                        let readLink = clientAPI.binding.ItemCauses[0]['@odata.readLink'];
                        let readLinkItem = data['@odata.readLink'];
                        let createCause = !!(function() { try { return (clientAPI.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue') && clientAPI.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue')); } catch (exc) { return ''; } })();
                        if (createCause) {
                            let data = JSON.parse(actionResult.data);
                            
                            return clientAPI.executeAction({
                                'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseUpdate.action',
                                'Properties': {
                                    'Properties':
                                    {
                                       
                                       'CauseText' : '-',
                                        // eslint-disable-next-line brace-style
                                        'CauseCodeGroup': (function() { try { return clientAPI.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue'); } catch (e) {return '';} })(),
                                        // eslint-disable-next-line brace-style
                                        'CauseCode' : (function() { try { return clientAPI.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue'); } catch (e) {return '';} })()
                                        
                        
                                    },
                                    'Headers':
                                    {
                                        'OfflineOData.RemoveAfterUpload': 'true',
                                        'OfflineOData.TransactionID': data.NotificationNumber,
                                    },
                                    'Target':
                                    {
                                        "EntitySet" : "MyNotificationItemCauses",
                                        "Service" : "/SAPAssetManager/Services/AssetManager.service",
                                        "ReadLink" : readLink
                                    },
                                    'UpdateLinks':
                                        [{
                                            "Property" : "Item",
                                            "Target":
                                            {
                                                "EntitySet" : "MyNotificationItems",
                                                "ReadLink" : readLinkItem
                                            }
                                        }]
                                },
                            }).then(actionResult2 => {
                                alert("75");
                                var d = JSON.parse(actionResult2.data);
                                alert(JSON.stringify(d));
                            }).catch(() => {
                                alert("86");
                                return Promise.resolve(); // Continue action chain
                            });
                        } else {
                            return Promise.reject(); // Skip cause create
                        }
                    }
                    */
                   
                }).catch(() => {
                    return Promise.resolve(); // Continue action chain
                });
            }
        } else {
            return Promise.resolve(false);
        }
    });
}
