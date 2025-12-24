export default function GetNewPartGroups(context) {
    let filter = "$filter=Catalog eq 'B'&$orderby=CodeGroup";
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