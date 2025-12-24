import assnType from '../../../../SAPAssetManager/Rules/Common/Library/AssignmentType';
export default function GetWorkcenters(context) {
    let planningPlant = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
    let filter = "$orderby=WorkCenterId&$filter=PlantId eq '"+ planningPlant +"'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filter).then(result => {
        var json = [];
        result.forEach(function(element) {
            json.push({
                'DisplayValue': `${element.WorkCenterId} - ${element.WorkCenterName}`,
                'ReturnValue': element.ExternalWorkCenterId,
            });
        });
        const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
    });
}