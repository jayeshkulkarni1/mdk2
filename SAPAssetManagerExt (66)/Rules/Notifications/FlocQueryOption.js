export default function EquipmentQueryOption(context, value) {
   // alert("EQ"+JSON.stringify(context.binding));
    //alert("2"+JSON.stringify(value));
    var value = context.getValue()[0].ReturnValue;
    //alert(value);
   // if (value) {
    //context.getPageProxy().getClientData().tempEquip = value;
    let pageProxy = context.getPageProxy();
    let flocControl = pageProxy.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl');
  
    //alert("7");
   
   // }
    if (flocControl) {
       

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${value}'`, '').then(result => {
           // alert("14");
            if (result && result.length > 0) {
                //alert("16");
                flocControl.setValue(result.getItem(0).FuncLocIdIntern);
            //    var json = [];
            //    result.forEach(function(element) {
            //        json.push({
            //            'DisplayValue': `${element.FuncLocId}`,
            //            'ReturnValue': element.FuncLocIdIntern,
            //        });
            //    });
               /* Not able to select work center so commenting as of now
               const unique = json.filter((obj, index) => {
                   return index === json.findIndex(o => obj.DisplayValue === o.DisplayValue);
               });
               */
             

            //  flocControl.setPickerItems(json);
            }
        })
    }
}





