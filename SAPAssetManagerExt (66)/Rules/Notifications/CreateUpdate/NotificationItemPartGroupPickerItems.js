import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import NotificationActivityGroupQuery from '../../../../SAPAssetManager/Rules/Notifications/Activity/NotificationActivityGroupQuery';
import NotificationTaskGroupQuery from '../../../../SAPAssetManager/Rules/Notifications/Task/NotificationTaskGroupQuery';
import NotificationItemActivityGroupQuery from '../../../../SAPAssetManager/Rules/Notifications/Item/Activity/Details/NotificationItemActivityGroupQuery';
import NotificationItemCauseGroupQuery from '../../../../SAPAssetManager/Rules/Notifications/Item/Cause/NotificationItemCauseGroupQuery';
import NotificationItemDamageGroupQuery from '../../../../SAPAssetManager/Rules/Notifications/Item/NotificationItemDamageGroupQuery';
import NotificationItemPartGroupQuery from '../../../../SAPAssetManager/Rules/Notifications/Item/NotificationItemPartGroupQuery';
import NotificationItemTaskGroupQuery from '../../../../SAPAssetManager/Rules/Notifications/Item/Task/NotificationItemTaskGroupQuery';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function NotificationItemPartGroupPickerItems(controlProxy) {
    const pageProxy = controlProxy.getPageProxy();
    const { queryOptionsRule, catType } = getOptionsForControl(controlProxy);

    return queryOptionsRule(pageProxy).then(queryOptions => {
        const isAssignedToCatalogProfile = pageProxy.getClientData()[`IsAssignedToCatalogProfile[${catType}]`];
        const usePMCatalogCodes = libCom.isDefined(isAssignedToCatalogProfile) ? !isAssignedToCatalogProfile : false;
        let entitySet = 'PMCatalogProfiles';
        let displayValue = 'Description';
        const returnValue = 'CodeGroup';

        if (usePMCatalogCodes) {
            entitySet = 'PMCatalogCodes';
            displayValue = 'CodeGroupDesc';
        }

        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(catalogs => {
            if (ValidationLibrary.evalIsEmpty(catalogs)) {
                return [];
            }
            if (usePMCatalogCodes) {
                catalogs = [...new Map(catalogs.map(item => [item[returnValue], item])).values()];
            }
            return Array.from(catalogs, item => ({
                ReturnValue: item[returnValue],
                DisplayValue: `${item[returnValue]} - ${item[displayValue]}` || '-',
            }));
        });
    });
}

function getOptionsForControl(controlProxy) {
    const controlName = controlProxy.getName();
    const pageName = libCom.getPageName(controlProxy);
    let queryOptionsRule = Promise.resolve();
    let catType;

    switch (pageName) {
        case 'NotificationActivityAddPage':
            queryOptionsRule = NotificationActivityGroupQuery;
            catType = 'CatTypeActivities';
            break;
        case 'NotificationItemActivityAddPage':
            queryOptionsRule = NotificationItemActivityGroupQuery;
            catType = 'CatTypeActivities';
            break;
        case 'NotificationTaskAddPage':
            queryOptionsRule = NotificationTaskGroupQuery;
            catType = 'CatTypeTasks';
            break;
        case 'NotificationItemTaskAddPage':
            queryOptionsRule = NotificationItemTaskGroupQuery;
            catType = 'CatTypeTasks';
            break;
        case 'NotificationItemCauseAddPage':
            queryOptionsRule = NotificationItemCauseGroupQuery;
            catType = 'CatTypeCauses';
            break;
        case 'NotificationUpdateMalfunctionEnd':
        case 'NotificationAddPage':
        case 'DefectCreateUpdatePage':
        case 'NotificationItemAddPage':
            if (controlName === 'PartGroupLstPkr') {
                queryOptionsRule = NotificationItemPartGroupQuery;
                catType = 'CatTypeObjectParts';
            } else if (controlName === 'DamageGroupLstPkr') {
                queryOptionsRule = NotificationItemDamageGroupQuery;
                catType = 'CatTypeDefects';
            } else if (controlName === 'CauseGroupLstPkr') {
                queryOptionsRule = NotificationItemCauseGroupQuery;
                catType = 'CatTypeCauses';
            }
            else if (controlName === 'AddtionalDamageGroup') { //extension 
                queryOptionsRule = NotificationItemDamageGroupQuery;
                catType = 'CatTypeDefects';
            }
            break;
        default:
            break;
    }

    return { queryOptionsRule, catType };
}
