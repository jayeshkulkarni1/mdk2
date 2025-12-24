export default function GetAdditionalDamageCodes(context) {
  
    let filter = "";
  
    filter = "$orderby=Code&$filter=Catalog eq 'C'";

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], filter).then(result => {
        var json = [];
        result.forEach(function(element) {
            json.push({
                'DisplayValue': `${element.Code} - ${element.CodeDescription}`,
                'ReturnValue': element.Code,
            });
        });
        const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
       // codevalue.setPickerItems(finalResult);

    });
}