export default function GetPartGroupPickerItems(context) {
    let catalog = 'B';
    let filter = "$orderby=CodeGroupDesc&$filter=Catalog eq '"+ catalog +"'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], filter).then(result => {
        var json = [];
        result.forEach(function(element) {
            json.push({
                'DisplayValue': `${element.CodeGroup} - ${element.CodeGroupDesc}`,
                'ReturnValue': element.CodeGroup,
            });
        });
        const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
    });
}