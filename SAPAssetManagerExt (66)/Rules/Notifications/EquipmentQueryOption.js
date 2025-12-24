import assnType from '../../../SAPAssetManager/Rules/Common/Library/AssignmentType';

export default function EquipmentQueryOption(context, sValue) {
    //alert("FL"+JSON.stringify(context.binding));
    let pageProxy = context.getPageProxy();
    let equipment = pageProxy.getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl');
    equipment.setValue("");
    //equipment.setValue(context.getPageProxy().getClientData().tempEquip);
    // alert(JSON.stringify(context.getPageProxy().getClientData().tempEquip));
    // if (context.getPageProxy().getClientData().tempEquip === undefined){
    //     equipment.setValue("");
    //     //equipment.setValue(context.getPageProxy().getClientData().tempEquip);
    // }
    // else {
    //     equipment.setValue("");
    // }
    let workcenter = pageProxy.getControl('FormCellContainer').getControl('MainWorkCenterListPicker');
    let plannerGroup = pageProxy.getControl('FormCellContainer').getControl('Plannergrouplistpicker');

    let planningPlant = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');

    let floc = sValue;
    if ((sValue === undefined || sValue === "") && context.getValue()[0]) {
        floc = context.getValue()[0].ReturnValue;
    }

    if (floc) {
        // Equipment QueryOption
        let specifier = equipment.getTargetSpecifier();
        let filter = `$orderby=EquipId&$filter=FuncLocIdIntern eq '${floc}'`;
        specifier.setQueryOptions(filter);
        equipment.setTargetSpecifier(specifier);

        // Workcenter QueryOption
        let specifier1 = workcenter.getTargetSpecifier();
        let filter1 = `$orderby=WorkCenterId`;
        specifier1.setQueryOptions(filter1);
        workcenter.setTargetSpecifier(specifier1);


        context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${floc}')`, [], '', '').then(result1 => {
            // plannerGroup.setValue(result1.getItem(0).PlannerGroup);
            //  alert(JSON.stringify(result1.getItem(0).MaintWorkCenter));
            var wc = result1.getItem(0).MaintWorkCenter;
            context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filter1, '').then(result => {
                workcenter.setValue("");
                var json = [];
                result.forEach(function(element) {
                    json.push({
                        'DisplayValue': `${element.ExternalWorkCenterId}`,
                        'ReturnValue': element.WorkCenterId,
                    });
                });
                /* Not able to select work center so commenting as of now
                const unique = json.filter((obj, index) => {
                    return index === json.findIndex(o => obj.DisplayValue === o.DisplayValue);
                });q
                */
                const unique = new Set(json.map(item => JSON.stringify(item)));

                workcenter.setPickerItems(unique);

                
              
                result.forEach(function (e) {
                    if (e.WorkCenterId === wc) {
                        workcenter.setValue(e.WorkCenterId);
                    }
                })
                // context.read('/SAPAssetManager/Services/AssetManager.service', 'PlannerGroups', [], '', '').then(result1 => {
                //     plannerGroup.setValue(result1.getItem(0).PlannerGroup);
                // })
            })
        })


        // return context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${type}')`, [], '').then(notifType => {

        // PlannerGroup QueryOption
        // let specifier2 = plannerGroup.getTargetSpecifier();
        // let filter2 = `$orderby=PlanningGroup&$filter=FuncLocId eq '${floc}'`;
        // specifier2.setQueryOptions(filter2);
        // plannerGroup.setTargetSpecifier(specifier2);
        // return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$orderby=EquipId&$filter=FuncLocIdIntern eq '${floc}'`, '').then(result => {
        //      if (result.length === 0) {
        //         equipment.setValue("");
        //      }
        // })


    } else {
        let specifier = equipment.getTargetSpecifier();
        let filter = '$orderby=EquipId';
        specifier.setQueryOptions(filter);
        equipment.setTargetSpecifier(specifier);

        let specifier1 = workcenter.getTargetSpecifier();
        let filter1 = `$orderby=WorkCenterId`;
        specifier1.setQueryOptions(filter1);
        workcenter.setTargetSpecifier(specifier1);

        // PlannerGroup QueryOption
        // let specifier2 = plannerGroup.getTargetSpecifier();
        // let filter2 = `$orderby=PlanningGroup`;
        // specifier2.setQueryOptions(filter2);
        // plannerGroup.setTargetSpecifier(specifier2);
    }
}





